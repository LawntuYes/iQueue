import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import { LoginSchema, RegisterSchema } from "../validations/auth.schema.js";

const SALT_ROUNDS = 12;

/** Helper to validate Zod schema. */
const validate = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw { status: 400, message: "Validation Error", errors };
    }
    throw error;
  }
};

/** Register a new user. */
export const register = async (req, res) => {
  try {
    const { name, email, password, userType } = validate(
      RegisterSchema,
      req.body,
    );

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ name, email, passwordHash, userType });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      user: newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json(error);
    }
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      stack: error.stack,
    });
  }
};

/** Log in an existing user. */
export const login = async (req, res) => {
  try {
    const { email, password } = validate(LoginSchema, req.body);

    const invalidCredentials = () => {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    };

    const user = await User.findOne({ email });
    if (!user) {
      return invalidCredentials();
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return invalidCredentials();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user,
      message: "Login successful.",
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json(error);
    }
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/** Log out current user (clear cookie). */
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Error logging out." });
  }
};

/** Get authenticated user profile. */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({ message: "Error fetching user." });
  }
};
