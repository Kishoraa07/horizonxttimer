import React, { useState, useEffect, useRef, useCallback } from 'react';
import MoltenMetal from './MoltenMetal';
import ParticleField from './ParticleField';
import SakuraField from './SakuraField';
import CosmicGlobe from './CosmicGlobe';
import { useSyncedTimer } from '../hooks/useSyncedTimer';

const TOTAL_36_HOURS_SECONDS = 36 * 3600; // 129,600 seconds (36 Hours)

const MILESTONES = [
  { hour: 0, code: 'T+00H', label: 'Mission Ignition', icon: '🚀', desc: 'Payload initialization, team formation & flight code commences.' },
  { hour: 6, code: 'T+06H', label: 'Telemetry & Mentor Sync', icon: '🛰️', desc: 'Domain masters inspect architectures, trajectory blueprints & system design.' },
  { hour: 14, code: 'T+14H', label: 'Deep Space Sprint', icon: '☕', desc: 'Midnight orbital burn. Fuel up, train algorithms & push core modules.' },
  { hour: 20, code: 'T+20H', label: 'Orbital Checkpoint', icon: '🛸', desc: '20-hour milestone. MVP live testing, sensor calibration & prototype demos.' },
  { hour: 28, code: 'T+28H', label: 'Payload Integration', icon: '🔬', desc: 'Hardware, AI models, telemetry pipelines & user interface harmonization.' },
  { hour: 33, code: 'T+33H', label: 'Atmospheric Re-entry', icon: '🏁', desc: 'Final 3-hour sprint. Code freeze, pitch deck polishing & live rehearsals.' },
  { hour: 36, code: 'T+36H', label: 'Touchdown & Grand Finale', icon: '🏆', desc: 'Mission accomplished. Live demos to the Council of Judges & award ceremony.' },
];

const MISSION_QUOTES = [
  "「HORIZONXT MISSION CONTROL」Houston, solutions are go for throttle up! Innovate beyond boundaries.",
  "「RESEARCH • INNOVATION • IMPACT」The three thrusters propelling our orbital voyage into the future.",
  "「STELLAR TRAJECTORY」Clear code burns bright across the cosmos. Debug resiliently, innovators!",
  "「ORBITAL VELOCITY」Through the dark void of errors, perseverance reveals the stars.",
  "「ONE SMALL COMMIT」One small commit for a hacker, one giant leap for HorizonXT.",
  "「DEEP SPACE SPRINT」36 hours of relentless velocity. Push your git commits to the galactic repository!",
  "「COSMIC HORIZON」Craft a pitch of unshakeable conviction: Problem, Deep Tech Solution, Tangible Impact.",
  "「TELEMETRY CONFIRMED」All sensors nominal. The cosmos belongs to those who dare to build."
];

