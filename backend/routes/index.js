const express = require('express');
const userRouter = require('./user');
const userAccount = require('./account');
const router = express.Router();
// const bcrypt = require('bcrypt');
router.use('/user',userRouter); 
router.use('/account',userAccount);
module.exports = router;