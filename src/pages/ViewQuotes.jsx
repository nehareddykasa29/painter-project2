import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, fetchAvailability, updateQuote } from '../store/bookingSlice';
import { FaTimes, FaEdit } from 'react-icons/fa';
import './ViewQuotes.css';

const ViewQuotes = () => {
  const dispatch = useDispatch();
  const { quotes, quotesLoading, quotesError, updateSuccess } = useSelector(state => state.booking);
  const availability = useSelector(state => state.booking.availability);
  const token = useSelector(state => state.auth?.token);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleViewMore = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuote(null);
    setEditing(false);
  };

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

  // Helper function to format service type
  const formatServiceType = (serviceType, projectType) => {
    if (serviceType && projectType) {
      return `${serviceType} - ${projectType}`;
    }
    return serviceType || projectType || 'N/A';
  };

  // Helper function to format appointment date
  const formatAppointmentDate = (date) => {
    if (!date) return 'N/A';
    const appointmentDate = new Date(date);
    return appointmentDate.toLocaleDateString('en-GB');
  };

  // Helper function to get status display
  const getStatusDisplay = (status) => {
    return status === 'completed' ? 'Completed' : 'Pending';
  };

  return (
    <div className="view-quotes-page">
      <div className="quotes-container">
        <h1 className="quotes-title">Quotes</h1>
        
          {quotesLoading && <p>Loading quotes...</p>}
          {quotesError && <p style={{ color: 'red' }}>Error: {quotesError}</p>}
        
          {!quotesLoading && !quotesError && (
          <div className="quotes-table-container">
              {quotes.length === 0 ? (
                <p>No quotes found.</p>
              ) : (
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
                  {quotes.map(q => (
                    <tr key={q._id} className="quote-row">
                      <td className="name-cell">{q.name}</td>
                      <td className="service-cell">{formatServiceType(q.serviceType, q.projectType)}</td>
                      <td className="budget-cell">{q.budget || 'N/A'}</td>
                      <td className="date-cell">{formatAppointmentDate(q.appointmentDate)}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${q.status === 'completed' ? 'completed' : 'pending'}`}>
                          {getStatusDisplay(q.status)}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button 
                          className="view-more-btn"
                          onClick={() => handleViewMore(q)}
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination">
                <button className="pagination-btn prev-btn">‹</button>
                <button className="pagination-btn page-btn active">1</button>
                <button className="pagination-btn page-btn">2</button>
                <button className="pagination-btn page-btn">3</button>
                <button className="pagination-btn page-btn">4</button>
                <button className="pagination-btn next-btn">›</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      <AnimatePresence>
        {showModal && selectedQuote && (
          <motion.div
            className="quote-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="quote-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="quote-modal-header">
                <h2 className="quote-modal-title">Quote Details</h2>
                <button className="quote-modal-close" onClick={handleCloseModal}>
                  <FaTimes />
                    </button>
              </div>

              <div className="quote-modal-content">
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Name:</div>
                  <div className="quote-detail-value">{selectedQuote.name}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Email:</div>
                  <div className="quote-detail-value">{selectedQuote.email}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Phone:</div>
                  <div className="quote-detail-value">{selectedQuote.phone}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Address:</div>
                  <div className="quote-detail-value">{selectedQuote.address}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Service Type:</div>
                  <div className="quote-detail-value">{selectedQuote.serviceType}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Project Type:</div>
                  <div className="quote-detail-value">{selectedQuote.projectType}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Rooms:</div>
                  <div className="quote-detail-value">
                    {Array.isArray(selectedQuote.rooms) && selectedQuote.rooms.length > 0 
                      ? selectedQuote.rooms.join(', ') 
                      : 'N/A'}
                  </div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Timeframe:</div>
                  <div className="quote-detail-value">{selectedQuote.timeframe}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Budget:</div>
                  <div className="quote-detail-value">{selectedQuote.budget}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Description:</div>
                  <div className="quote-detail-value">{selectedQuote.description}</div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Status:</div>
                  <div className="quote-detail-value">
                    <span className={`status-badge ${selectedQuote.status === 'completed' ? 'completed' : 'pending'}`}>
                      {getStatusDisplay(selectedQuote.status)}
                    </span>
                  </div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Appointment Date:</div>
                  <div className="quote-detail-value">
                    {selectedQuote.appointmentDate ? formatAppointmentDate(selectedQuote.appointmentDate) : 'N/A'}
                  </div>
                </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Appointment Slot:</div>
                  <div className="quote-detail-value">
                    {selectedQuote.appointmentSlot !== undefined && selectedQuote.appointmentSlot !== null
                      ? slotOptions.find(opt => opt.value === selectedQuote.appointmentSlot.toString())?.label || 'N/A'
                      : 'N/A'}
                      </div>
                      </div>
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Created At:</div>
                  <div className="quote-detail-value">
                    {selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleString() : 'N/A'}
                      </div>
                      </div>
                      </div>

              <div className="quote-modal-actions">
                <button className="modal-btn modal-btn-primary" onClick={handleEditClick}>
                  <FaEdit />
                  Edit
                      </button>
                </div>
            </motion.div>
          </motion.div>
              )}
      </AnimatePresence>
    </div>
  );
};

export default ViewQuotes;

