import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    operatingHours: {
      type: String,
      default: "9:00 AM - 5:00 PM",
    },
    category: {
      type: String,
      enum: ["Barber Shop", "Restaurant", "Shows", "Other"],
      default: "Other",
    },
  },
  { timestamps: true },
);

export const Business = mongoose.model("Business", businessSchema);
