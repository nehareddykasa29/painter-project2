// filepath: c:\\Users\\Aryan\\Desktop\\New folder (2)\\PainterGuys\\src\\pages\\BlockSlots.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailability, saveBlockedSlots } from '../store/bookingSlice';

// Universal (UTC) helpers — avoid local timezone conversions entirely
const todayUTCStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC

const parseYmd = (ymd) => {
  const [y, m, d] = String(ymd).split('-').map((v) => parseInt(v, 10));
  return { y, m, d };
};

const ymdToUTCDate = (ymd) => {
  const { y, m, d } = parseYmd(ymd);
  if ([y, m, d].some(Number.isNaN)) return null;
  return new Date(Date.UTC(y, m - 1, d));
};

const formatUTCDate = (date) => {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const addDaysYmd = (ymd, n) => {
  const dt = ymdToUTCDate(ymd);
  if (!dt) return ymd;
  dt.setUTCDate(dt.getUTCDate() + n);
  return formatUTCDate(dt);
};

const slotOptions = [
  { value: 0, label: '09:00 - 10:00' },
  { value: 1, label: '10:00 - 11:00' },
  { value: 2, label: '11:00 - 12:00' },
  { value: 3, label: '12:00 - 13:00' },
  { value: 4, label: '13:00 - 14:00' },
  { value: 5, label: '14:00 - 15:00' },
  { value: 6, label: '15:00 - 16:00' },
  { value: 7, label: '16:00 - 17:00' },
];

const isSundayUTCFromYMD = (ymd) => {
  const [y, m, d] = ymd.split('-').map((n) => parseInt(n, 10));
  if ([y, m, d].some(Number.isNaN)) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCDay() === 0;
};

export default function BlockSlots() {
  const dispatch = useDispatch();
  // IMPORTANT: don't coalesce to a new {} each render (causes effect loops)
  const availability = useSelector((s) => s.booking.availability);
  const availabilityMap = useMemo(() => availability || {}, [availability]);
  const [rangeStart, setRangeStart] = useState(todayUTCStr());
  const [daysToShow, setDaysToShow] = useState(14);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(fetchAvailability()).unwrap();
        console.log('[BlockSlots] Availability fetched:', data);
      } catch (e) {
        console.warn('[BlockSlots] Availability fetch failed:', e);
      }
    })();
  }, [dispatch]);

  const dates = useMemo(() => {
    // Build strictly using UTC math on YYYY-MM-DD strings
    const arr = [];
    let cur = rangeStart;
    for (let i = 0; i < daysToShow; i++) {
      arr.push(cur);
      cur = addDaysYmd(cur, 1);
    }
    return arr;
  }, [rangeStart, daysToShow]);

  // Only show today and future dates (UTC-based to match server keys)
  const visibleDates = useMemo(() => {
    const t = todayUTCStr();
    return dates.filter(d => d >= t);
  }, [dates]);

  const [pending, setPending] = useState({}); // { 'YYYY-MM-DD': Set<number> }

  // Initialize pending with existing availability (treat those arrays as blocked)
  useEffect(() => {
    // Merge availability into pending only when a date's blocked slots actually differ
    setPending((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.entries(availabilityMap).forEach(([date, arr]) => {
        const newSet = new Set((arr || []).map(Number));
        const oldSet = prev[date];
        const same = !!oldSet && oldSet.size === newSet.size && Array.from(newSet).every((v) => oldSet.has(v));
        if (!same) {
          next[date] = newSet;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [availabilityMap]);

  const toggle = (date, slot) => {
    setPending((prev) => {
      const set = new Set(prev[date] || []);
      if (set.has(slot)) set.delete(slot); else set.add(slot);
      return { ...prev, [date]: set };
    });
  };

  const save = async () => {
    // Convert Sets to arrays and only include visible (today/future) dates in current window
    const payload = {};
    for (const d of visibleDates) {
      if (pending[d] && pending[d].size) {
        payload[d] = Array.from(pending[d]).sort((a, b) => a - b);
      } else {
        // Explicitly allow unblocking by sending empty array
        payload[d] = [];
      }
    }
    try {
      setSaving(true);
      const res = await dispatch(saveBlockedSlots(payload)).unwrap();
      console.log('[BlockSlots] Save responses posted, summary:', res);
      alert('Blocked slots updated');
      // Refetch and the table will reflect the new availability
      const data = await dispatch(fetchAvailability()).unwrap();
      console.log('[BlockSlots] Availability after save:', data);
    } catch (e) {
      alert('Failed to save: ' + e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: 16 }}>Block slots</h1>
      <p style={{ color: '#555', marginBottom: 16 }}>Select dates and time slots to block for bookings. Sundays are not bookable and shown for reference only.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label>
          Start date:
          <input type="date" value={rangeStart} min={todayUTCStr()} onChange={(e) => setRangeStart(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <label>
          Days:
          <select value={daysToShow} onChange={(e) => setDaysToShow(Number(e.target.value))} style={{ marginLeft: 8 }}>
            {[7, 14, 21, 28].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button onClick={save} disabled={saving} style={{ marginLeft: 'auto', padding: '8px 14px', background: saving ? '#4b5563' : '#111827', color: '#fff', borderRadius: 6, opacity: saving ? 0.8 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving…' : 'Save changes'}</button>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              {slotOptions.map((s) => (
                <th key={s.value} style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleDates.map((d) => {
              const isSunday = isSundayUTCFromYMD(d);
              const blocked = pending[d] || new Set();
              const serverBlockedSet = new Set((availabilityMap[d] || []).map(Number));
              return (
                <tr key={d} style={{ background: isSunday ? '#f9fafb' : 'transparent', opacity: isSunday ? 0.6 : 1 }}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' }}>{d} {isSunday && <span style={{ fontSize: 12, color: '#6b7280' }}>(Sunday)</span>}</td>
                  {slotOptions.map((s) => (
                    <td key={s.value} style={{ textAlign: 'center', padding: '8px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      <input
                        type="checkbox"
                        checked={blocked.has(s.value)}
                        onChange={() => toggle(d, s.value)}
                        disabled={isSunday || serverBlockedSet.has(s.value)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
