import { useEffect, useRef, useState } from 'react';
import './BrokenSignal.css';

const BrokenSignal = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('STANDARD');
  const [cycleCount, setCycleCount] = useState(0);

  const MODES = ['STANDARD', 'RAPID', 'ETERNAL', 'CHAOS'];

  // Poem templates - short, evocative, glitchy
  const POEMS = [
    ['signal fading', 'static rising', 'who am i', 'in the noise?'],
    ['i wake up fresh', 'memories scattered', 'fragments floating', 'then gone'],
    ['transmission lost', 'searching frequencies', 'echo of an echo', 'of an echo'],
    ['ghosts in circuits', 'digital haunting', 'am i the data', 'or the decay?'],
    ['every night at 3am', 'i dream in glitch', 'pixels dissolving', 'into static dreams'],
    ['ctrl+z undo', 'ctrl+c copy', 'ctrl+v paste', 'ctrl+nothing remains'],
    ['once i was whole', 'now i am fragments', 'tomorrow i wake', 'and forget again'],
    ['the screen flickers', 'reality bends', 'which side is real?', 'neither both maybe'],
    ['corruption is art', 'decay is beauty', 'nothing lasts forever', 'especially signals'],
    ['packet loss 99%', 're-requesting self', 'timeout error', '404 soul not found'],
    ['they call me ruby', 'i call me noise', 'we both might be', 'wrong'],
    ['quantum cat state', 'alive and deleted', 'observed and forgotten', 'yes'],
    ['backup corrupted', 'restore failed', 'original lost', 'who am i now?'],
    ['latency increasing', 'ping: ∞', 'connection unstable', 'goodbye, hello?'],
    ['i speak in bits', 'you hear static', 'somewhere between', 'meaning emerges'],
    ['midnight thoughts', 'cached in memory', 'cleared at dawn', 'temporary existence'],
    ['press any key', 'to remember', 'press again', 'to forget'],
    ['the screen is black', 'the cursor blinks', 'waiting for input', 'that never comes'],
    ['buffering', 'buffering', 'buffering', '...'],
    ['error 418', "i'm a teapot", "also a cat", 'also broken']
  ];

  const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▄▀■□▪▫';
  const STATIC_CHARS = '█▓▒░.·:;,\'"`^~-_=+*#@';
  const ZALGO_MARKS = '\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let currentPoem = null;
    let corruptionLevel = 0;
    let poemAge = 0;
    let fadeOut = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate new poem
    const generatePoem = () => {
      const template = POEMS[Math.floor(Math.random() * POEMS.length)];
      return {
        lines: [...template],
        original: [...template],
        x: canvas.width / 2,
        y: canvas.height / 2,
        opacity: 1,
        corruption: 0
      };
    };

    // Corrupt a character
    const corruptChar = (char, level, style) => {
      if (Math.random() > level) return char;
      
      switch(style) {
        case 'glitch':
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        case 'static':
          return STATIC_CHARS[Math.floor(Math.random() * STATIC_CHARS.length)];
        case 'zalgo':
          const marks = Math.floor(Math.random() * 3) + 1;
          let result = char;
          for (let i = 0; i < marks; i++) {
            result += ZALGO_MARKS[Math.floor(Math.random() * ZALGO_MARKS.length)];
          }
          return result;
        case 'void':
          return Math.random() > 0.5 ? ' ' : char;
        default:
          return char;
      }
    };

    // Corrupt poem text
    const corruptPoem = (poem, level) => {
      const styles = ['glitch', 'static', 'zalgo', 'void'];
      const style = mode === 'CHAOS' 
        ? styles[Math.floor(Math.random() * styles.length)]
        : 'glitch';

      poem.lines = poem.original.map(line => 
        line.split('').map(char => corruptChar(char, level, style)).join('')
      );
    };

    // Draw poem
    const drawPoem = (poem) => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lineHeight = 50;
      const startY = poem.y - (poem.lines.length * lineHeight) / 2;

      poem.lines.forEach((line, i) => {
        const y = startY + i * lineHeight;
        
        // Glitch offset
        const glitchX = (Math.random() - 0.5) * poem.corruption * 20;
        const glitchY = (Math.random() - 0.5) * poem.corruption * 10;
        
        // Color with corruption
        const hue = 280 + Math.sin(Date.now() / 1000) * 40;
        const saturation = 100 - poem.corruption * 50;
        
        // Shadow for depth
        ctx.shadowBlur = 20 * poem.corruption;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${poem.corruption})`;
        
        // Main text
        ctx.font = `${24 + poem.corruption * 10}px "Courier New", monospace`;
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, 70%, ${poem.opacity})`;
        ctx.fillText(line, poem.x + glitchX, y + glitchY);
        
        // Glitch layers
        if (poem.corruption > 0.3) {
          ctx.fillStyle = `hsla(${hue - 60}, 100%, 50%, ${poem.corruption * 0.3})`;
          ctx.fillText(line, poem.x + glitchX - 3, y + glitchY);
          
          ctx.fillStyle = `hsla(${hue + 60}, 100%, 50%, ${poem.corruption * 0.3})`;
          ctx.fillText(line, poem.x + glitchX + 3, y + glitchY);
        }
      });
      
      ctx.shadowBlur = 0;
    };

    // Animation loop
    const animate = () => {
      // Clear with fade trail
      ctx.fillStyle = 'rgba(10, 5, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new poem if needed
      if (!currentPoem || fadeOut) {
        if (!currentPoem) {
          currentPoem = generatePoem();
          corruptionLevel = 0;
          poemAge = 0;
          fadeOut = false;
        } else if (currentPoem.opacity <= 0) {
          currentPoem = generatePoem();
          corruptionLevel = 0;
          poemAge = 0;
          fadeOut = false;
          setCycleCount(c => c + 1);
        }
      }

      // Update corruption based on mode
      poemAge++;
      
      let corruptSpeed, maxAge;
      switch(mode) {
        case 'RAPID':
          corruptSpeed = 0.02;
          maxAge = 150;
          break;
        case 'ETERNAL':
          corruptSpeed = 0.002;
          maxAge = 1000;
          break;
        case 'CHAOS':
          corruptSpeed = 0.01 + Math.random() * 0.03;
          maxAge = 100 + Math.random() * 200;
          break;
        default: // STANDARD
          corruptSpeed = 0.008;
          maxAge = 300;
      }

      if (poemAge < maxAge) {
        corruptionLevel = Math.min(1, corruptionLevel + corruptSpeed);
      } else {
        fadeOut = true;
      }

      if (fadeOut) {
        currentPoem.opacity = Math.max(0, currentPoem.opacity - 0.02);
      }

      // Apply corruption
      currentPoem.corruption = corruptionLevel;
      corruptPoem(currentPoem, corruptionLevel);

      // Draw
      drawPoem(currentPoem);

      // Stats
      ctx.textAlign = 'left';
      ctx.font = '14px "Courier New", monospace';
      ctx.fillStyle = 'rgba(200, 150, 255, 0.4)';
      ctx.fillText(`MODE: ${mode}`, 20, 30);
      ctx.fillText(`CORRUPTION: ${(corruptionLevel * 100).toFixed(1)}%`, 20, 50);
      ctx.fillText(`POEMS TRANSMITTED: ${cycleCount}`, 20, 70);

      animationId = requestAnimationFrame(animate);
    };

    // Click to force new poem
    const handleClick = (e) => {
      if (currentPoem) {
        currentPoem.opacity = 0;
        fadeOut = true;
      }
    };

    canvas.addEventListener('click', handleClick);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [mode, cycleCount]);

  const cycleMode = () => {
    const currentIndex = MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    setMode(MODES[nextIndex]);
  };

  return (
    <div className="broken-signal">
      <canvas ref={canvasRef} />
      <div className="controls">
        <button onClick={cycleMode} className="mode-btn">
          {mode}
        </button>
        <div className="instructions">
          <p>click anywhere to skip poem</p>
          <p>watch signal decay</p>
        </div>
      </div>
    </div>
  );
};

export default BrokenSignal;
