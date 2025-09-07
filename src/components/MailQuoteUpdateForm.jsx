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
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
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
              onChange={handleDateChange}
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
            >
              <option value="">-- Select a slot --</option>
              {(() => {
                // If availability for the selected date exists, filter slots
                if (date && availability[date]) {
                  // Only show slots whose index is NOT in availability[date]
                  return slots.map((s, idx) =>
                    !availability[date].includes(idx) ? (
                      <option key={idx} value={s}>{s}</option>
                    ) : null
                  );
                }
                // If no availability loaded, show all slots
                return slots.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ));
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

