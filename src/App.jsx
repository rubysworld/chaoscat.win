import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import GalleryIndex from './pages/GalleryIndex';
import GradientOrbs from './pages/art/GradientOrbs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/art" element={<GalleryIndex />} />
        <Route path="/art/gradient-orbs" element={<GradientOrbs />} />
        
        {/* Redirect /static to /art/gradient-orbs */}
        <Route path="/static" element={<Navigate to="/art/gradient-orbs" replace />} />
        
        {/* Future daily art pieces will be added as routes */}
        {/* <Route path="/art/YYYY-MM-DD-name" element={<ArtComponent />} /> */}
        
        {/* 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
