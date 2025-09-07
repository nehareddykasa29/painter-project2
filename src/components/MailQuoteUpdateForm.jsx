import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../store/backend'; // Add this import

function MailQuoteUpdateForm() {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const slotIndex = slots.indexOf(slot); // Get the slot number
      const res = await fetch(`${BACKEND_URL}/api/reschedule/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedDate: date,
          requestedSlot: slotIndex // Send the slot number
        })
      });
      if (!res.ok) throw new Error('Failed to reschedule');
      setSuccessMsg('Reschedule request submitted successfully!');
    } catch (err) {
      setErrorMsg('Failed to submit reschedule request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Select a date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
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
            {slots.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {successMsg && <div style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</div>}
      {errorMsg && <div style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</div>}
    </form>
  );
}

export default MailQuoteUpdateForm;
