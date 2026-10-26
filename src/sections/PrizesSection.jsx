import React from 'react'
import { prizes } from '../constants'
import { useGSAP } from '@gsap/react'
import ClipPathTitle from '../components/ClipPathTitle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ENHANCED_PRIZES = [
  {
    title: '1st Prize',
    japaneseTitle: '1等賞 • 優勝',
    place: '🏆 SUPREME CHAMPION',
    amount: '₹30,000',
    description: 'Awarded to the team displaying peak clinical impact, technical execution, and presentation perfection.',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.3)',
    badgeBg: 'bg-white/20 text-white border-white/50',
    borderColor: 'border-white/50',
    
    perks: ['₹30,000 Cash Prize', 'Winner Trophy & Gold Medals', 'Direct Incubation Support'],
    isFeatured: true,
  },
  {
    title: '2nd Prize',
    japaneseTitle: '2等賞 • 準優勝',
    place: '🥈 RUNNER UP',
    amount: '₹20,000',
    description: 'For the team demonstrating outstanding engineering novelty and medical problem solving.',
    color: '#e2e8f0',
    glowColor: 'rgba(226,232,240,0.25)',
    badgeBg: 'bg-white/10 text-gray-200 border-white/30',
    borderColor: 'border-white/30',
    
    perks: ['₹20,000 Cash Prize', 'Runner-Up Trophy & Silver Medals', 'Certificate of Distinction'],
    isFeatured: false,
  },
  {
    title: '3rd Prize',
    japaneseTitle: '3等賞 • 第3位',
    place: '🥉 SECOND RUNNER UP',
    amount: '₹15,000',
    description: 'Recognizing relentless execution, high feasibility, and strong cross-disciplinary teamwork.',
    color: '#cbd5e1',
    glowColor: 'rgba(203,213,225,0.25)',
    badgeBg: 'bg-white/10 text-gray-300 border-white/20',
    borderColor: 'border-white/20',
  
    perks: ['₹15,000 Cash Prize', '3rd Place Trophy & Bronze Medals', 'Certificate of Distinction'],
    isFeatured: false,
  },
  {
    title: 'Special Mention',
    japaneseTitle: '特別賞 • 特別言及',
    place: '🌟 SPECIAL MENTION (7 TEAMS)',
    amount: 'Exciting Goodies',
    description: 'Recognizing 7 outstanding teams for their exceptional ideas, creative approach, and innovative potential.',
    color: '#94a3b8',
    glowColor: 'rgba(148,163,184,0.25)',
    badgeBg: 'bg-white/10 text-gray-400 border-white/20',
    borderColor: 'border-white/20',
  
    perks: ['Exclusive HorizonXT Swags', 'Certificate of Recognition', 'Mentorship Opportunities'],
    isFeatured: false,
  },
]

const PrizesSection = () => {
    useGSAP(() => {
        const titles = ['.first-title', '.second-title', '.third-title', '.fourth-title', '.fifth-title']

        const revealTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.prizes-section',
                start: 'top 65%',
                end: 'top 10%',
                scrub: 1.5,
            },
        })

        titles.forEach((selector) => {
            revealTl.to(
                `.prizes-section ${selector}`,
                {
                    duration: 1,
                    opacity: 1,
                    ease: 'expo.out',
                    clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)',
                },
                '-=0.6'
            )
        })

        gsap.from('.prizes-intro-word', {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            ease: 'expo.out',
            duration: 0.9,
            scrollTrigger: {
                trigger: '.prizes-intro-box',
                start: 'top 85%',
            },
        })

        gsap.from('.prize-card-item', {
            opacity: 0,
            y: 45,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.prize-cards-grid',
                start: 'top 80%',
            },
        })
    })

    return (
        <section id="prizes" className="prizes-section relative bg-transparent text-white py-24 sm:py-32 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 shadow-md">
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                            ● WARRIOR REWARDS
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="first-title opacity-0 font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-wider text-white uppercase leading-none">
                            HONOR & GLORY
                        </div>
                        <div className="second-title opacity-0 font-['Bebas_Neue'] text-3xl sm:text-5xl md:text-6xl tracking-wider text-gray-400 uppercase leading-none mt-1">
                            賞金 • PRIZE POOL OVERVIEW
                        </div>
                    </div>
                </div>

                {/* Total Pool Banner */}
                <div className="prizes-intro-box mb-16 rounded-3xl glass-card border border-white/30 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-[80px] pointer-events-none" />
                    
                    <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest block mb-2">
                        TOTAL CASH PRIZE & INCUBATION POOL
                    </span>
                    <h3 className="font-['Bebas_Neue'] text-6xl sm:text-8xl md:text-9xl text-white tracking-wide m-0 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                        ₹1,00,000+
                    </h3>
                    <p className="prizes-intro-word text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mt-4 font-['Inter'] leading-relaxed">
                        Compete across 5 healthcare innovation tracks for cash awards, direct incubation opportunities with SRM ecosystems, and recognition from industry leaders.
                    </p>
                </div>

                {/* Prize Cards Grid */}
                <div className="prize-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {ENHANCED_PRIZES.map((prize, idx) => (
                        <div
                            key={idx}
                            className={`prize-card-item rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 glass-card glass-card-hover border relative group ${
                                prize.isFeatured
                                    ? 'border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] md:-translate-y-4'
                                    : 'border-white/20 hover:border-white/40'
                            }`}
                        >
                            {/* Crown / Top Badge */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-4xl sm:text-5xl drop-shadow-md group-hover:scale-110 transition-transform">
                                        {prize.icon}
                                    </span>
                                    <span className={`text-[10px] font-bold font-['Bebas_Neue'] tracking-widest px-3 py-1 rounded-full uppercase border ${prize.badgeBg}`}>
                                        {prize.japaneseTitle}
                                    </span>
                                </div>

                                <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider block">
                                    {prize.place}
                                </span>
                                <h4 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-white tracking-wide my-1">
                                    {prize.title}
                                </h4>
                                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono my-3">
                                    {prize.amount}
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed font-['Inter'] mb-6">
                                    {prize.description}
                                </p>
                            </div>

                            {/* Perks List */}
                            <div className="pt-4 border-t border-white/10 space-y-2">
                                {prize.perks.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-200">
                                        <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default PrizesSection
