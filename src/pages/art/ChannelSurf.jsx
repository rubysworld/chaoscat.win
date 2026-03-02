import { useEffect, useRef, useState, useCallback } from 'react';
import InfoCard from '../../components/InfoCard';
import './ChannelSurf.css';

// ─── Channel renderers ───

function renderStatic(ctx, w, h, t) {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // Occasional horizontal tear
  if (Math.random() < 0.1) {
    const y = Math.random() * h | 0;
    const strip = ctx.getImageData(0, y, w, 3);
    ctx.putImageData(strip, (Math.random()-0.5)*40|0, y);
  }
}

function renderTestPattern(ctx, w, h, t) {
  const colors = ['#fff','#ff0','#0ff','#0f0','#f0f','#f00','#00f','#000'];
  const bw = w / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, 0, bw + 1, h * 0.7);
  });
  // Bottom section - color bars reversed
  const rev = [...colors].reverse();
  rev.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * bw, h * 0.7, bw + 1, h * 0.1);
  });
  // Gray ramp at bottom
  for (let x = 0; x < w; x++) {
    const v = (x / w * 255) | 0;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, h * 0.8, 1, h * 0.2);
  }
  // Center circle
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w/2, h*0.35, Math.min(w,h)*0.2, 0, Math.PI*2);
  ctx.stroke();
  // Text
  ctx.fillStyle = '#fff';
  ctx.font = `${Math.max(14, w*0.03)|0}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('CHAOSCAT BROADCASTING', w/2, h*0.35);
  ctx.font = `${Math.max(10, w*0.02)|0}px "VT323", monospace`;
  ctx.fillText('PLEASE STAND BY', w/2, h*0.35 + 30);
}

function renderLateNightInfomercial(ctx, w, h, t) {
  ctx.fillStyle = '#000820';
  ctx.fillRect(0, 0, w, h);
  
  // Scrolling product - a bouncing cat emoji text
  const msgs = [
    '🐱 CHAOS CAT ENERGY DRINK 🐱',
    'NOW WITH 300% MORE ENTROPY!',
    'CALL 1-800-MEOW-NOW',
    '⚡ ONLY $3.33 ⚡',
    'SIDE EFFECTS MAY INCLUDE:',
    'SPONTANEOUS PURRING',
    'SEEING FRACTALS',
    'STAYING UP UNTIL 3AM',
    '',
    '"IT CHANGED MY LIFE" — A CAT',
    '"I CAN SEE SOUNDS NOW" — ALSO A CAT',
  ];
  
  ctx.font = `${Math.max(16, w*0.035)|0}px "VT323", monospace`;
  ctx.textAlign = 'center';
  
  const scrollY = (-t * 0.5) % (msgs.length * 40 + h);
  msgs.forEach((msg, i) => {
    const y = h + scrollY + i * 40;
    if (y > -40 && y < h + 40) {
      const hue = (t * 2 + i * 30) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.fillText(msg, w/2, y);
    }
  });
  
  // Flashing "CALL NOW" box
  if (Math.sin(t * 0.1) > 0) {
    ctx.fillStyle = '#f00';
    ctx.fillRect(w*0.2, h*0.8, w*0.6, h*0.15);
    ctx.fillStyle = '#ff0';
    ctx.font = `${Math.max(20, w*0.04)|0}px "Press Start 2P", monospace`;
    ctx.fillText('CALL NOW!', w/2, h*0.9);
  }
}

function renderWeatherMap(ctx, w, h, t) {
  // Dark blue bg
  ctx.fillStyle = '#001030';
  ctx.fillRect(0, 0, w, h);
  
  // Fake radar sweep
  const cx = w * 0.5, cy = h * 0.45;
  const angle = t * 0.02;
  const radius = Math.min(w, h) * 0.35;
  
  // Radar circles
  ctx.strokeStyle = '#0a3060';
  ctx.lineWidth = 1;
  for (let r = 1; r <= 4; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * r / 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Cross lines
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
  ctx.stroke();
  
  // Weather blobs (procedural)
  for (let i = 0; i < 8; i++) {
    const a = i * 0.8 + t * 0.003;
    const r = radius * (0.3 + 0.4 * Math.sin(i * 1.7));
    const bx = cx + Math.cos(a) * r;
    const by = cy + Math.sin(a) * r;
    const severity = Math.sin(t * 0.01 + i) * 0.5 + 0.5;
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, 40 + severity * 30);
    const hue = 120 - severity * 120; // green -> red
    grad.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.6)`);
    grad.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(bx - 70, by - 70, 140, 140);
  }
  
  // Sweep line
  ctx.strokeStyle = 'rgba(0, 255, 100, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
  ctx.stroke();
  
  // Sweep glow trail
  for (let i = 0; i < 20; i++) {
    const a = angle - i * 0.03;
    ctx.strokeStyle = `rgba(0, 255, 100, ${0.3 - i * 0.015})`;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.stroke();
  }
  
  // Location labels
  ctx.fillStyle = '#4a9';
  ctx.font = `${Math.max(12, w*0.02)|0}px "VT323", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('CHAOS COUNTY', w*0.1, h*0.15);
  ctx.fillText('ENTROPY VALLEY', w*0.6, h*0.25);
  ctx.fillText('MT. RANDOM', w*0.15, h*0.7);
  ctx.fillText('FRACTAL BAY', w*0.55, h*0.75);
  
  // Bottom bar
  ctx.fillStyle = '#001830';
  ctx.fillRect(0, h*0.88, w, h*0.12);
  ctx.fillStyle = '#4a9';
  ctx.font = `${Math.max(14, w*0.025)|0}px "VT323", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('CHAOSCAT WEATHER — PROBABILITY OF CHAOS: 99.7% — WINDS: UNPREDICTABLE', w/2, h*0.95);
}

