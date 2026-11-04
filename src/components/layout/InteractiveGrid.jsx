import React, { useEffect, useRef } from 'react';

/**
 * Full-screen canvas grid.
 * - Idle: the grid drifts slowly diagonally.
 * - Hover: lines near the cursor bend like liquid, turn rainbow,
 *   and split into red/cyan channels with a glitch jitter.
 */

const CELL = 64;        // grid cell size (px) - matches the old CSS grid
const STEP = 16;        // segment length used to bend each line
const RADIUS = 90;     // cursor influence radius (px)
const DRIFT = 10;       // idle drift speed (px / second)

export default function InteractiveGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let offset = 0;

    // target = real cursor, mouse = smoothed cursor, power = fade in/out
    const target = { x: -9999, y: -9999, active: false };
    const mouse = { x: -9999, y: -9999, power: 0 };
    let glitchSeed = 0;
    let glitchClock = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = true;
      if (mouse.x < -999) { mouse.x = e.clientX; mouse.y = e.clientY; }
    };
    const onLeave = () => { target.active = false; };

    // Bend a point around the cursor. Returns [x, y, influence 0..1]
    const warp = (x, y) => {
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const d = Math.hypot(dx, dy);
      const k = Math.exp(-((d / RADIUS) ** 2)) * mouse.power;
      if (k < 0.002) return [x, y, 0];

      // flowy wave travelling outward from the cursor + gentle push away
      const wave = Math.sin(d * 0.045 - time * 3.2) * 6 * k;
      const push = k * 10;
      const nx = d > 0 ? dx / d : 0;
      const ny = d > 0 ? dy / d : 0;
      return [x + nx * (push + wave), y + ny * (push + wave), k];
    };

    const hueAt = (x, y) => (x * 0.18 + y * 0.22 + time * 70) % 360;

    const drawLine = (isVertical, base, base_path) => {
      const len = isVertical ? h : w;
      let prev = null;

      for (let s = -STEP; s <= len + STEP; s += STEP) {
        const x = isVertical ? base : s;
        const y = isVertical ? s : base;
        const p = warp(x, y);

        if (prev) {
          const k = (p[2] + prev[2]) / 2;
          if (k < 0.03) {
            // calm segment -> batched into one cheap path
            base_path.moveTo(prev[0], prev[1]);
            base_path.lineTo(p[0], p[1]);
          } else {
            const hue = hueAt(p[0], p[1]);
            const g = k * (0.8 + glitchSeed * 1.5);       // glitch split amount
            const jitter = glitchSeed > 0.92 ? (glitchSeed - 0.92) * 12 * k : 0;
            ctx.lineWidth = 1 + k * 0.8;

            // red + cyan ghost channels (the glitch)
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = `rgba(255, 40, 90, ${k * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(prev[0] - g + jitter, prev[1]);
            ctx.lineTo(p[0] - g + jitter, p[1]);
            ctx.stroke();

            ctx.strokeStyle = `rgba(0, 220, 255, ${k * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(prev[0] + g + jitter, prev[1]);
            ctx.lineTo(p[0] + g + jitter, p[1]);
            ctx.stroke();

            // main rainbow line
            ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.1 + k * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(p[0], p[1]);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
          }
        }
        prev = p;
      }
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      if (!reduceMotion) offset = (offset + DRIFT * dt) % CELL;

      // ease the cursor + fade the effect in/out
      mouse.x += (target.x - mouse.x) * Math.min(1, dt * 10);
      mouse.y += (target.y - mouse.y) * Math.min(1, dt * 10);
      mouse.power += ((target.active ? 1 : 0) - mouse.power) * Math.min(1, dt * 6);

      // new glitch value ~12x per second so it stutters instead of vibrating
      glitchClock += dt;
      if (glitchClock > 0.08) { glitchClock = 0; glitchSeed = Math.random(); }

      ctx.clearRect(0, 0, w, h);

      const basePath = new Path2D();
      const startX = -CELL + offset;
      const startY = -CELL + offset;

      for (let x = startX; x < w + CELL; x += CELL) drawLine(true, x, basePath);
      for (let y = startY; y < h + CELL; y += CELL) drawLine(false, y, basePath);

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.stroke(basePath);

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
