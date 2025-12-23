import { useState, useEffect } from "react";
import { createBusiness, getMyBusiness, getBusinessAppointments } from "../../services/business";
import "../../assets/styles/home.css";

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

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;

  return (
    <div className="home-container" style={{ flexDirection: 'column', padding: '2rem', justifyContent: 'flex-start' }}>
      <div className="auth-card" style={{ maxWidth: "800px", width: "100%", marginTop: "2rem" }}>
        
        {!business ? (
          // CREATE BUSINESS FORM
          <>
            <h1 className="auth-title" style={{ textAlign: "center" }}>Create Business Profile</h1>
            <p className="auth-subtitle" style={{ textAlign: "center", marginBottom: "2rem" }}>
              Setup your business to start accepting queues.
            </p>
            
            <form onSubmit={handleCreateBusiness} className="auth-form" style={{ maxWidth: "500px", margin: "0 auto" }}>
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
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>Open</label>
                    <input 
                      type="time" 
                      className="form-input"
                      required
                      value={formData.openTime || "09:00"}
                      onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                    />
                  </div>
                  <span style={{ paddingTop: '1.5rem', color: '#6b7280' }}>to</span>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>Close</label>
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
              
              <button type="submit" className="btn-modern btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                Create Business
              </button>
              
              {message && <div className="auth-error">{message}</div>}
            </form>
          </>
        ) : (
          // BUSINESS DASHBOARD VIEW
          <>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
               <div>
                  <h1 className="auth-title" style={{ marginBottom: "0.25rem" }}>{business.name}</h1>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    background: "#e0e7ff", 
                    color: "#4338ca", 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "4px", 
                    fontWeight: 600,
                    marginRight: "0.5rem"
                  }}>
                    {business.category}
                  </span>
                  <p className="auth-subtitle" style={{ display: "inline-block" }}>{business.description}</p>
                  <p className="auth-subtitle" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>🕒 {business.operatingHours}</p>
               </div>
               <div style={{ padding: "0.5rem 1rem", background: "#d1fae5", color: "#065f46", borderRadius: "20px", fontWeight: "600" }}>
                 Business Active
               </div>
             </div>

             <div className="auth-divider">
                <span className="divider-text">Current Queue</span>
             </div>

             <div style={{ marginTop: "1rem" }}>
               {appointments.length === 0 ? (
                 <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                   <p>No active appointments in queue.</p>
                 </div>
               ) : (
                 <div style={{ display: "grid", gap: "1rem" }}>
                   {appointments.map((appt) => (
                     <div key={appt._id} style={{ 
                       background: "rgba(255, 255, 255, 0.6)", 
                       padding: "1rem", 
                       borderRadius: "12px",
                       border: "1px solid rgba(255,255,255,0.8)",
                       display: "flex",
                       justifyContent: "space-between",
                       alignItems: "center"
                     }}>
                       <div>
                         <div style={{ fontWeight: 600, color: "#1f2937", fontSize: "1.1rem" }}>
                           {appt.user?.name || "Unknown User"}
                         </div>
                         <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                           {new Date(appt.date).toLocaleDateString()} at <strong>{appt.time}</strong>
                         </div>
                       </div>
                       
                       <div style={{ display: "flex", gap: "0.5rem" }}>
                         <button className="btn-modern btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
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