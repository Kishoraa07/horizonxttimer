import React from 'react'
import { sponsors } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const SponsorsSection = () => {
  useGSAP(() => {
    const split = new SplitText('.sponsor-title', { type: 'chars' })
    gsap.set(split.chars, { yPercent: 120, rotateX: -80, opacity: 0 })
    gsap.to(split.chars, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      stagger: { amount: 0.6, ease: 'power3.inOut' },
      ease: 'expo.out',
      duration: 1.2,
      scrollTrigger: {
        trigger: '.sponsor-title',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    })

    gsap.fromTo('.tier-label',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.sponsors-container',
          start: 'top 80%',
        }
      }
    )

    gsap.fromTo('.sponsor-card',
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.08,
        ease: 'expo.out',
        duration: 1,
        scrollTrigger: {
          trigger: '.sponsors-container',
          start: 'top 75%',
        }
      }
    )

    gsap.fromTo('.sponsor-cta',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.sponsor-cta',
          start: 'top 95%',
        }
      }
    )

    gsap.to('.sponsor-bg-element', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.sponsors-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
  })

  return (
    <section id="sponsors" className="sponsors-section relative bg-transparent py-32 overflow-hidden text-white">
      <div className="sponsor-bg-element absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="sponsor-bg-element absolute bottom-1/4 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-gray-300 font-[Inter] tracking-[0.2em] mb-4">同盟</p>
          <h2 className="sponsor-title general-title text-white text-6xl md:text-8xl font-['Bebas_Neue'] uppercase" style={{ perspective: '1000px' }}>
            THE ALLIANCE
          </h2>
          <p className="text-gray-300 font-[Inter] mt-6 max-w-2xl mx-auto text-lg">
            Powered by visionaries who believe in the future of healthcare innovation.
          </p>
        </div>

        <div className="sponsors-container flex flex-col gap-16">
          {sponsors?.gold?.length > 0 && (
            <div className="tier-group">
              <h3 className="tier-label text-white font-['Bebas_Neue'] text-3xl tracking-widest text-center mb-8 flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-white/30" />
                <span>Incubation Support</span>
                <span className="w-8 h-px bg-white/30" />
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {sponsors.gold.map((sponsor, i) => (
                  <div 
                    key={i} 
                    className="sponsor-card bg-white rounded-3xl p-5 sm:p-7 w-full sm:w-[80%] md:w-[480px] h-40 sm:h-48 flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.12)] transition-all duration-300 hover:scale-[1.03] border border-white/40 group overflow-hidden"
                  >
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="text-black font-['Bebas_Neue'] text-3xl text-center">{sponsor.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sponsors?.silver?.length > 0 && (
            <div className="tier-group">
              <h3 className="tier-label text-gray-200 font-['Bebas_Neue'] text-2xl tracking-widest text-center mb-8 flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-white/20" />
                <span>Institutional Support</span>
                <span className="w-8 h-px bg-white/20" />
              </h3>
              <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
                {sponsors.silver.map((sponsor, i) => (
                  <div 
                    key={i} 
                    className="sponsor-card bg-white rounded-2xl p-4 sm:p-5 w-full sm:w-[47%] md:w-[28%] lg:w-[18%] h-28 sm:h-32 flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-[1.04] border border-white/30 group overflow-hidden"
                  >
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="text-black font-['Bebas_Neue'] text-xl text-center">{sponsor.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sponsors?.collaboration?.length > 0 && (
            <div className="tier-group mt-6">
              <h3 className="tier-label text-white font-['Bebas_Neue'] text-3xl tracking-widest text-center mb-8 flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-white/30" />
                <span>In Collaboration With</span>
                <span className="w-8 h-px bg-white/30" />
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {sponsors.collaboration.map((sponsor, i) => (
                  <div 
                    key={i} 
                    className="sponsor-card bg-white rounded-3xl p-5 sm:p-7 w-full sm:w-[80%] md:w-[480px] h-40 sm:h-48 flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.03] border border-white/50 group overflow-hidden"
                  >
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="text-black font-['Bebas_Neue'] text-3xl text-center">{sponsor.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SponsorsSection
