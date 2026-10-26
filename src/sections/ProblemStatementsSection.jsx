import React, { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const PROBLEM_STATEMENTS = [
  {
    id: 'PS1',
    title: 'Autonomous Sterilization Verification System for Reusable Surgical Instruments',
    track: 'Hardware',
    description: 'Reusable surgical instruments remain a significant vector for hospital-acquired infections when sterilization cycles fail or are incompletely documented. Current verification methods rely on periodic biological indicators or chemical strips that provide delayed or binary pass/fail results without continuous assurance. The problem is to design a compact, sterilization-tolerant hardware module that can be temporarily attached to instrument trays, continuously monitor critical sterilization parameters (temperature, pressure, exposure time, and residual bioburden proxies), cryptographically sign each cycle’s outcome, and transmit a tamper-proof sterilization certificate to hospital inventory systems. The device must survive autoclave conditions, operate without internal batteries during the cycle, and provide immediate visual feedback to operating-room staff on whether an instrument set is certified safe for use.',
  },
  {
    id: 'PS2',
    title: 'Self-Healing Medication Administration Record System for High-Acuity Care',
    track: 'Software & Automation',
    description: 'Medication errors in intensive care and emergency settings often arise from mismatched orders, interrupted workflows, and fragmented documentation across pumps, charts, and electronic records. Existing bar-code scanning systems verify the right drug at the right time but do not detect when the clinical context has changed or when the original order no longer matches the patient’s current status. The problem is to build a software and automation layer that continuously reconciles active medication orders, real-time infusion-pump telemetry, laboratory results, and nursing notes to detect context-inconsistent administrations before they occur, suggest safer alternatives, and automatically generate an auditable correction trail when discrepancies are resolved. The system must integrate with existing hospital APIs, handle conflicting or missing data gracefully, and present alerts in a way that reduces cognitive load rather than adding to it.',
  },
  {
    id: 'PS3',
    title: 'Synthetic Rare-Disease Patient Avatars for Clinical Training and Decision Support',
    track: 'Generative AI',
    description: 'Clinicians rarely encounter many rare diseases during training, yet must make time-sensitive decisions when such cases appear, often without access to experienced specialists or representative case libraries. Traditional case reports and textbooks cannot capture the full variability of presentation, progression, and response to therapy across diverse populations. The problem is to develop a generative AI system that creates high-fidelity, multi-modal synthetic patient avatars for rare diseases, including longitudinal histories, imaging patterns, laboratory trajectories, and response-to-treatment scenarios, all grounded in published medical literature and expert-validated disease models. These avatars must support interactive questioning, reveal uncertainty bounds, avoid reproducing identifiable real-patient data, and be usable for both clinician education and stress-testing of diagnostic algorithms under realistic but controlled conditions.',
  },
  {
    id: 'PS4',
    title: 'Multimodal Early Detection of Postoperative Delirium From Non-Neurological Signals',
    track: 'AI in Diagnostics',
    description: 'Postoperative delirium is a common, underdiagnosed complication in older surgical patients that is associated with prolonged hospitalization, functional decline, and increased mortality, yet current screening relies on intermittent cognitive assessments that miss early or fluctuating symptoms. The problem is to create an AI diagnostic system that predicts emerging delirium using only non-invasive, continuously available signals such as actigraphy, heart-rate variability, respiratory patterns, pupillary responses captured by bedside cameras, and nursing interaction logs, without requiring dedicated neurological testing. The model must differentiate delirium from baseline dementia, sedation effects, and pain-related agitation, provide interpretable risk trajectories over time, and adapt to individual baseline cognition and sleep patterns to reduce false alarms in heterogeneous surgical populations.',
  },
  {
    id: 'PS5',
    title: 'Closed-Loop Wearable for Early Detection and Mitigation of Vasovagal Syncope',
    track: 'Wearable Computing',
    description: 'Vasovagal syncope causes sudden loss of consciousness in response to triggers such as prolonged standing, pain, or emotional stress, leading to falls, injuries, and anxiety-driven activity avoidance, yet current management is largely reactive and educational. The problem is to engineer a comfortable, everyday wearable that continuously monitors pre-syncopal autonomic signatures (heart-rate dynamics, peripheral vasoconstriction, skin conductance, and posture changes), predicts impending syncope minutes in advance, and delivers personalized, closed-loop counter-maneuver guidance through haptic, auditory, or visual cues to abort the episode. The device must learn individual trigger patterns over time, function reliably during daily activities and exercise, minimize false positives that could cause unnecessary anxiety, and operate with multi-day battery life while storing encrypted event logs for clinician review.',
  }
]

const ProblemStatementsSection = ({ onRegisterClick }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrack, setSelectedTrack] = useState('All')
  const [copiedId, setCopiedId] = useState(null)
  const sectionRef = useRef(null)

  const tracksList = ['All', 'Hardware', 'Software & Automation', 'Generative AI', 'AI in Diagnostics', 'Wearable Computing']

  useGSAP(() => {
    // Title animation
    gsap.from('.ps-title', {
      scrollTrigger: {
        trigger: '.ps-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'expo.out'
    })

    // Accordion items stagger in
    gsap.from('.ps-item', {
      scrollTrigger: {
        trigger: '.ps-accordion',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    })
  }, [])

  useEffect(() => {
    const handleTrackSelection = (e) => {
      if (e.detail) {
        setSelectedTrack(e.detail)
        setActiveIndex(0)
      }
    }
    window.addEventListener('select-ps-track', handleTrackSelection)
    return () => window.removeEventListener('select-ps-track', handleTrackSelection)
  }, [])

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleCopy = (id, title) => {
    navigator.clipboard?.writeText(`${id}: ${title}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredProblems = PROBLEM_STATEMENTS.filter((ps) => {
    const matchesTrack = selectedTrack === 'All' || ps.track === selectedTrack
    const matchesSearch = ps.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ps.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ps.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTrack && matchesSearch
  })

  return (
    <section id="problem-statements" ref={sectionRef} className="ps-section relative bg-transparent text-white py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 ps-title">
          <span className="text-xs font-mono font-bold text-white border border-white/20 bg-white/10 px-3.5 py-1.5 rounded-full tracking-widest uppercase inline-block mb-3 backdrop-blur-md">
            CHALLENGE STATEMENTS
          </span>
          <h2 className="text-4xl sm:text-6xl font-['Bebas_Neue'] tracking-wider text-white uppercase m-0 leading-none">
            PROBLEM STATEMENTS
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm mt-3 font-['Inter']">
            Select an official clinical challenge to solve. Each problem statement targets high-impact healthcare bottlenecks.
          </p>
        </div>

        {/* Search & Track Filters */}
        <div className="mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search problem statements by keyword or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/20 focus:border-white text-white placeholder:text-white/40 text-sm rounded-full py-3.5 pl-12 pr-10 outline-none transition-all shadow-lg backdrop-blur-md"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer">
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 px-1 max-w-full justify-start sm:justify-center">
            {tracksList.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTrack(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0 ${selectedTrack === t ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105' : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/30 backdrop-blur-md'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Accordion */}
        <div className="ps-accordion space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              No problem statements found matching your filter criteria.
            </div>
          ) : (
            filteredProblems.map((ps, index) => {
              const isActive = activeIndex === index
              return (
                <div 
                  key={ps.id} 
                  className={`ps-item border transition-all duration-500 overflow-hidden ${isActive ? 'glass-card border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl' : 'bg-white/5 border-white/10 hover:border-white/25 rounded-xl backdrop-blur-md'}`}
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between focus:outline-none text-left cursor-pointer group"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex items-center gap-5 pr-4">
                      <span className={`font-['Bebas_Neue'] text-3xl px-3 py-1 rounded-lg transition-colors duration-300 ${isActive ? 'bg-white text-black font-bold' : 'bg-white/10 text-white border border-white/20'}`}>
                        {ps.id}
                      </span>
                      <div>
                        <h4 className={`font-bold md:text-lg text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                          {ps.title}
                        </h4>
                        <span className="text-[11px] text-gray-300 font-mono mt-1 block">
                          ● {ps.track}
                        </span>
                      </div>
                    </div>
                    
                    {/* Plus/Minus Icon */}
                    <div className={`relative w-7 h-7 shrink-0 flex items-center justify-center rounded-full border transition-all duration-500 ${isActive ? 'rotate-180 border-white text-white bg-white/20' : 'border-white/30 text-white'}`}>
                      <div className="absolute w-3.5 h-[2px] bg-current rounded-full" />
                      <div className={`absolute w-[2px] h-3.5 bg-current rounded-full transition-transform duration-300 ${isActive ? 'rotate-90 scale-0' : 'scale-100'}`} />
                    </div>
                  </button>

                  <div 
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-3 border-t border-white/10 mt-1">
                        <p className="text-gray-300 leading-relaxed md:text-base text-sm font-light mb-6">
                          {ps.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => onRegisterClick && onRegisterClick(ps)}
                            className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Registrations Closed</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(ps.id, ps.title)}
                            className="border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span>{copiedId === ps.id ? 'Copied!' : 'Copy Title'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default ProblemStatementsSection
