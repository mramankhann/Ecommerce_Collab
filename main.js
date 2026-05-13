const express = require("express");
const app = express();
const dotenv = require("dotenv").config()
const cors = require("cors");
const ConnectDB = require("./config/db")


//Connect Database
ConnectDB();


//Middleware
app.use(cors());

app.use(express.json());


//Routes
app.use("/api/auth", require("./routes/authroutes"));

//Home Route
app.get("/",(req,res)=>{
    res.send("API is Running")
});




app.listen(process.env.PORT,()=>{
    console.log(`server is running`)
})