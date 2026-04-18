import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
        const { username, email, password } = req.body;

        // 1. Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // 5. Return user (without password)
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            token: jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate JWT
        // Note: Ensure you have JWT_SECRET defined in your .env file
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // 4. Return token
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;