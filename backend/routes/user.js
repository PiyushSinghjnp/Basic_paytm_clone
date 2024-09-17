const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const zod = require('zod');
const  {User,Account} = require('../db');

const { authMiddleware } = require('../middleware/authMiddleware');

const singupSchema = zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})
// signUp
const signupSchema = zod.object({
  username: zod.string().email({ message: "Invalid email format" }).min(1, { message: "Email is required" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters long" }).max(20, { message: "Password must not exceed 20 characters" }),
  firstName: zod.string().min(1, { message: "First name is required" }).max(50, { message: "First name must not exceed 50 characters" }),
  lastName: zod.string().min(1, { message: "Last name is required" }).max(50, { message: "Last name must not exceed 50 characters" }),
});

router.post('/signup', async (req, res) => {
  console.log('Signup route hit');
  const body = req.body;
  // Destructure both success and error from the safeParse method
  const { success, error } = signupSchema.safeParse(body);

  if (!success) { 
    console.log('hiii');
      const summary = error.errors.map(err => err.message).join(', '); // join all the errors 
      console.log(summary);
        return res.status(400).json({
          message: summary,
          errors: error.errors // Provide validation error details
      });
  }

  const existingUser = await User.findOne({
      username: req.body.username,
  });

  if (existingUser) {
      return res.status(400).json({
          message: "Email already taken",
      });
  }

  const { username, firstName, lastName, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  const newUser = await User.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
  });

  const userId = newUser._id;

  // ----- Create new account ------
  await Account.create({
      userId,
      balance: parseInt(Math.random() * 10000),
  });

  const token = jwt.sign(
      { userId },
      JWT_SECRET
  );

  res.json({
      message: 'User created successfully',
      token: token,
  });
});
// User signin 
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
  });
  
  router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
  
    const user = await User.findOne({
      username: req.body.username,
    });
  
    if (!user) {
      return res.status(404).json("User not found!");
    }
  
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(401).json(
          { message: "Wrong credentials!"});
      }
  
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET
      );
  
      res.status(200).json({
        token: token,
      });
      return;
    }
  });


// FOR UPDATING USER INFO

const updateBody = zod.object({
    password: zod.string().optional(),// if this field not updated then also we have to update the data so we use optional()
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put('/',authMiddleware,async(req,res)=>{

    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information",
          });
    }

    await User.updateOne({ _id: req.userId},req.body);
    res.json({
        message: "Updated successfully",
      });
});
// FOR GETTING USERS WITH FILTER QUERY
// for getting specific user detail do the ?filter= fistname or lastname or both
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
  
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } }
      ],
    });
  
    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  });
// get all the specific  userinfo
  router.get("/getUser", authMiddleware, async (req, res) => {
    const user = await User.findOne({
      _id: req.userId,
    });
    res.json(user);
  });

  router.get('/me', authMiddleware, async (req, res) => {
    try {
      // Fetch the user from the database using the userId from the request object (req.userId we get it from the authMiddleware)
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return the user's details
      res.json({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
module.exports = router;