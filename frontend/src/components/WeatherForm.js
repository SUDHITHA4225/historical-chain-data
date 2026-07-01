import React, { useState } from 'react';

function WeatherForm({ contract, account }) {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setStatus('Connect your wallet first.');
      return;
    }
    setPending(true);
    setStatus('Submitting request...');
    try {
      const tx = await contract.requestWeather(city, { value: '1000000000000000' });
      setStatus(`Transaction submitted: ${tx.hash}`);
      await tx.wait();
      setStatus('Weather request confirmed.');
    } catch (error) {
      setStatus(error.message || 'Request failed.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 24 }}>
      <h2>Request Weather</h2>
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" required />
      <button type="submit" disabled={pending} style={{ marginLeft: 8 }}>
        {pending ? 'Submitting...' : 'Request Weather'}
      </button>
      <p>{status}</p>
    </form>
  );
}

export default WeatherForm;
