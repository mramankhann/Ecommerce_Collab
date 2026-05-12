const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//Generate jwt token

const generateToken =(id)=>{

  return jwt.sign(
    {id},
    process.env.JWT_SECRET, //secret key...prevent fake token
    { expiresIn: "7d" }
  );

};

//Register User

exports.registerUser = async (req, res)=> {
  
  try{
    
    const {name, email, password} = req.body;

    //Check empty field
    if(!name || !email ||!password){

      return res.status(400).json({
        message: "All field required",
      });

    }

    //Check existing user
    const userExists = await User.findOne({email});

    if (userExists){

      return res.status(400).json({
        message: "User already exists",

      })
    }

    //Hash password 
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    //Create User
    const newUser = await User.create({
      name,
      email,
      password:hashedPassword,
    });

    //Generate Token
    const token = generateToken(newUser.id);

    //Response
    res.status(201).json({

      message: "User Registered",
      
      token,

      user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email,
      },

    });

  }catch(error){ // database connection fail, coding error, server issue

    res.status(500).json({
      message:error.message,

    });
  }
}

//Login user

exports.loginUser = async(req, res)=>{

  try{

    const {email, password} = req.body;

    //Find User

    const user = await User.findOne({email});

    if(!user){

      return res.status(400).json({
        message:"Invalid User",

      });
    }

    //Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if(!isMatch){
      return res.status(400).json({
      message: "Invalid pasword"
      })
    }

    //Generate Token
    const token = generateToken(user._id);

    //Success Response
    res.status(200).json({
      message:"Login successfully",

      token, 

      user:{
        id:user._id,
        name:user.name,
        email:user.email,
      },

    });

  } catch(error){
    res.status(500).json({
      message:"error message",
    });

  }

};

//Get current user
exports.getMe = async(req, res) =>{ // middleware check validation(info valid, address filled ), authentication(login user) and jwt(user identity)

  try{

    const user = await User.findById(req.user.id)
      .select("-password");// remove password 

      res.status(200).json(user);

  }catch(error){

    res.status(500).json({
      message:error.message,
    });
  }



};


