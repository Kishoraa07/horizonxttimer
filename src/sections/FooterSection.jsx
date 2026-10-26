import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const NAV_LINKS = [
  { heading: 'Event', items: ['About', 'Tracks', 'Template'] },
  { heading: 'Participate', items: ['Results will be announced soon', 'Solution Template', 'Rules', 'Code of Conduct'] },
]

const FooterSection = ({ onRegisterClick }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const sectionRef = useRef(null)
  const emailRef = useRef(null)
  const ctxRef = useRef(null)
  const [emailFocused, setEmailFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleLinkClick = (item) => {
    switch (item) {
      case 'About':
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'Tracks':
        document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'Template':
      case 'Solution Template':
        document.getElementById('template')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'Results will be announced soon':
      case 'Results':
      case 'Register':
        if (onRegisterClick) onRegisterClick()
        break
      case 'Rules':
      case 'Code of Conduct':
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'Contact Us':
        window.location.href = 'mailto:contact@medaithon.com?subject=MEDAITHON\'26%20Inquiry'
        break
      default:
        break
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const init = () => {
      ctxRef.current = gsap.context(() => {
        const tagSplit = SplitText.create('.footer-tag', { type: 'chars' })

        gsap.set(tagSplit.chars, { yPercent: 130, rotateX: -80, opacity: 0 })

        gsap.to(tagSplit.chars, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          stagger: { amount: 0.65, ease: 'power3.inOut' },
          ease: 'expo.out',
          duration: 1.1,
          scrollTrigger: {
            trigger: '.footer-tag-wrap',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        gsap.fromTo('.footer-tag',
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'expo.out',
            duration: 1.4,
            delay: 0.3,
            scrollTrigger: {
              trigger: '.footer-tag-wrap',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )

        gsap.set('.footer-col', { opacity: 0, y: 40 })
        gsap.to('.footer-col', {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'expo.out',
          duration: 1,
          scrollTrigger: {
            trigger: '.footer-links',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }, section)
    }

    init()
    return () => ctxRef.current?.revert()
  }, [])

  const onArrowEnter = (e) => {
    gsap.to(e.currentTarget, { x: 4, duration: 0.3, ease: 'power2.out' })
  }
  const onArrowLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  const onLinkEnter = (e) => {
    const line = e.currentTarget.querySelector('.link-line')
    if (line) gsap.to(line, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(e.currentTarget, { x: 4, duration: 0.3, ease: 'power2.out' })
  }
  const onLinkLeave = (e) => {
    const line = e.currentTarget.querySelector('.link-line')
    if (line) gsap.to(line, { scaleX: 0, duration: 0.25, ease: 'power2.in', transformOrigin: 'right' })
    gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
  }

  const handleSubmit = () => {
    if (!emailRef.current?.value) return
    gsap.to('.footer-arrow-btn', {
      rotation: 360,
      duration: 0.5,
      ease: 'expo.out',
      onComplete: () => gsap.set('.footer-arrow-btn', { rotation: 0 }),
    })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section ref={sectionRef} className="footer-section bg-black/80 backdrop-blur-2xl text-white relative border-t border-white/20">

      {/* ── Gradient Divider ──────────────────────────────────────────── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent absolute top-0 left-0" />

      <div className="2xl:h-[110dvh] relative pt-[10vh]">

        {/* ── #MEDAITHON26 ───────────────────────────────────────────── */}
        <div
          className="footer-tag-wrap overflow-hidden relative z-10 mt-10"
          style={{ perspective: '1000px' }}
        >
          <div className="footer-tag flex flex-col items-center justify-center py-5 gap-4">
            <img src="/horizonxt-logo.png" alt="HorizonXT Logo" className="h-16 md:h-24 object-contain" />
            <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md shadow-md">
              <span className="text-xs text-gray-200 font-['Inter'] uppercase tracking-widest font-semibold">In Collaboration With</span>
              <div className="bg-white px-3 py-1 rounded-lg flex items-center justify-center">
                <img src="/images/startuptn-logo.png" alt="StartupTN" className="h-5 sm:h-6 object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Links + Newsletter row ─────────────────────────────────────── */}
        <div className="footer-links mt-32 md:mt-40 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between font-[Inter]">

          {/* Nav columns */}
          <div className="flex items-start md:gap-16 gap-8">
            {NAV_LINKS.map((group, gi) => (
              <div key={gi} className="footer-col flex flex-col gap-2.5">
                <p className="text-sm font-bold tracking-widest uppercase opacity-70 mb-1 text-white">
                  {group.heading}
                </p>
                {group.items.map((item) => (
                  <p
                    key={item}
                    className="footer-link-item cursor-pointer relative inline-flex items-center text-base font-medium text-gray-300 hover:text-white transition-colors"
                    onMouseEnter={onLinkEnter}
                    onMouseLeave={onLinkLeave}
                    onClick={() => handleLinkClick(item)}
                  >
                    {item}
                    <span
                      className="link-line absolute bottom-0 left-0 right-0 h-px bg-white"
                      style={{ transform: 'scaleX(0)', transformOrigin: 'left', opacity: 0.8 }}
                    />
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter md:max-w-lg w-full">
            <p className="text-sm md:text-base leading-relaxed opacity-80 mb-6 text-gray-300">
              Get notified about HorizonXT results, shortlisted teams, and event schedule.
            </p>

            {/* Input row */}
            <div
              className="relative flex items-center gap-3 py-4"
              style={{
                borderBottom: `1px solid ${emailFocused ? '#ffffff' : 'rgba(255,255,255,0.2)'}`,
                transition: 'border-color 0.3s ease',
              }}
            >
              <input
                ref={emailRef}
                type="email"
                placeholder={submitted ? '✓ You\'re on the list!' : 'Enter your email'}
                className="w-full bg-transparent outline-none text-white placeholder:text-white/40 text-sm md:text-base"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                className="footer-arrow-btn flex-none p-2.5 rounded-full border border-white hover:bg-white hover:text-black transition-colors duration-300 text-white cursor-pointer"
                onMouseEnter={onArrowEnter}
                onMouseLeave={onArrowLeave}
                onClick={handleSubmit}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

            {/* Micro privacy note */}
            <p className="text-[10px] opacity-40 mt-3 tracking-wide text-gray-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* ── Copyright bar ──────────────────────────────────────────────── */}
        <div className="copyright-box mt-16 md:px-10 px-5 pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60 text-gray-300">
            Copyright © 2026 HORIZONXT — Research • Innovation • Impact
          </p>
          <div className="flex items-center gap-6">
            {/* Back to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-xs text-white hover:bg-white hover:text-black font-mono border border-white/30 px-4 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-md"
              title="Back to Top"
            >
              <span>TOP</span>
              <span>↑</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default FooterSection