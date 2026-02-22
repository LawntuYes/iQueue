import React, { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await request('/users/get');
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleEditUser = async (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name, email: user.email });
    setIsEditing(false);
    setSaveError(null);
    setDeleteConfirmStep(0);
    
    // Fetch user appointments
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const data = await request(`/appointments/user/${user._id}`);
      setAppointments(data.appointments || []);
    } catch (err) {
      setAppointmentsError(err.message || 'Failed to load appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setSaveError(null);
    setDeleteConfirmStep(0);
  };

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setDeleteConfirmStep(0);
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updatedUser = await request(`/users/${selectedUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData),
      });

      // Update the user in the local state list
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      
      // Update selected user and exit edit mode
      setSelectedUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    setSaveError(null);
    try {
      await request(`/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      // Remove the user from the local state list
      setUsers(users.filter(u => u._id !== selectedUser._id));
      
      // Close the modal
      handleCloseModal();
    } catch (err) {
      setSaveError(err.message || 'Failed to delete user');
      setDeleteConfirmStep(0);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  if (error) {
    return <div className="admin-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">System Admin</h1>
      <h2>Users</h2>
      <div className="admin-users-grid">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="admin-user-card clickable-card"
            onClick={() => handleEditUser(user)}
          >
            <div className="admin-user-header">
              <div className="admin-user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="admin-user-info">
                <h3>{user.name}</h3>
                <span className={`admin-user-role role-${user.role || user.userType || 'user'}`}>
                  {user.role || user.userType || 'user'}
                </span>
              </div>
            </div>
            <div className="admin-user-body">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="admin-no-users">No users found.</div>
        )}
      </div>

      {/* User Popup Modal */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="admin-modal-header">
              <div className="admin-modal-avatar">
                {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="admin-modal-title">
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    className="admin-edit-input title-edit" 
                    value={editFormData.name} 
                    onChange={handleFormChange}
                    disabled={isSaving}
                  />
                ) : (
                  <h2>{selectedUser.name}</h2>
                )}
                <span className={`admin-user-role role-${selectedUser.role || selectedUser.userType || 'user'}`}>
                  {selectedUser.role || selectedUser.userType || 'user'}
                </span>
              </div>
            </div>
            <div className="admin-modal-body">
              {saveError && <div className="admin-modal-error">{saveError}</div>}
              <div className="admin-modal-detail">
                <span>Email</span>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    className="admin-edit-input" 
                    value={editFormData.email} 
                    onChange={handleFormChange}
                    disabled={isSaving}
                  />
                ) : (
                  <p>{selectedUser.email}</p>
                )}
              </div>
              <div className="admin-modal-detail">
                <span>Joined Date</span>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="admin-modal-detail">
                <span>User ID</span>
                <p className="admin-modal-id">{selectedUser._id}</p>
              </div>

              {/* Appointments Section */}
              <div className="admin-modal-detail admin-modal-appointments">
                <span>Appointments</span>
                {appointmentsLoading ? (
                  <p className="admin-appointments-loading">Loading appointments...</p>
                ) : appointmentsError ? (
                  <p className="admin-modal-error">{appointmentsError}</p>
                ) : appointments.length > 0 ? (
                  <ul className="admin-appointments-list">
                    {appointments.map(apt => (
                      <li key={apt._id}>
                        <div className="admin-apt-time">{apt.date} at {apt.time}</div>
                        {apt.business && <div className="admin-apt-business">{apt.business.name}</div>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-no-appointments">No appointments found.</p>
                )}
              </div>
            </div>
            <div className="admin-modal-actions">
              {isEditing ? (
                <>
                  <button className="admin-modal-btn admin-modal-btn-close" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </button>
                  <button className="admin-modal-btn admin-modal-btn-save" onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  {deleteConfirmStep === 0 && (
                    <button className="admin-modal-btn admin-modal-btn-delete" onClick={() => setDeleteConfirmStep(1)}>
                      Delete User
                    </button>
                  )}
                  {deleteConfirmStep === 1 && (
                    <button className="admin-modal-btn admin-modal-btn-delete-confirm" onClick={() => setDeleteConfirmStep(2)}>
                      Are you sure? Click again
                    </button>
                  )}
                  {deleteConfirmStep === 2 && (
                    <button className="admin-modal-btn admin-modal-btn-delete-final" onClick={handleDeleteUser} disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Yes, forever delete'}
                    </button>
                  )}

                  <div style={{flex: 1}}></div>

                  <button className="admin-modal-btn admin-modal-btn-close" onClick={handleCloseModal}>
                    Close
                  </button>
                  <button className="admin-modal-btn admin-modal-btn-edit" onClick={startEditing}>
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}