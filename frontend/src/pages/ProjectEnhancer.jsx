import React, { useState } from 'react';

const ProjectEnhancer = () => {
  const [bullet, setBullet] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enhance = async () => {
    if (!bullet.trim()) {
      setError('Please enter a bullet point to enhance');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/projects/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError('Failed to enhance bullet point. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#2c3e50',
          margin: '0 0 0.5rem 0'
        }}>
          Project Enhancer
        </h2>
        <p style={{
          color: '#6c757d',
          margin: '0',
          fontSize: '1rem'
        }}>
          Transform your project bullet points into impactful statements
        </p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#495057'
        }}>
          Bullet Point
        </label>
        <textarea
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="Enter your project bullet point..."
          rows="4"
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px', 
            border: '2px solid #e9ecef', 
            borderRadius: '8px',
            fontFamily: 'inherit',
            resize: 'vertical',
            transition: 'border-color 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#28a745';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e9ecef';
          }}
        />
      </div>
      
      <button 
        onClick={enhance} 
        disabled={loading}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: loading ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 2px 4px rgba(40,167,69,0.3)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#218838';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(40,167,69,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#28a745';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(40,167,69,0.3)';
          }
        }}
      >
        {loading ? 'Enhancing...' : 'Enhance Bullet Point'}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: '1rem',
          padding: '12px 16px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '8px',
          color: '#721c24',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      {loading && (
        <div style={{ 
          marginTop: '2rem',
          textAlign: 'center', 
          padding: '2rem'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #28a745',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ margin: '0', color: '#6c757d' }}>Enhancing your bullet point...</p>
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '1.5rem'
          }}>
            Enhanced Versions
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              color: '#6c757d',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Original
            </h4>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: '8px',
              fontStyle: 'italic',
              color: '#6c757d',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              {result.original}
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              color: '#007bff',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Enhanced
            </h4>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#e8f4ff', 
              border: '2px solid #007bff', 
              borderRadius: '8px',
              fontWeight: '500',
              color: '#004085',
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,123,255,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,123,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,123,255,0.15)';
            }}>
              {result.enhanced}
            </div>
          </div>
          
          <div>
            <h4 style={{
              color: '#28a745',
              marginBottom: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Impact Version
            </h4>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#e8f5e8', 
              border: '2px solid #28a745', 
              borderRadius: '8px',
              fontWeight: '600',
              color: '#155724',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 12px rgba(40,167,69,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(40,167,69,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(40,167,69,0.2)';
            }}>
              {result.impact_version}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEnhancer;
