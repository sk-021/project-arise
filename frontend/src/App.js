import React, { useState } from 'react';
import Home from './pages/Home';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ProjectEnhancer from './pages/ProjectEnhancer';
import LinkedInGenerator from './pages/LinkedInGenerator';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'projects':
        return <ProjectEnhancer />;
      case 'linkedin':
        return <LinkedInGenerator />;
      default:
        return <Home />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'resume', label: 'Resume Analyzer' },
    { id: 'projects', label: 'Project Enhancer' },
    { id: 'linkedin', label: 'LinkedIn Generator' }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <nav style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <h1 style={{
              margin: '0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginRight: 'auto'
            }}>
              Career Tools
            </h1>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: currentPage === item.id ? '#007bff' : 'transparent',
                  color: currentPage === item.id ? '#ffffff' : '#6c757d',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = '#e9ecef';
                    e.target.style.color = '#495057';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6c757d';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          padding: '2rem',
          minHeight: '400px'
        }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
