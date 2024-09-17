const mongoose = require('mongoose')
// MONGO_URI="mongodb+srv://piyushjaunpuria007:Piyush%401@paytm.djdlc.mongodb.net/?retryWrites=true&w=majority&appName=Paytm"
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
 const  connectDB = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("mongoose connected");
        }
    catch(err){
            console.log('error is'+err.message)
    }
};

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
  });

  const accountSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User", // reference to the User model if user does not exists then it will not create a account
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  });
  const Account= mongoose.model('Account',accountSchema);
  const User= mongoose.model('User',userSchema);
    module.exports={
            User,Account,connectDB
    }