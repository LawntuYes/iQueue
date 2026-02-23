import React, { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminBusinesses.css';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await request('/business');
        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(err.message || 'Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinesses();
  }, []);

  const handleOpenModal = (business) => {
    setSelectedBusiness(business);
    setEditFormData({ description: business.description || '' });
    setIsEditing(false);
    setSaveError(null);
    setDeleteConfirmStep(0);
  };

  const handleCloseModal = () => {
    setSelectedBusiness(null);
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
      const data = await request(`/business/${selectedBusiness._id}/description`, {
        method: 'PATCH',
        body: JSON.stringify(editFormData),
      });

      const updatedBusiness = data.business;
      setBusinesses(businesses.map(b => b._id === updatedBusiness._id ? updatedBusiness : b));
      setSelectedBusiness(updatedBusiness);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update description');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBusiness = async () => {
    setIsDeleting(true);
    setSaveError(null);
    try {
      await request(`/business/${selectedBusiness._id}`, {
        method: 'DELETE',
      });

      // Remove the business from the local state list
      setBusinesses(businesses.filter(b => b._id !== selectedBusiness._id));
      
      // Close the modal
      handleCloseModal();
    } catch (err) {
      setSaveError(err.message || 'Failed to delete business');
      setDeleteConfirmStep(0);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading businesses...</div>;
  }

  if (error) {
    return <div className="admin-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">System Admin</h1>
      <h2>Businesses</h2>
      <div className="admin-businesses-grid">
        {businesses.map((business) => (
          <div key={business._id} className="admin-business-card clickable-card" onClick={() => handleOpenModal(business)}>
            <div className="admin-business-header">
              <div className="admin-business-avatar">
                {business.name ? business.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="admin-business-info">
                <h3>{business.name}</h3>
                <span className="admin-user-role role-business">{business.category || 'Business'}</span>
              </div>
            </div>
            <div className="admin-business-body">
              <p><strong>Owner:</strong> {business.owner ? business.owner.name : 'Unknown'}</p>
              <p><strong>Hours:</strong> {business.operatingHours || 'N/A'}</p>
            </div>
            {business.description && (
              <div className="admin-business-desc">
                {business.description}
              </div>
            )}
          </div>
        ))}
        {businesses.length === 0 && (
          <div className="admin-no-users">No businesses found.</div>
        )}
      </div>

      {/* Business Popup Modal */}
      {selectedBusiness && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content admin-business-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="admin-modal-header">
              <div className="admin-modal-avatar">
                {selectedBusiness.name ? selectedBusiness.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="admin-modal-title">
                <h2>{selectedBusiness.name}</h2>
                <span className="admin-user-role role-business">{selectedBusiness.category || 'Business'}</span>
              </div>
            </div>
            <div className="admin-modal-body">
              {saveError && <div className="admin-modal-error">{saveError}</div>}
              <div className="admin-modal-detail">
                <span>Description</span>
                {isEditing ? (
                  <textarea
                    name="description"
                    className="admin-edit-input"
                    value={editFormData.description}
                    onChange={handleFormChange}
                    disabled={isSaving}
                    rows="4"
                    style={{ flex: 1, marginLeft: '1rem', resize: 'vertical' }}
                  />
                ) : (
                  <p style={{ textAlign: 'right', flex: 1, marginLeft: '1rem', whiteSpace: 'pre-wrap' }}>
                    {selectedBusiness.description || 'No description provided.'}
                  </p>
                )}
              </div>
              <div className="admin-modal-detail">
                <span>Operating Hours</span>
                <p>{selectedBusiness.operatingHours || 'N/A'}</p>
              </div>
              <div className="admin-modal-detail">
                <span>Owner</span>
                <p>{selectedBusiness.owner ? selectedBusiness.owner.name : 'Unknown'}</p>
              </div>
              <div className="admin-modal-detail">
                <span>Contact Email</span>
                <p>{selectedBusiness.owner ? selectedBusiness.owner.email : 'Unknown'}</p>
              </div>
              <div className="admin-modal-detail">
                <span>Business ID</span>
                <p className="admin-modal-id">{selectedBusiness._id}</p>
              </div>
            </div>
            <div className="admin-modal-actions">
              {isEditing ? (
                <>
                  <button className="admin-modal-btn admin-modal-btn-close" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </button>
                  <button className="admin-modal-btn admin-modal-btn-save" onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Description'}
                  </button>
                </>
              ) : (
                <>
                  {deleteConfirmStep === 0 && (
                    <button className="admin-modal-btn admin-modal-btn-delete" onClick={() => setDeleteConfirmStep(1)}>
                      Delete Business
                    </button>
                  )}
                  {deleteConfirmStep === 1 && (
                    <button className="admin-modal-btn admin-modal-btn-delete-confirm" onClick={() => setDeleteConfirmStep(2)}>
                      Are you sure? Click again
                    </button>
                  )}
                  {deleteConfirmStep === 2 && (
                    <button className="admin-modal-btn admin-modal-btn-delete-final" onClick={handleDeleteBusiness} disabled={isDeleting}>
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
