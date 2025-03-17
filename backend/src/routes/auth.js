import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";
import { ApiError } from "../utils/errors.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token");

  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });

  res.json({ success: true });
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
  });
});

export default router;
