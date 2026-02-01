import React, { useEffect, useRef, useState } from 'react';
import './FracturedGrowth.css';

const FracturedGrowth = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('FOREST'); // FOREST, CHAOS, WINTER, FIRE
  const [angleVar, setAngleVar] = useState(25);
  const [depth, setDepth] = useState(10);
  const [stats, setStats] = useState({ trees: 0, branches: 0 });
  const animationRef = useRef(null);
  const treesRef = useRef([]);
  const branchCountRef = useRef(0);
  
  // Tree growth state
  const growthTimerRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawAll();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Draw fractal tree branch
    const drawBranch = (x, y, length, angle, depth, color) => {
      if (depth === 0 || length < 2) return;
      
      branchCountRef.current++;
      
      const endX = x + length * Math.cos(angle);
      const endY = y + length * Math.sin(angle);
      
      // Color varies by depth and mode
      let strokeColor = color;
      if (mode === 'FOREST') {
        const greenShift = Math.floor((depth / 10) * 100);
        strokeColor = `hsl(${120 - greenShift}, 70%, ${40 + depth * 3}%)`;
      } else if (mode === 'WINTER') {
        strokeColor = `hsl(200, ${50 - depth * 3}%, ${80 - depth * 3}%)`;
      } else if (mode === 'FIRE') {
        const hue = depth > 5 ? 30 : 0; // yellow to red
        strokeColor = `hsl(${hue}, 100%, ${50 + depth * 2}%)`;
      } else if (mode === 'CHAOS') {
        strokeColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
      }
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = depth * 0.8;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Recursive branching with variation
      const newLength = length * (0.65 + Math.random() * 0.1);
      const angleVariation = (angleVar * Math.PI / 180) * (0.8 + Math.random() * 0.4);
      
      // Left branch
      drawBranch(
        endX, endY,
        newLength,
        angle - angleVariation,
        depth - 1,
        strokeColor
      );
      
      // Right branch
      drawBranch(
        endX, endY,
        newLength,
        angle + angleVariation,
        depth - 1,
        strokeColor
      );
      
      // Sometimes add a third middle branch for chaos
      if (mode === 'CHAOS' && Math.random() > 0.7) {
        drawBranch(
          endX, endY,
          newLength * 0.7,
          angle + (Math.random() - 0.5) * angleVariation,
          depth - 1,
          strokeColor
        );
      }
    };
    
    const plantTree = (x, y) => {
      branchCountRef.current = 0;
      
      const baseLength = 60 + Math.random() * 40;
      const baseAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3; // mostly upward
      
      drawBranch(x, y, baseLength, baseAngle, depth, '#fff');
      
      treesRef.current.push({ x, y, baseLength, baseAngle });
      setStats(prev => ({
        trees: prev.trees + 1,
        branches: prev.branches + branchCountRef.current
      }));
    };
    
    const redrawAll = () => {
      ctx.fillStyle = mode === 'WINTER' ? '#0a0d1f' : 
                       mode === 'FIRE' ? '#1a0505' :
                       '#050a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      branchCountRef.current = 0;
      treesRef.current.forEach(tree => {
        drawBranch(tree.x, tree.y, tree.baseLength, tree.baseAngle, depth, '#fff');
      });
      setStats(prev => ({
        ...prev,
        branches: branchCountRef.current
      }));
    };
    
    // Handle clicks
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      plantTree(x, y);
    };
    
    // Handle space bar for random tree
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        plantTree(
          Math.random() * canvas.width,
          canvas.height * (0.5 + Math.random() * 0.4) // bottom half
        );
      } else if (e.code === 'KeyC') {
        // Clear canvas
        treesRef.current = [];
        setStats({ trees: 0, branches: 0 });
        ctx.fillStyle = mode === 'WINTER' ? '#0a0d1f' : 
                         mode === 'FIRE' ? '#1a0505' :
                         '#050a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);
    
    // Initial clear
    ctx.fillStyle = '#050a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
      if (growthTimerRef.current) clearTimeout(growthTimerRef.current);
    };
  }, [mode, angleVar, depth]);
  
  const cycleMode = () => {
    const modes = ['FOREST', 'CHAOS', 'WINTER', 'FIRE'];
    const currentIndex = modes.indexOf(mode);
    setMode(modes[(currentIndex + 1) % modes.length]);
  };
  
  return (
    <div className="fractured-growth">
      <canvas ref={canvasRef} />
      
      <div className="controls">
        <div className="control-group">
          <button onClick={cycleMode} className="mode-btn">
            MODE: {mode}
          </button>
        </div>
        
        <div className="control-group">
          <label>
            BRANCH ANGLE: {angleVar}°
            <input
              type="range"
              min="10"
              max="45"
              value={angleVar}
              onChange={(e) => setAngleVar(Number(e.target.value))}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            DEPTH: {depth}
            <input
              type="range"
              min="5"
              max="12"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </label>
        </div>
        
        <div className="stats">
          <div>TREES: {stats.trees}</div>
          <div>BRANCHES: {stats.branches}</div>
        </div>
        
        <div className="instructions">
          <div>CLICK to plant tree</div>
          <div>SPACE for random</div>
          <div>C to clear</div>
        </div>
      </div>
    </div>
  );
};

export default FracturedGrowth;
