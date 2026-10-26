import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MoltenMetal from './MoltenMetal';
import ParticleField from './ParticleField';
import SakuraField from './SakuraField';
import { useSyncedTimer } from '../hooks/useSyncedTimer';
import { fetchLivePhotos, uploadLivePhoto, deleteLivePhoto } from '../services/imageService';

const TOTAL_36_HOURS_SECONDS = 36 * 3600; // 129,600 seconds (36 Hours)

const INITIAL_PHOTOS = [
  {
    id: 1,
    title: 'Mission Ignition & Kickoff',
    code: 'T+00H',
    category: 'Keynote & Kickoff',
    time: 'Day 1 • 10:00 AM',
    location: 'Main Mission Control Hall',
    img: '/images/event/photo_1.jpeg',
    description: 'Mission ignition! Innovators assemble for track reveals, flight rules, and opening ceremonies.',
    likes: 42,
  },
  {
    id: 2,
    title: 'Team Ideation & Brainstorming',
    code: 'T+02H',
    category: 'Ideation & Code',
    time: 'Day 1 • 11:45 AM',
    location: 'Design Arena B',
    img: '/images/event/photo_2.jpeg',
    description: 'Cross-functional teams debate architectural diagrams, payload workflows, and initial system schematics.',
    likes: 38,
  },
  {
    id: 3,
    title: 'Technical Mentorship Deep Dive',
    code: 'T+06H',
    category: 'Mentorship',
    time: 'Day 1 • 03:30 PM',
    location: 'Mentors Pavilion',
    img: '/images/event/photo_3.jpeg',
    description: 'Senior engineers and domain researchers provide deep architectural feedback on innovator prototypes.',
    likes: 56,
  },
  {
    id: 4,
    title: 'Hardware & IoT Prototyping',
    code: 'T+08H',
    category: 'Hardware & IoT',
    time: 'Day 1 • 06:15 PM',
    location: 'Maker Lab 3',
    img: '/images/event/photo_4.jpeg',
    description: 'Soldering sensors, calibrating microcontroller analog inputs, and assembling intelligent edge devices.',
    likes: 49,
  },
  {
    id: 5,
    title: 'Late Night Coding & Midnight Fuel',
    code: 'T+14H',
    category: 'Ideation & Code',
    time: 'Day 2 • 01:45 AM',
    location: 'Central Arena Hub',
    img: '/images/event/photo_5.jpeg',
    description: 'Innovators code under the cosmos with fresh coffee, snacks, and relentless energy.',
    likes: 64,
  },
  {
    id: 6,
    title: 'AI Model Optimization & Testing',
    code: 'T+20H',
    category: 'Ideation & Code',
    time: 'Day 2 • 08:30 AM',
    location: 'AI Sandbox Cluster',
    img: '/images/event/photo_6.jpeg',
    description: 'Fine-tuning transformer embeddings and verifying predictive accuracy against test sets.',
    likes: 51,
  },
  {
    id: 7,
    title: 'Jury Evaluation & Live Demos',
    code: 'T+28H',
    category: 'Mentorship',
    time: 'Day 2 • 02:00 PM',
    location: 'Pitch Theater Alpha',
    img: '/images/event/photo_7.jpeg',
    description: 'Teams showcase real-time working prototypes to the council of judges and technical directors.',
    likes: 58,
  },
  {
    id: 8,
    title: 'Faculty Guidance & Academic Review',
    code: 'T+30H',
    category: 'Mentorship',
    time: 'Day 2 • 04:20 PM',
    location: 'Academic Review Pod',
    img: '/images/event/photo_8.jpeg',
    description: 'Faculty professors validate research methodology, technical depth, and novelty.',
    likes: 33,
  },
  {
    id: 9,
    title: 'Cross-Domain Collaboration',
    code: 'T+32H',
    category: 'Ideation & Code',
    time: 'Day 2 • 06:10 PM',
    location: 'Collab Corner 4',
    img: '/images/event/photo_9.jpeg',
    description: 'Hardware developers and software architects merge sensor telemetry with cloud-hosted neural pipelines.',
    likes: 47,
  },
  {
    id: 10,
    title: 'DeepTech Architecture Discussion',
    code: 'T+33H',
    category: 'Mentorship',
    time: 'Day 2 • 07:40 PM',
    location: 'Conference Lounge 1',
    img: '/images/event/photo_10.jpeg',
    description: 'Exploring protocol interoperability and edge cloud deployment models.',
    likes: 29,
  },
  {
    id: 11,
    title: 'Innovation Showcase & Expo',
    code: 'T+34H',
    category: 'Awards & Glory',
    time: 'Day 2 • 08:15 PM',
    location: 'Grand Exhibition Hall',
    img: '/images/event/photo_11.jpeg',
    description: 'Teams reveal their finished hardware enclosures and interactive telemetry dashboards.',
    likes: 72,
  },
  {
    id: 12,
    title: 'Grand Finale & Celebrations',
    code: 'T+35H',
    category: 'Awards & Glory',
    time: 'Day 2 • 09:30 PM',
    location: 'Main Auditorium Hall',
    img: '/images/event/photo_12.jpeg',
    description: 'The auditorium erupts with applause as 36 hours of relentless engineering concludes.',
    likes: 85,
  },
  {
    id: 13,
    title: 'Closing Ceremony & Swag Hampers',
    code: 'T+36H',
    category: 'Awards & Glory',
    time: 'Day 2 • 10:00 PM',
    location: 'Main Stage Arena',
    img: '/images/event/photo_13.jpeg',
    description: 'Participants receive official HorizonXT certificates, medals, and innovator swag hampers.',
    likes: 67,
  },
  {
    id: 14,
    title: 'Winners & Award Trophies',
    code: 'WINNERS',
    category: 'Awards & Glory',
    time: 'Day 2 • 10:30 PM',
    location: 'Main Stage Arena',
    img: '/images/event/photo_14.jpg',
    description: 'The council crowns the supreme champions! Cash prizes, trophies, and glory bestowed.',
    likes: 120,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Telemetry', code: 'ALL' },
  { id: 'Keynote & Kickoff', label: 'Mission Ignition', code: 'T+00H' },
  { id: 'Ideation & Code', label: 'Deep Space Sprint', code: 'T+14H' },
  { id: 'Hardware & IoT', label: 'Hardware & Sensors', code: 'T+20H' },
  { id: 'Mentorship', label: 'Mentorship & Demos', code: 'T+28H' },
  { id: 'Awards & Glory', label: 'Touchdown & Glory', code: 'T+36H' },
];

const CompactOrbitalDial = ({
  value,
  subValue,
  label,
  subLabel,
  fraction = 0,
  colorScheme = 'cyan',
  isRunning = false,
}) => {
  const safeFraction = Math.min(1, Math.max(0, fraction));
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - safeFraction * circumference;

  const theta = safeFraction * 2 * Math.PI;
  const satX = 54 + r * Math.cos(theta);
  const satY = 54 + r * Math.sin(theta);

  const strokeColor =
    colorScheme === 'amber'
      ? '#f59e0b'
      : colorScheme === 'cyan'
      ? '#00c2cb'
      : '#0b1b3d';

  const gradientId = `gallery-dial-${label.toLowerCase()}`;

  return (
    <div className="relative group flex-1 flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-2xl bg-white/95 border border-[#0b1b3d]/10 backdrop-blur-xl shadow-xs transition-all">
      {isRunning && (
        <div
          className="absolute -inset-0.5 rounded-2xl blur-xs opacity-20 pointer-events-none"
          style={{ backgroundColor: strokeColor }}
        />
      )}
      <div className="w-full flex items-center justify-between px-1 text-[8px] font-mono text-slate-500">
        <span className="truncate">{subLabel}</span>
        <span className="font-bold" style={{ color: strokeColor }}>
          {Math.round(safeFraction * 100)}%
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[105px] flex items-center justify-center my-0.5">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 108 108">
          <defs>
            <linearGradient id="gallery-dial-hrs" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c2cb" />
              <stop offset="100%" stopColor="#0b1b3d" />
            </linearGradient>
            <linearGradient id="gallery-dial-mins" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c2cb" />
              <stop offset="100%" stopColor="#0b1b3d" />
            </linearGradient>
            <linearGradient id="gallery-dial-secs" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Guide ticks */}
          <circle cx="54" cy="54" r="50" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1 4" fill="none" opacity="0.6" />
          {/* Base Track */}
          <circle cx="54" cy="54" r={r} stroke="#e2e8f0" strokeWidth="5.5" fill="none" />
          {/* Progress Arc */}
          <circle
            cx="54"
            cy="54"
            r={r}
            stroke={`url(#${gradientId})`}
            strokeWidth="5.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Traveling Satellite Dot */}
          {isRunning && (
            <g>
              <circle cx={satX} cy={satY} r="3.5" fill={strokeColor} />
              <circle cx={satX} cy={satY} r="1.5" fill="#ffffff" />
            </g>
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <div className="flex items-baseline justify-center">
            <span className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#0b1b3d] leading-none">
              {value}
            </span>
            {subValue && (
              <span className="font-mono text-[10px] text-[#b45309] font-bold ml-0.5">
                {subValue}
              </span>
            )}
          </div>
          <span className="font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

const RealtimeGalleryPage = ({ onNavigateToTimer }) => {
  // Photos state with LocalStorage persistence for user-uploaded moments
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem('horizonxt_live_photos') || localStorage.getItem('medaithon_live_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_PHOTOS];
      }
    } catch {
      // fallback
    }
    return INITIAL_PHOTOS;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showSakura, setShowSakura] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Deletion state
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState(null);

  // New photo upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Ideation & Code');
  const [newLocation, setNewLocation] = useState('');
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  // -------------------------------------------------------------
  // 36-HOUR LIVE TIMER ENGINE (Synchronized across all devices)
  // -------------------------------------------------------------
  const {
    elapsedSeconds: timerElapsedSeconds,
    hours: timerHours,
    minutes: timerMinutes,
    seconds: timerSecs,
    tenths,
    progressPercent: timerProgressPercent,
    isTimerRunning,
    syncStatus,
    togglePlayPause: toggleTimerPlayPause,
    resetTimer,
    adjustTime: adjustTimerTime,
  } = useSyncedTimer();

  const timerGaugeRadius = 34;
  const timerGaugeCircumference = 2 * Math.PI * timerGaugeRadius;
  const timerGaugeStrokeDashoffset =
    timerGaugeCircumference - (parseFloat(timerProgressPercent) / 100) * timerGaugeCircumference;

  // Fetch live uploaded photos from Cloudinary / Serverless API on mount
  useEffect(() => {
    let isMounted = true;
    fetchLivePhotos().then((res) => {
      if (isMounted && res && Array.isArray(res.photos) && res.photos.length > 0) {
        setPhotos((prev) => {
          const existingIds = new Set(prev.map((p) => String(p.id)));
          const newPhotos = res.photos.filter((p) => !existingIds.has(String(p.id)));
          return [...newPhotos, ...prev];
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Photos based on category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  // Current active spotlight photo
  const currentPhoto = useMemo(() => {
    if (filteredPhotos.length === 0) return null;
    const safeIndex = Math.min(currentSlideIndex, filteredPhotos.length - 1);
    return filteredPhotos[safeIndex];
  }, [filteredPhotos, currentSlideIndex]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!slideshowActive || filteredPhotos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slideshowActive, filteredPhotos.length]);

  // Fullscreen toggle
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
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleTimerPlayPause();
      } else if (selectedPhoto) {
        if (e.key === 'Escape') {
          setSelectedPhoto(null);
        } else if (e.key === 'ArrowRight') {
          const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
          if (idx !== -1 && idx < filteredPhotos.length - 1) {
            setSelectedPhoto(filteredPhotos[idx + 1]);
          }
        } else if (e.key === 'ArrowLeft') {
          const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
          if (idx > 0) {
            setSelectedPhoto(filteredPhotos[idx - 1]);
          }
        }
      } else if (!selectedPhoto && filteredPhotos.length > 0) {
        if (e.key === 'ArrowRight') {
          setCurrentSlideIndex((prev) => (prev + 1) % filteredPhotos.length);
        } else if (e.key === 'ArrowLeft') {
          setCurrentSlideIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, filteredPhotos, toggleFullscreen, toggleTimerPlayPause]);

  // Handle local image file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLivePhoto = async (e) => {
    e.preventDefault();
    if (!newImagePreview || !newTitle.trim()) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccessMsg(null);

    try {
      const result = await uploadLivePhoto({
        image: newImagePreview,
        title: newTitle.trim(),
        category: newCategory,
        location: newLocation.trim() || 'Arena Floor',
        description: 'Captured live directly from the HorizonXT 36-hour arena.',
      });

      if (result && result.photo) {
        setPhotos((prev) => [result.photo, ...prev]);
        setCurrentSlideIndex(0);
        setUploadSuccessMsg(
          result.hostedOnCloudinary
            ? '✓ Photo uploaded to Cloudinary & broadcasted live!'
            : '✓ Photo posted to HorizonXT Live Telemetry!'
        );

        setTimeout(() => {
          setNewTitle('');
          setNewLocation('');
          setNewImagePreview(null);
          setIsUploadOpen(false);
          setIsUploading(false);
          setUploadSuccessMsg(null);
        }, 1200);
      } else {
        throw new Error(result?.error || 'Failed to upload image');
      }
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
      setIsUploading(false);
    }
  };

  // Delete photo handler
  const confirmDeletePhoto = async (photo) => {
    if (!photo) return;
    setIsDeleting(true);
    try {
      await deleteLivePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => String(p.id) !== String(photo.id)));

      if (selectedPhoto && String(selectedPhoto.id) === String(photo.id)) {
        setSelectedPhoto(null);
      }

      setDeleteToast(`✓ "${photo.title}" deleted.`);
      setTimeout(() => setDeleteToast(null), 3000);
      setPhotoToDelete(null);
    } catch (err) {
      console.error('Failed to delete photo:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-white text-[#0b1b3d] flex flex-col justify-between selection:bg-[#f59e0b] selection:text-white font-['Inter']">
      {/* 3D Molten Metal Background WebGL (Light Pearlescent Mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <MoltenMetal
          color1="#ffffff"
          color2="#f1f5f9"
          color3="#e0f2fe"
          speed={0.14}
          scale={3.0}
          detail={3}
          glow={0.8}
          coreSize={0.12}
          swirl={1.1}
          fold={-0.2}
          brightness={1.3}
          colorMode="molten"
          grain={false}
          opacity={0.5}
        />
      </div>

      {/* Cosmic Stardust Particle Field (Navy, Gold, Cyan) */}
      <div className="fixed inset-0 z-1 pointer-events-none opacity-45">
        <ParticleField />
      </div>

      {/* Twinkling Space Stars */}
      {showSakura && <SakuraField />}

      {/* Ambient Radial Iridescent Glowing Orbs */}
      <div className="fixed top-1/4 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#00c2cb]/15 via-[#f59e0b]/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 right-0 w-[550px] h-[550px] bg-gradient-to-tl from-[#0b1b3d]/10 via-[#00c2cb]/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />

      {/* TOAST NOTIFICATION */}
      {deleteToast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono backdrop-blur-xl shadow-[0_10px_30px_rgba(239,68,68,0.15)] animate-bounce">
          {deleteToast}
        </div>
      )}

      {/* ============================================================= */}
      {/* COMPACT TOP NAVIGATION BAR                                     */}
      {/* ============================================================= */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 border-b border-[#0b1b3d]/10 backdrop-blur-xl bg-white/80 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          {/* HorizonXT Hex Badge */}
          <div className="w-8 h-8 rounded-lg bg-[#0b1b3d] border border-[#f59e0b]/60 shadow-[0_2px_8px_rgba(11,27,61,0.2)] flex items-center justify-center text-[#f59e0b] font-black text-xs select-none shrink-0">
            HX
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onNavigateToTimer}
            title="Switch to Full Stage Timer"
          >
            <img
              src="/horizonxt-logo.png"
              alt="HorizonXT Logo"
              className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_6px_rgba(11,27,61,0.15)]"
            />
            <span className="font-['Bebas_Neue'] text-base sm:text-xl tracking-wider text-[#0b1b3d] hidden sm:inline">
              HORIZON<span className="text-[#f59e0b]">XT</span> LIVE TELEMETRY
            </span>
          </div>

          {/* Dynamic Sync Badges */}
          <div className="hidden md:flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 border ${
                isTimerRunning
                  ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isTimerRunning ? 'bg-[#f59e0b] animate-ping' : 'bg-slate-400'}`} />
              {isTimerRunning ? '36H MISSION ACTIVE' : 'MISSION HOLD'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border border-cyan-200 bg-cyan-50 text-cyan-800">
              <span className={`w-1 h-1 rounded-full ${syncStatus === 'synced' ? 'bg-cyan-500' : 'bg-yellow-500 animate-ping'}`} />
              {syncStatus === 'synced' ? 'VERCEL SYNCED' : 'LOCAL CACHE'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* UPLOAD LIVE SHOT BUTTON */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-900 text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-sm hover:scale-102"
          >
            <svg className="w-3.5 h-3.5 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Live Photo</span>
          </button>

          {/* SLIDESHOW TOGGLE */}
          <button
            onClick={() => setSlideshowActive(!slideshowActive)}
            title={slideshowActive ? 'Pause Projector Slideshow' : 'Start Projector Slideshow'}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
              slideshowActive
                ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm'
                : 'bg-white/80 border-[#0b1b3d]/15 text-[#0b1b3d]/70 hover:text-[#0b1b3d] hover:bg-white'
            }`}
          >
            {slideshowActive ? (
              <>
                <svg className="w-3.5 h-3.5 fill-current text-[#f59e0b]" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span className="hidden sm:inline">Slideshow ON</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="hidden sm:inline">Slideshow</span>
              </>
            )}
          </button>

          {/* SPACE STARS TOGGLE */}
          <button
            onClick={() => setShowSakura(!showSakura)}
            title={showSakura ? 'Hide Space Stars' : 'Show Space Stars'}
            className="p-1.5 rounded-xl bg-white/80 border border-[#0b1b3d]/15 text-[#0b1b3d] hover:bg-white transition-all cursor-pointer text-xs"
          >
            🌌
          </button>

          {/* FULL STAGE TIMER LINK */}
          {onNavigateToTimer && (
            <button
              onClick={onNavigateToTimer}
              title="Switch to 36H Stage Timer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b1b3d] hover:bg-[#132c66] border border-[#0b1b3d] text-xs font-['Bebas_Neue'] tracking-wider text-white backdrop-blur-xl transition-all cursor-pointer hover:scale-102 shadow-sm"
            >
              <span>STAGE TIMER (36H)</span>
            </button>
          )}

          {/* FULLSCREEN BUTTON */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-amber-100 border-amber-400 text-amber-800'
                : 'bg-white/80 hover:bg-white border-[#0b1b3d]/15 text-[#0b1b3d]'
            }`}
          >
            {isFullscreen ? 'EXIT (F)' : 'FULLSCREEN (F)'}
          </button>
        </div>
      </header>

      {/* ============================================================= */}
      {/* MAIN UNIFIED STUDIO BODY: 100% VISIBLE WITHOUT SCROLLING      */}
      {/* ============================================================= */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1750px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:overflow-hidden">
        
        {/* ----------------------------------------------------------- */}
        {/* LEFT COLUMN: 36-HOUR LIVE TIMER COMMAND CENTER              */}
        {/* ----------------------------------------------------------- */}
        <section className="glass-aurora lg:col-span-4 xl:col-span-4 rounded-3xl border border-white/70 bg-white/75 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(11,27,61,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between relative overflow-hidden group">
          {/* Top Iridescent Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-80 pointer-events-none" />

          {/* Timer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#0b1b3d]/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="cursor-pointer group flex items-center gap-2"
                onClick={onNavigateToTimer}
                title="Open HorizonXT Stage Timer"
              >
                <img
                  src="/horizonxt-logo.png"
                  alt="HorizonXT"
                  className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(11,27,61,0.1)]"
                />
              </div>
              <div>
                <span className="font-['Bebas_Neue'] text-lg sm:text-xl text-[#0b1b3d] tracking-wider block leading-none">
                  36-HOUR ODYSSEY
                </span>
                <span className="text-[10px] font-mono text-[#0b1b3d]/60">
                  {Math.floor(timerElapsedSeconds / 3600)}h Elapsed &bull; {timerHours}h Remaining
                </span>
              </div>
            </div>

            <span className="font-mono text-xs text-[#f59e0b] font-bold">
              36 HOURS
            </span>
          </div>

          {/* Digits Display + SVG Circular Gauge in Center */}
          <div className="flex flex-col items-center justify-center my-auto py-2 sm:py-3 gap-3">
            {/* Compact Orbital HUD Rings */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full">
              <CompactOrbitalDial
                value={timerHours.toString().padStart(2, '0')}
                label="HRS"
                subLabel="ORBIT-1"
                fraction={timerHours / 36}
                colorScheme="cyan"
                isRunning={isTimerRunning}
              />

              <div className="flex flex-col items-center gap-1 opacity-60">
                <div className={`w-1 h-1 rounded-full ${isTimerRunning ? 'bg-cyan-500 animate-ping' : 'bg-slate-300'}`} />
              </div>

              <CompactOrbitalDial
                value={timerMinutes.toString().padStart(2, '0')}
                label="MINS"
                subLabel="ORBIT-2"
                fraction={timerMinutes / 60}
                colorScheme="navy"
                isRunning={isTimerRunning}
              />

              <div className="flex flex-col items-center gap-1 opacity-60">
                <div className={`w-1 h-1 rounded-full ${isTimerRunning ? 'bg-[#f59e0b] animate-ping' : 'bg-slate-300'}`} />
              </div>

              <CompactOrbitalDial
                value={timerSecs.toString().padStart(2, '0')}
                subValue={`.${tenths}`}
                label="SECS"
                subLabel="SYNC"
                fraction={(timerSecs + tenths / 10) / 60}
                colorScheme="amber"
                isRunning={isTimerRunning}
              />
            </div>

            {/* Circular Progress Gauge & Overall Completion */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/80 border border-[#0b1b3d]/10 shadow-sm">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={timerGaugeRadius}
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-slate-200"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={timerGaugeRadius}
                    stroke="url(#timerLeftGaugeGradient)"
                    strokeWidth="5"
                    strokeDasharray={timerGaugeCircumference}
                    strokeDashoffset={timerGaugeStrokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="timerLeftGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00c2cb" />
                      <stop offset="50%" stopColor="#0b1b3d" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute font-['Bebas_Neue'] text-sm text-[#0b1b3d]">
                  {timerProgressPercent}%
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-mono font-semibold text-[#0b1b3d]">
                  Mission Progress: {timerProgressPercent}% Complete
                </span>
                <span className="text-[9px] font-mono text-[#0b1b3d]/60">
                  36-Hour Hackathon &bull; HorizonXT
                </span>
              </div>
            </div>

            {/* Milestone Linear Bar */}
            <div className="w-full space-y-1">
              <div className="relative w-full h-2 bg-slate-200/80 rounded-full overflow-hidden border border-[#0b1b3d]/10 p-[0.5px]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-[#0b1b3d] to-[#f59e0b] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, parseFloat(timerProgressPercent)))}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-[#0b1b3d]/60 px-0.5">
                <span>0H LAUNCH</span>
                <span>8H</span>
                <span>18H MIDWAY</span>
                <span>28H</span>
                <span>34H SPRINT</span>
                <span>36H END</span>
              </div>
            </div>
          </div>

          {/* Frosted Glassmorphism Timer Controls */}
          <div className="pt-3 border-t border-[#0b1b3d]/10 shrink-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* Play / Pause Glassmorphism Button */}
              <button
                onClick={toggleTimerPlayPause}
                className="relative group flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-['Bebas_Neue'] text-base tracking-wider text-white bg-[#0b1b3d] hover:bg-[#132c66] shadow-[0_4px_12px_rgba(11,27,61,0.2)] transition-all cursor-pointer hover:scale-102"
              >
                {isTimerRunning ? (
                  <>
                    <svg className="w-3.5 h-3.5 fill-[#f59e0b]" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span>PAUSE MISSION (HOLD)</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-[#f59e0b]" viewBox="0 0 24 24">
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
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#0b1b3d]/15 text-xs font-mono text-[#0b1b3d] transition-all cursor-pointer shadow-sm"
              >
                Reset 36h
              </button>

              {/* Adjust +/- */}
              <button
                onClick={() => adjustTimerTime(3600)}
                title="Add 1 Hour"
                className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#0b1b3d]/15 text-xs font-mono text-[#0b1b3d] transition-all cursor-pointer shadow-sm"
              >
                +1h
              </button>
              <button
                onClick={() => adjustTimerTime(-3600)}
                title="Subtract 1 Hour"
                className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#0b1b3d]/15 text-xs font-mono text-[#0b1b3d] transition-all cursor-pointer shadow-sm"
              >
                -1h
              </button>
            </div>

            {/* Space Mission Motto Footer */}
            <div className="flex items-center justify-between text-[9px] font-mono text-[#0b1b3d]/60 pt-0.5">
              <span>「HORIZONXT」Research • Innovation • Impact (36H)</span>
              <span className="text-cyan-700 font-semibold">Live Serverless Synced</span>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- */}
        {/* RIGHT COLUMN: REAL-TIME LIVE PHOTO FEED & SPOTLIGHT STUDIO   */}
        {/* ----------------------------------------------------------- */}
        <section className="glass-aurora lg:col-span-8 xl:col-span-8 rounded-3xl border border-white/70 bg-white/75 backdrop-blur-2xl p-3 sm:p-4 lg:p-5 shadow-[0_20px_50px_rgba(11,27,61,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-col justify-between relative overflow-hidden group">
          {/* Top Katana Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-80 pointer-events-none" />

          {/* Top Categories & Quick Stats Strip */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#0b1b3d]/10 shrink-0 overflow-x-auto scrollbar-none">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {CATEGORIES.map((cat) => {
                const count = cat.id === 'all' ? photos.length : photos.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentSlideIndex(0);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#0b1b3d] text-white border border-[#0b1b3d] shadow-sm'
                        : 'bg-white/80 text-[#0b1b3d]/70 hover:text-[#0b1b3d] hover:bg-white border border-[#0b1b3d]/15'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Photo Index Counter */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#0b1b3d]/60 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
              <span>
                {currentSlideIndex + 1} / {filteredPhotos.length} Shots
              </span>
            </div>
          </div>

          {/* Main Photo Spotlight Display (Centerpiece) */}
          {currentPhoto ? (
            <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden my-2 sm:my-2.5 border border-[#0b1b3d]/15 bg-slate-50 flex items-center justify-center group/spotlight shadow-inner">
              {/* Blurred Ambient Backdrop Glow */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-15 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${currentPhoto.img})` }}
              />

              {/* Main Photo Image */}
              <img
                src={currentPhoto.img}
                alt={currentPhoto.title}
                onClick={() => setSelectedPhoto(currentPhoto)}
                className="relative z-10 max-h-full max-w-full object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.015]"
              />

              {/* Prev / Next Spotlight Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white border border-[#0b1b3d]/20 text-[#0b1b3d] flex items-center justify-center opacity-80 group-hover/spotlight:opacity-100 transition-all cursor-pointer backdrop-blur-md shadow-md"
                title="Previous Photo (Left Arrow)"
              >
                &larr;
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev + 1) % filteredPhotos.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white border border-[#0b1b3d]/20 text-[#0b1b3d] flex items-center justify-center opacity-80 group-hover/spotlight:opacity-100 transition-all cursor-pointer backdrop-blur-md shadow-md"
                title="Next Photo (Right Arrow)"
              >
                &rarr;
              </button>

              {/* Top-Right Action Controls (Delete & Fullscreen Lightbox) */}
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 group-hover/spotlight:opacity-100 transition-opacity">
                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoToDelete(currentPhoto);
                  }}
                  title="Delete this Photo"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-mono font-semibold backdrop-blur-xl shadow-sm transition-all cursor-pointer hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>

                {/* EXPAND LIGHTBOX BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(currentPhoto);
                  }}
                  title="Open Fullscreen Lightbox"
                  className="p-1.5 rounded-xl bg-white/90 hover:bg-white border border-[#0b1b3d]/20 text-[#0b1b3d] text-xs backdrop-blur-xl transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5m-6 16H4m0 0v-4m0 4l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-white/95 via-white/80 to-transparent flex flex-wrap items-end justify-between gap-2 pointer-events-none">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0b1b3d] text-[10px] font-mono font-bold text-white shadow-sm">
                      {currentPhoto.code || 'TELEMETRY'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-100 border border-cyan-300 text-[10px] font-mono text-cyan-800">
                      {currentPhoto.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#0b1b3d]/60">
                      📍 {currentPhoto.location} &bull; {currentPhoto.time}
                    </span>
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl sm:text-2xl text-[#0b1b3d] tracking-wide drop-shadow-sm">
                    {currentPhoto.title}
                  </h3>
                </div>

                <div className="pointer-events-auto">
                  <button
                    onClick={() => setSelectedPhoto(currentPhoto)}
                    className="text-xs font-mono text-cyan-700 hover:text-[#0b1b3d] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Click to Expand</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center rounded-2xl border border-[#0b1b3d]/10 bg-white/50 text-center p-6 space-y-2">
              <span className="text-3xl">📷</span>
              <p className="text-sm font-mono text-[#0b1b3d]/70">No photos found in this category.</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-3 py-1.5 rounded-xl bg-[#0b1b3d] text-white text-xs cursor-pointer"
              >
                Reset to All Moments
              </button>
            </div>
          )}

          {/* Bottom Thumbnails Strip (Scrollable Carousel) */}
          <div className="h-20 sm:h-22 shrink-0 pt-1 border-t border-[#0b1b3d]/10 flex items-center gap-2 overflow-x-auto scrollbar-thin">
            {filteredPhotos.map((photo, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <div
                  key={photo.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`group/thumb relative h-full aspect-[4/3] rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all duration-300 shadow-sm ${
                    isActive
                      ? 'border-[#f59e0b] ring-2 ring-[#f59e0b]/50 scale-102'
                      : 'border-[#0b1b3d]/15 opacity-75 hover:opacity-100 hover:border-[#0b1b3d]/40'
                  }`}
                >
                  <img
                    src={photo.img}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-transparent transition-colors" />

                  {/* Thumbnail Quick Delete Button on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoToDelete(photo);
                    }}
                    title="Delete Photo"
                    className="absolute top-1 right-1 z-30 w-5 h-5 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-[10px] opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm cursor-pointer"
                  >
                    ✕
                  </button>

                  <span className="absolute bottom-1 left-1 z-20 text-[9px] font-mono text-white bg-[#0b1b3d]/80 px-1 rounded truncate max-w-[90%]">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}

            {/* Quick "+ Add Live Photo" Card at End of Strip */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-full aspect-[4/3] rounded-xl border border-dashed border-cyan-500/50 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 flex flex-col items-center justify-center gap-1 shrink-0 transition-all cursor-pointer text-xs font-mono"
            >
              <span className="text-base font-bold text-cyan-700">+</span>
              <span className="text-[9px] font-semibold">Add Photo</span>
            </button>
          </div>
        </section>
      </main>

      {/* ============================================================= */}
      {/* DELETE CONFIRMATION MODAL                                     */}
      {/* ============================================================= */}
      {photoToDelete && (
        <div
          className="fixed inset-0 z-50 bg-[#0b1b3d]/40 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !isDeleting && setPhotoToDelete(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white border border-red-200 rounded-3xl p-6 shadow-[0_25px_60px_rgba(239,68,68,0.2)] text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-100 border border-red-300 text-red-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
              🗑️
            </div>

            <div>
              <h4 className="font-['Bebas_Neue'] text-2xl text-[#0b1b3d] tracking-wider">
                DELETE EVENT PHOTO?
              </h4>
              <p className="text-xs text-gray-600 mt-1 font-mono leading-relaxed">
                "{photoToDelete.title}" will be permanently deleted from Cloudinary CDN and the live event stream.
              </p>
            </div>

            {/* Preview image */}
            <div className="w-full h-24 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={photoToDelete.img}
                alt={photoToDelete.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDeletePhoto(photoToDelete)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LIGHTBOX MODAL WITH FULL RES & DELETE BUTTON                  */}
      {/* ============================================================= */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#0b1b3d]/60 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white border border-white/80 rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_60px_rgba(11,27,61,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0b1b3d] text-xs font-mono font-bold text-white">
                  {selectedPhoto.code || 'TELEMETRY'}
                </span>
                <div>
                  <h3 className="font-['Bebas_Neue'] text-xl sm:text-2xl text-[#0b1b3d] tracking-wide">
                    {selectedPhoto.title}
                  </h3>
                  <span className="text-xs font-mono text-gray-500">
                    📍 {selectedPhoto.location} &bull; {selectedPhoto.time}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
                title="Close (Esc)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedPhoto.img}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer: Description + Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-700 font-light max-w-2xl">
                {selectedPhoto.description}
              </p>
              <div className="flex items-center gap-3">
                {/* DELETE BUTTON IN LIGHTBOX */}
                <button
                  onClick={() => setPhotoToDelete(selectedPhoto)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-xs font-semibold text-red-700 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Photo</span>
                </button>

                {/* DOWNLOAD HIGH RES BUTTON */}
                <a
                  href={selectedPhoto.img}
                  download={`horizonxt-${selectedPhoto.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0b1b3d] hover:bg-[#132c66] text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download High-Res</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* UPLOAD LIVE PHOTO MODAL                                       */}
      {/* ============================================================= */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0b1b3d]/50 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,27,61,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="font-['Bebas_Neue'] text-2xl text-[#0b1b3d] tracking-wider">
                  POST LIVE MOMENT
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 mb-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-mono flex items-center gap-2">
                <span>⚠️</span>
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleAddLivePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-700 mb-1">
                  Photo Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neural Model Live Training in Lab 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-300 text-sm text-[#0b1b3d] placeholder-gray-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-700 mb-1">
                    Event Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-300 text-xs text-[#0b1b3d] focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    <option value="Ideation & Code">Ideation & Code</option>
                    <option value="Hardware & IoT">Hardware & IoT</option>
                    <option value="Mentorship">Mentorship & Demos</option>
                    <option value="Keynote & Kickoff">Keynote & Kickoff</option>
                    <option value="Awards & Glory">Awards & Glory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-700 mb-1">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Arena Stage B"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-300 text-xs text-[#0b1b3d] placeholder-gray-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-700 mb-1">
                  Upload Photo Image (Dispatched to Cloudinary)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0b1b3d] file:text-white hover:file:bg-[#132c66] cursor-pointer disabled:opacity-50"
                />
              </div>

              {newImagePreview && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono text-cyan-800">Uploading to Cloudinary CDN...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
                <span>☁️ Cloudinary Global CDN Sync</span>
                <span>⚡ Vercel Serverless /api</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0b1b3d] hover:bg-[#132c66] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 hover:scale-102"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Publish Moment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeGalleryPage;
