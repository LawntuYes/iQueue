import { Appointment } from "../models/Appointment.model.js";

/** Create a new appointment. */
export const createAppointment = async (req, res) => {
  try {
    const { date, time, businessId } = req.body;
    const userId = req.userId;

    const newAppointment = new Appointment({
      user: userId,
      business: businessId,
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

/** Get appointments for the authenticated user. */
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await Appointment.find({ user: userId })
      .populate("business", "name") // Populate business reference with name field
      .sort({
        createdAt: -1, // Sort by creation date descending (newest first)
      });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
};

/** Delete an appointment (requires ID). */
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting appointment" });
  }
};

/** Approve an appointment (change status to confirmed). */
export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment approved", appointment });
  } catch (error) {
    console.error("Approve Appointment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error approving appointment" });
  }
};
