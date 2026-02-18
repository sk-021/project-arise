import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Home = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.getHealth();
        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <p>This is a simple home page.</p>
      {loading && <p>Loading backend status...</p>}
      {error && <p>Error: {error}</p>}
      {status && <p>Backend Status: {JSON.stringify(status)}</p>}
    </div>
  );
};

export default Home;