// =========================================================================
// ORBITAL DIAL HUD COMPONENT (INDIVIDUAL CIRCULAR PROGRESS & TRAVELING SATELLITE)
// =========================================================================
const OrbitalDial = ({
  value,
  subValue,
  label,
  subLabel,
  badgeText,
  fraction = 0,
  colorScheme = 'cyan', // 'cyan' | 'navy' | 'amber'
  isRunning = false,
}) => {
  const safeFraction = Math.min(1, Math.max(0, fraction));
  const r = 58;
  const circumference = 2 * Math.PI * r; // ~364.42
  const strokeDashoffset = circumference - safeFraction * circumference;

  // Exact satellite coordinate inside -rotate-90 SVG coordinate system
  const theta = safeFraction * 2 * Math.PI;
  const satX = 80 + r * Math.cos(theta);
  const satY = 80 + r * Math.sin(theta);

  // 12 compass degree ticks around the dial (every 30 deg)
  const ticks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const strokeColor =
    colorScheme === 'amber'
      ? '#f59e0b'
      : colorScheme === 'cyan'
      ? '#00c2cb'
      : '#0b1b3d';

  const gradientId = `grad-${label.toLowerCase()}`;

  return (
    <div className="relative group flex-1 min-w-[100px] sm:min-w-[130px] max-w-[210px] flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-3xl bg-white/95 border border-[#0b1b3d]/10 backdrop-blur-2xl shadow-[0_10px_30px_rgba(11,27,61,0.06),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_16px_40px_rgba(11,27,61,0.1)] transition-all duration-300">
      {/* Dynamic Glow Halo */}
      {isRunning && (
        <div
          className="absolute -inset-1 rounded-3xl blur-md opacity-25 pointer-events-none transition-opacity"
          style={{ backgroundColor: strokeColor }}
        />
      )}

      {/* Dial Top Status Pill */}
      <div className="w-full flex items-center justify-between px-1 mb-0.5 z-10 text-[9px] font-mono">
        <span className="flex items-center gap-1 text-slate-500 font-semibold truncate">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? 'animate-ping' : 'opacity-50'
            }`}
            style={{ backgroundColor: strokeColor }}
          />
          {badgeText || subLabel}
        </span>
        <span
          className="font-bold text-[10px]"
          style={{ color: strokeColor }}
        >
          {Math.round(safeFraction * 100)}%
        </span>
      </div>

      {/* Multi-Ring SVG Canvas */}
      <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center my-0.5">
        <svg
          className="w-full h-full -rotate-90 transform drop-shadow-sm"
          viewBox="0 0 160 160"
        >
          <defs>
            {/* Hours: Cyan to Deep Space Navy */}
            <linearGradient id="grad-hours" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c2cb" />
              <stop offset="60%" stopColor="#0b1b3d" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Minutes: Cyan to Navy */}
            <linearGradient id="grad-minutes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c2cb" />
              <stop offset="70%" stopColor="#0b1b3d" />
              <stop offset="100%" stopColor="#00c2cb" />
            </linearGradient>

            {/* Seconds: Amber Gold to Bright Radiant Flame */}
            <linearGradient id="grad-seconds" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Satellite Bloom Filter */}
            <filter id={`bloom-${label.toLowerCase()}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Outer Orbit Guide Ring with Micro-Ticks */}
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="1.5 5"
            fill="none"
            opacity="0.6"
          />

          {/* 2. Degree & Cardinal Crosshairs */}
          {ticks.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const isCardinal = i % 3 === 0;
            const len = isCardinal ? 6 : 3;
            const r1 = 72 - len;
            const r2 = 72;
            return (
              <line
                key={deg}
                x1={80 + r1 * Math.cos(rad)}
                y1={80 + r1 * Math.sin(rad)}
                x2={80 + r2 * Math.cos(rad)}
                y2={80 + r2 * Math.sin(rad)}
                stroke={isCardinal ? '#64748b' : '#94a3b8'}
                strokeWidth={isCardinal ? '1.5' : '1'}
                strokeLinecap="round"
              />
            );
          })}

          {/* 3. Base Track Ring */}
          <circle
            cx="80"
            cy="80"
            r={r}
            stroke="#e2e8f0"
            strokeWidth="7"
            fill="none"
          />

          {/* 4. Concentric Inner Stardust Track */}
          <circle
            cx="80"
            cy="80"
            r="46"
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="2 3"
            fill="none"
          />

          {/* 5. Active Orbital Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={r}
            stroke={`url(#${gradientId})`}
            strokeWidth="7.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* 6. Active Traveling Satellite Node */}
          {isRunning && (
            <g className="transition-transform duration-200">
              {/* Radar pulse wave */}
              <circle
                cx={satX}
                cy={satY}
                r="7.5"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.2"
                opacity="0.8"
                className="animate-ping"
              />
              {/* Glowing body */}
              <circle
                cx={satX}
                cy={satY}
                r="4.8"
                fill={strokeColor}
                filter={`url(#bloom-${label.toLowerCase()})`}
              />
              {/* White photon core */}
              <circle
                cx={satX}
                cy={satY}
                r="2"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>

        {/* Center Digital Telemetry Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <div className="flex items-baseline justify-center">
            <span className="font-['Bebas_Neue'] text-5xl sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl leading-none text-[#0b1b3d] tracking-tight drop-shadow-[0_2px_6px_rgba(11,27,61,0.1)]">
              {value}
            </span>
            {subValue && (
              <span className="font-mono text-xs sm:text-sm text-[#b45309] font-bold ml-0.5">
                {subValue}
              </span>
            )}
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Bottom Sub-Telemetry Tag */}
      <div className="w-full mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 px-1 z-10">
        <span className="text-slate-400 uppercase tracking-wider">{subLabel}</span>
        <span className="font-bold text-[#0b1b3d]">{value} {label.slice(0, 3)}</span>
      </div>
    </div>
  );
};

