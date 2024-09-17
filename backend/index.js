const express = require("express");
const dotenv = require("dotenv");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { connectDB } = require('./db'); 
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on port: " + process.env.PORT);
  });