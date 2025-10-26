// filepath: c:\\Users\\Aryan\\Desktop\\New folder (2)\\PainterGuys\\src\\pages\\BlockSlots.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOccupiedDetailed, saveBlockedSlots } from '../store/bookingSlice';
import './BlockSlots.css';

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
  // Occupied detailed contains booked and admin-blocked maps
  const occupied = useSelector((s) => s.booking.occupiedDetailed);
  const bookedMap = useMemo(() => (occupied?.bookedSlots) || {}, [occupied]);
  const adminBlockedMap = useMemo(() => (occupied?.adminBlockedSlots) || {}, [occupied]);
  const [rangeStart, setRangeStart] = useState(todayUTCStr());
  const [daysToShow, setDaysToShow] = useState(14);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await dispatch(fetchOccupiedDetailed()).unwrap();
        console.log('[BlockSlots] Occupied detailed fetched:', data);
      } catch (e) {
        console.warn('[BlockSlots] Occupied detailed fetch failed:', e);
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

  // Initialize pending with existing admin-blocked slots
  useEffect(() => {
    // Merge availability into pending only when a date's blocked slots actually differ
    setPending((prev) => {
      let changed = false;
      const next = { ...prev };
  Object.entries(adminBlockedMap).forEach(([date, arr]) => {
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
  }, [adminBlockedMap]);

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
  // Refetch and the table will reflect the new occupied details
  const data = await dispatch(fetchOccupiedDetailed()).unwrap();
  console.log('[BlockSlots] Occupied detailed after save:', data);
    } catch (e) {
      alert('Failed to save: ' + e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="blockslots-container">
      <h1 className="page-title">Block slots</h1>
      <p className="page-subtle">Select dates and time slots to block for bookings. Sundays are not bookable and shown for reference only.</p>

      <div className="controls">
        <label>
          <span>Start date:</span>
          <input type="date" value={rangeStart} min={todayUTCStr()} onChange={(e) => setRangeStart(e.target.value)} />
        </label>
        <label>
          <span>Days:</span>
          <select value={daysToShow} onChange={(e) => setDaysToShow(Number(e.target.value))}>
            {[7, 14, 21, 28].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save changes'}</button>
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-dot booked"></span>
          <span>Booked (customer)</span>
        </span>
        <span className="legend-item">
          <span className="legend-dot blocked"></span>
          <span>Blocked (admin)</span>
        </span>
      </div>

      <div className="table-wrap">
        <table className="slot-table">
          <thead>
            <tr>
              <th>Date</th>
              {slotOptions.map((s) => (
                <th key={s.value}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleDates.map((d) => {
              const isSunday = isSundayUTCFromYMD(d);
              const blocked = pending[d] || new Set();
              const bookedSet = new Set((bookedMap[d] || []).map(Number));
              return (
                <tr key={d} style={{ opacity: isSunday ? 0.7 : 1 }}>
                  <td className="cell date-cell">{d} {isSunday && <span style={{ fontSize: 12, color: '#6b7280' }}>(Sunday)</span>}</td>
                  {slotOptions.map((s) => (
                    <td key={s.value} className="cell">
                      <div className="cell-inner">
                        <input
                          type="checkbox"
                          checked={blocked.has(s.value)}
                          onChange={() => toggle(d, s.value)}
                          disabled={isSunday || bookedSet.has(s.value)}
                          title={bookedSet.has(s.value) ? 'Booked by customer' : (isSunday ? 'Sunday (not bookable)' : 'Toggle admin block')}
                        />
                        {bookedSet.has(s.value) && (
                          <span className="slot-badge booked">Booked</span>
                        )}
                        {!bookedSet.has(s.value) && blocked.has(s.value) && (
                          <span className="slot-badge blocked">Blocked</span>
                        )}
                      </div>
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
