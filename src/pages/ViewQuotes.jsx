import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, fetchAvailability, updateQuote } from '../store/bookingSlice';
import './ViewQuotes.css';

const ViewQuotes = () => {
  const dispatch = useDispatch();
  const { quotes, quotesLoading, quotesError, updateSuccess } = useSelector(state => state.booking);
  const availability = useSelector(state => state.booking.availability);
  const token = useSelector(state => state.auth?.token);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    estimatedCost: '',
    notes: '',
    appointmentDate: '',
    appointmentSlot: ''
  });
  // Track if fetchAvailability was triggered
  const [availabilityRequested, setAvailabilityRequested] = useState(false);

  useEffect(() => {
    dispatch(fetchQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(fetchQuotes());
    }
  }, [updateSuccess, dispatch]);

  const handleEditClick = () => {
    setEditForm({
      status: selectedQuote.status || '',
      estimatedCost: selectedQuote.estimatedCost || '',
      notes: selectedQuote.notes || '',
      appointmentDate: selectedQuote.appointmentDate ? selectedQuote.appointmentDate.slice(0,10) : '',
      appointmentSlot: selectedQuote.appointmentSlot || ''
    });
    setEditing(true);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCancel = () => {
    setEditing(false);
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
      setEditing(false);
      // No need to call dispatch(fetchQuotes()) here, useEffect above will handle it
    } catch (err) {
      alert('Error updating quote: ' + err);
    }
  };

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

      <section className="content-section">
        <div className="container">
          {quotesLoading && <p>Loading quotes...</p>}
          {quotesError && <p style={{ color: 'red' }}>Error: {quotesError}</p>}
          {!quotesLoading && !quotesError && (
            <div className="quotes-list">
              {quotes.length === 0 ? (
                <p>No quotes found.</p>
              ) : (
                <ul className="quotes-list-ul">
                  {quotes.map(q => (
                    <li
                      key={q._id}
                      className={`quotes-list-item${selectedQuote?._id === q._id ? ' selected' : ''}`}
                      onClick={() => setSelectedQuote(q)}
                    >
                      <strong>{q.name}</strong> - {q.email}
                    </li>
                  ))}
                </ul>
              )}
              {selectedQuote && (
                <div className="quote-details-box">
                  <h3>Quote Details</h3>
                  <p><strong>Name:</strong> {selectedQuote.name}</p>
                  <p><strong>Email:</strong> {selectedQuote.email}</p>
                  <p><strong>Phone:</strong> {selectedQuote.phone}</p>
                  <p><strong>Address:</strong> {selectedQuote.address}</p>
                  <p><strong>Service Type:</strong> {selectedQuote.serviceType}</p>
                  <p><strong>Project Type:</strong> {selectedQuote.projectType}</p>
                  <p><strong>Rooms:</strong> {Array.isArray(selectedQuote.rooms) && selectedQuote.rooms.length > 0 ? selectedQuote.rooms.join(', ') : 'N/A'}</p>
                  <p><strong>Timeframe:</strong> {selectedQuote.timeframe}</p>
                  <p><strong>Budget:</strong> {selectedQuote.budget}</p>
                  <p><strong>Description:</strong> {selectedQuote.description}</p>
                  <p><strong>Status:</strong> {selectedQuote.status}</p>
                  <p><strong>Appointment Date:</strong> {selectedQuote.appointmentDate ? new Date(selectedQuote.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Appointment Slot:</strong> {selectedQuote.appointmentSlot}</p>
                  <p><strong>Created At:</strong> {selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleString() : 'N/A'}</p>
                  {/* Add more fields if needed */}
                  {!editing ? (
                    <button
                      className="edit-btn"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
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
                      <div className="form-group">
                        <label>Appointment Date:&nbsp;
                          <input
                            name="appointmentDate"
                            value={editForm.appointmentDate}
                            onChange={handleEditChange}
                            type="date"
                            onClick={handleDateClick}
                          />
                        </label>
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
                              .filter(opt => !unavailableSlots.includes(Number(opt.value)))
                              .map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                        </label>
                      </div>
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
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewQuotes;

