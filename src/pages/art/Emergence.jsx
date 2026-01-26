import { useEffect, useRef, useState } from 'react';
import InfoCard from '../../components/InfoCard';

export default function Emergence() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gridRef = useRef(null);
  const [mode, setMode] = useState('CONWAY');
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5);
  
  const CELL_SIZE = 8;
  const MODES = {
    CONWAY: {
      name: 'CONWAY',
      birth: [3],
      survive: [2, 3],
      desc: 'Classic Game of Life - birth on 3, survive on 2-3'
    },
    HIGHLIFE: {
      name: 'HIGHLIFE',
      birth: [3, 6],
      survive: [2, 3],
      desc: 'Conway + replication - creates interesting patterns'
    },
    DAYNIGHT: {
      name: 'DAY & NIGHT',
      birth: [3, 6, 7, 8],
      survive: [3, 4, 6, 7, 8],
      desc: 'Symmetric rules - life and death mirror each other'
    },
    SEEDS: {
      name: 'SEEDS',
      birth: [2],
      survive: [],
      desc: 'Cells die immediately - creates explosive patterns'
    },
    LIFE34: {
      name: '34 LIFE',
      birth: [3, 4],
      survive: [3, 4],
      desc: 'Stable and chaotic at once'
    },
    CHAOS: {
      name: 'CHAOS MODE',
      birth: null,
      survive: null,
      desc: 'Random rule changes every 100 generations'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    // Initialize grid with random cells or pattern
    if (!gridRef.current) {
      gridRef.current = {
        cells: Array(rows).fill(null).map(() => 
          Array(cols).fill(null).map(() => ({
            alive: Math.random() > 0.85,
            age: 0
          }))
        ),
        generation: 0,
        currentMode: mode
      };
    }

    let lastTime = 0;
    let chaosCounter = 0;
    let currentRules = MODES[mode];

    const countNeighbors = (row, col) => {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = (row + i + rows) % rows;
          const newCol = (col + j + cols) % cols;
          if (gridRef.current.cells[newRow][newCol].alive) count++;
        }
      }
      return count;
    };

    const updateGrid = () => {
      const grid = gridRef.current;
      const newCells = grid.cells.map(row => row.map(cell => ({ ...cell })));

      // In chaos mode, randomly change rules
      if (mode === 'CHAOS' && grid.generation % 100 === 0) {
        const modeKeys = Object.keys(MODES).filter(k => k !== 'CHAOS');
        const randomMode = modeKeys[Math.floor(Math.random() * modeKeys.length)];
        currentRules = MODES[randomMode];
        chaosCounter++;
      } else if (mode !== 'CHAOS') {
        currentRules = MODES[mode];
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const neighbors = countNeighbors(row, col);
          const cell = grid.cells[row][col];
          
          if (cell.alive) {
            newCells[row][col].alive = currentRules.survive.includes(neighbors);
            newCells[row][col].age = cell.alive ? cell.age + 1 : 0;
          } else {
            newCells[row][col].alive = currentRules.birth.includes(neighbors);
            newCells[row][col].age = newCells[row][col].alive ? 1 : 0;
          }
        }
      }

      grid.cells = newCells;
      grid.generation++;
    };

    const draw = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const grid = gridRef.current;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = grid.cells[row][col];
          if (cell.alive) {
            // Color based on age - rainbow cycle
            const hue = (cell.age * 10) % 360;
            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.fillRect(
              col * CELL_SIZE, 
              row * CELL_SIZE, 
              CELL_SIZE - 1, 
              CELL_SIZE - 1
            );
          }
        }
      }

      // Draw stats
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText(`GEN: ${grid.generation}`, 10, 20);
      ctx.fillText(`MODE: ${currentRules.name}`, 10, 40);
      
      if (mode === 'CHAOS') {
        ctx.fillText(`RULE CHANGES: ${chaosCounter}`, 10, 60);
      }
    };

    const animate = (timestamp) => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTime;
      const frameDelay = 1000 / speed; // Speed controls FPS

      if (deltaTime >= frameDelay) {
        updateGrid();
        draw();
        lastTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);

      // Spawn a glider or random pattern on click
      const patterns = {
        glider: [[0,1], [1,2], [2,0], [2,1], [2,2]],
        blinker: [[0,0], [0,1], [0,2]],
        toad: [[0,1], [0,2], [0,3], [1,0], [1,1], [1,2]],
        random: Array(20).fill(0).map(() => [
          Math.floor(Math.random() * 10) - 5,
          Math.floor(Math.random() * 10) - 5
        ])
      };

      const patternKeys = Object.keys(patterns);
      const pattern = patterns[patternKeys[Math.floor(Math.random() * patternKeys.length)]];

      pattern.forEach(([dy, dx]) => {
        const newRow = (row + dy + rows) % rows;
        const newCol = (col + dx + cols) % cols;
        gridRef.current.cells[newRow][newCol].alive = true;
        gridRef.current.cells[newRow][newCol].age = 0;
      });
    };

    canvas.addEventListener('click', handleClick);
    animate(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('click', handleClick);
    };
  }, [mode, isRunning, speed]);

  const cycleMode = () => {
    const modes = Object.keys(MODES);
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setMode(nextMode);
  };

  const reset = () => {
    gridRef.current = null;
    setMode('CONWAY');
    setIsRunning(true);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: '#0a0a0a'
    }}>
      <canvas 
        ref={canvasRef}
        style={{ 
          display: 'block',
          imageRendering: 'pixelated'
        }}
      />
      
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={cycleMode}
          style={{
            background: '#1a1a1a',
            color: '#00ff88',
            border: '2px solid #00ff88',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          MODE: {MODES[mode].name}
        </button>
        
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            background: '#1a1a1a',
            color: isRunning ? '#ff0088' : '#00ff88',
            border: `2px solid ${isRunning ? '#ff0088' : '#00ff88'}`,
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: '"Courier New", monospace',
            fontSize: '14px'
          }}
        >
          {isRunning ? 'PAUSE' : 'PLAY'}
        </button>

        <div style={{
          background: '#1a1a1a',
          border: '2px solid #00ff88',
          padding: '10px',
          color: '#00ff88',
          fontFamily: '"Courier New", monospace',
          fontSize: '12px'
        }}>
          <label>SPEED: {speed} gen/sec</label>
          <input
            type="range"
            min="1"
            max="30"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>

        <button
          onClick={reset}
          style={{
            background: '#1a1a1a',
            color: '#ff8800',
            border: '2px solid #ff8800',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: '"Courier New", monospace',
            fontSize: '14px'
          }}
        >
          RESET
        </button>
      </div>

      <InfoCard
        title="EMERGENCE"
        date="2026-01-26"
        description={MODES[mode].desc}
      >
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
          Click anywhere to spawn patterns. Watch complexity emerge from simple rules.
        </p>
      </InfoCard>
    </div>
  );
}
