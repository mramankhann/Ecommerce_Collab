const express = require("express");
const app = express();
const dotenv = require("dotenv").config()
const ConnectDB = require("./config/db")
ConnectDB()


app.use(express.json());

app.get("/",(req,res)=>{
res.send("API is Running")
})


app.listen(process.env.PORT,()=>{
    console.log(`server is running`)
})