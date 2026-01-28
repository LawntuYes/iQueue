import { useState, useEffect, useCallback } from "react";
import {
  createBusiness,
  getMyBusiness,
  getBusinessAppointments,
} from "../../services/business";
import { deleteAppointment } from "../../services/appointments";
import ConfirmModal from "../../components/ConfirmModal";

import "../../assets/styles/home.css";
import "./DashboardBusiness.css";

export default function DashboardBusiness() {
  const [business, setBusiness] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Modal state
  const [modalType, setModalType] = useState(null); // "complete" | "delete" | null
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // 🔹 Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Barber Shop",
    description: "",
    openTime: "09:00",
    closeTime: "17:00",
  });
  const [message, setMessage] = useState("");

  // 🔹 Fetch business + appointments
  const fetchBusinessData = useCallback(async () => {
    try {
      const bizData = await getMyBusiness();
      if (bizData.success && bizData.business) {
        setBusiness(bizData.business);

        const apptData = await getBusinessAppointments();
        if (apptData.success) {
          setAppointments(apptData.appointments);
        }
      }
    } catch (error) {
      console.error("Error fetching business data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  // 🔹 Create business
  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        operatingHours: `${formData.openTime} - ${formData.closeTime}`,
      };

      const data = await createBusiness(payload);
      if (data.success) {
        setBusiness(data.business);
        setMessage("");
      } else {
        setMessage(data.message || "Failed to create business");
      }
    } catch {
      setMessage("Error creating business");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Modal helpers
  const openModal = (type, id) => {
    setModalType(type);
    setSelectedAppointmentId(id);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAppointmentId(null);
  };

  // 🔹 Confirm action
  const handleConfirm = async () => {
    if (modalType === "delete") {
      try {
        const data = await deleteAppointment(selectedAppointmentId);
        if (data.success) {
          setAppointments((prev) =>
            prev.filter((appt) => appt._id !== selectedAppointmentId)
          );
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    if (modalType === "complete") {
      // TODO: completeAppointment(selectedAppointmentId)
      console.log("Complete appointment:", selectedAppointmentId);
    }

    closeModal();
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <div className="home-container dashboard-business-wrapper">
      <div className="auth-card dashboard-business-card">
        {!business ? (
          /* ================= CREATE BUSINESS ================= */
          <>
            <h1 className="auth-title create-business-title">
              Create Business Profile
            </h1>

            <form
              onSubmit={handleCreateBusiness}
              className="auth-form create-business-form"
            >
              <input
                type="text"
                placeholder="Business name"
                required
                className="form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <select
                className="form-input"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Barber Shop">Barber Shop</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Shows">Shows</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                className="form-input"
                rows="3"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <button type="submit" className="btn-modern btn-primary">
                Create Business
              </button>

              {message && <div className="auth-error">{message}</div>}
            </form>
          </>
        ) : (
          /* ================= DASHBOARD ================= */
          <>
            <h1 className="auth-title">{business.name}</h1>

            <div className="queue-list-container">
              {appointments.length === 0 ? (
                <p>No active appointments.</p>
              ) : (
                <div className="queue-grid">
                  {appointments.map((appt) => (
                    <div key={appt._id} className="queue-item">
                      <div>
                        <strong>{appt.user?.name || "Unknown User"}</strong>
                        <div>
                          {new Date(appt.date).toLocaleDateString()} at{" "}
                          {appt.time}
                        </div>
                      </div>

                      <div className="queue-actions">
                        <button
                          className="btn-modern btn-outline btn-complete"
                          onClick={() => openModal("complete", appt._id)}
                        >
                          Complete
                        </button>

                        <button
                          className="btn-modern btn-outline btn-deny"
                          onClick={() => openModal("delete", appt._id)}
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={modalType !== null}
        title={
          modalType === "complete"
            ? "Complete Appointment"
            : "Delete Appointment"
        }
        message={
          modalType === "complete"
            ? "Are you sure you want to complete this appointment?"
            : "Are you sure you want to delete this appointment?"
        }
        confirmText={modalType === "complete" ? "Complete" : "Delete"}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        danger={modalType === "delete"}
      />
    </div>
  );
}
