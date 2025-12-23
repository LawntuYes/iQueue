import { useState, useEffect } from "react";
import { createAppointment, getMyAppointments } from "../../services/appointments";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/home.css";

export default function DashboardUser() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await createAppointment(date, time);
      if (data.success) {
        setMessage("Appointment booked successfully!");
        fetchAppointments(); // Refresh list
        setDate("");
        setTime(""); 
      }
    } catch {
      setMessage("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container" style={{ flexDirection: 'column', padding: '2rem', justifyContent: 'flex-start' }}>
      <div className="auth-card" style={{ maxWidth: "800px", width: "100%", marginTop: "2rem" }}>
        <h1 className="auth-title" style={{ textAlign: "center", marginBottom: "0.5rem" }}>User Dashboard</h1>
        <p className="auth-subtitle" style={{ textAlign: "center", marginBottom: "2rem" }}>Welcome, {user?.name}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Booking Section */}
          <div>
            <h2 className="auth-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Book Appointment</h2>
            <form onSubmit={handleBook} className="auth-form">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input 
                  type="time" 
                  className="form-input"
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-modern btn-primary"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
              {message && (
                <div className={`auth-error ${message.includes("success") ? "success-message" : ""}`} 
                     style={message.includes("success") ? { background: "#d1fae5", borderColor: "#a7f3d0", color: "#065f46" } : {}}>
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Appointments List */}
          <div>
             <h2 className="auth-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>My Appointments</h2>
             <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "0.5rem" }}>
               {appointments.length === 0 ? (
                 <p className="auth-subtitle">No appointments found.</p>
               ) : (
                 <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                   {appointments.map((appt) => (
                     <div key={appt._id} style={{ 
                       background: "rgba(255, 255, 255, 0.5)", 
                       padding: "1rem", 
                       borderRadius: "12px",
                       border: "1px solid rgba(255,255,255,0.8)"
                     }}>
                       <div style={{ fontWeight: 600, color: "#4b5563" }}>
                         {new Date(appt.date).toLocaleDateString()}
                       </div>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                         <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4f46e5" }}>
                           {appt.time}
                         </span>
                         <span style={{ 
                           fontSize: "0.75rem", 
                           padding: "0.25rem 0.75rem", 
                           borderRadius: "20px", 
                           background: appt.status === 'confirmed' ? '#d1fae5' : '#f3f4f6',
                           color: appt.status === 'confirmed' ? '#065f46' : '#6b7280',
                           fontWeight: 600,
                           textTransform: "uppercase"
                         }}>
                           {appt.status}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}