import { Business } from "../models/Business.model.js";
import { Appointment } from "../models/Appointment.model.js";

/** Create a new business for the authenticated user. */
export const createBusiness = async (req, res) => {
  try {
    const { name, description, operatingHours, category } = req.body;
    const userId = req.userId;

    const existingBusiness = await Business.findOne({ owner: userId });
    if (existingBusiness) {
      return res
        .status(400)
        .json({ success: false, message: "User already owns a business" });
    }

    const newBusiness = new Business({
      owner: userId,
      name,
      description,
      operatingHours,
      category: category || "Other",
    });

    await newBusiness.save();

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business: newBusiness,
    });
  } catch (error) {
    console.error("Create Business Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating business" });
  }
};

/** Get the business owned by the authenticated user. */
export const getMyBusiness = async (req, res) => {
  try {
    const userId = req.userId;
    const business = await Business.findOne({ owner: userId });

    if (!business) {
      return res.status(200).json({ success: true, business: null });
    }

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.error("Get My Business Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching business" });
  }
};

/** Get appointments for the user's business. */
export const getBusinessAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const business = await Business.findOne({ owner: userId });

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }

    const appointments = await Appointment.find({ business: business._id })
      .populate("user", "name email")
      .sort({ date: 1, time: 1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Get Business Appointments Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};

/** Get all businesses (public/protected list). */
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find(
      {},
      "name description category operatingHours owner",
    );
    res.status(200).json({ success: true, businesses });
  } catch (error) {
    console.error("Get All Businesses Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching businesses" });
  }
};
