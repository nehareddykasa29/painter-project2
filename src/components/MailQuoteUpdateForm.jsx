import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../store/backend';

function MailQuoteUpdateForm() {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [availability, setAvailability] = useState({});
  const { token } = useParams();

  const slots = [
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00'
  ];

  // Fetch availability when date input is clicked
  const handleDateInputClick = async () => {
    if (Object.keys(availability).length === 0) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/appointments/availability`);
        if (!res.ok) throw new Error('Failed to fetch availability');
        const data = await res.json();
        setAvailability(data);
        // Print the total response
        // eslint-disable-next-line no-console
        console.log('Full availability response:', data);
      } catch (err) {
        // Optionally handle error
      }
    }
  };

  // Print available slot numbers for the selected date
  const printAvailableSlots = () => {
    if (date && availability[date]) {
      // eslint-disable-next-line no-console
      console.log('Available slot numbers for', date, ':', availability[date]);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSlot('');
    // Print available slots for the selected date
    setTimeout(printAvailableSlots, 0);
  };

  // Helper to get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to get the next available slot index for today
  const getNextAvailableSlotIdx = () => {
    const now = new Date();
    const currentHour = now.getHours();
    // slots: ['9:00', ..., '16:00']
    // Find the first slot whose hour is greater than current hour
    for (let i = 0; i < slots.length; i++) {
      const slotHour = parseInt(slots[i]);
      if (slotHour > currentHour) {
        return i;
      }
    }
    // If all slots are in the past, return -1 (no slots available)
    return -1;
  };

  // Prevent selecting Sundays and past days
  const handleDateInput = (e) => {
    const value = e.target.value;
    const selected = new Date(value);
    // 0 = Sunday
    if (selected.getDay() === 0) {
      setErrorMsg('Sundays are not available. Please select another day.');
      setDate('');
      setSlot('');
      return;
    }
    setErrorMsg('');
    setDate(value);
    setSlot('');
    setTimeout(printAvailableSlots, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const slotNumber = slots.indexOf(slot);
      if (slotNumber === -1) throw new Error('Invalid slot selected');
      const res = await fetch(`${BACKEND_URL}/api/reschedule/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedDate: date,
          requestedSlot: slotNumber
        })
      });
      if (!res.ok) throw new Error('Failed to reschedule');
      setSuccessMsg('Reschedule request submitted successfully!');
      // Disable submit button after success
      setLoading(true);
    } catch (err) {
      setErrorMsg('Failed to submit reschedule request.');
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select a date:
            <input
              type="date"
              value={date}
              min={getToday()}
              onChange={handleDateInput}
              onClick={handleDateInputClick}
              style={{ marginLeft: '1rem' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select a slot:
            <select
              value={slot}
              onChange={e => setSlot(e.target.value)}
              style={{ marginLeft: '1rem' }}
              required
              disabled={!date}
            >
              <option value="">-- Select a slot --</option>
              {(() => {
                if (date && availability[date]) {
                  let availableSlots = slots.map((s, idx) =>
                    !availability[date].includes(idx) ? { label: s, idx } : null
                  ).filter(Boolean);

                  // If selected date is today, filter out past slots except the next available
                  if (date === getToday()) {
                    const nextIdx = getNextAvailableSlotIdx();
                    availableSlots = availableSlots.filter(
                      slotObj => slotObj.idx >= nextIdx
                    );
                  }

                  return availableSlots.map(slotObj => (
                    <option key={slotObj.idx} value={slots[slotObj.idx]}>
                      {slots[slotObj.idx]}
                    </option>
                  ));
                }
                // If no availability loaded or no date, show all slots only if date is selected
                if (date) {
                  let allSlots = slots.map((s, idx) => ({ label: s, idx }));
                  if (date === getToday()) {
                    const nextIdx = getNextAvailableSlotIdx();
                    allSlots = allSlots.filter(slotObj => slotObj.idx >= nextIdx);
                  }
                  return allSlots.map(slotObj => (
                    <option key={slotObj.idx} value={slotObj.label}>
                      {slotObj.label}
                    </option>
                  ));
                }
                return null;
              })()}
            </select>
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submited' : 'Submit'}
        </button>
        {successMsg && <div style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</div>}
        {errorMsg && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</div>}
      </form>
    </>
  );
}

export default MailQuoteUpdateForm;

