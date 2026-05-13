const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controller/authcontroller");

const protect = require("../middleware/authMiddleware");


// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Current User
router.get("/me", protect, getMe);


module.exports = router;