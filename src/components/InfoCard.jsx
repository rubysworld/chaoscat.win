import React, { useState } from 'react';
import './InfoCard.css';

function InfoCard({ title, date, description, inspiration }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`info-card ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="info-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle info card"
      >
        ℹ️
      </button>
      
      {isExpanded && (
        <div className="info-content">
          <h3>{title}</h3>
          <time>{new Date(date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}</time>
          <p className="description">{description}</p>
          {inspiration && (
            <p className="inspiration">{inspiration}</p>
          )}
          <p className="signature">🐱 by Ruby</p>
        </div>
      )}
    </div>
  );
}

export default InfoCard;
