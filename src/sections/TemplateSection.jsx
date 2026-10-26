import React, { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDE_PREVIEWS = [
  {
    id: 'slide-1',
    num: '01',
    label: 'Title & Team',
    tag: 'SLIDE 1 • COVER & TEAM COMPOSITION',
    title: 'HEALTHCARE INNOVATION ABSTRACT',
    subtitle: 'SRM TRP Engineering College & SRM Medical College',
    badge: 'MANDATORY DECK COVER',
    accentColor: '#ffffff',
    content: (
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-[10px] text-gray-300 font-mono uppercase block">Project Title & Track</span>
            <p className="text-xs sm:text-sm font-bold text-white m-0">[Your Innovation Title] — Track 01 to 05</p>
          </div>
          <span className="text-xs bg-white/20 text-white border border-white/40 px-2.5 py-1 rounded-md font-mono">16:9 HD</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <span className="text-[10px] text-white font-mono font-bold block mb-1">👨‍💻 1. ENGINEERING MEMBER</span>
            <p className="text-xs text-white font-semibold m-0">Engineering Core Lead</p>
            <p className="text-[11px] text-gray-300 mt-0.5">Hardware / Software / AI Model</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <span className="text-[10px] text-white font-mono font-bold block mb-1">🩺 2. MEDICAL MEMBER</span>
            <p className="text-xs text-white font-semibold m-0">Clinical Insight Lead</p>
            <p className="text-[11px] text-gray-300 mt-0.5">Medical Needs / Diagnostics</p>
          </div>
        </div>
        <p className="text-[11px] text-white font-mono text-center pt-1 m-0">
          TEAM REQUIREMENT: Minimum 1 female member per team (Mandatory)
        </p>
      </div>
    )
  },
  {
    id: 'slide-2',
    num: '02',
    label: '01 / NEED',
    tag: 'SLIDE 2 • CLINICAL PROBLEM & UNMET NEED',
    title: '01 / CLINICAL NEED ANALYSIS',
    subtitle: 'Define the burden, diagnostic bottleneck, or patient care gap',
    badge: 'PROBLEM STATEMENT',
    accentColor: '#ffffff',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-mono text-white block mb-1">● Current Clinical Bottleneck</span>
          <p className="text-xs text-gray-300 leading-relaxed m-0">
            Describe current diagnostic delays, high equipment costs, or lack of bedside decision support in current healthcare workflows.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-mono text-white block mb-1">● Target Patient Population</span>
          <p className="text-xs text-gray-300 leading-relaxed m-0">
            Specify patient demographics, hospital departments (ICU, Radiology, ER), or rural clinics benefiting from your solution.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'slide-3',
    num: '03',
    label: '02 / TECH',
    tag: 'SLIDE 3 • ENGINEERING CORE & PIPELINE',
    title: '02 / TECHNICAL ARCHITECTURE',
    subtitle: 'Hardware schematics, AI models, data flow & system execution',
    badge: 'ENGINEERING CORE',
    accentColor: '#ffffff',
    content: (
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex-1">
            <span className="text-xs font-mono text-white block mb-1">● System Block Diagram / Architecture</span>
            <p className="text-xs text-gray-300 m-0">Sensors / Microcontrollers → Model Inference → Clinical Interface Dashboard</p>
          </div>
          <span className="text-xl">⚙️</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono text-gray-300">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">Hardware / Sensor</div>
          <div className="p-2 rounded-lg bg-white/20 border border-white/40 text-white font-bold">AI / Edge Model</div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">UI / EHR Output</div>
        </div>
      </div>
    )
  },
  {
    id: 'slide-4',
    num: '04',
    label: '03 / OUTCOME',
    tag: 'SLIDE 4 • CLINICAL IMPACT & FEASIBILITY',
    title: '03 / CLINICAL OUTCOME & SYNERGY',
    subtitle: 'Bedside feasibility, validation metrics & implementation roadmap',
    badge: 'CLINICAL IMPACT',
    accentColor: '#ffffff',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-mono text-white block mb-1">● Bedside Feasibility</span>
          <p className="text-xs text-gray-300 leading-relaxed m-0">
            Ease of deployment in hospital wards, diagnostic accuracy benchmarks, and safety compliance considerations.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-mono text-white block mb-1">● Cross-Disciplinary Synergy</span>
          <p className="text-xs text-gray-300 leading-relaxed m-0">
            How medical observations directly shaped engineering design choices and model training parameters.
          </p>
        </div>
      </div>
    )
  }
]