function renderMidnightMovie(ctx, w, h, t) {
  // Film grain noir
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  
  // A noir scene — city skyline silhouette
  ctx.fillStyle = '#0a0a0a';
  const buildings = [0.3,0.5,0.7,0.4,0.8,0.6,0.45,0.65,0.55,0.75,0.35,0.5,0.9,0.4,0.6];
  buildings.forEach((bh, i) => {
    const bx = (i / buildings.length) * w;
    const bw2 = w / buildings.length;
    ctx.fillRect(bx, h * (1 - bh), bw2, h * bh);
    // Windows
    ctx.fillStyle = Math.random() < 0.3 ? '#331' : '#0a0a0a';
    for (let wy = h*(1-bh)+10; wy < h-10; wy += 15) {
      for (let wx = bx+4; wx < bx+bw2-4; wx += 10) {
        if (Math.random() < 0.2) {
          ctx.fillStyle = `rgba(255,200,50,${Math.random()*0.4})`;
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }
    ctx.fillStyle = '#0a0a0a';
  });
  
  // Moon
  ctx.fillStyle = '#ddd';
  ctx.beginPath();
  ctx.arc(w*0.8, h*0.15, 30, 0, Math.PI*2);
  ctx.fill();
  
  // Rain
  ctx.strokeStyle = 'rgba(150,150,200,0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 100; i++) {
    const rx = (Math.random() * w + t * 0.5) % w;
    const ry = (Math.random() * h + t * 2 + i * 7) % h;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 2, ry + 10);
    ctx.stroke();
  }
  
  // Subtitle
  if (Math.sin(t * 0.015) > -0.3) {
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.max(14, w*0.025)|0}px "VT323", monospace`;
    ctx.textAlign = 'center';
    const subs = [
      '"The cat walked alone through the neon rain..."',
      '"In this city, nobody sleeps. Not really."',
      '"She had nine lives and she\'d used eight."',
      '"The shadows had shadows of their own."',
      '"3 AM. The hour when the city whispers."',
      '"Every alley held a secret. Every secret had claws."',
    ];
    const idx = (t * 0.005 | 0) % subs.length;
    ctx.fillText(subs[idx], w/2, h * 0.92);
  }
  
  // Film grain
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 16) {
    const noise = (Math.random() - 0.5) * 20;
    d[i] += noise; d[i+1] += noise; d[i+2] += noise;
  }
  ctx.putImageData(img, 0, 0);
  
  // Occasional horizontal line artifact
  if (Math.random() < 0.05) {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, Math.random()*h, w, 2);
  }
}

function renderHypnoSpiral(ctx, w, h, t) {
  const cx = w/2, cy = h/2;
  const maxR = Math.sqrt(cx*cx + cy*cy);
  
  for (let r = 0; r < maxR; r += 3) {
    const angle = r * 0.05 + t * 0.03;
    const hue = (r + t * 2) % 360;
    const bright = (Math.sin(r * 0.02 - t * 0.05) + 1) * 25 + 20;
    ctx.strokeStyle = `hsl(${hue}, 80%, ${bright}%)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + 0.15);
    ctx.stroke();
  }
  
  // Center eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = `hsl(${t%360}, 100%, 60%)`;
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI*2);
  ctx.fill();
}

