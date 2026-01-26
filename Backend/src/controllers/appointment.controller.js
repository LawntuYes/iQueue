import { Appointment } from "../models/Appointment.model.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time, businessId } = req.body;
    const userId = req.userId; // Provided by auth middleware

    const newAppointment = new Appointment({
      user: userId,
      business: businessId, // Optional for now, but good to support
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
    const appointments = await Appointment.find({ user: userId })
      .populate("business", "name")
      .sort({
        createdAt: -1, // צריך -1 כדי למיין מהחדש לישן
      });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // TODO: Verify if the user owns the business linked to this appointment (security)
    // For now, assuming if they have the ID and are logged in, it's okay (MVP)

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting appointment" });
  }
};