const TimerPage = ({ onNavigateToGallery }) => {
  const {
    remainingSeconds,
    totalSeconds,
    elapsedSeconds,
    tenths,
    progressPercent,
    isTimerRunning: isRunning,
    syncStatus,
    togglePlayPause,
    resetTimer,
    adjustTime,
  } = useSyncedTimer();

  const mode = 'countdown';
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStars, setShowStars] = useState(true);
  const [rightPanelMode, setRightPanelMode] = useState('globe');
  const [missionSpeech, setMissionSpeech] = useState(MISSION_QUOTES[0]);
  const [coreAuraGlow, setCoreAuraGlow] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playCosmicPing = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1760.00, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {
      // silent
    }
  }, [getAudioContext, soundEnabled]);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        if (e.shiftKey) resetTimer(TOTAL_36_HOURS_SECONDS);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleFullscreen, resetTimer]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleCoreClick = () => {
    setCoreAuraGlow(true);
    playCosmicPing();
    const randomIndex = Math.floor(Math.random() * MISSION_QUOTES.length);
    setMissionSpeech(MISSION_QUOTES[randomIndex]);
    setTimeout(() => setCoreAuraGlow(false), 1200);
  };

  const displaySeconds = mode === 'countdown' ? remainingSeconds : elapsedSeconds;

  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const seconds = displaySeconds % 60;

  const elapsedHoursExact = elapsedSeconds / 3600;

  const currentMilestoneIndex = MILESTONES.reduce((acc, m, idx) => {
    if (elapsedHoursExact >= m.hour) return idx;
    return acc;
  }, 0);

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-[#ffffff] text-[#0b1b3d] flex flex-col justify-between selection:bg-[#f59e0b] selection:text-white font-['Inter']">
      
      {/* 3D Molten Metal Background WebGL in Light Mode */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <MoltenMetal
          lightMode={true}
          backgroundColor="#ffffff"
          color1="#e0f2fe"
          color2="#fef3c7"
          color3="#0b1b3d"
          speed={0.14}
          scale={3.2}
          detail={4}
          glow={1.4}
          coreSize={0.08}
          swirl={1.1}
          fold={-0.2}
          brightness={1.1}
          colorMode="molten"
          grain={true}
          grainIntensity={0.03}
          opacity={0.35}
        />
      </div>

      {/* Cosmic Floating Stardust Particle Field on White */}
      <div className="fixed inset-0 z-1 pointer-events-none opacity-35">
        <ParticleField />
      </div>

      {/* Twinkling Space Stars & Meteors on White */}
      {showStars && <SakuraField />}

      {/* Ambient Radial Glowing Orbs (Soft Celestial Cyan & Warm Champagne Gold) */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] h-[520px] bg-gradient-to-tr from-[#00c2cb]/12 via-[#fef3c7]/25 to-[#f59e0b]/12 blur-[140px] rounded-full pointer-events-none z-0 animate-pulse-glow" />

      {/* ============================================================= */}
      {/* 1. TOP SPACE MISSION CONTROL NAVBAR (CLEAN WHITE GLASS)       */}
      {/* ============================================================= */}
      <header className="relative z-20 w-full px-3 sm:px-6 py-2 border-b border-slate-200/80 backdrop-blur-2xl bg-white/80 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-[0_2px_15px_rgba(11,27,61,0.03)]">
        {/* Brand & Dynamic Live Status */}
        <div className="flex items-center gap-3">
          {/* HorizonXT Hex Star Badge */}
          <div className="w-8 h-8 rounded-lg bg-[#0b1b3d] border border-[#f59e0b] shadow-[0_2px_10px_rgba(11,27,61,0.2)] flex items-center justify-center text-[#f59e0b] font-black text-xs select-none shrink-0">
            HX
          </div>

          <div className="flex items-center gap-2.5">
            <img
              src="/horizonxt-logo.png"
              alt="HorizonXT Logo"
              className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(11,27,61,0.15)]"
            />
            <div className="flex flex-col">
              <span className="font-['Bebas_Neue'] text-base sm:text-lg tracking-wider text-[#0b1b3d] leading-none">
                HORIZON<span className="text-[#f59e0b]">XT</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-slate-500 uppercase leading-none mt-0.5">
                Research • Innovation • Impact
              </span>
            </div>
          </div>

          {/* Dynamic Status Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 border transition-all ${
              isRunning
                ? 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#b45309] shadow-sm'
                : 'bg-amber-50 border-amber-300 text-amber-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#f59e0b] animate-ping' : 'bg-amber-500'}`} />
              {isRunning ? '● 36H MISSION ACTIVE' : '⏸ MISSION HOLD'}
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border border-cyan-500/30 bg-cyan-50 text-cyan-800">
              <span className={`w-1 h-1 rounded-full ${syncStatus === 'synced' ? 'bg-cyan-500' : 'bg-yellow-500 animate-ping'}`} />
              {syncStatus === 'synced' ? 'VERCEL SYNCED' : 'LOCAL CACHE'}
            </span>
          </div>
        </div>

        {/* Live Clock & Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Link to Realtime Gallery Page */}
          {onNavigateToGallery && (
            <button
              onClick={onNavigateToGallery}
              title="View Real-Time Live Mission Photo Feed"
              className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-400/40 text-cyan-800 text-xs font-semibold backdrop-blur-xl shadow-sm transition-all cursor-pointer hover:scale-102"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <span>LIVE TELEMETRY (PHOTOS)</span>
            </button>
          )}

          {/* Starfield Toggle */}
          <button
            onClick={() => setShowStars(!showStars)}
            title={showStars ? 'Hide Space Stars' : 'Show Space Stars'}
            className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#0b1b3d] hover:bg-slate-200 text-xs transition-all cursor-pointer"
          >
            🌌
          </button>

          {/* Sound Chimes Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Telemetry Chimes (M)' : 'Enable Telemetry Chimes (M)'}
            className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#0b1b3d] hover:bg-slate-200 text-xs transition-all cursor-pointer"
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#b45309] shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {isFullscreen ? 'EXIT (F)' : 'FULLSCREEN (F)'}
          </button>

          {/* Local IST Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2. MAIN TIMER ARENA (WHITE THEME WITH GLASSMORPHISM)          */}
      {/* ============================================================= */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6 py-2 sm:py-3 flex flex-col justify-between lg:overflow-hidden gap-2 sm:gap-3">
        
        {/* TOP ROW: EVENT BRAND BANNER + LIVE MISSION DISPATCH + STATS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3.5 py-2 rounded-2xl glass-aurora iridescent-border shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/horizonxt-logo.png"
              alt="HorizonXT"
              className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(11,27,61,0.12)]"
            />
            <div className="flex items-center gap-2">
              <span className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#0b1b3d] tracking-wider leading-none">
                THE 36-HOUR INNOVATION ODYSSEY
              </span>
              <span className="font-mono text-xs text-[#b45309] hidden sm:inline font-bold">
                RESEARCH • INNOVATION • IMPACT
              </span>
            </div>
          </div>

          {/* Live Mission Quote Ticker */}
          <div
            onClick={handleCoreClick}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-mono text-slate-700 max-w-lg cursor-pointer transition-colors shadow-xs"
            title="Click to receive new Mission Control directive"
          >
            <span className="text-[#f59e0b]">🚀</span>
            <span className="truncate italic font-medium">{missionSpeech}</span>
          </div>

          {/* Event Crucible Chips */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              <strong className="text-[#0b1b3d]">36h</strong> Odyssey
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              <strong className="text-cyan-700">200+</strong> Innovators
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-slate-700">
              <strong className="text-[#b45309]">₹1,00,000+</strong> Glory
            </span>
          </div>
        </div>

        {/* =========================================================== */}
        {/* CENTER ARENA: TIMER ENGINE + 3D SPACE GLOBE (GLAASIRIORAL) */}
        {/* =========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-center flex-1 min-h-0 my-auto">
          
          {/* LEFT 7 COLS: TIMER ENGINE, CIRCULAR GAUGE & GLASS CONTROLS */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full rounded-3xl glass-aurora iridescent-border p-3.5 sm:p-5 relative overflow-hidden">
            
            {/* Top Amber Horizon Shimmer Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-80 pointer-events-none" />

            {/* Top Flight Telemetry Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-1.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#0b1b3d] text-white font-mono text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#f59e0b] animate-ping' : 'bg-slate-400'}`} />
                  ORBITAL HUD • 36H MISSION
                </span>
                <span className="font-mono text-xs text-[#0b1b3d] font-semibold hidden sm:inline">
                  Velocity: <strong className="text-cyan-800">{progressPercent}% Flown</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  Phase: <strong className="text-cyan-800">{MILESTONES[currentMilestoneIndex].code} ({MILESTONES[currentMilestoneIndex].label})</strong>
                </span>
              </div>
            </div>

            {/* MULTI-RING ORBITAL HUD TRIPLE RINGS */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-3 my-auto w-full py-1">
              {/* HOURS ORBITAL DIAL */}
              <OrbitalDial
                value={hours.toString().padStart(2, '0')}
                label="HOURS"
                subLabel="T-ORBIT 01"
                badgeText="ORBIT-01 • 36H"
                fraction={hours / 36}
                colorScheme="cyan"
                isRunning={isRunning}
              />

              {/* INTER-ORBIT SIGNAL BRIDGE 1 */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-1.5 px-0.5 shrink-0 select-none opacity-80">
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-cyan-500 animate-pulse' : 'bg-slate-300'}`} />
                <div className="w-px h-8 bg-gradient-to-b from-cyan-400 via-slate-300 to-[#0b1b3d]" />
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#0b1b3d] animate-ping' : 'bg-slate-300'}`} />
              </div>

              {/* MINUTES ORBITAL DIAL */}
              <OrbitalDial
                value={minutes.toString().padStart(2, '0')}
                label="MINUTES"
                subLabel="T-ORBIT 02"
                badgeText="ORBIT-02 • 60M"
                fraction={minutes / 60}
                colorScheme="navy"
                isRunning={isRunning}
              />

              {/* INTER-ORBIT SIGNAL BRIDGE 2 */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-1.5 px-0.5 shrink-0 select-none opacity-80">
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#0b1b3d] animate-ping' : 'bg-slate-300'}`} />
                <div className="w-px h-8 bg-gradient-to-b from-[#0b1b3d] via-amber-300 to-[#f59e0b]" />
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#f59e0b] animate-pulse' : 'bg-slate-300'}`} />
              </div>

              {/* SECONDS ORBITAL DIAL */}
              <OrbitalDial
                value={seconds.toString().padStart(2, '0')}
                subValue={`.${tenths}`}
                label="SECONDS"
                subLabel="TELEMETRY"
                badgeText="ACTIVE • 60S"
                fraction={(seconds + tenths / 10) / 60}
                colorScheme="amber"
                isRunning={isRunning}
              />
            </div>

            {/* Progress Summary Pill */}
            <div className="my-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-700 px-1">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 flex items-center gap-1.5 shadow-xs">
                <span className="text-slate-500 font-mono uppercase text-[10px]">MISSION:</span>
                <strong className="text-[#0b1b3d]">36h 00m 00s</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 flex items-center gap-1.5 shadow-xs">
                <span className="text-cyan-700 font-mono uppercase text-[10px]">ELAPSED:</span>
                <strong className="text-cyan-800">{Math.floor(elapsedSeconds / 3600)}h {Math.floor((elapsedSeconds % 3600) / 60)}m</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 flex items-center gap-1.5 shadow-xs">
                <span className="text-[#b45309] font-mono uppercase text-[10px]">REMAINING:</span>
                <strong className="text-[#b45309]">{hours}h {minutes}m {seconds}s</strong>
              </span>
            </div>

            {/* Linear Milestone Progress Bar */}
            <div className="w-full space-y-1 my-1">
              <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                <span className="flex items-center gap-1">
                  <span className="text-[#f59e0b]">🚀</span>
                  <span>T+00h Launch</span>
                </span>
                <span className="text-[#0b1b3d] font-medium flex items-center gap-1">
                  <span className="text-slate-500 font-mono text-[10px]">PHASE:</span>
                  <strong className="text-cyan-800">
                    {MILESTONES[currentMilestoneIndex].code} ({MILESTONES[currentMilestoneIndex].label})
                  </strong>
                </span>
                <span>T+36h Touchdown 🏆</span>
              </div>
              <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 p-[0.5px]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-[#0b1b3d] to-[#f59e0b] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,163,196,0.3)]"
                  style={{ width: `${Math.min(100, Math.max(0, parseFloat(progressPercent)))}%` }}
                />
              </div>
            </div>

            {/* PRIMARY INTERACTIVE CONTROLS */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {/* Play / Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="relative group flex items-center gap-2 px-4 py-2 rounded-xl font-['Bebas_Neue'] text-base tracking-wider text-white bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] shadow-[0_4px_18px_rgba(245,158,11,0.35)] transition-all cursor-pointer hover:scale-102"
                >
                  {isRunning ? (
                    <>
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                      <span>PAUSE MISSION (HOLD)</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>RESUME MISSION (GO)</span>
                    </>
                  )}
                </button>

                {/* Reset Button */}
                <button
                  onClick={() => resetTimer(TOTAL_36_HOURS_SECONDS)}
                  title="Reset to 36:00:00"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-700 hover:text-[#0b1b3d] transition-all cursor-pointer"
                >
                  Reset 36h
                </button>

                {/* Adjust +/- */}
                <button
                  onClick={() => adjustTime(3600)}
                  title="Add 1 Hour"
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-700 hover:text-[#0b1b3d] transition-all cursor-pointer"
                >
                  +1h
                </button>
                <button
                  onClick={() => adjustTime(-3600)}
                  title="Subtract 1 Hour"
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-700 hover:text-[#0b1b3d] transition-all cursor-pointer"
                >
                  -1h
                </button>
              </div>

              {/* Presets Pills */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                <button
                  onClick={() => resetTimer(36 * 3600)}
                  className={`px-2 py-1 rounded-lg border transition-all cursor-pointer text-[10px] ${
                    totalSeconds === 36 * 3600 ? 'bg-[#0b1b3d] text-white border-[#0b1b3d]' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  36h (Odyssey)
                </button>
                <button
                  onClick={() => resetTimer(24 * 3600)}
                  className={`px-2 py-1 rounded-lg border transition-all cursor-pointer text-[10px] ${
                    totalSeconds === 24 * 3600 ? 'bg-[#0b1b3d] text-white border-[#0b1b3d]' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  24h
                </button>
                <button
                  onClick={() => resetTimer(12 * 3600)}
                  className={`px-2 py-1 rounded-lg border transition-all cursor-pointer text-[10px] ${
                    totalSeconds === 12 * 3600 ? 'bg-[#0b1b3d] text-white border-[#0b1b3d]' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  12h
                </button>
                <button
                  onClick={() => resetTimer(4 * 3600)}
                  className={`px-2 py-1 rounded-lg border transition-all cursor-pointer text-[10px] ${
                    totalSeconds === 4 * 3600 ? 'bg-[#0b1b3d] text-white border-[#0b1b3d]' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  4h
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: 3D INTERACTIVE COSMIC GLOBE + VOYAGER TELEMETRY */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between h-full rounded-3xl glass-aurora iridescent-border p-3.5 sm:p-5 relative overflow-hidden">
            
            {/* Top Cyan Starlight Shimmer Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c2cb] to-transparent opacity-80 pointer-events-none" />

            {/* Mode Toggle Header: Globe vs Mascot */}
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00c2cb] animate-ping" />
                <span className="font-mono text-xs text-[#0b1b3d] font-bold tracking-wider">
                  CELESTIAL TELEMETRY
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg text-[9px] font-mono">
                <button
                  onClick={() => setRightPanelMode('globe')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    rightPanelMode === 'globe' ? 'bg-[#0b1b3d] text-white' : 'text-slate-600 hover:text-[#0b1b3d]'
                  }`}
                >
                  🌍 3D Globe
                </button>
                <button
                  onClick={() => setRightPanelMode('core')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    rightPanelMode === 'core' ? 'bg-[#0b1b3d] text-white' : 'text-slate-600 hover:text-[#0b1b3d]'
                  }`}
                >
                  ✦ Voyager Core
                </button>
              </div>
            </div>

            {/* Mission Dispatch Directive Card */}
            <div className="w-full relative z-20 shrink-0 mt-1">
              <div className="relative bg-white/95 border border-slate-200 rounded-2xl p-2 sm:p-2.5 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-[#f59e0b] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                    🛰️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[10px] text-[#b45309] font-bold tracking-wider">
                        MISSION DISPATCH
                      </span>
                      <span className="text-[8px] font-mono text-slate-500">
                        TAP TO PING
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug font-medium line-clamp-2">
                      "{missionSpeech}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Visual: 3D Interactive Cosmic Globe OR Voyager Core */}
            {rightPanelMode === 'globe' ? (
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center my-auto py-1">
                <CosmicGlobe
                  className="w-full h-full"
                  onNodeClick={handleCoreClick}
                />
              </div>
            ) : (
              <div
                onClick={handleCoreClick}
                className="relative group cursor-pointer flex items-center justify-center my-auto select-none py-2"
                title="Click HorizonXT Core to transmit telemetry directive"
              >
                {/* Cosmic Starlight Aura Glow */}
                <div className={`absolute w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 rounded-full bg-gradient-to-tr from-cyan-400/20 via-[#f59e0b]/15 to-cyan-400/20 blur-[55px] pointer-events-none transition-all duration-700 ${
                  coreAuraGlow ? 'opacity-100 scale-120' : 'animate-cosmic-aura'
                }`} />

                {/* Outer Counter-Clockwise Orbit Ring */}
                <div className="absolute w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 rounded-full border border-dashed border-[#f59e0b]/40 animate-orbit-reverse pointer-events-none flex items-center justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 shadow-[0_0_6px_#00c2cb]" />
                </div>

                {/* Inner Clockwise Orbit Ring */}
                <div className="absolute w-44 sm:w-52 md:w-56 h-44 sm:h-52 md:h-56 rounded-full border border-cyan-500/40 animate-orbit-spin pointer-events-none flex items-center justify-center">
                  <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-[0_0_10px_#00c2cb]" />
                  <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#0b1b3d]" />
                </div>

                {/* HorizonXT Central Emblem Hologram */}
                <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-white/95 border border-slate-200/90 shadow-[0_12px_35px_rgba(11,27,61,0.1)] animate-space-float transition-transform duration-500 group-hover:scale-105">
                  <img
                    src="/horizonxt-logo.png"
                    alt="HorizonXT Emblem"
                    className="max-h-[16vh] lg:max-h-[19vh] xl:max-h-[22vh] w-auto object-contain filter drop-shadow-[0_8px_20px_rgba(11,27,61,0.15)]"
                  />
                  <span className="font-mono text-[9px] text-[#0b1b3d] tracking-widest uppercase font-bold mt-1">
                    ✦ HORIZONXT CORE ✦
                  </span>
                </div>

                {/* Hover Prompt Pill */}
                <div className="absolute -bottom-3 z-20 px-3 py-0.5 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono text-slate-700 group-hover:text-[#b45309] group-hover:border-amber-400/50 backdrop-blur-md shadow-sm transition-all flex items-center gap-1">
                  <span>🛰️ Tap Core for Mission Telemetry</span>
                </div>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="w-full grid grid-cols-3 gap-2 shrink-0 pt-2 border-t border-slate-200">
              <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 text-center shadow-xs">
                <span className="block font-['Bebas_Neue'] text-lg sm:text-xl text-[#0b1b3d] leading-none">
                  36 HRS
                </span>
                <span className="text-[8px] text-slate-500 font-mono uppercase">
                  Odyssey
                </span>
              </div>
              <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 text-center shadow-xs">
                <span className="block font-['Bebas_Neue'] text-lg sm:text-xl text-cyan-800 leading-none">
                  200+
                </span>
                <span className="text-[8px] text-slate-500 font-mono uppercase">
                  Innovators
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-1.5 text-center shadow-xs">
                <span className="block font-['Bebas_Neue'] text-lg sm:text-xl text-[#b45309] leading-none">
                  ₹1,00,000+
                </span>
                <span className="text-[8px] text-amber-700 font-mono uppercase">
                  Prize Pool
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* 3. 36-HOUR ODYSSEY MILESTONES (COMPACT 7-PHASE HORIZON BAR) */}
        {/* =========================================================== */}
        <section className="w-full shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
            {MILESTONES.map((m, idx) => {
              const isPassed = elapsedHoursExact >= m.hour;
              const isCurrent = idx === currentMilestoneIndex;
              return (
                <div
                  key={m.hour}
                  className={`p-2 rounded-xl border transition-all backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/80 border-[#f59e0b] shadow-[0_4px_18px_rgba(245,158,11,0.18)] scale-102 ring-1 ring-[#f59e0b]/50'
                      : isPassed
                      ? 'bg-white/90 border-slate-200 text-slate-700 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-70'
                  }`}
                  title={`${m.code} - ${m.label}: ${m.desc}`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-[#0b1b3d] to-[#f59e0b] animate-pulse" />
                  )}
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm">{m.icon}</span>
                    <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isCurrent ? 'bg-[#0b1b3d] text-white' : isPassed ? 'bg-slate-100 text-slate-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {m.code}
                    </span>
                  </div>
                  <div>
                    <div className="font-['Inter'] text-[10px] font-bold text-[#0b1b3d] truncate leading-tight">
                      {m.label}
                    </div>
                  </div>
                  <div className="mt-1 pt-0.5 border-t border-slate-200 flex items-center justify-between text-[8px] font-mono">
                    <span className={isCurrent ? 'text-[#b45309] font-bold' : isPassed ? 'text-cyan-800 font-medium' : 'text-slate-400'}>
                      {isCurrent ? '● IN FLIGHT' : isPassed ? '✓ REACHED' : 'UPCOMING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ============================================================= */}
      {/* 4. COMPACT FOOTER BAR                                         */}
      {/* ============================================================= */}
      <footer className="relative z-20 w-full px-3 sm:px-6 py-1.5 border-t border-slate-200/80 backdrop-blur-2xl bg-white/80 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#0b1b3d] font-bold">HORIZONXT 2026</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] hidden sm:inline text-cyan-800 font-sans">Research • Innovation • Impact &bull; 36-Hour Hackathon</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden sm:inline">Shortcuts: <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-200 rounded text-slate-800 text-[10px]">Space</kbd> Play/Pause &bull; <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-200 rounded text-slate-800 text-[10px]">F</kbd> Fullscreen</span>
          <span className="text-slate-500">&copy; 2026 HorizonXT Council</span>
        </div>
      </footer>
    </div>
  );
};

export default TimerPage;
