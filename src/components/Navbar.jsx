import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = ['About', 'Tracks', 'Problems', 'Template', 'Prizes', 'FAQ']

const Navbar = ({ onRegisterClick, hasBanner = false }) => {
  const navRef = useRef(null)
  const pillRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

  useGSAP(() => {
    // ── Entrance: slides down after page load ──────────────────────────────
    gsap.fromTo(navRef.current, {
      y: -90,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.3,
    })

    // ── Scroll-aware state ─────────────────────────────────────────────────
    ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    })
  }, [])

  // ── ScrollSpy observer ────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'tracks', 'problems', 'template', 'prizes', 'faq']
      const scrollPos = window.scrollY + 200

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Nav pill shrink / grow on scroll ────────────────────────────────────
  useEffect(() => {
    gsap.to(navRef.current, {
      paddingTop: scrolled ? '0.5rem' : '1rem',
      paddingBottom: scrolled ? '0.5rem' : '0.85rem',
      paddingLeft: scrolled ? '1rem' : '2.25rem',
      paddingRight: scrolled ? '1rem' : '2.25rem',
      duration: 0.4,
      ease: 'power3.out',
    })

    gsap.to(pillRef.current, {
      opacity: scrolled ? 1 : 0.85,
      scale: scrolled ? 1 : 1.01,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [scrolled])

  // ── Mobile menu GSAP open/close ──────────────────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo('.mobile-menu',
        { y: -20, opacity: 0, pointerEvents: 'none' },
        { y: 0, opacity: 1, pointerEvents: 'all', duration: 0.45, ease: 'expo.out' }
      )
      gsap.from('.mobile-menu li', {
        y: 16,
        opacity: 0,
        stagger: 0.06,
        ease: 'expo.out',
        duration: 0.5,
        delay: 0.05,
      })
    } else {
      gsap.to('.mobile-menu', {
        y: -12,
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power3.in',
      })
    }
  }, [menuOpen])

  // Magnetic logo effect
  const onLogoMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    gsap.to(e.currentTarget, { x: dx * 0.25, y: dy * 0.25, duration: 0.3, ease: 'power2.out' })
  }
  const onLogoLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  const onCtaMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    gsap.to(e.currentTarget, { x: dx * 0.2, y: dy * 0.2, duration: 0.3, ease: 'power2.out' })
  }
  const onCtaLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  const onLinkEnter = (e) => {
    const line = e.currentTarget.querySelector('.nav-line')
    if (line) gsap.to(line, { scaleX: 1, duration: 0.3, ease: 'power2.out', transformOrigin: 'left' })
  }
  const onLinkLeave = (e, isActive) => {
    const line = e.currentTarget.querySelector('.nav-line')
    if (line && !isActive) gsap.to(line, { scaleX: 0, duration: 0.25, ease: 'power2.in', transformOrigin: 'right' })
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 w-full z-[9999] px-4 md:px-9 pt-5 pb-3.5 transition-all duration-300"
        style={{
          top: hasBanner ? '44px' : '16px',
          willChange: 'transform, opacity, padding, top',
          opacity: 1,
          transition: 'top 0.3s ease-out, padding 0.4s ease-out',
        }}
      >
        {/* Frosted Glass Backdrop Pill */}
        <div
          ref={pillRef}
          className="absolute inset-0 mx-3 md:mx-8 rounded-full bg-black/80 backdrop-blur-2xl border border-white/25 shadow-[0_12px_45px_rgba(0,0,0,0.85)] pointer-events-none"
        >
          {/* Subtle glowing chrome accent line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
        </div>

        <div className="relative z-10 flex items-center justify-between h-full px-4 md:px-6">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <div
            className="cursor-pointer select-none relative z-10 flex items-center"
            onMouseMove={onLogoMove}
            onMouseLeave={onLogoLeave}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/horizonxt-logo.png" alt="HorizonXT Logo" className="h-9 md:h-11 object-contain transition-transform duration-300 hover:scale-105" />
          </div>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => {
              const id = item.toLowerCase()
              const isActive = activeSection === id
              return (
                <li key={item}>
                  <a
                    href={`#${id}`}
                    className={`relative text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 pb-1 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                    onMouseEnter={onLinkEnter}
                    onMouseLeave={(e) => onLinkLeave(e, isActive)}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item}
                    <span
                      className="nav-line absolute -bottom-0.5 left-0 right-0 h-[2px] bg-white rounded-full transition-transform duration-300"
                      style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* ── Desktop CTAs ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/MED_AI_THON_2026_Rulebook.pdf"
              download
              className="relative overflow-hidden items-center gap-2 border border-white/30 hover:border-white text-white text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-3 rounded-full transition-colors duration-300 backdrop-blur-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Rulebook
            </a>
            <button
              onClick={onRegisterClick}
              className="hidden lg:flex relative overflow-hidden items-center gap-2 bg-gradient-to-r from-amber-500/20 via-white/10 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 text-white text-[10px] font-bold tracking-[0.18em] uppercase px-6 py-3 rounded-full border border-amber-400/60 hover:border-amber-400 shadow-[0_2px_15px_rgba(251,191,36,0.25)] transition-all cursor-pointer backdrop-blur-md"
              onMouseMove={onCtaMove}
              onMouseLeave={onCtaLeave}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="relative z-10 text-white font-extrabold">Results will be announced soon</span>
            </button>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────── */}
          <button
            className="lg:hidden relative z-10 flex flex-col gap-[5px] p-2 cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-[1.5px] bg-white transition-all duration-300 ease-out"
                style={{
                  width: '22px',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(6.5px)'
                      : i === 1 ? 'scaleX(0)'
                        : 'rotate(-45deg) translateY(-6.5px)'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ────────────────────────────────────────── */}
      <div
        className="mobile-menu fixed left-0 right-0 z-[9998] pt-24 pb-10 px-6 lg:hidden pointer-events-none"
        style={{
          top: hasBanner ? '36px' : '0px',
          opacity: 0,
          background: 'rgba(5,5,8,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '0.5px solid rgba(255,255,255,0.2)',
        }}
      >
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="block py-3.5 text-2xl font-bold uppercase tracking-tight text-white hover:text-gray-300 border-b border-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {item}
              </a>
            </li>
          ))}
          <li className="mt-8 flex flex-col gap-4">
            <a
              href="/MED_AI_THON_2026_Rulebook.pdf"
              download
              className="text-center border border-white/30 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-full"
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Download Rulebook
            </a>
            <button
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 via-white/10 to-amber-500/20 border border-amber-400/50 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-full cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                onRegisterClick();
              }}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Results Will Be Announced Soon</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar