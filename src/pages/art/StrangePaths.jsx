import React, { useEffect, useRef, useState } from 'react';
import InfoCard from '../../components/InfoCard';

// Strange Attractors visualization
// Different chaotic systems draw beautiful never-repeating paths

const attractorTypes = [
  {
    name: 'LORENZ',
    description: 'The butterfly effect, literally',
    params: { sigma: 10, rho: 28, beta: 8/3 },
    scale: 8,
    speed: 0.005
  },
  {
    name: 'RÖSSLER',
    description: 'Twisted ribbon in space',
    params: { a: 0.2, b: 0.2, c: 5.7 },
    scale: 15,
    speed: 0.02
  },
  {
    name: 'AIZAWA',
    description: 'Chaotic pretzel of doom',
    params: { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1 },
    scale: 25,
    speed: 0.01
  },
  {
    name: 'DADRAS',
    description: 'Four-winged chaos',
    params: { a: 3, b: 2.7, c: 1.7, d: 2, e: 9 },
    scale: 12,
    speed: 0.005
  }
];

function StrangePaths() {
  const canvasRef = useRef(null);
  const [attractorIndex, setAttractorIndex] = useState(0);
  const [iterations, setIterations] = useState(0);
  const animationRef = useRef(null);
  const pointsRef = useRef([]);
  const rotationRef = useRef({ x: 0, y: 0 });
  
  const attractor = attractorTypes[attractorIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Reset points when attractor changes
    pointsRef.current = [];
    setIterations(0);
    
    // Initial position (slightly random)
    let x = 0.1 + Math.random() * 0.1;
    let y = 0.1 + Math.random() * 0.1;
    let z = 0.1 + Math.random() * 0.1;
    
    let frame = 0;
    
    const animate = () => {
      // Slowly fade canvas instead of clearing (creates trails)
      ctx.fillStyle = 'rgba(5, 2, 10, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate next point based on attractor type
      const dt = attractor.speed;
      let dx, dy, dz;
      
      if (attractor.name === 'LORENZ') {
        const { sigma, rho, beta } = attractor.params;
        dx = sigma * (y - x);
        dy = x * (rho - z) - y;
        dz = x * y - beta * z;
      } else if (attractor.name === 'RÖSSLER') {
        const { a, b, c } = attractor.params;
        dx = -(y + z);
        dy = x + a * y;
        dz = b + z * (x - c);
      } else if (attractor.name === 'AIZAWA') {
        const { a, b, c, d, e, f } = attractor.params;
        dx = (z - b) * x - d * y;
        dy = d * x + (z - b) * y;
        dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x);
      } else if (attractor.name === 'DADRAS') {
        const { a, b, c, d, e } = attractor.params;
        dx = y - a * x + b * y * z;
        dy = c * y - x * z + z;
        dz = d * x * y - e * z;
      }
      
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      
      // Add point to trail (limit trail length)
      pointsRef.current.push({ x, y, z });
      if (pointsRef.current.length > 5000) {
        pointsRef.current.shift();
      }
      
      // Update rotation slowly
      rotationRef.current.y += 0.002;
      rotationRef.current.x = Math.sin(frame * 0.0005) * 0.3;
      
      // Project and draw all points
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      pointsRef.current.forEach((point, i) => {
        if (i === 0) return;
        
        const prev = pointsRef.current[i - 1];
        
        // Rotate points
        const { x: px, y: py, z: pz } = rotatePoint(prev, rotationRef.current);
        const { x: cx, y: cy, z: cz } = rotatePoint(point, rotationRef.current);
        
        // Project to 2D (simple perspective)
        const scale = attractor.scale;
        const prevProjected = project3D(px * scale, py * scale, pz * scale, centerX, centerY);
        const currProjected = project3D(cx * scale, cy * scale, cz * scale, centerX, centerY);
        
        // Color based on age (older = more faded, shift hue over time)
        const age = i / pointsRef.current.length;
        const hue = (frame * 0.5 + age * 360) % 360;
        const alpha = age * 0.8;
        
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(prevProjected.x, prevProjected.y);
        ctx.lineTo(currProjected.x, currProjected.y);
        ctx.stroke();
      });
      
      // Draw current point as glowing dot
      if (pointsRef.current.length > 0) {
        const curr = pointsRef.current[pointsRef.current.length - 1];
        const { x: cx, y: cy, z: cz } = rotatePoint(curr, rotationRef.current);
        const scale = attractor.scale;
        const projected = project3D(cx * scale, cy * scale, cz * scale, centerX, centerY);
        
        const hue = (frame * 0.5) % 360;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, 80%, 60%)`;
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      frame++;
      setIterations(pointsRef.current.length);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [attractorIndex]);
  
  // 3D rotation helpers
  const rotatePoint = (point, rotation) => {
    let { x, y, z } = point;
    
    // Rotate around Y axis
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const xRot = x * cosY - z * sinY;
    const zRot = x * sinY + z * cosY;
    x = xRot;
    z = zRot;
    
    // Rotate around X axis
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const yRot = y * cosX - z * sinX;
    const zRot2 = y * sinX + z * cosX;
    y = yRot;
    z = zRot2;
    
    return { x, y, z };
  };
  
  // Simple perspective projection
  const project3D = (x, y, z, centerX, centerY) => {
    const perspective = 600;
    const scale = perspective / (perspective + z);
    return {
      x: centerX + x * scale,
      y: centerY + y * scale
    };
  };
  
  const nextAttractor = () => {
    setAttractorIndex((attractorIndex + 1) % attractorTypes.length);
  };
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: '#05020a',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef}
        style={{
          display: 'block',
          cursor: 'crosshair'
        }}
        onClick={nextAttractor}
      />
      
      {/* Stats overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontFamily: 'VT323, monospace',
        fontSize: '18px',
        color: '#ff00ff',
        textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        <div style={{ marginBottom: '5px' }}>
          ATTRACTOR: <span style={{ color: '#00ffff' }}>{attractor.name}</span>
        </div>
        <div style={{ marginBottom: '5px', fontSize: '14px', color: '#888' }}>
          {attractor.description}
        </div>
        <div style={{ fontSize: '14px' }}>
          POINTS: {iterations.toLocaleString()}
        </div>
        <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
          click to change attractor
        </div>
      </div>
      
      <InfoCard 
        date="2026-02-02"
        title="Strange Paths"
        description="Chaotic deterministic systems draw beautiful patterns"
      />
    </div>
  );
}

export default StrangePaths;
