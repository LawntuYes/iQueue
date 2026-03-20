import { useState, useEffect } from "react";
import { getBusinessAppointments } from "../../services/business";
import "../DashboardBusiness/DashboardBusiness.css"; // Reuse dashboard styles

export default function BusinessPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getBusinessAppointments();
        if (data.success) {
          // Only show confirmed appointments
          const confirmed = data.appointments.filter(
            (appt) => appt.status === "confirmed"
          );
          setAppointments(confirmed);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <div className="home-container dashboard-business-wrapper">
      <div className="auth-card dashboard-business-card">
        <h1 className="auth-title">Approved Appointments Queue</h1>

        <div className="queue-list-container">
          {appointments.length === 0 ? (
            <p>No approved appointments yet.</p>
          ) : (
            <div className="queue-grid">
              {appointments.map((appt) => (
                <div key={appt._id} className="queue-item" style={{ borderLeftColor: "#4caf50" }}>
                  <div>
                    <strong>{appt.user?.name || "Unknown User"}</strong>
                    <div>
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </div>
                  </div>
                  <div className="queue-status" style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#4caf50", fontWeight: "bold", marginLeft: "auto" }}>Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}