import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../../components/InfoCard';
import { getArtPiece } from '../../data/artPieces';
import './MidnightVisitors.css';

function MidnightVisitors() {
  const canvasRef = useRef(null);
  const [eyeCount, setEyeCount] = useState(0);
  const [watchingIntensity, setWatchingIntensity] = useState(0);
  const artPiece = getArtPiece('2026-01-31-midnight-visitors');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = width / 2, mouseY = height / 2;
    let eyes = [];
    let meows = [];
    let time = 0;
    let animationId;
    let keys = {};

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Eye pair class
    class EyePair {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.spacing = 15 + Math.random() * 10; // distance between eyes
        this.blinkTimer = Math.random() * 300 + 100;
        this.blinkDuration = 0;
        this.isBlinking = false;
        this.pupilOffsetX = 0;
        this.pupilOffsetY = 0;
        this.targetPupilX = 0;
        this.targetPupilY = 0;
        this.glowIntensity = 0.3 + Math.random() * 0.3;
        this.color = Math.random() > 0.5 ? 
          `hsl(${30 + Math.random() * 30}, 80%, 60%)` : // amber/yellow
          `hsl(${120 + Math.random() * 20}, 70%, 50%)`; // green
        this.meowCooldown = Math.random() * 600 + 400;
      }

      update(mx, my, pspsps) {
        // Blinking logic
        this.blinkTimer--;
        if (this.blinkTimer <= 0 && !this.isBlinking) {
          this.isBlinking = true;
          this.blinkDuration = 8 + Math.random() * 4;
          this.blinkTimer = 200 + Math.random() * 400;
        }
        if (this.isBlinking) {
          this.blinkDuration--;
          if (this.blinkDuration <= 0) {
            this.isBlinking = false;
          }
        }

        // Track mouse with pupils
        const dx = mx - this.x;
        const dy = my - this.y;
        const angle = Math.atan2(dy, dx);
        const maxOffset = pspsps ? 4 : 3;
        this.targetPupilX = Math.cos(angle) * maxOffset;
        this.targetPupilY = Math.sin(angle) * maxOffset;

        // Smooth pupil movement
        this.pupilOffsetX += (this.targetPupilX - this.pupilOffsetX) * 0.1;
        this.pupilOffsetY += (this.targetPupilY - this.pupilOffsetY) * 0.1;

        // Distance-based glow (eyes get brighter when you look at them)
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetGlow = pspsps ? 1.0 : Math.max(0.3, 1 - dist / 300);
        this.glowIntensity += (targetGlow - this.glowIntensity) * 0.05;

        // Maybe spawn a meow
        this.meowCooldown--;
        if (this.meowCooldown <= 0 && Math.random() < 0.01) {
          meows.push(new Meow(this.x, this.y));
          this.meowCooldown = 400 + Math.random() * 800;
        }
      }

      draw(ctx) {
        if (this.isBlinking) {
          // Draw closed eyes (horizontal lines)
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          
          // Left eye closed
          ctx.beginPath();
          ctx.moveTo(this.x - this.spacing - 6, this.y);
          ctx.lineTo(this.x - this.spacing + 6, this.y);
          ctx.stroke();

          // Right eye closed
          ctx.beginPath();
          ctx.moveTo(this.x + this.spacing - 6, this.y);
          ctx.lineTo(this.x + this.spacing + 6, this.y);
          ctx.stroke();
          
          ctx.globalAlpha = 1;
          return;
        }

        // Draw glowing eyes
        const eyeRadius = 8;
        const pupilRadius = 4;

        // Glow effect
        ctx.shadowBlur = 20 * this.glowIntensity;
        ctx.shadowColor = this.color;

        // Left eye
        ctx.globalAlpha = this.glowIntensity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x - this.spacing, this.y, eyeRadius, eyeRadius * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left pupil
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
          this.x - this.spacing + this.pupilOffsetX,
          this.y + this.pupilOffsetY,
          pupilRadius, 0, Math.PI * 2
        );
        ctx.fill();

        // Right eye
        ctx.globalAlpha = this.glowIntensity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + this.spacing, this.y, eyeRadius, eyeRadius * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Right pupil
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
          this.x + this.spacing + this.pupilOffsetX,
          this.y + this.pupilOffsetY,
          pupilRadius, 0, Math.PI * 2
        );
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    // Meow text class
    class Meow {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y;
        this.vy = -0.5 - Math.random() * 0.5;
        this.life = 120;
        this.maxLife = this.life;
        this.text = ['meow', 'mrrp', 'mrow', 'prr', 'nya', '...'][Math.floor(Math.random() * 6)];
        this.size = 12 + Math.random() * 8;
      }

      update() {
        this.y += this.vy;
        this.life--;
      }

      draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.font = `${this.size}px "VT323", monospace`;
        ctx.fillStyle = '#9d4edd';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Initialize eyes
    const eyeCountTarget = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < eyeCountTarget; i++) {
      eyes.push(new EyePair());
    }
    setEyeCount(eyes.length);

    // Mouse tracking
    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    window.addEventListener('mousemove', handleMouseMove);

    // Keyboard for pspsps
    function handleKeyDown(e) {
      keys[e.key.toLowerCase()] = true;
    }
    function handleKeyUp(e) {
      keys[e.key.toLowerCase()] = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop
    function animate() {
      time++;

      // Dark background with slow fade
      ctx.fillStyle = 'rgba(10, 5, 15, 0.3)';
      ctx.fillRect(0, 0, width, height);

      const pspsps = keys['p'] || false;

      // Update and draw eyes
      let totalGlow = 0;
      eyes.forEach(eye => {
        eye.update(mouseX, mouseY, pspsps);
        eye.draw(ctx);
        totalGlow += eye.glowIntensity;
      });

      // Update watching intensity
      const avgGlow = totalGlow / eyes.length;
      setWatchingIntensity(Math.round(avgGlow * 100));

      // Update and draw meows
      meows = meows.filter(meow => !meow.isDead());
      meows.forEach(meow => {
        meow.update();
        meow.draw(ctx);
      });

      // Draw UI hints
      ctx.font = '16px "VT323", monospace';
      ctx.fillStyle = 'rgba(157, 78, 221, 0.6)';
      ctx.textAlign = 'left';
      ctx.fillText(`eyes watching: ${eyes.length}`, 20, 30);
      ctx.fillText(`intensity: ${Math.round(avgGlow * 100)}%`, 20, 50);
      if (!pspsps) {
        ctx.fillStyle = 'rgba(157, 78, 221, 0.4)';
        ctx.fillText('hold [P] to pspsps', 20, height - 20);
      } else {
        ctx.fillStyle = 'rgba(157, 78, 221, 1)';
        ctx.fillText('pspsps pspsps pspsps', 20, height - 20);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="midnight-visitors">
      <canvas ref={canvasRef} />
      
      <div className="back-button">
        <Link to="/art">← back to gallery</Link>
      </div>

      {artPiece && (
        <InfoCard
          title={artPiece.title}
          date={artPiece.date}
          description={artPiece.description}
        />
      )}
    </div>
  );
}

export default MidnightVisitors;
