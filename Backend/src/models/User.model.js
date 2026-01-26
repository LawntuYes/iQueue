import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Exclude passwordHash and map userType to role
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  if (userObject.userType) {
    userObject.role = userObject.userType;
  }
  return userObject;
};

export const User = mongoose.model("User", userSchema);
