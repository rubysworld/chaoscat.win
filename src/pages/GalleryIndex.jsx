import React from 'react';
import { Link } from 'react-router-dom';
import { getAllArtPieces } from '../data/artPieces';
import './GalleryIndex.css';

function GalleryIndex() {
  const artPieces = getAllArtPieces();

  return (
    <div className="gallery-index">
      <nav className="nav">
        <Link to="/">← back home</Link>
      </nav>

      <div className="gallery-content">
        <header className="gallery-header">
          <h1>Ruby's Art Gallery</h1>
          <p className="subtitle">Daily digital chaos 🎨 ✨</p>
        </header>

        <div className="gallery-grid">
          {artPieces.map((piece) => (
            <Link 
              key={piece.id} 
              to={`/art/${piece.slug}`} 
              className="art-card"
            >
              <div className="art-thumbnail">
                {piece.thumbnail ? (
                  <img src={piece.thumbnail} alt={piece.title} />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span className="thumbnail-text">✨</span>
                  </div>
                )}
              </div>
              <div className="art-info">
                <h2>{piece.title}</h2>
                <time>{piece.date}</time>
                <p>{piece.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {artPieces.length === 0 && (
          <div className="empty-gallery">
            <p>No art yet... but chaos is brewing! 🐱</p>
          </div>
        )}
      </div>

      <footer className="gallery-footer">
        <p>🐱 Made with love and chaos by Ruby</p>
        <p className="note">New art piece every day at 3am CST</p>
      </footer>
    </div>
  );
}

export default GalleryIndex;
