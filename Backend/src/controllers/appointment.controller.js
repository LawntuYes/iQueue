import { Appointment } from "../models/Appointment.model.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const userId = req.userId; // Provided by auth middleware

    const newAppointment = new Appointment({
      user: userId,
      date,
      time,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error booking appointment" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await Appointment.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};
