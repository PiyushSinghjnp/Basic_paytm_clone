const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { Account } = require("../db");
const mongoose = require("mongoose");

const router = express.Router();

router.get('/balance',authMiddleware, async(req,res)=>{

    const account = await Account.findOne({
        userId: req.userId,
    });
    res.json({
        balance: account.balance,
    });

});

router.post('/transfer',authMiddleware,async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        const{amount,to}=req.body;
        // don't allow transfer to oneSelf
        if(to === req.userId){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Can't transfer to yourself",
            });
        }

     // Fetch the accounts within transaction
        const account = await Account.findOne({
            userId: req.userId,
        }).session(session); // The transaction ensures that all operations (such as fetching the accounts, deducting or crediting amounts) are treated as a single, atomic operation. If something goes wrong (like insufficient balance or an error in updating the recipient's account), the entire transaction can be aborted, and none of the operations will be applied, maintaining data integrity.
   
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
            message: "Insufficient balance",
            });
        }
        const toAccount = await Account.findOne({
            userId: to,
          }).session(session);

          if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
              message: "Invalid account",
            });
          }
          await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } } //decrease from one $inc is used for the increment operation
          ).session(session);
          await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } } // increase from one
          ).session(session);
        
          // Commit Transaction
          await session.commitTransaction();
        
          res.json({
            message: "Transfer successful",
          });
    });
module.exports = router