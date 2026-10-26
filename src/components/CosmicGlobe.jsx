import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * CosmicGlobe - High-Performance Interactive 3D Holographic Globe
 * Optimized for White Background with Deep Navy, Horizon Cyan & Amber Gold Telemetry
 */
const CosmicGlobe = ({ className = '', onNodeClick }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [telemetryText, setTelemetryText] = useState('ORBIT: LEO • ALT: 412 KM • INC: 51.6°');

  const rotationRef = useRef({
    phi: 0.3,
    theta: 0.25,
    velPhi: 0.003,
    velTheta: 0,
  });

  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const numPoints = 650;
    const globePoints = [];
    const radius = Math.min(canvas.offsetWidth || 340, canvas.offsetHeight || 340) * 0.38;

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 0.1 * i * Math.PI * (3 - Math.sqrt(5));

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const lat = Math.asin(y);
      const lon = Math.atan2(z, x);

      const isLand =
        Math.sin(lat * 3.5 + 0.4) * Math.cos(lon * 2.8) +
        Math.sin(lat * 6.2 - lon * 4.1) * 0.4 +
        Math.cos(lat * 2.0 + lon * 1.5) * 0.5 > 0.15;

      globePoints.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        isLand,
        baseSize: isLand ? 1.7 : 0.9,
      });
    }

    const baseLat = 13.08 * (Math.PI / 180);
    const baseLon = 80.27 * (Math.PI / 180);
    const baseStation = {
      x: radius * Math.cos(baseLat) * Math.cos(baseLon),
      y: -radius * Math.sin(baseLat),
      z: radius * Math.cos(baseLat) * Math.sin(baseLon),
      name: 'SRM IST • MISSION HQ',
    };

    let satAngle1 = 0;

    const render = () => {
      const displayW = canvas.offsetWidth || 340;
      const displayH = canvas.offsetHeight || 340;

      ctx.clearRect(0, 0, displayW, displayH);

      const cx = displayW / 2;
      const cy = displayH / 2;

      if (!isDragging) {
        rotationRef.current.phi += rotationRef.current.velPhi;
        rotationRef.current.velPhi = rotationRef.current.velPhi * 0.98 + 0.0025 * 0.02;
        rotationRef.current.theta += rotationRef.current.velTheta;
        rotationRef.current.velTheta *= 0.95;
      }

      const { phi, theta } = rotationRef.current;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      // --- 1. ATMOSPHERIC HALO / CORONA (SOFT CYAN & AMBER) ---
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius * 1.35);
      glowGrad.addColorStop(0, 'rgba(0, 163, 196, 0.12)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.09)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.save();
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 2. LUMINOUS CRYSTAL SPHERE SHADING ---
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.5, 'rgba(240, 249, 255, 0.92)');
      sphereGrad.addColorStop(0.85, 'rgba(224, 242, 254, 0.7)');
      sphereGrad.addColorStop(1, 'rgba(0, 163, 196, 0.28)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(0, 163, 196, 0.4)';
      ctx.stroke();
      ctx.restore();

      // --- 3. 3D ORBITAL ELLIPSE ---
      satAngle1 += 0.022;

      const orbitRadiusX = radius * 1.38;
      const orbitRadiusY = radius * 0.45;
      const orbitTilt = -0.38;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(orbitTilt);

      ctx.beginPath();
      ctx.ellipse(0, 0, orbitRadiusX, orbitRadiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // --- 4. 3D GLOBE POINTS (DEEP NAVY & CYAN) ---
      const projected = [];

      for (let i = 0; i < globePoints.length; i++) {
        const p = globePoints[i];

        let x1 = p.x * cosPhi + p.z * sinPhi;
        let z1 = -p.x * sinPhi + p.z * cosPhi;
        let y1 = p.y;

        let y2 = y1 * cosTheta - z1 * sinTheta;
        let z2 = y1 * sinTheta + z1 * cosTheta;
        let x2 = x1;

        const fov = 400;
        const scale = fov / (fov + z2);
        const projX = cx + x2 * scale;
        const projY = cy + y2 * scale;

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          isLand: p.isLand,
          baseSize: p.baseSize,
        });
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const isFront = pt.z > 0;
        const alpha = isFront
          ? Math.min(1, 0.35 + (pt.z / radius) * 0.65)
          : Math.max(0.08, 0.2 + (pt.z / radius) * 0.15);

        ctx.beginPath();
        const drawSize = isFront ? pt.baseSize * (1 + pt.z / radius * 0.35) : pt.baseSize * 0.7;
        ctx.arc(pt.x, pt.y, Math.max(0.6, drawSize), 0, Math.PI * 2);

        if (pt.isLand) {
          // Deep Navy on Front, Soft Cyan/Slate on Back
          ctx.fillStyle = isFront ? `rgba(11, 27, 61, ${alpha})` : `rgba(11, 27, 61, ${alpha * 0.35})`;
        } else {
          // Horizon Cyan dots for oceans
          ctx.fillStyle = isFront ? `rgba(0, 163, 196, ${alpha * 0.85})` : `rgba(0, 163, 196, ${alpha * 0.2})`;
        }
        ctx.fill();
      }

      // --- 5. BASE STATION PIN (SRM IST / HORIZONXT MISSION CONTROL) ---
      let bsX1 = baseStation.x * cosPhi + baseStation.z * sinPhi;
      let bsZ1 = -baseStation.x * sinPhi + baseStation.z * cosPhi;
      let bsY1 = baseStation.y;

      let bsY2 = bsY1 * cosTheta - bsZ1 * sinTheta;
      let bsZ2 = bsY1 * sinTheta + bsZ1 * cosTheta;
      let bsX2 = bsX1;

      if (bsZ2 > 0) {
        const fov = 400;
        const scale = fov / (fov + bsZ2);
        const pinX = cx + bsX2 * scale;
        const pinY = cy + bsY2 * scale;

        const pulse = (Date.now() % 1600) / 1600;
        ctx.beginPath();
        ctx.arc(pinX, pinY, 4 + pulse * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${1 - pulse})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0b1b3d';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#f59e0b';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.save();
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText('✦ SRM IST • MISSION HQ', pinX + 8, pinY - 4);
        ctx.restore();
      }

      // --- 6. SATELLITE ON ORBIT ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(orbitTilt);

      const sat1X = Math.cos(satAngle1) * orbitRadiusX;
      const sat1Y = Math.sin(satAngle1) * orbitRadiusY;
      const sat1IsFront = Math.sin(satAngle1) > 0;

      ctx.beginPath();
      ctx.arc(sat1X, sat1Y, sat1IsFront ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = sat1IsFront ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)';
      ctx.shadowBlur = sat1IsFront ? 8 : 0;
      ctx.shadowColor = '#f59e0b';
      ctx.fill();
      ctx.shadowBlur = 0;

      if (sat1IsFront) {
        ctx.strokeStyle = '#0b1b3d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sat1X - 7, sat1Y);
        ctx.lineTo(sat1X + 7, sat1Y);
        ctx.stroke();

        ctx.fillStyle = '#0b1b3d';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('SAT-HX1', sat1X + 8, sat1Y - 4);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.phi += deltaX * 0.007;
    rotationRef.current.theta += deltaY * 0.007;
    rotationRef.current.theta = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.theta));

    rotationRef.current.velPhi = deltaX * 0.002;
    rotationRef.current.velTheta = deltaY * 0.002;

    const lon = (((rotationRef.current.phi * 180) / Math.PI) % 360).toFixed(1);
    const lat = (((rotationRef.current.theta * 180) / Math.PI)).toFixed(1);
    setTelemetryText(`LAT: ${lat}° • LON: ${lon}° • TRAJECTORY: LOCKED`);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePos.current.x;
    const deltaY = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    rotationRef.current.phi += deltaX * 0.008;
    rotationRef.current.theta += deltaY * 0.008;
    rotationRef.current.theta = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.theta));

    rotationRef.current.velPhi = deltaX * 0.002;
    rotationRef.current.velTheta = deltaY * 0.002;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[340px] max-h-[340px] sm:max-w-[380px] sm:max-h-[380px] object-contain drop-shadow-[0_12px_28px_rgba(0,163,196,0.18)]"
      />

      {/* Interactive Orbit Hint Pill on White */}
      <div className="absolute -bottom-2 z-20 px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 text-[9px] font-mono text-[#0b1b3d] backdrop-blur-md shadow-[0_4px_15px_rgba(11,27,61,0.08)] flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00a3c4] animate-ping" />
        <span>{telemetryText}</span>
      </div>
    </div>
  );
};

export default CosmicGlobe;
