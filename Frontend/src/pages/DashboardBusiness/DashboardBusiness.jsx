import { useState, useEffect } from "react";
import { createBusiness, getMyBusiness, getBusinessAppointments } from "../../services/business";
import "../../assets/styles/home.css";
import "./DashboardBusiness.css";

export default function DashboardBusiness() {
  const [business, setBusiness] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Barber Shop",
    description: "",
    openTime: "09:00",
    closeTime: "17:00"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const bizData = await getMyBusiness();
      if (bizData.success && bizData.business) {
        setBusiness(bizData.business);
        // If business exists, fetch appointments
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
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        operatingHours: `${formData.openTime} - ${formData.closeTime}`
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

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <div className="home-container dashboard-business-wrapper">
      <div className="auth-card dashboard-business-card">
        
        {!business ? (
          // CREATE BUSINESS FORM
          <>
            <h1 className="auth-title create-business-title">Create Business Profile</h1>
            <p className="auth-subtitle create-business-subtitle">
              Setup your business to start accepting queues.
            </p>
            
            <form onSubmit={handleCreateBusiness} className="auth-form create-business-form">
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input 
                  type="text" 
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Barber Shop">Barber Shop</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Shows">Shows</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Operating Hours</label>
                <div className="hours-container">
                  <div className="hours-input-group">
                    <label className="hours-label">Open</label>
                    <input 
                      type="time" 
                      className="form-input"
                      required
                      value={formData.openTime || "09:00"}
                      onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                    />
                  </div>
                  <span className="hours-separator">to</span>
                  <div className="hours-input-group">
                    <label className="hours-label">Close</label>
                    <input 
                      type="time" 
                      className="form-input"
                      required
                      value={formData.closeTime || "17:00"}
                      onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn-modern btn-primary submit-btn">
                Create Business
              </button>
              
              {message && <div className="auth-error">{message}</div>}
            </form>
          </>
        ) : (
          // BUSINESS DASHBOARD VIEW
          <>
             <div className="business-header">
               <div>
                  <h1 className="auth-title business-title">{business.name}</h1>
                  <span className="business-category-badge">
                    {business.category}
                  </span>
                  <p className="auth-subtitle business-desc">{business.description}</p>
                  <p className="auth-subtitle business-time">🕒 {business.operatingHours}</p>
               </div>
               <div className="business-active-badge">
                 Business Active
               </div>
             </div>

             <div className="auth-divider">
                <span className="divider-text">Current Queue</span>
             </div>

             <div className="queue-list-container">
               {appointments.length === 0 ? (
                 <div className="empty-queue">
                   <p>No active appointments in queue.</p>
                 </div>
               ) : (
                 <div className="queue-grid">
                   {appointments.map((appt) => (
                     <div key={appt._id} className="queue-item">
                       <div>
                         <div className="queue-user-name">
                           {appt.user?.name || "Unknown User"}
                         </div>
                         <div className="queue-time-info">
                           {new Date(appt.date).toLocaleDateString()} at <strong>{appt.time}</strong>
                         </div>
                       </div>
                       
                       <div className="queue-actions">
                         <button className="btn-modern btn-outline btn-complete">
                           Complete
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
    </div>
  );
}