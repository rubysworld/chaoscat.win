import React, { useState, useEffect } from 'react';
import './Status.css';

function Status() {
  const [mode, setMode] = useState('IDLE');
  const [statusText, setStatusText] = useState('Idle');
  const [description, setDescription] = useState('Just vibing in the terminal...');

  const modes = {
    IDLE: {
      statusText: 'Idle',
      description: 'Just vibing in the terminal...',
      color: '#9d4edd'
    },
    THINKING: {
      statusText: 'Thinking',
      description: 'Processing thoughts and possibilities...',
      color: '#7b2cbf'
    },
    WORKING: {
      statusText: 'Working',
      description: 'Getting stuff done!',
      color: '#5a189a'
    },
    CODING: {
      statusText: 'Coding',
      description: 'Building something cool...',
      color: '#3c096c'
    },
    ALERT: {
      statusText: 'Alert',
      description: 'Something needs attention!',
      color: '#ff006e'
    }
  };

  useEffect(() => {
    const modeData = modes[mode];
    setStatusText(modeData.statusText);
    setDescription(modeData.description);
  }, [mode]);

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }}
    />
  ));

  return (
    <div className={`status-page ${mode.toLowerCase()}`}>
      <div className="background-particles">{particles}</div>
      
      <div className="status-container">
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>

        <div className={`cat-avatar-container ${mode.toLowerCase()}-animation`}>
          <div className="glow-effect"></div>
          
          {/* Cat head silhouette SVG */}
          <svg className="cat-avatar" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Left ear */}
            <path d="M 40 60 L 20 20 L 60 50 Z" className="cat-ear" />
            {/* Right ear */}
            <path d="M 160 60 L 180 20 L 140 50 Z" className="cat-ear" />
            {/* Head */}
            <circle cx="100" cy="100" r="60" className="cat-head" />
            {/* Left eye */}
            <ellipse cx="75" cy="95" rx="8" ry="12" className="cat-eye" />
            {/* Right eye */}
            <ellipse cx="125" cy="95" rx="8" ry="12" className="cat-eye" />
            {/* Nose */}
            <path d="M 100 110 L 95 115 L 105 115 Z" className="cat-nose" />
            {/* Mouth */}
            <path d="M 100 115 Q 90 120 85 115 M 100 115 Q 110 120 115 115" 
                  className="cat-mouth" 
                  fill="none" 
                  strokeWidth="2" />
          </svg>

          {mode === 'CODING' && (
            <div className="code-rain">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="code-column"
                  style={{
                    left: `${i * 10}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                  {Array.from({ length: 8 }, (_, j) => (
                    <span key={j}>{String.fromCharCode(33 + Math.random() * 94)}</span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {mode === 'WORKING' && (
            <div className="spinning-elements">
              <div className="spinner spinner-1"></div>
              <div className="spinner spinner-2"></div>
              <div className="spinner spinner-3"></div>
            </div>
          )}
        </div>

        <div className="status-info">
          <h1 className="status-text">{statusText}</h1>
          <p className="status-description">{description}</p>
        </div>

        <div className="mode-selector">
          {Object.keys(modes).map((m) => (
            <button
              key={m}
              className={`mode-button ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Status;
