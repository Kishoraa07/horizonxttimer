import React, { useRef, useState, useEffect } from 'react'
import { tracks } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText, ScrollTrigger } from 'gsap/all'
import { useMediaQuery } from 'react-responsive'

gsap.registerPlugin(SplitText, ScrollTrigger)

const renderTrackIcon = (index) => {
    switch (index) {
        case 0:
            // Hardware / IoT Track (Microchip / Hardware)
            return (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                </div>
            )
        case 1:
            // AI / Software Track (Code Terminal)
            return (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )
        case 2:
            // HealthTech / Interoperability Track (Hospital / Medical Cross)
            return (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-2-12v4m-2-2h4" />
                    </svg>
                </div>
            )
        case 3:
            // Advanced / Hybrid Track (Biotech Flask)
            return (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.594 15.12a2 2 0 00-1.022.547l-1.42 1.42A2 2 0 004.566 20.5h14.868a2 2 0 001.414-3.414l-1.42-1.42z" />
                    </svg>
                </div>
            )
        case 4:
        default:
            // DragonForge Open (Energy Bolt / Spark)
            return (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <svg className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            )
    }
}

const TracksSection = () => {
    const sectionRef = useRef()
    const containerRef = useRef()
    const sliderRef = useRef()
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
    const [activeIndex, setActiveIndex] = useState(0)

    useGSAP(() => {
        // Safe SplitText animations
        try {
            const firstTitle = sectionRef.current?.querySelector(".first-text-split h1")
            const secondTitle = sectionRef.current?.querySelector(".second-text-split h1")
            
            if (firstTitle && !firstTitle.dataset.split) {
                firstTitle.dataset.split = "true"
                const firstTextSplit = SplitText.create(firstTitle, { type: "chars" })
                gsap.from(firstTextSplit.chars, {
                    yPercent: 120,
                    opacity: 0,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                })
            }

            if (secondTitle && !secondTitle.dataset.split) {
                secondTitle.dataset.split = "true"
                const secondTextSplit = SplitText.create(secondTitle, { type: "chars" })
                gsap.from(secondTextSplit.chars, {
                    yPercent: 120,
                    opacity: 0,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                })
            }
        } catch (err) {
            console.warn("SplitText initialization warning:", err)
        }

        // Badge reveal
        gsap.to(".tracks-text-scroll", {
            duration: 0.8,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
            }
        })

        // GSAP Horizontal Scroll Scrubbing for Desktop with GSAP Pinning
        if (!isTablet && sliderRef.current && containerRef.current) {
            const getScrollAmount = () => {
                if (!sliderRef.current || !containerRef.current) return 0
                const sliderWidth = sliderRef.current.scrollWidth
                const containerWidth = containerRef.current.offsetWidth
                return Math.max(0, sliderWidth - containerWidth + 120)
            }

            gsap.to(sliderRef.current, {
                x: () => -getScrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const index = Math.min(
                            tracks.length - 1,
                            Math.floor(self.progress * tracks.length)
                        )
                        setActiveIndex(index)
                    }
                }
            })

            setTimeout(() => {
                ScrollTrigger.refresh()
            }, 200)
        }
    }, { scope: sectionRef })

    const scrollToTrack = (index) => {
        if (index < 0 || index >= tracks.length) return
        setActiveIndex(index)
        
        if (isTablet && containerRef.current && sliderRef.current) {
            const cardWidth = containerRef.current.offsetWidth * 0.85
            containerRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            })
        }
    }

    const handleMobileScroll = (e) => {
        if (!isTablet) return
        const scrollPosition = e.target.scrollLeft
        const cardWidth = e.target.offsetWidth * 0.85
        const index = Math.round(scrollPosition / cardWidth)
        if (index !== activeIndex && index >= 0 && index < tracks.length) {
            setActiveIndex(index)
        }
    }

    const handleTrackSelect = (track) => {
        const target = document.getElementById('problem-statements')
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
        } else {
            window.location.hash = '#problem-statements'
        }
    }

    return (
        <section 
            id="tracks" 
            ref={sectionRef} 
            className="tracks-section relative z-10 bg-transparent text-white min-h-screen lg:h-screen flex items-center"
        >
            <div className="w-full h-full flex items-center overflow-hidden py-16 lg:py-0">
                <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-7xl">
                
                {/* Left Side: Header & Track Indicators */}
                <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left pt-6 lg:pt-0 z-20">
                    
                    {/* Floating Badge */}
                    <div 
                        style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }} 
                        className="tracks-text-scroll mb-4"
                    >
                        <div className="bg-white/10 border border-white/20 text-white font-mono text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md shadow-md">
                            ● WARRIOR DOMAINS
                        </div>
                    </div>

                    <div className="overflow-hidden first-text-split text-white">
                        <h1 className="uppercase font-['Bebas_Neue'] text-4xl sm:text-6xl md:text-7xl tracking-wider m-0 leading-none">
                            INNOVATION TRACKS
                        </h1>
                    </div>

                    <div className="overflow-hidden second-text-split text-gray-300">
                        <h1 className="uppercase font-['Bebas_Neue'] text-4xl sm:text-6xl md:text-7xl tracking-wider m-0 leading-none">
                            五道
                        </h1>
                    </div>

                    {/* Active Track Counter & Navigation Controls */}
                    <div className="mt-2 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                            <span className="text-white font-bold text-xs sm:text-sm font-['Bebas_Neue'] tracking-widest">
                                TRACK 0{activeIndex + 1} / 0{tracks.length}
                            </span>
                            <div className="w-10 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-300 rounded-full"
                                    style={{ width: `${((activeIndex + 1) / tracks.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Prev / Next Arrow Controls */}
                        <div className="flex items-center gap-3 z-30 mt-1">
                            <button 
                                onClick={() => scrollToTrack(activeIndex - 1)}
                                disabled={activeIndex === 0}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                                    activeIndex === 0 
                                        ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/40' 
                                        : 'bg-white/10 hover:bg-white hover:text-black text-white hover:border-white active:scale-95 shadow-lg'
                                }`}
                                aria-label="Previous Track"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {/* Track Dots */}
                            <div className="flex items-center gap-1.5 px-1">
                                {tracks.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollToTrack(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            activeIndex === idx 
                                                ? 'w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]' 
                                                : 'w-2 bg-white/20 hover:bg-white/50'
                                        }`}
                                        aria-label={`Go to Track ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <button 
                                onClick={() => scrollToTrack(activeIndex + 1)}
                                disabled={activeIndex === tracks.length - 1}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                                    activeIndex === tracks.length - 1 
                                        ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/40' 
                                        : 'bg-white/10 hover:bg-white hover:text-black text-white hover:border-white active:scale-95 shadow-lg'
                                }`}
                                aria-label="Next Track"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Side: Horizontal Cards Wrapper */}
                <div 
                    ref={containerRef} 
                    onScroll={handleMobileScroll}
                    className={`relative ${
                        isTablet 
                            ? 'w-full overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-2' 
                            : 'flex-1 lg:w-[calc(100vw-360px)] xl:w-[calc(100vw-420px)] h-screen flex items-center overflow-hidden pt-12 pr-8'
                    }`}
                >
                    <div 
                        ref={sliderRef} 
                        className={`tracks flex ${
                            isTablet 
                                ? 'flex-row gap-5 w-max min-w-full' 
                                : 'flex-row flex-nowrap w-max gap-8 pr-20 pl-2'
                        }`}
                    >
                        {tracks && tracks.map((track, i) => {
                            const isActive = activeIndex === i
                            return (
                                <div
                                    key={track.name || i}
                                    onClick={() => handleTrackSelect(track)}
                                    className={`relative z-30 transition-all duration-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between items-center text-center border cursor-pointer group glass-card glass-card-hover ${
                                        isTablet 
                                            ? 'w-[85vw] sm:w-[400px] snap-center flex-none min-h-[380px]' 
                                            : 'w-[360px] sm:w-[400px] lg:w-[440px] xl:w-[480px] flex-none h-[52vh] min-h-[380px] max-h-[480px] hover:scale-[1.02]'
                                    } ${
                                        isActive 
                                            ? 'border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] scale-[1.01]' 
                                            : 'border-white/15 hover:border-white/30 opacity-90'
                                    }`}
                                >
                                    {/* Top Badge */}
                                    <div className="w-full flex justify-between items-center mb-1">
                                        <span className="text-[11px] font-bold font-['Bebas_Neue'] tracking-widest px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                                            TRACK 0{i + 1}
                                        </span>
                                        <div 
                                            className="w-3 h-3 rounded-full transition-all duration-300 bg-white"
                                            style={{ 
                                                boxShadow: isActive ? '0 0 12px rgba(255,255,255,0.8)' : 'none'
                                            }}
                                        />
                                    </div>

                                    {/* Main Icon & Titles */}
                                    <div className="flex flex-col items-center justify-center my-auto py-1">
                                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            {renderTrackIcon(i)}
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase font-['Bebas_Neue'] mb-2 tracking-wider leading-tight">
                                            {track.name}
                                        </h3>
                                        <p className="text-gray-300 font-['Inter'] text-xs sm:text-sm md:text-base max-w-sm leading-relaxed line-clamp-3">
                                            {track.description}
                                        </p>
                                    </div>

                                    {/* Bottom CTA Action Button */}
                                    <div className="w-full pt-3 border-t border-white/10">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTrackSelect(track)
                                            }}
                                            className="w-full py-2.5 px-4 rounded-2xl bg-white/10 group-hover:bg-white group-hover:text-black text-white text-xs font-bold font-['Inter'] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 group-hover:border-white shadow-md"
                                        >
                                            <span>View Problem Statements</span>
                                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    </section>
    )
}

export default TracksSection
