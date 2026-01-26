import { User } from "../models/User.model.js";

/** Get all users. */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
