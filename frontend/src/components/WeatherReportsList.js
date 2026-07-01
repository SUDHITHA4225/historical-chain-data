import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const QUERY = gql`
  query WeatherReports {
    weatherReports(first: 20, orderBy: timestamp, orderDirection: desc) {
      id
      city
      temperature
      description
      timestamp
      requester
    }
  }
`;

function WeatherReportsList({ client }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await client.query({ query: QUERY });
        setReports(data.weatherReports || []);
      } catch (err) {
        setError(err.message || 'Could not load reports');
      }
    };
    load();
  }, [client]);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Historical Reports</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!error && reports.length === 0 && <p>No weather reports yet.</p>}
      <ul>
        {reports.map((report) => (
          <li key={report.id} style={{ marginBottom: 10 }}>
            <strong>{report.city}</strong> — {report.temperature}°C — {report.description}<br />
            <small>{new Date(Number(report.timestamp) * 1000).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherReportsList;
