import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, fetchAvailability, updateQuote, deleteQuote } from '../store/bookingSlice';
import { BACKEND_URL } from '../store/backend';
import './ViewQuotes.css';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewQuotes = () => {
  const dispatch = useDispatch();
  const { quotes, quotesLoading, quotesError, updateSuccess } = useSelector(state => state.booking);
  const availability = useSelector(state => state.booking.availability);
  const token = useSelector(state => state.auth?.token);
  const [selectedQuote, setSelectedQuote] = useState(null);
  // Replace editing boolean with editingQuoteId
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    estimatedCost: '',
    notes: '',
    appointmentDate: '',
    appointmentSlot: ''
  });
  const [showAppointmentInputs, setShowAppointmentInputs] = useState(false);
  // Track if fetchAvailability was triggered
  const [availabilityRequested, setAvailabilityRequested] = useState(false);
  const [lastUpdatedQuoteId, setLastUpdatedQuoteId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(fetchQuotes());
    }
  }, [updateSuccess, dispatch]);

  // Add this useEffect to update editForm when selectedQuote changes
  useEffect(() => {
    if (selectedQuote) {
      setEditForm({
        status: selectedQuote.status || '',
        estimatedCost: selectedQuote.estimatedCost || '',
        notes: selectedQuote.notes || '',
        appointmentDate: selectedQuote.appointmentDate ? selectedQuote.appointmentDate.slice(0,10) : '',
        appointmentSlot: selectedQuote.appointmentSlot || ''
      });
    }
  }, [selectedQuote]);

  // When a quote is selected, reset editing state
  useEffect(() => {
    setEditingQuoteId(null);
  }, [selectedQuote]);

  // Helper to get quoteId from URL query
  const getQuoteIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('quoteId');
  };

  // On mount, if quoteId in URL, select that quote after quotes are fetched
  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const quoteId = getQuoteIdFromQuery();
      if (quoteId) {
        const found = quotes.find(q => q._id === quoteId);
        if (found) setSelectedQuote(found);
      }
    }
  }, [quotes]);

  // Keep pagination in range when quotes change
  useEffect(() => {
    if (!quotes) return;
    const totalPages = Math.max(1, Math.ceil(quotes.length / pageSize));
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [quotes]);

  const handleEditClick = () => {
    setEditingQuoteId(selectedQuote?._id);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCancel = () => {
    setEditingQuoteId(null);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      await dispatch(updateQuote({
        id: selectedQuote._id,
        data: {
          status: editForm.status,
          estimatedCost: Number(editForm.estimatedCost),
          notes: editForm.notes,
          appointmentDate: editForm.appointmentDate,
          appointmentSlot: Number(editForm.appointmentSlot)
        }
      })).unwrap();

      alert('Quote updated successfully!');
      // Set quoteId in URL and reload page
      navigate(`?quoteId=${selectedQuote._id}`);
      window.location.reload();
    } catch (err) {
      alert('Error updating quote: ' + err);
    }
  };


  // After quotes are refetched, keep the last updated quote open
  useEffect(() => {
    if (lastUpdatedQuoteId && quotes && quotes.length > 0) {
      const found = quotes.find(q => q._id === lastUpdatedQuoteId);
      if (found) {
        setSelectedQuote(found);
        setLastUpdatedQuoteId(null); // Reset after use
      }
    }
  }, [quotes, lastUpdatedQuoteId]);

  const handleDateClick = async () => {
    setAvailabilityRequested(true);
    dispatch(fetchAvailability());
  };

  useEffect(() => {
    if (availabilityRequested && availability) {
      console.log('Availability response:', availability);
      setAvailabilityRequested(false);
    }
  }, [availability, availabilityRequested]);

  // Slot mapping
  const slotOptions = [
    { value: "0", label: "09:00 - 10:00" },
    { value: "1", label: "10:00 - 11:00" },
    { value: "2", label: "11:00 - 12:00" },
    { value: "3", label: "12:00 - 13:00" },
    { value: "4", label: "13:00 - 14:00" },
    { value: "5", label: "14:00 - 15:00" },
    { value: "6", label: "15:00 - 16:00" },
    { value: "7", label: "16:00 - 17:00" }
  ];

  // Get unavailable slots for selected date from availability response
  const unavailableSlots = (() => {
    if (
      availability &&
      editForm.appointmentDate &&
      availability[editForm.appointmentDate]
    ) {
      // Flatten array if needed
      return Array.isArray(availability[editForm.appointmentDate])
        ? availability[editForm.appointmentDate]
        : [];
    }
    return [];
  })();

  // Helper to get slot label from slot number
  const getSlotLabel = slotNum => {
    if (slotNum === undefined || slotNum === null || slotNum === "") return "N/A";
    const found = slotOptions.find(opt => Number(opt.value) === Number(slotNum));
    return found ? found.label : slotNum;
  };

  // Helper to format date as DD/MM/YYYY
  const formatDateDMY = dateStr => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d)) return "N/A";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper to check if a date is Sunday
  const isSunday = dateStr => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getDay() === 0; 
  };

  // Helper to get today's date in YYYY-MM-DD format
  const todayStr = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  // Helper to get the next available slot index for today
  const getNextAvailableSlotIdx = () => {
    const now = new Date();
    const currentHour = now.getHours();
    // slotOptions: [{ value: "0", label: "09:00 - 10:00" }, ...]
    // Find the first slot whose start hour is greater than current hour
    for (let i = 0; i < slotOptions.length; i++) {
      const slotHour = 9 + i; // slot 0 = 9:00, slot 1 = 10:00, etc.
      if (slotHour > currentHour) {
        return i;
      }
    }
    // If all slots are in the past, return a value greater than any slot index
    return slotOptions.length;
  };

  const handleDeleteQuote = useCallback(async () => {
    if (!selectedQuote) return;
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/quotes/${selectedQuote._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete quote');
      }
      alert('Quote deleted successfully!');
      setSelectedQuote(null);
      dispatch(fetchQuotes());
    } catch (err) {
      alert('Error deleting quote: ' + err);
    }
  }, [dispatch, selectedQuote, token]);

  // Helpers for UI rendering
  const statusBadgeClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'completed') return 'status-badge completed';
    if (s === 'pending') return 'status-badge pending';
    return 'status-badge';
  };

  const totalPages = Math.max(1, Math.ceil((quotes?.length || 0) / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedQuotes = (quotes || []).slice(pageStart, pageStart + pageSize);

  const openModal = (q) => {
    setSelectedQuote(q);
    setEditingQuoteId(null);
  };

  const closeModal = () => {
    setSelectedQuote(null);
    setEditingQuoteId(null);
  };

  return (
    <div className="view-quotes-page">
      <div className="quotes-container">
        <h1 className="quotes-title">Quotes</h1>

        <div className="quotes-table-container">
          {quotesLoading && <p>Loading quotes...</p>}
          {quotesError && <p style={{ color: 'red' }}>Error: {quotesError}</p>}
          {!quotesLoading && !quotesError && (
            <table className="quotes-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service / project Type</th>
                  <th>Budget</th>
                  <th>Appointment Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No quotes found.</td>
                  </tr>
                ) : (
                  paginatedQuotes.map((q) => (
                    <tr key={q._id} className="quote-row">
                      <td className="name-cell">{q.name}</td>
                      <td className="service-cell">{[q.serviceType, q.projectType].filter(Boolean).join(' - ')}</td>
                      <td className="budget-cell">{q.budget || 'N/A'}</td>
                      <td className="date-cell">{q.appointmentDate ? formatDateDMY(q.appointmentDate) : 'N/A'}</td>
                      <td className="status-cell">
                        <span className={statusBadgeClass(q.status)}>{String(q.status || '').charAt(0).toUpperCase() + String(q.status || '').slice(1)}</span>
                      </td>
                      <td className="action-cell">
                        <button className="view-more-btn" onClick={() => openModal(q)}>View More</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {(!quotesLoading && !quotesError && (quotes?.length || 0) > pageSize) && (
          <div className="pagination-container">
            <div className="pagination">
              <button
                className="pagination-btn prev-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pagination-btn ${currentPage === n ? 'active' : ''}`}
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="pagination-btn next-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="quote-modal-overlay" onClick={closeModal}>
          <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quote-modal-header">
              <h3 className="quote-modal-title">Quote Details</h3>
              <button className="quote-modal-close" onClick={closeModal}>×</button>
            </div>

            <form id="quote-edit-form" onSubmit={handleEditSubmit}>
              <div className="quote-modal-content">
                {/* Name */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Name</div>
                  <div className="quote-detail-value">{selectedQuote.name}</div>
                </div>

                {/* Email */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Email</div>
                  <div className="quote-detail-value">{selectedQuote.email}</div>
                </div>

                {/* Phone */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Phone</div>
                  <div className="quote-detail-value">{selectedQuote.phone || 'N/A'}</div>
                </div>

                {/* Address */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Address</div>
                  <div className="quote-detail-value">{selectedQuote.address || 'N/A'}</div>
                </div>

                {/* Service/Project Type */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Service / Project Type</div>
                  <div className="quote-detail-value">{[selectedQuote.serviceType, selectedQuote.projectType].filter(Boolean).join(' - ') || 'N/A'}</div>
                </div>

                {/* Rooms */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Rooms</div>
                  <div className="quote-detail-value">{Array.isArray(selectedQuote.rooms) && selectedQuote.rooms.length > 0 ? selectedQuote.rooms.join(', ') : 'N/A'}</div>
                </div>

                {/* Timeframe */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Timeframe</div>
                  <div className="quote-detail-value">{selectedQuote.timeframe || 'N/A'}</div>
                </div>

                {/* Budget (Estimated Cost for editing) */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Budget</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <input
                        name="estimatedCost"
                        value={editForm.estimatedCost}
                        onChange={handleEditChange}
                        type="number"
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
                      />
                    ) : (
                      selectedQuote.budget || 'N/A'
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Status</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <select name="status" value={editForm.status} onChange={handleEditChange} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}>
                        <option value="pending">Pending</option>
                        <option value="quoted">Quoted</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      String(selectedQuote.status || 'N/A').charAt(0).toUpperCase() + String(selectedQuote.status || 'N/A').slice(1)
                    )}
                  </div>
                </div>

                {/* Appointment Date */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Appointment Date</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <input
                        name="appointmentDate"
                        value={editForm.appointmentDate}
                        onChange={e => {
                          const value = e.target.value;
                          const selected = new Date(value);
                          if (selected.getDay() === 0) {
                            setErrorMsg('Sundays are not available. Please select another day.');
                            setEditForm(prev => ({ ...prev, appointmentDate: '', appointmentSlot: '' }));
                            return;
                          }
                          setErrorMsg('');
                          handleEditChange(e);
                          setEditForm(prev => ({ ...prev, appointmentSlot: '' }));
                        }}
                        type="date"
                        onClick={handleDateClick}
                        min={todayStr()}
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
                      />
                    ) : (
                      selectedQuote.appointmentDate ? formatDateDMY(selectedQuote.appointmentDate) : 'N/A'
                    )}
                  </div>
                  {errorMsg && editingQuoteId === selectedQuote._id && (
                    <div style={{ gridColumn: '1 / -1', color: 'red' }}>{errorMsg}</div>
                  )}
                </div>

                {/* Appointment Slot */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Appointment Slot</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <select
                        name="appointmentSlot"
                        value={editForm.appointmentSlot}
                        onChange={handleEditChange}
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
                      >
                        <option value="">Select slot</option>
                        {slotOptions
                          .filter(opt => !unavailableSlots.includes(Number(opt.value)))
                          .filter(opt => {
                            if (editForm.appointmentDate === todayStr()) {
                              return Number(opt.value) >= getNextAvailableSlotIdx();
                            }
                            return true;
                          })
                          .map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                      </select>
                    ) : (
                      getSlotLabel(selectedQuote.appointmentSlot)
                    )}
                  </div>
                </div>

                {/* Created At */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Created At</div>
                  <div className="quote-detail-value">{selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleString() : 'N/A'}</div>
                </div>
              </div>
              {/* Uploaded Images Section */}
              <div className="quote-images-section">
                <div className="quote-images-header">Uploaded Images</div>
                {Array.isArray(selectedQuote.images) && selectedQuote.images.length > 0 ? (
                  <div className="quote-images-grid">
                    {selectedQuote.images.map((img, idx) => {
                      const imgUrl = img?.path || img?.url;
                      if (!imgUrl) return null;
                      return (
                        <a
                          key={idx}
                          className="quote-image-item"
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={img?.filename || `Image ${idx + 1}`}
                        >
                          <img src={imgUrl} alt={img?.filename || `Quote image ${idx + 1}`} />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="quote-images-empty">No images uploaded</div>
                )}
              </div>
            </form>

            <div className="quote-modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={handleEditClick}
                disabled={editingQuoteId === selectedQuote._id}
              >
                Edit
              </button>
              <button
                type="submit"
                form="quote-edit-form"
                className="modal-btn modal-btn-primary"
                disabled={editingQuoteId !== selectedQuote._id}
              >
                Save
              </button>
              {String(selectedQuote.status).toLowerCase() === 'completed' && (
                <button
                  type="button"
                  className="modal-btn modal-btn-danger"
                  onClick={handleDeleteQuote}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewQuotes;

