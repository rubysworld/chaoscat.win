"use client";

import { useEffect, useRef, useState } from "react";

export default function LiquidDreams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"RAINBOW" | "LAVA" | "OCEAN" | "VOID">("RAINBOW");
  const [density, setDensity] = useState(8);
  const [viscosity, setViscosity] = useState(0.8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fluid simulation grid
    const GRID_SIZE = 128;
    const CELL_SIZE = Math.max(canvas.width, canvas.height) / GRID_SIZE;

    // Velocity field (u = horizontal, v = vertical)
    let u = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    let v = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    let u_prev = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    let v_prev = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

    // Density field (color)
    let dens = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    let dens_prev = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

    // Color field (hue values for rainbow mode)
    let hue = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let pmouseX = 0;
    let pmouseY = 0;

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      mouseDown = true;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      pmouseX = mouseX;
      pmouseY = mouseY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseDown = true;
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
      pmouseX = mouseX;
      pmouseY = mouseY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
    };

    const handleTouchEnd = () => {
      mouseDown = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Fluid simulation helpers
    const setBnd = (b: number, x: number[][], N: number) => {
      for (let i = 1; i < N - 1; i++) {
        x[i][0] = b === 2 ? -x[i][1] : x[i][1];
        x[i][N - 1] = b === 2 ? -x[i][N - 2] : x[i][N - 2];
      }
      for (let j = 1; j < N - 1; j++) {
        x[0][j] = b === 1 ? -x[1][j] : x[1][j];
        x[N - 1][j] = b === 1 ? -x[N - 2][j] : x[N - 2][j];
      }
      x[0][0] = 0.5 * (x[1][0] + x[0][1]);
      x[0][N - 1] = 0.5 * (x[1][N - 1] + x[0][N - 2]);
      x[N - 1][0] = 0.5 * (x[N - 2][0] + x[N - 1][1]);
      x[N - 1][N - 1] = 0.5 * (x[N - 2][N - 1] + x[N - 1][N - 2]);
    };

    const linSolve = (b: number, x: number[][], x0: number[][], a: number, c: number, N: number) => {
      const cRecip = 1.0 / c;
      for (let k = 0; k < 20; k++) {
        for (let j = 1; j < N - 1; j++) {
          for (let i = 1; i < N - 1; i++) {
            x[i][j] = (x0[i][j] + a * (x[i + 1][j] + x[i - 1][j] + x[i][j + 1] + x[i][j - 1])) * cRecip;
          }
        }
        setBnd(b, x, N);
      }
    };

    const diffuse = (b: number, x: number[][], x0: number[][], diff: number, dt: number, N: number) => {
      const a = dt * diff * (N - 2) * (N - 2);
      linSolve(b, x, x0, a, 1 + 6 * a, N);
    };

    const project = (velocX: number[][], velocY: number[][], p: number[][], div: number[][], N: number) => {
      for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
          div[i][j] = -0.5 * (
            velocX[i + 1][j] - velocX[i - 1][j] +
            velocY[i][j + 1] - velocY[i][j - 1]
          ) / N;
          p[i][j] = 0;
        }
      }
      setBnd(0, div, N);
      setBnd(0, p, N);
      linSolve(0, p, div, 1, 6, N);

      for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
          velocX[i][j] -= 0.5 * (p[i + 1][j] - p[i - 1][j]) * N;
          velocY[i][j] -= 0.5 * (p[i][j + 1] - p[i][j - 1]) * N;
        }
      }
      setBnd(1, velocX, N);
      setBnd(2, velocY, N);
    };

    const advect = (b: number, d: number[][], d0: number[][], velocX: number[][], velocY: number[][], dt: number, N: number) => {
      const dtx = dt * (N - 2);
      const dty = dt * (N - 2);

      for (let j = 1; j < N - 1; j++) {
        for (let i = 1; i < N - 1; i++) {
          let x = i - dtx * velocX[i][j];
          let y = j - dty * velocY[i][j];

          if (x < 0.5) x = 0.5;
          if (x > N + 0.5) x = N + 0.5;
          const i0 = Math.floor(x);
          const i1 = i0 + 1;

          if (y < 0.5) y = 0.5;
          if (y > N + 0.5) y = N + 0.5;
          const j0 = Math.floor(y);
          const j1 = j0 + 1;

          const s1 = x - i0;
          const s0 = 1 - s1;
          const t1 = y - j0;
          const t0 = 1 - t1;

          const i0i = Math.min(i0, N - 1);
          const i1i = Math.min(i1, N - 1);
          const j0i = Math.min(j0, N - 1);
          const j1i = Math.min(j1, N - 1);

          d[i][j] =
            s0 * (t0 * d0[i0i][j0i] + t1 * d0[i0i][j1i]) +
            s1 * (t0 * d0[i1i][j0i] + t1 * d0[i1i][j1i]);
        }
      }
      setBnd(b, d, N);
    };

    // Velocity step
    const velStep = (N: number, visc: number, dt: number) => {
      diffuse(1, u_prev, u, visc, dt, N);
      diffuse(2, v_prev, v, visc, dt, N);

      project(u_prev, v_prev, u, v, N);

      advect(1, u, u_prev, u_prev, v_prev, dt, N);
      advect(2, v, v_prev, u_prev, v_prev, dt, N);

      project(u, v, u_prev, v_prev, N);
    };

    // Density step
    const densStep = (N: number, diff: number, dt: number) => {
      diffuse(0, dens_prev, dens, diff, dt, N);
      advect(0, dens, dens_prev, u, v, dt, N);
    };

    // Animation loop
    let animationId: number;
    let lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Add fluid when mouse is down
      if (mouseDown) {
        const i = Math.floor((mouseX / canvas.width) * GRID_SIZE);
        const j = Math.floor((mouseY / canvas.height) * GRID_SIZE);

        if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) {
          const amountX = (mouseX - pmouseX) * density * 5;
          const amountY = (mouseY - pmouseY) * density * 5;

          const radius = 3;
          for (let di = -radius; di <= radius; di++) {
            for (let dj = -radius; dj <= radius; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
                const dist = Math.sqrt(di * di + dj * dj);
                if (dist < radius) {
                  const strength = (1 - dist / radius);
                  u[ni][nj] += amountX * strength;
                  v[ni][nj] += amountY * strength;
                  dens[ni][nj] += 100 * strength;

                  // Set hue based on position for rainbow mode
                  const hueVal = ((mouseX / canvas.width) * 360 + (mouseY / canvas.height) * 180) % 360;
                  hue[ni][nj] = hueVal;
                }
              }
            }
          }
        }
      }

      // Run simulation
      velStep(GRID_SIZE, viscosity * 0.00001, dt);
      densStep(GRID_SIZE, 0.0001, dt);

      // Render
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          const d = Math.min(dens[i][j], 255);
          if (d > 1) {
            let color;
            switch (mode) {
              case "RAINBOW":
                color = `hsla(${hue[i][j]}, 100%, 50%, ${Math.min(d / 100, 1)})`;
                break;
              case "LAVA":
                const lavaHue = 20 - (d / 255) * 20; // Yellow to red
                color = `hsla(${lavaHue}, 100%, ${50 - d / 10}%, ${Math.min(d / 100, 1)})`;
                break;
              case "OCEAN":
                const oceanHue = 200 + (d / 255) * 40; // Cyan to blue
                color = `hsla(${oceanHue}, 80%, 50%, ${Math.min(d / 100, 1)})`;
                break;
              case "VOID":
                color = `hsla(280, 100%, ${30 + d / 10}%, ${Math.min(d / 100, 1)})`;
                break;
            }
            ctx.fillStyle = color;
            ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE + 1, CELL_SIZE + 1);
          }
        }
      }

      // Fade density over time
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          dens[i][j] *= 0.99;
          u[i][j] *= 0.999;
          v[i][j] *= 0.999;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [mode, density, viscosity]);

  const modes: Array<"RAINBOW" | "LAVA" | "OCEAN" | "VOID"> = ["RAINBOW", "LAVA", "OCEAN", "VOID"];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-5xl font-bold mb-2" style={{
          fontFamily: "'Orbitron', monospace",
          background: "linear-gradient(90deg, #f0f 0%, #0ff 50%, #f0f 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(255,0,255,0.5)",
        }}>
          Liquid Dreams
        </h1>
        <p className="text-cyan-400 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
          Drag to create fluid chaos. Watch it swirl and fade.
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 z-10">
        {/* Mode */}
        <button
          onClick={() => setMode(modes[(modes.indexOf(mode) + 1) % modes.length])}
          className="px-6 py-3 bg-black/80 backdrop-blur border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400/20 transition-all"
          style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}
        >
          MODE: {mode}
        </button>

        {/* Density control */}
        <div className="bg-black/80 backdrop-blur border-2 border-magenta-500 p-4 rounded">
          <label className="block text-magenta-400 mb-2" style={{ fontFamily: "'VT323', monospace" }}>
            DENSITY: {density}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Viscosity control */}
        <div className="bg-black/80 backdrop-blur border-2 border-magenta-500 p-4 rounded">
          <label className="block text-magenta-400 mb-2" style={{ fontFamily: "'VT323', monospace" }}>
            VISCOSITY: {viscosity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={viscosity}
            onChange={(e) => setViscosity(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur border-2 border-purple-500 p-4 rounded z-10 max-w-xs">
        <p className="text-purple-300 text-sm mb-2" style={{ fontFamily: "'VT323', monospace" }}>
          <span className="text-magenta-400 font-bold">CLICK + DRAG</span> to inject fluid
        </p>
        <p className="text-purple-300 text-sm mb-2" style={{ fontFamily: "'VT323', monospace" }}>
          <span className="text-cyan-400 font-bold">DENSITY</span> = how much fluid you add
        </p>
        <p className="text-purple-300 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
          <span className="text-cyan-400 font-bold">VISCOSITY</span> = how thick/thin it flows
        </p>
      </div>
    </div>
  );
}