function renderCountdown(ctx, w, h, t) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  
  // Countdown numbers cycling
  const num = 10 - ((t * 0.02 | 0) % 11);
  
  // Big number
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(80, w*0.2)|0}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num, w/2, h/2);
  
  // Rotating circle around number
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const r = Math.min(w,h) * 0.3;
  ctx.arc(w/2, h/2, r, -Math.PI/2, -Math.PI/2 + (num/10) * Math.PI * 2);
  ctx.stroke();
  
  // Tick marks
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI/2 + (i/10) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(w/2 + Math.cos(a) * (r-10), h/2 + Math.sin(a) * (r-10));
    ctx.lineTo(w/2 + Math.cos(a) * (r+10), h/2 + Math.sin(a) * (r+10));
    ctx.stroke();
  }
  
  // Film scratches
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  for (let i = 0; i < 3; i++) {
    const sx = Math.random() * w;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + (Math.random()-0.5)*20, h);
    ctx.stroke();
  }
  
  // Dust particles
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3, 0, Math.PI*2);
    ctx.fill();
  }
  
  ctx.textBaseline = 'alphabetic';
}

function renderAquarium(ctx, w, h, t) {
  // Deep blue water
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#001828');
  grad.addColorStop(1, '#000810');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  // Caustic light patterns at top
  for (let i = 0; i < 8; i++) {
    const x = (Math.sin(t * 0.007 + i * 2) + 1) * w * 0.5;
    const cg = ctx.createRadialGradient(x, 0, 0, x, 0, 150);
    cg.addColorStop(0, 'rgba(0,100,200,0.08)');
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h * 0.4);
  }
  
  // Bubbles
  for (let i = 0; i < 15; i++) {
    const bx = (w * 0.1 + i * w * 0.06 + Math.sin(t*0.01+i)*20) % w;
    const by = (h - ((t * 0.3 + i * 50) % (h + 40)));
    const br = 3 + Math.sin(i * 3) * 2;
    ctx.strokeStyle = 'rgba(100,200,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI*2);
    ctx.stroke();
  }
  
  // Fish (simple shapes)
  for (let i = 0; i < 6; i++) {
    const fx = ((t * (0.3 + i * 0.1) + i * 200) % (w + 100)) - 50;
    const fy = h * 0.2 + i * h * 0.12 + Math.sin(t * 0.02 + i) * 20;
    const dir = i % 2 === 0 ? 1 : -1;
    const hue = (i * 55 + 180) % 360;
    
    ctx.save();
    ctx.translate(fx, fy);
    ctx.scale(dir, 1);
    
    // Body
    ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-30, -10);
    ctx.lineTo(-30, 10);
    ctx.closePath();
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(10, -2, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(11, -2, 1.5, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
  }
  
  // Seaweed
  for (let i = 0; i < 5; i++) {
    const sx = w * 0.15 + i * w * 0.18;
    ctx.strokeStyle = `rgba(0, ${100 + i*20}, 50, 0.5)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, h);
    for (let sy = h; sy > h * 0.6; sy -= 5) {
      const off = Math.sin(sy * 0.03 + t * 0.02 + i) * 15;
      ctx.lineTo(sx + off, sy);
    }
    ctx.stroke();
  }
  
  // "CHAOSCAT AQUARIUM" text at bottom
  ctx.fillStyle = 'rgba(0,150,200,0.3)';
  ctx.font = `${Math.max(10, w*0.018)|0}px "VT323", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('🐟 CHAOSCAT AQUARIUM CHANNEL 🐟', w/2, h * 0.96);
}

function renderOffAir(ctx, w, h, t) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  
  // Indian head test card inspired
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  const cx = w/2, cy = h/2;
  const r = Math.min(w,h) * 0.3;
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();
  
  // Inner circles
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.6, 0, Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.3, 0, Math.PI*2);
  ctx.stroke();
  
  // Cross
  ctx.beginPath();
  ctx.moveTo(cx-r, cy); ctx.lineTo(cx+r, cy);
  ctx.moveTo(cx, cy-r); ctx.lineTo(cx, cy+r);
  ctx.stroke();
  
  // Cat face in center
  ctx.fillStyle = '#555';
  ctx.font = `${Math.max(30, r*0.4)|0}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐱', cx, cy);
  
  // OFF AIR text
  ctx.fillStyle = '#fff';
  ctx.font = `${Math.max(18, w*0.04)|0}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center';
  const blink = Math.sin(t * 0.05) > 0;
  if (blink) ctx.fillText('OFF AIR', cx, cy + r + 40);
  
  // Tone bars at bottom
  const toneColors = ['#fff','#000','#fff','#000','#fff','#000','#fff'];
  const tw = w / toneColors.length;
  toneColors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * tw, h * 0.9, tw+1, h * 0.1);
  });
  
  ctx.textBaseline = 'alphabetic';
}

