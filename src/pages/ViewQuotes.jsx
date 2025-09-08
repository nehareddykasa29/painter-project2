import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, fetchAvailability, updateQuote, deleteQuote } from '../store/bookingSlice';
import { BACKEND_URL } from '../store/backend';
import './ViewQuotes.css';

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
      setEditingQuoteId(null);
      setLastUpdatedQuoteId(selectedQuote._id); // Track last updated quote
      // Optimistically update selectedQuote to reflect new status immediately
      setSelectedQuote(prev => prev ? { ...prev, ...editForm, status: editForm.status } : prev);
      dispatch(fetchQuotes()); // Refetch quotes
      // Do not reload the page
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

  return (
    <div className="view-quotes-page">
      <section className="hero-section">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>View Quotes</h1>
            <p>Quote management dashboard</p>
          </motion.div>
        </div>
      </section>

      <section className="content-section" style={{ minHeight: '70vh', background: '#f5f7fa' }}>
        <div className="quotes-flex-container">
          {/* Sidebar: Quotes List */}
          <aside className="quotes-sidebar">
            <h2 className="sidebar-title">Quotes</h2>
            {quotesLoading && <p>Loading quotes...</p>}
            {quotesError && <p style={{ color: 'red' }}>Error: {quotesError}</p>}
            {!quotesLoading && !quotesError && (
              <ul className="quotes-list-ul">
                {quotes.length === 0 ? (
                  <li className="no-quotes">No quotes found.</li>
                ) : (
                  quotes.map(q => (
                    <li
                      key={q._id}
                      className={`quotes-list-item${selectedQuote?._id === q._id ? ' selected' : ''}`}
                      onClick={() => setSelectedQuote(q)}
                    >
                      <div className="quote-list-card">
                        <div className="quote-list-name">{q.name}</div>
                        <div className="quote-list-email">{q.email}</div>
                        <div className="quote-list-status">Status: {q.status}</div>
                        {/* Removed estimated cost and notes from sidebar */}
                      </div>
                    </li>
                  ))
                )}
              </ul>

            )}
          </aside>
          {/* Main: Quote Details */}
          <main className="quotes-main">
            {selectedQuote ? (
              <motion.div
                className="quote-details-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="details-title">Quote Details</h2>
                <div className="details-section">
                  <div className="details-row">
                    <span className="details-label">Name:</span>
                    <span>{selectedQuote.name}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Email:</span>
                    <span>{selectedQuote.email}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Phone:</span>
                    <span>{selectedQuote.phone}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Address:</span>
                    <span>{selectedQuote.address}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Service Type:</span>
                    <span>{selectedQuote.serviceType}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Project Type:</span>
                    <span>{selectedQuote.projectType}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Rooms:</span>
                    <span>{Array.isArray(selectedQuote.rooms) && selectedQuote.rooms.length > 0 ? selectedQuote.rooms.join(', ') : 'N/A'}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Timeframe:</span>
                    <span>{selectedQuote.timeframe}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Budget:</span>
                    <span>{selectedQuote.budget}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Description:</span>
                    <span>{selectedQuote.description}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Status:</span>
                    <span>{selectedQuote.status}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Appointment Date:</span>
                    <span>{selectedQuote.appointmentDate ? formatDateDMY(selectedQuote.appointmentDate) : 'N/A'}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Appointment Slot:</span>
                    <span>
                      {getSlotLabel(selectedQuote.appointmentSlot)}
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Created At:</span>
                    <span>{selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
                {/* Images array display */}
                {Array.isArray(selectedQuote.images) && selectedQuote.images.length > 0 && (
                  <div className="details-section" style={{ marginTop: '18px' }}>
                    <span className="details-label" style={{ marginBottom: '8px' }}>Images:</span>
                    <div className="images-grid">
                      {selectedQuote.images.map((img, idx) => (
                        <div key={idx} className="image-thumb-card">
                          {img.path && img.path.startsWith('http') && (
                            <img src={img.path} alt={img.filename} className="image-thumb" />
                          )}
                          <div className="image-filename">{img.filename}</div>
                          <div className="image-mimetype">{img.mimetype}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* ...existing code for edit button/form... */}
                {editingQuoteId !== selectedQuote._id ? (
                  <>
                    <button
                      className="edit-btn"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                    {/* Show Delete button only if status is "completed" */}
                    {selectedQuote.status === "completed" && (
                      <button
                        className="delete-btn"
                        style={{ marginLeft: '10px', background: '#e74c3c', color: '#fff' }}
                        onClick={handleDeleteQuote}
                      >
                        Delete
                      </button>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <div className="form-group">
                      <label>Status:&nbsp;
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Estimated Cost:&nbsp;
                        <input
                          name="estimatedCost"
                          value={editForm.estimatedCost}
                          onChange={handleEditChange}
                          type="number"
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Notes:&nbsp;
                        <input
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditChange}
                          type="text"
                        />
                      </label>
                    </div>
                    {/* Toggle button for appointment inputs */}
                    <button
                      type="button"
                      className="toggle-appointment-btn"
                      style={{ marginBottom: '10px' }}
                      onClick={() => setShowAppointmentInputs(v => !v)}
                    >
                      {showAppointmentInputs ? 'Close' : 'Date and Slot'}
                    </button>
                    {showAppointmentInputs && (
                      <>
                        <div className="form-group">
                          <label>Appointment Date:&nbsp;
                            <input
                              name="appointmentDate"
                              value={editForm.appointmentDate}
                              onChange={e => {
                                const value = e.target.value;
                                const selected = new Date(value);
                                if (selected.getDay() === 0) {
                                  setErrorMsg('Sundays are not available. Please select another day.');
                                  setEditForm(prev => ({
                                    ...prev,
                                    appointmentDate: '',
                                    appointmentSlot: ''
                                  }));
                                  return;
                                }
                                setErrorMsg('');
                                handleEditChange(e);
                                setEditForm(prev => ({
                                  ...prev,
                                  appointmentSlot: ''
                                }));
                              }}
                              type="date"
                              onClick={handleDateClick}
                              min={todayStr()}
                            />
                          </label>
                          {errorMsg && <div style={{ color: 'red', marginTop: '0.5rem' }}>{errorMsg}</div>}
                        </div>
                        <div className="form-group">
                          <label>Appointment Slot:&nbsp;
                            <select
                              name="appointmentSlot"
                              value={editForm.appointmentSlot}
                              onChange={handleEditChange}
                            >
                              <option value="">Select slot</option>
                              {slotOptions
                                // Filter out unavailable slots
                                .filter(opt => !unavailableSlots.includes(Number(opt.value)))
                                // If today is selected, filter out past slots
                                .filter(opt => {
                                  if (editForm.appointmentDate === todayStr()) {
                                    return Number(opt.value) >= getNextAvailableSlotIdx();
                                  }
                                  return true;
                                })
                                .map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                            </select>
                          </label>
                        </div>
                      </>
                    )}
                    <button
                      type="submit"
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <div className="blank-content">
                <p>Select a quote from the left to view details.</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default ViewQuotes;

