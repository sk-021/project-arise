import React, { useState } from 'react';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError('Failed to analyze resume. Please try again.');
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
          Resume Analyzer
        </h2>
        <p style={{
          color: '#6c757d',
          margin: '0',
          fontSize: '1rem'
        }}>
          Get instant feedback on your resume with AI-powered analysis
        </p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#495057'
        }}>
          Resume Text
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          rows="12"
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
            e.target.style.borderColor = '#007bff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e9ecef';
          }}
        />
      </div>
      
      <button 
        onClick={analyze} 
        disabled={loading}
        style={{
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: loading ? 'none' : '0 2px 4px rgba(0,123,255,0.3)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
          }
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
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
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ margin: '0', color: '#6c757d' }}>Analyzing your resume...</p>
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 8px 16px rgba(102,126,234,0.3)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', margin: '0' }}>
              {result.score}/100
            </div>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Resume Score</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#d4edda', 
              borderRadius: '12px',
              border: '1px solid #c3e6cb',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <h4 style={{ 
                color: '#155724', 
                marginTop: '0',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                💪 Strengths
              </h4>
              <ul style={{ 
                paddingLeft: '1.5rem', 
                margin: '0',
                color: '#155724'
              }}>
                {result.strengths.map((strength, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f8d7da', 
              borderRadius: '12px',
              border: '1px solid #f5c6cb',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <h4 style={{ 
                color: '#721c24', 
                marginTop: '0',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                ⚠️ Weaknesses
              </h4>
              <ul style={{ 
                paddingLeft: '1.5rem', 
                margin: '0',
                color: '#721c24'
              }}>
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{weakness}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#d1ecf1', 
              borderRadius: '12px',
              border: '1px solid #bee5eb',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <h4 style={{ 
                color: '#0c5460', 
                marginTop: '0',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                💡 Suggestions
              </h4>
              <ul style={{ 
                paddingLeft: '1.5rem', 
                margin: '0',
                color: '#0c5460'
              }}>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
