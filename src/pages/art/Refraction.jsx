import React, { useEffect, useRef, useState } from 'react';
import './Refraction.css';

const Refraction = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('PRISM'); // PRISM, SHATTER, AURORA, CHAOS
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const raysRef = useRef([]);
  const fracturesRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleClick = (e) => {
      // Add a fracture point
      fracturesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        intensity: Math.random() * 0.5 + 0.5,
      });

      // Spawn particles
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          hue: Math.random() * 360,
          life: 1,
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Initialize rays
    for (let i = 0; i < 12; i++) {
      raysRef.current.push({
        angle: (i / 12) * Math.PI * 2,
        length: 100,
        hue: (i / 12) * 360,
        offset: Math.random() * 100,
      });
    }

    const draw = () => {
      const { x, y, px, py } = mouseRef.current;
      const dx = x - px;
      const dy = y - py;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Fade previous frame
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === 'PRISM') {
        // Draw rainbow rays emanating from cursor
        raysRef.current.forEach((ray) => {
          const rayAngle = ray.angle + velocity * 0.01;
          const rayLength = ray.length + velocity * 2;
          
          const gradient = ctx.createLinearGradient(
            x, y,
            x + Math.cos(rayAngle) * rayLength,
            y + Math.sin(rayAngle) * rayLength
          );
          gradient.addColorStop(0, `hsla(${ray.hue}, 100%, 70%, 0.8)`);
          gradient.addColorStop(0.5, `hsla(${ray.hue + 60}, 100%, 60%, 0.4)`);
          gradient.addColorStop(1, `hsla(${ray.hue + 120}, 100%, 50%, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(rayAngle) * rayLength,
            y + Math.sin(rayAngle) * rayLength
          );
          ctx.stroke();

          ray.angle += 0.005;
          ray.hue = (ray.hue + 0.5) % 360;
        });
      } else if (mode === 'SHATTER') {
        // Draw fracture lines from click points
        fracturesRef.current.forEach((fracture, i) => {
          fracture.age += 1;
          const maxAge = 100;
          const progress = fracture.age / maxAge;
          
          if (fracture.age > maxAge) {
            fracturesRef.current.splice(i, 1);
            return;
          }

          // Radiating cracks
          for (let j = 0; j < 8; j++) {
            const angle = (j / 8) * Math.PI * 2 + fracture.age * 0.02;
            const length = progress * 200 * fracture.intensity;
            
            const gradient = ctx.createLinearGradient(
              fracture.x, fracture.y,
              fracture.x + Math.cos(angle) * length,
              fracture.y + Math.sin(angle) * length
            );
            gradient.addColorStop(0, `hsla(${angle * 60}, 100%, 80%, ${1 - progress})`);
            gradient.addColorStop(1, `hsla(${angle * 60 + 180}, 100%, 60%, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fracture.x, fracture.y);
            ctx.lineTo(
              fracture.x + Math.cos(angle) * length,
              fracture.y + Math.sin(angle) * length
            );
            ctx.stroke();
          }
        });
      } else if (mode === 'AURORA') {
        // Flowing aurora borealis effect
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
          const waveY = canvas.height * 0.3 + Math.sin(time + i) * 100;
          const waveX = (time * 50 + i * 200) % canvas.width;
          
          const gradient = ctx.createRadialGradient(
            waveX, waveY, 0,
            waveX, waveY, 200
          );
          gradient.addColorStop(0, `hsla(${(time * 30 + i * 60) % 360}, 100%, 70%, 0.3)`);
          gradient.addColorStop(0.5, `hsla(${(time * 30 + i * 60 + 120) % 360}, 100%, 60%, 0.1)`);
          gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Mouse interaction ripple
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, velocity * 10);
        gradient.addColorStop(0, `hsla(${(time * 100) % 360}, 100%, 80%, 0.6)`);
        gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, velocity * 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'CHAOS') {
        // All modes at once
        const time = Date.now() * 0.001;
        
        // Prism rays
        raysRef.current.forEach((ray) => {
          const rayAngle = ray.angle + Math.sin(time + ray.offset) * 0.5;
          const rayLength = 150 + Math.cos(time * 2 + ray.offset) * 50;
          
          ctx.strokeStyle = `hsla(${ray.hue}, 100%, 60%, 0.3)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(rayAngle) * rayLength,
            y + Math.sin(rayAngle) * rayLength
          );
          ctx.stroke();

          ray.angle += 0.01;
          ray.hue = (ray.hue + 1) % 360;
        });

        // Random fractures
        if (Math.random() < 0.02) {
          fracturesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            age: 0,
            intensity: 0.5,
          });
        }
      }

      // Draw particles (all modes)
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.02;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          return;
        }

        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode]);

  const cycleMode = () => {
    const modes = ['PRISM', 'SHATTER', 'AURORA', 'CHAOS'];
    const currentIndex = modes.indexOf(mode);
    setMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="refraction-container">
      <canvas ref={canvasRef} className="refraction-canvas" />
      <div className="refraction-controls">
        <button onClick={cycleMode} className="mode-btn">
          MODE: {mode}
        </button>
        <div className="instructions">
          {mode === 'PRISM' && 'Move your mouse. Watch light bend.'}
          {mode === 'SHATTER' && 'Click to shatter. Watch cracks spread.'}
          {mode === 'AURORA' && 'Flow through the void. Dance with light.'}
          {mode === 'CHAOS' && 'Everything at once. Embrace it.'}
        </div>
      </div>
    </div>
  );
};

export default Refraction;
