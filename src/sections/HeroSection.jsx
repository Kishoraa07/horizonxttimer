import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText, ScrollTrigger } from 'gsap/all'
import { useRef } from 'react'
import ParticleField from '../components/ParticleField'
import CountdownTimer from '../components/CountdownTimer'

gsap.registerPlugin(SplitText, ScrollTrigger)
const HeroSection = ({ onRegisterClick }) => {
  const buttonRef = useRef()
  const outlineButtonRef = useRef()

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 })

    // Hero content base reveal
    tl.from('.hero-content', {
      opacity: 0,
      y: 15,
      ease: 'expo.out',
      duration: 0.8,
    })

      // Header Japanese Badge
      .from(
        '.hero-badge',
        {
          scale: 0.85,
          opacity: 0,
          y: -15,
          ease: 'back.out(1.7)',
          duration: 0.6,
        },
        '-=0.4'
      )

      // Logo fade and scale in
      .from(
        '.hero-main-logo',
        {
          scale: 0.9,
          opacity: 0,
          y: 20,
          ease: 'expo.out',
          duration: 0.9,
        },
        '-=0.4'
      )

      // Hero description & pills
      .from(
        '.hero-description',
        { opacity: 0, y: 15, duration: 0.6, ease: 'expo.out' },
        '-=0.4'
      )
      .from(
        '.hero-pill-badge',
        {
          opacity: 0,
          y: 12,
          scale: 0.9,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.5)',
        },
        '-=0.3'
      )
      .from(
        '.hero-button',
        { opacity: 0, scale: 0.85, duration: 0.5, ease: 'back.out(2)', stagger: 0.1 },
        '-=0.3'
      )

    // Scroll-driven subtle fade (Desktop only)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (!isMobile) {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      heroTl.to('.hero-container', {
        opacity: 0.85,
        scale: 0.96,
        ease: 'none',
      })
    }

    // Floating dragon image
    gsap.to('.hero-dragon-img', {
      y: -18,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // CTA button continual glow pulse
    gsap.to(buttonRef.current, {
      boxShadow: '0 0 35px 8px rgba(251, 191, 36, 0.45)',
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5,
    })
  })

  const handleLearnMore = (e) => {
    e.preventDefault()
    const target = document.getElementById('about')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.hash = '#about'
    }
  }

  return (
    <section className="bg-transparent text-white relative overflow-hidden min-h-screen w-full flex items-center justify-center pt-36 sm:pt-40 lg:pt-36 pb-28 sm:pb-32 lg:pb-16">

      {/* Background ParticleField */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 75%)' }}></div>

      <div className="hero-container relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-6 sm:gap-8 lg:gap-10">
        
        {/* Left Column: Hero Main Content */}
        <div className="hero-content relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[58%] xl:w-[60%]">
          
          {/* Stable Ambient Glass Glow (No Blinking / Flickering) */}
          <div className="absolute top-1/2 left-1/2 lg:left-1/3 -translate-x-1/2 -translate-y-[50%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-white/10 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none"></div>

          {/* Top Event Badge */}
          <div className="hero-badge mb-2 sm:mb-3 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/30 backdrop-blur-md text-white text-[9px] sm:text-xs font-mono font-semibold tracking-wider inline-flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping shrink-0"></span>
            <span className="truncate">HORIZONXT • 36-HOUR SPACE & TECH HACKATHON • OCT 26 & 27, 2026</span>
          </div>
          
          {/* Main Logo Image (HorizonXT) */}
          <div className="hero-main-logo w-full max-w-[260px] sm:max-w-md md:max-w-xl lg:max-w-2xl mb-2 sm:mb-3 relative z-10">
            <img src="/horizonxt-logo.png" alt="HorizonXT" className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(245,158,11,0.35)]" />
          </div>

          {/* Tagline / Sub-description */}
          <h2 className="hero-description max-w-xl text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed font-inter">
            Research • Innovation • Impact. 36 hours of relentless innovation navigating the frontiers of space and deep technology.
          </h2>

          {/* Mobile-Only HorizonXT Space Core (Compact spacing on Mobile & Tablet) */}
          <div className="lg:hidden w-full flex justify-center my-2 sm:my-3 relative z-20">
            <img
              src="/horizonxt-logo.png"
              alt="HorizonXT Core"
              className="hero-dragon-img w-36 sm:w-52 md:w-64 object-contain filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-transform duration-500"
            />
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 max-w-lg sm:max-w-2xl w-full">
            <div className="hero-pill-badge px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 backdrop-blur-md text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>REGISTRATIONS CLOSED</span>
            </div>
            <div className="hero-pill-badge px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>36 Hours</span>
            </div>
            <div className="hero-pill-badge px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2 0h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              <span>₹1L+ Prizes</span>
            </div>
            <div className="hero-pill-badge px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span>200+ Hackers</span>
            </div>
            <div className="hero-pill-badge px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.594 15.12a2 2 0 00-1.022.547l-1.42 1.42A2 2 0 004.566 20.5h14.868a2 2 0 001.414-3.414l-1.42-1.42z" /></svg>
              <span>1 ENG + 1 MED</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-4 sm:mb-5 w-full max-w-md lg:max-w-lg">
            <CountdownTimer />
          </div>

          {/* Action CTAs - Results Will Be Announced Soon directly below Countdown Timer */}
          <div className="relative z-50 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full mt-2 pointer-events-auto">
            {/* Primary Status Button - Results Will Be Announced Soon */}
            <button
              ref={buttonRef}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (typeof onRegisterClick === 'function') onRegisterClick()
              }}
              className="hero-button group relative cursor-pointer bg-gradient-to-r from-amber-500/25 via-white/10 to-amber-500/25 hover:from-amber-500/35 hover:to-amber-500/35 text-white px-8 py-3.5 rounded-full font-extrabold tracking-widest uppercase text-xs sm:text-sm font-inter transition-all duration-300 shadow-[0_4px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_4px_40px_rgba(251,191,36,0.55)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 border-2 border-amber-400/80 hover:border-amber-400 w-full sm:w-auto shrink-0 z-50 backdrop-blur-xl"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
              </span>
              <span className="pointer-events-none whitespace-nowrap text-white font-extrabold">Results Will Be Announced Soon</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            {/* PPT Template Button */}
            <a
              href="/ppt_template/MEDAITHON_Team_Template-2.pptx"
              download="MEDAITHON_Team_Template-2.pptx"
              className="hero-button relative group cursor-pointer bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold tracking-widest uppercase text-xs font-inter transition-all duration-300 shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-white/30 backdrop-blur-md whitespace-nowrap w-full sm:w-auto"
            >
              <span className="absolute -top-2 -right-1 bg-white text-black text-[9px] font-black font-['Bebas_Neue'] tracking-wider px-2 py-0.5 rounded-full border border-black shadow-sm animate-bounce">
                NEW v2
              </span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>PPT Template v2</span>
            </a>

            {/* Rulebook Download Button */}
            <a
              href="/MED_AI_THON_2026_Rulebook.pdf"
              download="MED_AI_THON_2026_Rulebook.pdf"
              className="hero-button cursor-pointer bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white px-5 py-3 rounded-full font-bold tracking-widest uppercase text-xs font-inter transition-all border border-white/20 hover:border-white backdrop-blur-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
            >
              <svg className="w-4 h-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Rulebook PDF</span>
            </a>
          </div>

        </div>

        {/* Desktop-Only Right Column: HorizonXT Cosmic Core */}
        <div className="hero-dragon-wrap hidden lg:flex w-full lg:w-[38%] xl:w-[35%] items-center justify-end relative z-20">
          <div className="relative p-8 rounded-full bg-[#030712]/60 border border-[#f59e0b]/30 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-xl">
            <img
              src="/horizonxt-logo.png"
              alt="HorizonXT Core"
              className="hero-dragon-img w-80 lg:w-[380px] xl:w-[400px] object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.45)] transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection