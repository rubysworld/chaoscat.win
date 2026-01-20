import { useState, useEffect } from 'react';
import './ChaoClock.css';

const ChaoClock = () => {
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [chaos, setChaos] = useState(1);

  // Modes of time perception
  const modes = [
    'NORMAL TIME',
    'CAT TIME',
    'UNTIL 3AM',
    'HEARTBEATS',
    'BLINKS',
    'CHAOS UNITS'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      // Random glitch effect
      if (Math.random() < 0.05) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 400);
      }
      
      // Chaos intensity oscillates
      setChaos(Math.sin(Date.now() / 3000) * 0.5 + 1.5);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const getTimeDisplay = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ms = time.getMilliseconds();

    switch(mode) {
      case 0: // Normal
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      case 1: // Cat time (cats sleep 16h/day, so time moves slower)
        const catHours = Math.floor(hours * 0.33);
        const catMinutes = Math.floor(minutes * 0.33);
        return `${String(catHours).padStart(2, '0')}:${String(catMinutes).padStart(2, '0')} 😸`;
      
      case 2: // Until 3am
        let until3am = (3 - hours + 24) % 24;
        if (hours >= 3) until3am = (27 - hours);
        const untilMinutes = 60 - minutes;
        return `${until3am}h ${untilMinutes}m until chaos time`;
      
      case 3: // Heartbeats (avg 70 bpm)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const heartbeats = Math.floor(totalSeconds * 70 / 60);
        return `${heartbeats.toLocaleString()} heartbeats today`;
      
      case 4: // Blinks (avg 15-20 per min)
        const blinks = Math.floor((hours * 3600 + minutes * 60 + seconds) * 17 / 60);
        return `${blinks.toLocaleString()} blinks today`;
      
      case 5: // Pure chaos
        const chaosNum = Math.floor(Math.sin(seconds) * Math.cos(minutes) * hours * ms);
        const chaosSymbols = ['✨', '🌀', '💫', '⚡', '🔮', '👁️'];
        const symbol = chaosSymbols[Math.floor(Math.random() * chaosSymbols.length)];
        return `${symbol} ${Math.abs(chaosNum)} ${symbol}`;
    }
  };

  const cycleMode = () => {
    setMode((mode + 1) % modes.length);
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
  };

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
  const glitchText = (text) => {
    if (!glitch) return text;
    return text.split('').map(char => 
      Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
    ).join('');
  };

  return (
    <div className="chao-clock">
      <div 
        className={`clock-container ${glitch ? 'glitching' : ''}`}
        style={{
          transform: `scale(${chaos}) rotate(${glitch ? Math.random() * 4 - 2 : 0}deg)`,
        }}
      >
        <div className="mode-label" onClick={cycleMode}>
          {modes[mode]}
        </div>
        
        <div className="time-display">
          {glitchText(getTimeDisplay())}
        </div>
        
        <div className="subtext">
          {mode === 5 && "reality is optional"}
          {mode === 3 && "still ticking"}
          {mode === 4 && "still blinking"}
          {mode === 2 && "the witching hour approaches"}
          {mode === 1 && "16 hours of sleep remaining"}
          {mode === 0 && "click to escape"}
        </div>
      </div>

      <div className="chaos-meter">
        <div className="chaos-bar" style={{ width: `${chaos * 50}%` }} />
        <span className="chaos-label">chaos level</span>
      </div>

      <div className="instructions">
        click the mode to cycle through different perceptions of time<br/>
        <span className="smol">time is fake anyway 🐱</span>
      </div>
    </div>
  );
};

export default ChaoClock;