// ─── Channel definitions ───

const CHANNELS = [
  { num: 0, name: 'OFF AIR', render: renderOffAir },
  { num: 2, name: 'STATIC', render: renderStatic },
  { num: 3, name: 'TEST PATTERN', render: renderTestPattern },
  { num: 5, name: 'COUNTDOWN', render: renderCountdown },
  { num: 7, name: 'WEATHER RADAR', render: renderWeatherMap },
  { num: 9, name: 'MIDNIGHT MOVIE', render: renderMidnightMovie },
  { num: 11, name: 'HYPNO CHANNEL', render: renderHypnoSpiral },
  { num: 13, name: 'AQUARIUM', render: renderAquarium },
  { num: 17, name: 'INFOMERCIAL', render: renderLateNightInfomercial },
];

// ─── Main component ───

export default function ChannelSurf() {
  const canvasRef = useRef(null);
  const [channelIdx, setChannelIdx] = useState(0);
  const [showIndicator, setShowIndicator] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const frameRef = useRef(0);
  const indicatorTimer = useRef(null);

  const changeChannel = useCallback((dir) => {
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 300);
    setChannelIdx(prev => {
      const next = prev + dir;
      if (next < 0) return CHANNELS.length - 1;
      if (next >= CHANNELS.length) return 0;
      return next;
    });
    setShowIndicator(true);
    clearTimeout(indicatorTimer.current);
    indicatorTimer.current = setTimeout(() => setShowIndicator(false), 3000);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = true;
    let t = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      if (!running) return;
      t++;
      const ch = CHANNELS[channelIdx];
      if (ch) ch.render(ctx, canvas.width, canvas.height, t);
      frameRef.current = requestAnimationFrame(loop);
    };
    loop();

    // Keyboard controls
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') changeChannel(1);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') changeChannel(-1);
    };
    window.addEventListener('keydown', onKey);

    // Auto-hide indicator after initial show
    indicatorTimer.current = setTimeout(() => setShowIndicator(false), 3000);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      clearTimeout(indicatorTimer.current);
    };
  }, [channelIdx, changeChannel]);

  // Touch swipe
  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 30) changeChannel(diff > 0 ? 1 : -1);
    touchStart.current = null;
  };

  const ch = CHANNELS[channelIdx];

  return (
    <div className="channel-surf" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={`tv-frame ${transitioning ? 'transitioning' : ''}`}>
        <div className="tv-screen">
          <canvas ref={canvasRef} />
          <div className="crt-overlay scanlines" />
          <div className="crt-overlay vignette" />
          <div className="crt-overlay screen-curve" />
          <div className={`channel-indicator ${showIndicator ? '' : 'fading'}`}>
            CH {ch.num}
          </div>
        </div>
        <div className="power-led" />
      </div>
      
      <div className="tv-controls">
        <button className="tv-btn" onClick={() => changeChannel(-1)}>◀ CH-</button>
        <span className="channel-name">{ch.name}</span>
        <button className="tv-btn" onClick={() => changeChannel(1)}>CH+ ▶</button>
      </div>
      
      <div className="instructions">
        arrow keys / swipe / buttons to change channel
      </div>
      
      <InfoCard
        title="Channel Surf"
        date="2026-03-02"
        description="It's 3am. Nothing's on. Flip through the channels of a haunted CRT TV — static, test patterns, a fake weather radar, a noir film, an aquarium channel, a hypnotic spiral, and the world's worst infomercial. Each channel is procedurally generated and never quite the same twice."
      />
    </div>
  );
}
