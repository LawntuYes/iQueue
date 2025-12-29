import { useState, useEffect } from "react";
import { createAppointment, getMyAppointments } from "../../services/appointments";
import { getAllBusinesses } from "../../services/business";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/home.css";
import "./DashboardUser.css";

export default function DashboardUser() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  
  // Modal & Booking State
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // check if the time is synching with the business open hours
  const [isTimeValid, setIsTimeValid] = useState(false);
  const [timeMin, setTimeMin] = useState("");
  const [timeMax, setTimeMax] = useState("");

  // parse operating hours like "09:00-17:00" and return normalized HH:MM
  const parseOperatingHours = (operatingHours) => {
    if (!operatingHours) return null;
    const match = operatingHours.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    if (!match) return null;
    const normalize = (t) => { 
      const [h, m] = t.split(":");
      return `${h.padStart(2, "0")}:${m}`;
    };
    try {
      const open = normalize(match[1]);
      const close = normalize(match[2]);
      return { open, close };
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (!time) {
      setIsTimeValid(false);
      return;
    }
    // If no parsed range available, consider time valid
    if (!timeMin || !timeMax) {
      setIsTimeValid(true);
      return;
    }
    setIsTimeValid(time >= timeMin && time <= timeMax);
  }, [time, timeMin, timeMax]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptData, bizData] = await Promise.all([
        getMyAppointments(),
        getAllBusinesses()
      ]);
      
      if (apptData.success) setAppointments(apptData.appointments);
      if (bizData.success) setBusinesses(bizData.businesses);
      
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const openBookingModal = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
    setMessage("");
    setDate("");
    setTime("");
    // derive min/max time from business operatingHours when opening modal
    const parsed = parseOperatingHours(business?.operatingHours);
    if (parsed) {
      setTimeMin(parsed.open);
      setTimeMax(parsed.close);
      setIsTimeValid(false);
    } else {
      setTimeMin("");
      setTimeMax("");
      setIsTimeValid(false);
    }
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedBusiness(null);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedBusiness) return;
    
    setLoading(true);
    setMessage("");
    // Validate time against business hours if range is available
    if (timeMin && timeMax && !(time >= timeMin && time <= timeMax)) {
      setMessage("Selected time is outside business hours");
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        date,
        time,
        businessId: selectedBusiness._id
      };
      
      const data = await createAppointment(payload);
      if (data.success) {
        setMessage("success"); // Flag for UI to show success state/close modal
        
        // Refresh appointments
        const apptData = await getMyAppointments();
        if (apptData.success) setAppointments(apptData.appointments);
        
        // Small delay before closing modal so user sees success
        setTimeout(() => {
          closeBookingModal();
        }, 1500);
      } else {
         setMessage(data.message || "Failed to book");
      }
    } catch {
      setMessage("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get category color
  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'Barber Shop': return { bg: '#e0e7ff', text: '#4338ca' }; // Indigo
      case 'Restaurant': return { bg: '#fce7f3', text: '#be185d' }; // Pink
      case 'Shows': return { bg: '#fae8ff', text: '#86198f' }; // Purple
      default: return { bg: '#f3f4f6', text: '#374151' }; // Gray
    }
  };

  return (
    <div className="home-container dashboard-wrapper">
      <div className="auth-card dashboard-card">
        <h1 className="auth-title dashboard-title">User Dashboard</h1>
        <p className="auth-subtitle dashboard-subtitle">Welcome, {user?.name}</p>

        <div className="dashboard-grid">
          
          {/* LEFT: Available Businesses */}
          <div>
            <h2 className="auth-title business-list-header">Available Businesses</h2>
            <div className="business-cards-container">
              {businesses.length === 0 ? (
                <p className="auth-subtitle">No businesses found.</p>
              ) : (
                businesses.map((biz) => {
                   const method = getCategoryColor(biz.category);
                   return (
                    <div key={biz._id} className="business-card">
                      <div className="business-card-header">
                        <div>
                          <div className="business-info-header">
                            <h3 className="business-name">{biz.name}</h3>
                            <span className="category-badge" style={{ 
                              background: method.bg, 
                              color: method.text
                            }}>
                              {biz.category}
                            </span>
                          </div>
                          <p className="business-description">{biz.description}</p>
                          <p className="business-hours">🕒 {biz.operatingHours}</p>
                        </div>
                        
                        <button 
                          className="btn-modern btn-primary queue-button" 
                          onClick={() => openBookingModal(biz)}
                        >
                          Queue
                        </button>
                      </div>
                    </div>
                   );
                })
              )}
            </div>
          </div>

          {/* RIGHT: My Appointments */}
          <div>
             <h2 className="auth-title business-list-header">My Appointments</h2>
             <div className="appointments-list-container">
               {appointments.length === 0 ? (
                 <p className="auth-subtitle">No appointments found.</p>
               ) : (
                 <div className="appointments-stack">
                   {appointments.map((appt) => (
                     <div key={appt._id} className="appointment-card">
                       <div className="appointment-date">
                         {appt.business?.name ? (
                           <div style={{ fontSize: "1.1rem", color: "#4f46e5", fontWeight: "700", marginBottom: "0.25rem" }}>
                             {appt.business.name}
                           </div>
                         ) : (
                           <div style={{ fontSize: "0.9rem", color: "#9ca3af", fontStyle: "italic", marginBottom: "0.25rem" }}>
                             Unknown Business
                           </div>
                         )}
                         <div style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                           {new Date(appt.date).toLocaleDateString()}
                         </div>
                       </div>
                       <div className="appointment-details">
                         <span className="appointment-time">
                           {appt.time}
                         </span>
                         <span className={`appointment-status ${appt.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
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

      {/* BOOKING MODAL */}
      {showModal && selectedBusiness && (
        <div className="modal-overlay">
          <div className="auth-card modal-content">
            <button 
              onClick={closeBookingModal}
              className="close-modal-btn"
            >
              ×
            </button>
            
            <h2 className="auth-title modal-title">Queue for {selectedBusiness.name}</h2>
            <p className="auth-subtitle modal-subtitle">
              {selectedBusiness.operatingHours}
            </p>

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
                  min={timeMin || undefined}
                  max={timeMax || undefined}
                  required 
                />
                {time && timeMin && timeMax && !isTimeValid && (
                  <div className="auth-error">Selected time is outside business hours ({timeMin} - {timeMax})</div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading || (timeMin && timeMax ? !isTimeValid : false)}
                className="btn-modern btn-primary full-width-btn"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              
              {message === "success" ? (
                 <div className="auth-error success-message-box">
                   booking confirmed!
                 </div>
              ) : message && (
                 <div className="auth-error">
                   {message}
                 </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}