import React, { useState } from 'react';

const LinkedInGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate content');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/linkedin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError('Failed to generate LinkedIn post. Please try again.');
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
          LinkedIn Generator
        </h2>
        <p style={{
          color: '#6c757d',
          margin: '0',
          fontSize: '1rem'
        }}>
          Create engaging LinkedIn posts with AI-powered content generation
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#495057'
          }}>
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic..."
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              border: '2px solid #e9ecef', 
              borderRadius: '8px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0a66c2';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#495057'
          }}>
            Tone
          </label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px', 
              border: '2px solid #e9ecef', 
              borderRadius: '8px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
              outline: 'none',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0a66c2';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <option value="professional">Professional</option>
            <option value="confident">Confident</option>
            <option value="storytelling">Storytelling</option>
          </select>
        </div>
      </div>
      
      <button 
        onClick={generate} 
        disabled={loading}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: loading ? '#6c757d' : '#0a66c2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 2px 4px rgba(10,102,194,0.3)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#004182';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(10,102,194,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#0a66c2';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(10,102,194,0.3)';
          }
        }}
      >
        {loading ? 'Generating...' : 'Generate LinkedIn Post'}
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
            borderTop: '3px solid #0a66c2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ margin: '0', color: '#6c757d' }}>Generating your LinkedIn post...</p>
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
            Generated LinkedIn Post
          </h3>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e0e0e0', 
            borderRadius: '12px', 
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                fontWeight: '700', 
                fontSize: '1.25rem', 
                marginBottom: '1rem',
                color: '#0a66c2',
                lineHeight: '1.3'
              }}>
                {result.hook}
              </div>
            </div>
            
            <div style={{ 
              marginBottom: '1.5rem', 
              lineHeight: '1.6',
              fontSize: '1rem',
              color: '#333333'
            }}>
              {result.body}
            </div>
            
            <div style={{ 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e0e0e0',
              fontStyle: 'italic',
              color: '#666666',
              fontSize: '0.95rem'
            }}>
              {result.cta}
            </div>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#495057',
              marginBottom: '1rem'
            }}>
              📝 Post Components
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong style={{ color: '#0a66c2', display: 'block', marginBottom: '0.25rem' }}>Hook:</strong>
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>{result.hook}</span>
              </div>
              <div>
                <strong style={{ color: '#495057', display: 'block', marginBottom: '0.25rem' }}>Body:</strong>
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>{result.body}</span>
              </div>
              <div>
                <strong style={{ color: '#28a745', display: 'block', marginBottom: '0.25rem' }}>CTA:</strong>
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>{result.cta}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInGenerator;
