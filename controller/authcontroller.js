const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");


// Generate JWT Token
const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

};


// Register User
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Check Empty Fields
    if (!name || !email || !password) {

      return res.status(400).json({
        message: "All fields required",
      });

    }

    // Check Existing User
    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({

      name,
      email,
      password: hashedPassword,

    });

    // Generate Token
    const token = generateToken(newUser._id);

    // Response
    res.status(201).json({

      message: "User Registered",

      token,

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// Login User
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "Invalid User",
      });

    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Password",
      });

    }

    // Generate Token
    const token = generateToken(user._id);

    // Response
    res.status(200).json({

      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// Get Current User
exports.getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};