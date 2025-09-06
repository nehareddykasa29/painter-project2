import React, { useState } from 'react';

function MailQuoteUpdateForm() {
  const [date, setDate] = useState('');

  return (
    <form>
      <label>
        Select a date:
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
      </label>
    </form>
  );
}

export default MailQuoteUpdateForm;