const EVALUATION_PILLARS = [
  {
    title: 'Clinical Relevance & Impact',
    jp: '臨床的臨床的影響 (30%)',
    desc: 'Clear problem identification, severity of medical need, and potential to improve patient outcomes or hospital efficiency.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    title: 'Technical Execution & Rigor',
    jp: '技術的完成度 (30%)',
    desc: 'Architecture design, code/hardware prototype completeness, algorithms used, and technical feasibility.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: 'Cross-Disciplinary Integration',
    jp: '医工連携シナジー (20%)',
    desc: 'How seamlessly engineering capabilities address specific medical constraints, showing true collaboration.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: 'Feasibility & Presentation',
    jp: '実現可能性と発表 (20%)',
    desc: 'Realistic deployment pathway, clarity of abstract deck, pitch quality, and defense during jury Q&A.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
]

const TemplateSection = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [copied, setCopied] = useState(false)

  const templateFileUrl = '/ppt_template/MEDAITHON_Team_Template-2.pptx'

  useGSAP(() => {
    gsap.from('.template-title', {
      scrollTrigger: {
        trigger: '#template',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out'
    })

    gsap.from('.template-reveal', {
      scrollTrigger: {
        trigger: '.template-showcase',
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    })
  }, [])

  const currentSlide = SLIDE_PREVIEWS[activeSlide]

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + templateFileUrl
    navigator.clipboard?.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="template" className="relative bg-transparent text-white py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-14 template-title">
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 shadow-md">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              ● OFFICIAL SUBMISSION DOSSIER
            </span>
          </div>
          
          <h2 className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-wider text-white uppercase m-0 leading-none">
            SOLUTION ABSTRACT TEMPLATE V2.0
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mt-4 font-['Inter'] leading-relaxed">
            All participating teams must prepare their 4-slide solution abstract using the official PPT template. Online registrations are now closed and evaluations are underway.
          </p>
        </div>

        {/* Mandatory Team Requirement Banner */}
        <div className="mb-10 rounded-2xl glass-card border border-white/30 p-4 sm:p-5 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] template-reveal">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 text-white text-xl flex items-center justify-center shrink-0">
              ⚖️
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase font-['Bebas_Neue'] tracking-widest block">
                MANDATORY TEAM COMPOSITION RULE
              </span>
              <p className="text-xs text-gray-200 font-['Inter'] m-0 mt-0.5">
                Each team MUST comprise at least <strong className="text-white">1 Female Member</strong> across the team roster.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-mono text-white">
            <span>1 FEMALE MEMBER</span>
            <span className="text-white font-bold">✓ MANDATORY</span>
          </div>
        </div>

        {/* Main Showcase: Two-column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch template-showcase">
          
          {/* Left Column: Interactive Multi-Slide Deck Explorer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between template-reveal">
            <div className="relative rounded-3xl glass-card border border-white/30 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between h-full overflow-hidden group">
              
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Dossier Mockup Window Controls & Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white/30 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-white/10 inline-block" />
                    <span className="text-xs font-mono text-gray-300 ml-2">
                      MEDAITHON_Team_Template-2.pptx
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-white bg-white/20 border border-white/40 px-3 py-1 rounded-full uppercase">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Slide Tagline */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-gray-300 font-bold tracking-wider uppercase">
                    {currentSlide.tag}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    SLIDE {currentSlide.num} / 04
                  </span>
                </div>

                {/* Main Interactive Slide Render */}
                <div className="rounded-2xl bg-black/60 border border-white/20 p-5 md:p-6 mb-6 shadow-inner min-h-[260px] flex flex-col justify-between transition-all duration-300">
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl md:text-3xl text-white tracking-wide m-0 leading-tight">
                      {currentSlide.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300 font-['Inter'] mt-1 mb-4">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Render Custom Slide Preview Content */}
                  <div className="my-2">
                    {currentSlide.content}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>HORIZONXT OFFICIAL DOSSIER • 26–27 OCT</span>
                    <span>CONFIDENTIAL • FOR JURY REVIEW ONLY</span>
                  </div>
                </div>
              </div>

              {/* Slide Selection Navigation Tabs */}
              <div>
                <span className="text-[11px] font-mono text-gray-300 block mb-2 font-semibold">
                  SELECT SLIDE TO INSPECT STRUCTURE:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SLIDE_PREVIEWS.map((slide, idx) => {
                    const isActive = activeSlide === idx
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-white text-black border-white shadow-lg scale-105 font-bold'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[10px] font-mono block opacity-70">
                          {slide.num} //
                        </span>
                        <span className="text-xs font-bold font-['Bebas_Neue'] tracking-wider uppercase block truncate">
                          {slide.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Download & Evaluation Specs (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 template-reveal">
            
            {/* Download CTA Card */}
            <div className="rounded-3xl glass-card border border-white/30 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-white font-bold tracking-widest uppercase">
                    OFFICIAL ASSETS
                  </span>
                  <span className="bg-white text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    .PPTX FORMAT
                  </span>
                </div>

                <h3 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white tracking-wide m-0">
                  DOWNLOAD DECK V2.0
                </h3>
                <p className="text-xs md:text-sm text-gray-300 font-['Inter'] mt-2 leading-relaxed">
                  Download the updated template v2.0 and follow the 4-slide structure for project evaluation and shortlisted presentations.
                </p>
              </div>

              {/* Direct Link Share Box */}
              <div className="mt-6 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <div className="truncate text-xs font-mono text-gray-300 pl-1">
                  {templateFileUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs px-3 py-1.5 rounded-xl font-bold font-mono transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={templateFileUrl}
                  download="MEDAITHON_Team_Template-2.pptx"
                  className="w-full text-center inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-black py-4 px-6 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm font-['Inter'] shadow-[0_4px_25px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group cursor-pointer border border-white"
                >
                  <svg className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Solution Template v2.0 (.PPTX)</span>
                </a>

                <a
                  href="/MED_AI_THON_2026_Rulebook.pdf"
                  download
                  className="w-full text-center inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white py-3 px-6 rounded-full font-bold uppercase tracking-widest text-xs font-['Inter'] transition-all duration-300 hover:bg-white/10 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <span>View Full Rulebook (.PDF) →</span>
                </a>
              </div>
            </div>

            {/* Evaluation Criteria Cards */}
            <div className="rounded-3xl glass-card border border-white/30 p-6 md:p-7 backdrop-blur-2xl">
              <h4 className="font-['Bebas_Neue'] text-xl text-white tracking-wide uppercase mb-4 flex items-center gap-2">
                <span>⚖️</span>
                <span>Jury Assessment Criteria</span>
              </h4>
              <div className="space-y-3.5">
                {EVALUATION_PILLARS.map((pillar, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 shrink-0 mt-0.5">
                      {pillar.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">
                          {pillar.title}
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono">
                          {pillar.jp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default TemplateSection
