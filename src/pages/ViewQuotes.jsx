import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes, fetchAvailability, updateQuote, deleteQuote, markQuoteSeen, markQuoteViewed, handleReschedule } from '../store/bookingSlice';
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
  const [originalEditSnapshot, setOriginalEditSnapshot] = useState(null); // track original values when entering edit
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
  const [initialSelectionApplied, setInitialSelectionApplied] = useState(false);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all'); // 'all' | specific service
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'last7'
  const [appointmentDateFilter, setAppointmentDateFilter] = useState('all'); // 'all' | 'today' | 'next7'
  const [updatedSort, setUpdatedSort] = useState('desc'); // 'desc' latest->oldest | 'asc' oldest->latest

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
    if (initialSelectionApplied) return;
    if (quotes && quotes.length > 0) {
      const quoteId = getQuoteIdFromQuery();
      if (quoteId) {
        const found = quotes.find(q => q._id === quoteId);
        if (found) {
          setSelectedQuote(found);
          setInitialSelectionApplied(true);
        }
      } else {
        setInitialSelectionApplied(true);
      }
    }
  }, [quotes, initialSelectionApplied]);

  // Helpers for date filtering (based on createdAt)
  const startOfDay = (d) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

  const isWithinLastNDays = (dateStr, n) => {
    if (!dateStr) return false;
    const target = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    const from = new Date(today);
    from.setDate(from.getDate() - (n - 1)); // inclusive of today
    return target.getTime() >= from.getTime() && target.getTime() <= today.getTime();
  };

  // Next N days window (including today)
  const isWithinNextNDays = (dateStr, n) => {
    if (!dateStr) return false;
    const target = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    const to = new Date(today);
    to.setDate(to.getDate() + (n - 1)); // inclusive through future date
    return target.getTime() >= today.getTime() && target.getTime() <= to.getTime();
  };

  // Unique service types for select
  const serviceTypeOptions = useMemo(() => {
    const set = new Set();
    (quotes || []).forEach(q => {
      if (q?.serviceType) set.add(String(q.serviceType));
    });
    return Array.from(set);
  }, [quotes]);

  // Filtered + Sorted quotes (client-side)
  const filteredQuotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = (quotes || []).filter(q => {
      // search by name
      if (term && !String(q?.name || '').toLowerCase().includes(term)) return false;

      // filter by service type
      if (serviceTypeFilter !== 'all' && String(q?.serviceType) !== serviceTypeFilter) return false;

      // createdAt date filter
      if (dateFilter === 'today') {
        if (!q?.createdAt) return false;
        if (!isSameDay(new Date(q.createdAt), new Date())) return false;
      } else if (dateFilter === 'last7') {
        if (!q?.createdAt) return false;
        if (!isWithinLastNDays(q.createdAt, 7)) return false;
      }

      // appointment date filter
      if (appointmentDateFilter === 'today') {
        if (!q?.appointmentDate) return false;
        if (!isSameDay(new Date(q.appointmentDate), new Date())) return false;
      } else if (appointmentDateFilter === 'next7') {
        if (!q?.appointmentDate) return false;
        if (!isWithinNextNDays(q.appointmentDate, 7)) return false;
      }

      return true;
    });

    // sort by updatedAt (fallback to createdAt) according to updatedSort
    const sorted = filtered.slice().sort((a, b) => {
      const ta = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const tb = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      return updatedSort === 'desc' ? tb - ta : ta - tb;
    });
    return sorted;
  }, [quotes, searchTerm, serviceTypeFilter, dateFilter, appointmentDateFilter, updatedSort]);

  // Keep pagination in range when filtered quotes change
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((filteredQuotes?.length || 0) / pageSize));
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [filteredQuotes]);

  const handleEditClick = () => {
    if (!selectedQuote) return;
    // Toggle behavior: if already editing this quote, treat as cancel (handled elsewhere), else enter edit
    if (editingQuoteId === selectedQuote._id) {
      // toggle off handled by separate cancel function, early return
      return;
    }
    setEditingQuoteId(selectedQuote._id);
    // Do not fallback to budget anymore; keep blank unless estimatedCost exists
    let estimatedCostFallback = '';
    if (selectedQuote.estimatedCost !== undefined && selectedQuote.estimatedCost !== null && selectedQuote.estimatedCost !== '') {
      estimatedCostFallback = selectedQuote.estimatedCost;
    }
    const snapshot = {
      status: selectedQuote.status || '',
      estimatedCost: estimatedCostFallback,
      notes: selectedQuote.notes || '',
      appointmentDate: selectedQuote.appointmentDate ? selectedQuote.appointmentDate.slice(0,10) : '',
      appointmentSlot: selectedQuote.appointmentSlot || ''
    };
    setOriginalEditSnapshot(snapshot);
    setEditForm(snapshot);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditCancel = () => {
    // Restore original snapshot if exists
    if (originalEditSnapshot) {
      setEditForm(originalEditSnapshot);
    }
    setEditingQuoteId(null);
  };

  // Determine if there are unsaved changes when in edit mode
  const hasChanges = useMemo(() => {
    if (!editingQuoteId || !originalEditSnapshot) return false;
    const keys = ['status', 'estimatedCost', 'notes', 'appointmentDate', 'appointmentSlot'];
    return keys.some(k => String(editForm[k] || '') !== String(originalEditSnapshot[k] || ''));
  }, [editingQuoteId, originalEditSnapshot, editForm]);

  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!hasChanges) {
      return; // no-op if nothing changed
    }
    try {
      const payload = {
        status: editForm.status,
        notes: editForm.notes,
        appointmentDate: editForm.appointmentDate,
        appointmentSlot: editForm.appointmentSlot !== '' ? Number(editForm.appointmentSlot) : undefined
      };
      if (editForm.estimatedCost !== '' && !isNaN(Number(editForm.estimatedCost))) {
        payload.estimatedCost = Number(editForm.estimatedCost);
      }

      await dispatch(updateQuote({
        id: selectedQuote._id,
        data: payload
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

  // Simple start-time map for slots (0 -> 09:00, ..., 7 -> 16:00)
  const timeSlotMap = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
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
  // Timezone-agnostic (local) date string helper to avoid UTC shift issues across timezones
  const dateToLocalDateString = (d) => {
    if (!(d instanceof Date)) d = new Date(d);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
  };
  const todayStr = () => dateToLocalDateString(new Date());

  // UTC-safe helpers for date-only strings (YYYY-MM-DD)
  const ymdToUTCDate = (ymd) => {
    // ymd expected format: 'YYYY-MM-DD'
    const [y, m, d] = String(ymd).split('-').map(n => parseInt(n, 10));
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
    return new Date(Date.UTC(y, m - 1, d));
  };
  const isSundayUTCFromYMD = (ymd) => {
    const dt = ymdToUTCDate(ymd);
    if (!dt) return false;
    return dt.getUTCDay() === 0; // Sunday in UTC
  };
  const todayUTCStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC

  // Helper to get the next available slot index for today
  const getNextAvailableSlotIdx = () => {
    const now = new Date();
    const currentHour = now.getHours();
    for (let i = 0; i < slotOptions.length; i++) {
      const slotHour = 9 + i;
      if (slotHour > currentHour) return i;
    }
    return slotOptions.length;
  };

  // UTC-based variant for universal comparison
  const getNextAvailableSlotIdxUTC = () => {
    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    for (let i = 0; i < slotOptions.length; i++) {
      const slotHourUTC = 9 + i; // interpret schedule in UTC
      if (slotHourUTC > currentHourUTC) return i;
    }
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

  const totalPages = Math.max(1, Math.ceil((filteredQuotes?.length || 0) / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedQuotes = (filteredQuotes || []).slice(pageStart, pageStart + pageSize);

  // Detect if any quote exposes the admin-view flags we rely on (viewedByAdmin, seenByAdmin)
  const hasSeenFlag = useMemo(() => {
    return (quotes || []).some(q => (
      q && (
        (typeof q.viewedByAdmin === 'boolean') ||
        (typeof q.seenByAdmin === 'boolean')
      )
    ));
  }, [quotes]);

  const openModal = async (q) => {
    setSelectedQuote(q);
    setEditingQuoteId(null);
    setOriginalEditSnapshot(null);
    // Reflect selection in URL so a refresh opens the same quote
    try { navigate(`?quoteId=${q._id}`, { replace: false }); } catch (_) {}
    try {
      // 1) If it's a new reschedule request: rescheduleRequest.status === 'pending' AND rescheduleRequest.seenByAdmin === false
      const isReschedulePendingUnseen = (
        q?.rescheduleRequest &&
        q.rescheduleRequest.status === 'pending' &&
        typeof q.rescheduleRequest.seenByAdmin === 'boolean' &&
        q.rescheduleRequest.seenByAdmin === false
      );
      if (isReschedulePendingUnseen) {
        await dispatch(markQuoteSeen(q._id)).unwrap();
        dispatch(fetchQuotes());
        return; // Done
      }

      // 2) Else if it's a brand new quote: viewedByAdmin === false
      if (typeof q?.viewedByAdmin === 'boolean' && q.viewedByAdmin === false) {
        await dispatch(markQuoteViewed(q._id)).unwrap();
        dispatch(fetchQuotes());
      }
    } catch (e) {
      console.error('Failed to mark quote viewed/seen:', e);
    }
  };

  const closeModal = () => {
    if (editingQuoteId && editingQuoteId === selectedQuote?._id) {
      // Determine unsaved changes (reuse logic akin to hasChanges)
      const keys = ['status', 'estimatedCost', 'notes', 'appointmentDate', 'appointmentSlot'];
      const unsaved = originalEditSnapshot && keys.some(k => String(editForm[k] || '') !== String(originalEditSnapshot[k] || ''));
      if (unsaved) {
        const proceed = window.confirm('the changes are made but not saved. Close without saving?');
        if (!proceed) return; // user opted to stay
      }
    }
    // Fully reset edit state
    setSelectedQuote(null);
    setEditingQuoteId(null);
    setOriginalEditSnapshot(null);
    setEditForm({
      status: '',
      estimatedCost: '',
      notes: '',
      appointmentDate: '',
      appointmentSlot: ''
    });
    // Remove quoteId from URL so it doesn't reopen after refetch
    try {
      const params = new URLSearchParams(location.search);
      if (params.has('quoteId')) {
        params.delete('quoteId');
        const newSearch = params.toString();
        navigate({ search: newSearch ? `?${newSearch}` : '' }, { replace: true });
      }
    } catch (_) {}
    // After closing, refetch quotes to display the latest state
    dispatch(fetchQuotes());
  };

  return (
    <div className="view-quotes-page">
      <div className="quotes-container">
        <h1 className="quotes-title">Quotes</h1>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label" htmlFor="searchName">Search</label>
            <input
              id="searchName"
              type="text"
              className="search-input"
              placeholder="Search by applicant name"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="serviceTypeFilter">Service type</label>
            <select
              id="serviceTypeFilter"
              className="filter-select"
              value={serviceTypeFilter}
              onChange={(e) => { setServiceTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All services</option>
              {serviceTypeOptions.map(st => (
                <option key={st} value={st}>{String(st).charAt(0).toUpperCase() + String(st).slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="dateFilter">Date</label>
            <select
              id="dateFilter"
              className="filter-select"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="last7">Last 7 days</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="apptDateFilter">Appointment date</label>
            <select
              id="apptDateFilter"
              className="filter-select"
              value={appointmentDateFilter}
              onChange={(e) => { setAppointmentDateFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All appointments</option>
              <option value="today">Today</option>
              <option value="next7">Next 7 days</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="updatedSort">Last updated</label>
            <select
              id="updatedSort"
              className="filter-select"
              value={updatedSort}
              onChange={(e) => { setUpdatedSort(e.target.value); setCurrentPage(1); }}
            >
              <option value="desc">Latest to oldest</option>
              <option value="asc">Oldest to latest</option>
            </select>
          </div>
          {(searchTerm || serviceTypeFilter !== 'all' || dateFilter !== 'all' || appointmentDateFilter !== 'all' || updatedSort !== 'desc') && (
            <div className="filter-group">
              <button
                type="button"
                className="clear-filters"
                onClick={() => { setSearchTerm(''); setServiceTypeFilter('all'); setDateFilter('all'); setAppointmentDateFilter('all'); setUpdatedSort('desc'); setCurrentPage(1); }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

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
                  paginatedQuotes.map((q) => {
                    // Highlight unseen only when the specific fields exist and are false
                    let showUnseen = false;
                    if (typeof q?.viewedByAdmin === 'boolean' && q.viewedByAdmin === false) {
                      showUnseen = true;
                    } else if (typeof q?.seenByAdmin === 'boolean' && q.seenByAdmin === false) {
                      showUnseen = true;
                    }
                    // Guard: if neither field exists anywhere, do not highlight at all
                    if (!hasSeenFlag) showUnseen = false;
                    const hasPendingReschedule = q?.rescheduleRequest && q.rescheduleRequest.status === 'pending';
                    return (
                    <tr key={q._id} className={`quote-row ${showUnseen ? 'unseen-quote' : ''}`}>
                      <td className="name-cell">
                        {showUnseen && (
                          <span className="unseen-indicator" title="New / Unseen"></span>
                        )}
                        {q.name}
                        {hasPendingReschedule && (
                          <span style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 12, background:'#ffedd5', color:'#9a3412', fontSize:'0.75rem' }}>New Request</span>
                        )}
                      </td>
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
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* Legend for unseen quotes: only show if at least one quote supports the flag */}
        {hasSeenFlag && (
          <div className="unseen-legend">
            <span className="unseen-indicator"></span>
            <span className="unseen-legend-text">New / Unseen quote</span>
          </div>
        )}

        {/* Pagination */}
        {(!quotesLoading && !quotesError && (filteredQuotes?.length || 0) > pageSize) && (
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
          <div
            className={`quote-modal ${editingQuoteId === selectedQuote._id ? 'editing-active' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="quote-modal-header">
              <h3 className="quote-modal-title">Quote Details</h3>
              <button className="quote-modal-close" onClick={closeModal}>×</button>
            </div>

            {editingQuoteId === selectedQuote._id && (
              <div className="editing-banner" role="status" aria-live="polite">
                Editing mode is ON — you can now modify the highlighted fields below. Don’t forget to Save.
              </div>
            )}

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

                {/* Budget (original user-provided; always read-only) */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Budget</div>
                  <div className="quote-detail-value">{selectedQuote.budget || 'N/A'}</div>
                </div>

                {/* Estimated Cost (admin input) */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Estimated Cost {editingQuoteId === selectedQuote._id && <span className="editable-tag">Editable</span>}</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <input
                        name="estimatedCost"
                        value={editForm.estimatedCost}
                        onChange={handleEditChange}
                        type="number"
                        placeholder="Enter estimated total (numbers only)"
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
                      />
                    ) : (
                      (selectedQuote.estimatedCost !== undefined && selectedQuote.estimatedCost !== null && selectedQuote.estimatedCost !== '')
                        ? `$${selectedQuote.estimatedCost}`
                        : 'N/A'
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Status {editingQuoteId === selectedQuote._id && <span className="editable-tag">Editable</span>}</div>
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
                  <div className="quote-detail-label">Appointment Date {editingQuoteId === selectedQuote._id && <span className="editable-tag">Editable</span>}</div>
                  <div className="quote-detail-value">
                    {editingQuoteId === selectedQuote._id ? (
                      <input
                        name="appointmentDate"
                        value={editForm.appointmentDate}
                        onChange={e => {
                          const value = e.target.value;
                          // Block Sundays using UTC day to avoid timezone skew
                          if (isSundayUTCFromYMD(value)) {
                            setErrorMsg('Sundays are not available. Please select another day.');
                            try {
                              // Show native validation bubble
                              e.target.setCustomValidity('Sundays are not available.');
                              e.target.reportValidity();
                            } catch (_) {}
                            try { e.target.setCustomValidity(''); } catch (_) {}
                            setEditForm(prev => ({ ...prev, appointmentDate: '', appointmentSlot: '' }));
                            return;
                          }
        setErrorMsg('');
        handleEditChange(e);
                          setEditForm(prev => ({ ...prev, appointmentSlot: '' }));
                        }}
                        type="date"
                        onClick={handleDateClick}
                        min={todayUTCStr()}
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
                  <div className="quote-detail-label">Appointment Slot {editingQuoteId === selectedQuote._id && <span className="editable-tag">Editable</span>}</div>
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
                            // Use UTC today string to compare date-only values universally
                            if (editForm.appointmentDate === todayUTCStr()) {
                              return Number(opt.value) >= getNextAvailableSlotIdxUTC();
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

                {/* Pending Reschedule Request details */}
                {selectedQuote?.rescheduleRequest?.status === 'pending' && (
                  <>
                    <div className="quote-detail-row">
                      <div className="quote-detail-label">Requested Date</div>
                      <div className="quote-detail-value">
                        {selectedQuote?.rescheduleRequest?.requestedDate
                          ? formatDateDMY(selectedQuote.rescheduleRequest.requestedDate)
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="quote-detail-row">
                      <div className="quote-detail-label">Requested Slot</div>
                      <div className="quote-detail-value">
                        {(() => {
                          const rs = selectedQuote?.rescheduleRequest?.requestedSlot;
                          if (rs === undefined || rs === null || rs === '') return 'N/A';
                          const idx = Number(rs);
                          if (Number.isNaN(idx) || idx < 0 || idx >= timeSlotMap.length) return 'N/A';
                          return timeSlotMap[idx];
                        })()}
                      </div>
                    </div>
                  </>
                )}

                {/* Reschedule decision controls: show while reschedule is pending */}
                {selectedQuote?.rescheduleRequest && selectedQuote.rescheduleRequest.status === 'pending' && (
                  <div className="quote-detail-row" style={{ gridColumn: '1 / -1' }}>
                    <div className="quote-detail-label">Reschedule Decision</div>
                    <div className="quote-detail-value" style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="modal-btn modal-btn-primary"
                        onClick={async () => {
                          try {
                            await dispatch(handleReschedule({ id: selectedQuote._id, action: 'approve' })).unwrap();
                            // Reload the page and keep this quote selected via query param
                            try { navigate(`?quoteId=${selectedQuote._id}`, { replace: true }); } catch (_) {}
                            window.location.reload();
                          } catch (e) {
                            console.error('Failed to approve reschedule:', e);
                          }
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="modal-btn modal-btn-danger"
                        onClick={async () => {
                          try {
                            await dispatch(handleReschedule({ id: selectedQuote._id, action: 'deny' })).unwrap();
                            // Reload the page and keep this quote selected via query param
                            try { navigate(`?quoteId=${selectedQuote._id}`, { replace: true }); } catch (_) {}
                            window.location.reload();
                          } catch (e) {
                            console.error('Failed to deny reschedule:', e);
                          }
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )}

                {/* Created At */}
                <div className="quote-detail-row">
                  <div className="quote-detail-label">Created At</div>
                  <div className="quote-detail-value">{selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleString() : 'N/A'}</div>
                </div>
                {/* Updated At (if present) */}
                {selectedQuote.updatedAt && (
                  <div className="quote-detail-row">
                    <div className="quote-detail-label">Updated At</div>
                    <div className="quote-detail-value">{new Date(selectedQuote.updatedAt).toLocaleString()}</div>
                  </div>
                )}
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
              {editingQuoteId === selectedQuote._id ? (
                <>
                  <button
                    type="button"
                    className="modal-btn"
                    onClick={handleEditCancel}
                  >
                    Cancel Edit
                  </button>
                  <button
                    type="submit"
                    form="quote-edit-form"
                    className="modal-btn modal-btn-primary"
                    disabled={!hasChanges}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="modal-btn modal-btn-primary"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              )}
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

