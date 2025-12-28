# User Dashboard Documentation

This document provides a comprehensive technical overview of the **User Dashboard** functionality in iQueue, updated with the latest **Business Selection** features.

## 1. Overview

The User Dashboard (`/dashboard/user`) is the central hub for users to:

1.  **Browse Businesses**: View a list of available service providers (Barbers, Restaurants, etc.).
2.  **Book Appointments**: Select a date and time to queue for a specific business.
3.  **View Queue**: See a historical and upcoming list of their personal bookings with status and business names.

---

## 2. Updated Data Flow

1.  **Fetch Data**: On load, the dashboard fetches two things in parallel:
    - `getAllBusinesses()`: Retrives list of all businesses.
    - `getMyAppointments()`: Retrieves user's booking history (now populated with Business Name).
2.  **Selection**: User clicks "Queue" on a business card -> Opens Modal.
3.  **Booking**: User confirms Date/Time -> `createAppointment(payload)` sends `businessId` to backend.
4.  **Refresh**: On success, the appointments list refreshes automatically.

---

## 3. Full Code Explanation

Below is the **exact code** for the User Dashboard component with a detailed, line-by-line breakdown of what every single part does.

### File: `Frontend/src/pages/DashboardUser/DashboardUser.jsx`

```javascript
/* 1. Imports */
import { useState, useEffect } from "react";
import {
  createAppointment,
  getMyAppointments,
} from "../../services/appointments";
import { getAllBusinesses } from "../../services/business";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/home.css";
import "./DashboardUser.css";

/* 
   Line 1: Import React hooks for managing state (data that changes) and side effects (fetching data).
   Line 2: Import service functions to talk to the Backend API for appointments.
   Line 3: Import service function to fetch the list of businesses.
   Line 4: Import custom hook to get the logged-in user's info (name, id).
   Line 5: Import global styles (backgrounds, buttons).
   Line 6: Import specific styles for this dashboard (grid layout, cards).
*/

export default function DashboardUser() {
  /* 2. State Initialization */
  const { user } = useAuth(); // Access current user context
  const [appointments, setAppointments] = useState([]); // Store list of user's appointments
  const [businesses, setBusinesses] = useState([]); // Store list of available businesses

  // Modal & Booking State
  const [selectedBusiness, setSelectedBusiness] = useState(null); // Which business is being booked?
  const [showModal, setShowModal] = useState(false); // Is the popup open?
  const [date, setDate] = useState(""); // Form input: Date
  const [time, setTime] = useState(""); // Form input: Time

  const [loading, setLoading] = useState(false); // UI state: Is a request in progress?
  const [message, setMessage] = useState(""); // UI state: Success/Error feedback text

  /* 3. Initial Data Fetch */
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array [] means this runs ONCE when the component mounts.

  const fetchData = async () => {
    try {
      // Promise.all runs both requests at the same time for speed
      const [apptData, bizData] = await Promise.all([
        getMyAppointments(),
        getAllBusinesses(),
      ]);

      // Update state if API calls were successful
      if (apptData.success) setAppointments(apptData.appointments);
      if (bizData.success) setBusinesses(bizData.businesses);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  /* 4. Modal Handlers */
  const openBookingModal = (business) => {
    setSelectedBusiness(business); // Save which business was clicked
    setShowModal(true); // Show the popup
    setMessage(""); // Clear old messages
    setDate(""); // Reset form form
    setTime(""); // Reset form
  };

  const closeBookingModal = () => {
    setShowModal(false); // Hide popup
    setSelectedBusiness(null); // Clear selection
  };

  /* 5. Booking Logic */
  const handleBook = async (e) => {
    e.preventDefault(); // Stop page reload on form submit
    if (!selectedBusiness) return;

    setLoading(true); // Disable button
    setMessage("");

    try {
      // Prepare data for Backend
      const payload = {
        date,
        time,
        businessId: selectedBusiness._id, // Critical: Link booking to specific business
      };

      const data = await createAppointment(payload); // API POST request

      if (data.success) {
        setMessage("success");

        // Refresh the appointment list immediately so user sees their new booking
        const apptData = await getMyAppointments();
        if (apptData.success) setAppointments(apptData.appointments);

        // Auto-close modal after 1.5 seconds for smooth UX
        setTimeout(() => {
          closeBookingModal();
        }, 1500);
      } else {
        setMessage(data.message || "Failed to book");
      }
    } catch {
      setMessage("Failed to book appointment.");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  /* 6. Helper: Category Styling */
  const getCategoryColor = (cat) => {
    // Returns different colors based on business type
    switch (cat) {
      case "Barber Shop":
        return { bg: "#e0e7ff", text: "#4338ca" }; // Indigo
      case "Restaurant":
        return { bg: "#fce7f3", text: "#be185d" }; // Pink
      case "Shows":
        return { bg: "#fae8ff", text: "#86198f" }; // Purple
      default:
        return { bg: "#f3f4f6", text: "#374151" }; // Gray
    }
  };

  /* 7. JSX Rendering */
  return (
    <div className="home-container dashboard-wrapper">
      <div className="auth-card dashboard-card">
        <h1 className="auth-title dashboard-title">User Dashboard</h1>
        <p className="auth-subtitle dashboard-subtitle">
          Welcome, {user?.name}
        </p>

        <div className="dashboard-grid">
          {/* LEFT COLUMN: Available Businesses List */}
          <div>
            <h2 className="auth-title business-list-header">
              Available Businesses
            </h2>
            <div className="business-cards-container">
              {businesses.length === 0 ? (
                <p className="auth-subtitle">No businesses found.</p>
              ) : (
                businesses.map((biz) => {
                  // Get color style for this business's category
                  const method = getCategoryColor(biz.category);

                  return (
                    <div key={biz._id} className="business-card">
                      <div className="business-card-header">
                        <div>
                          <div className="business-info-header">
                            <h3 className="business-name">{biz.name}</h3>
                            {/* Category Badge */}
                            <span
                              className="category-badge"
                              style={{
                                background: method.bg,
                                color: method.text,
                              }}
                            >
                              {biz.category}
                            </span>
                          </div>
                          <p className="business-description">
                            {biz.description}
                          </p>
                          <p className="business-hours">
                            🕒 {biz.operatingHours}
                          </p>
                        </div>

                        {/* Queue Button - Triggers Modal */}
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

          {/* RIGHT COLUMN: My Appointments List */}
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
                        {/* Display Link Business Name if available, else standard text */}
                        {appt.business?.name ? (
                          <div
                            style={{
                              fontSize: "1.1rem",
                              color: "#4f46e5",
                              fontWeight: "700",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {appt.business.name}
                          </div>
                        ) : (
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#9ca3af",
                              fontStyle: "italic",
                              marginBottom: "0.25rem",
                            }}
                          >
                            Unknown Business
                          </div>
                        )}
                        <div style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                          {new Date(appt.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="appointment-details">
                        <span className="appointment-time">{appt.time}</span>
                        {/* Status Badge (Confirmed/Pending) */}
                        <span
                          className={`appointment-status ${
                            appt.status === "confirmed"
                              ? "status-confirmed"
                              : "status-pending"
                          }`}
                        >
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

      {/* 8. BOOKING MODAL (Pop-up) */}
      {/* Only renders if showModal is true AND a business is selected */}
      {showModal && selectedBusiness && (
        <div className="modal-overlay">
          <div className="auth-card modal-content">
            <button onClick={closeBookingModal} className="close-modal-btn">
              ×
            </button>

            <h2 className="auth-title modal-title">
              Queue for {selectedBusiness.name}
            </h2>
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
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-modern btn-primary full-width-btn"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>

              {/* Conditional Success/Error Message Display */}
              {message === "success" ? (
                <div className="auth-error success-message-box">
                  booking confirmed!
                </div>
              ) : (
                message && <div className="auth-error">{message}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```
