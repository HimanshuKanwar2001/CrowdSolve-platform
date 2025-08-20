import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const jwt = await generateToken(user._id);

    res.status(201).json({ message: "User created successfully", token: jwt });
  } catch (error) {
    console.error("Error in signup controller :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwt = await generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
      token: jwt,
    });
  } catch (error) {
    console.error("Error in login controller :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId; // Assuming userId is set in the request by middleware

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller :", error);
    res.status(500).json({ message: "Server error" });
  }
};
