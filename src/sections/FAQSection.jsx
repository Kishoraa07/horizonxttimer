import React, { useState, useRef } from 'react'
import { faqs } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)
  const iconRef = useRef(null)

  useGSAP(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(iconRef.current, { rotation: 45, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
      gsap.to(iconRef.current, { rotation: 0, duration: 0.3, ease: 'power2.inOut' })
    }
  }, [isOpen])

  return (
    <div className="faq-item border border-white/20 rounded-2xl mb-4 glass-card overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-white">
      <div
        className="flex justify-between items-center cursor-pointer px-6 py-5 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-['Bebas_Neue'] text-xl sm:text-2xl text-white group-hover:text-gray-200 transition-colors duration-300 pr-4">
          {faq.question}
        </h3>
        <div ref={iconRef} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl shrink-0 group-hover:bg-white group-hover:text-black transition-all">
          +
        </div>
      </div>
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        <div className="font-[Inter] text-gray-300 px-6 pb-6 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3">
          {faq.answer}
        </div>
      </div>
    </div>
  )
}

const FAQSection = () => {
  const [query, setQuery] = useState('')

  useGSAP(() => {
    const split = new SplitText('.faq-title', { type: 'words, chars' })
    gsap.set(split.chars, { opacity: 0, y: 20 })
    gsap.to(split.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      ease: 'back.out(1.7)',
      duration: 0.8,
      scrollTrigger: {
        trigger: '.faq-title',
        start: 'top 85%',
      }
    })
  })

  const filteredFaqs = faqs?.filter(
    (f) => f.question.toLowerCase().includes(query.toLowerCase()) || f.answer.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section id="faq" className="faq-section bg-transparent py-28 md:py-36 relative overflow-hidden text-white">
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Title Block - Centered & Aligned */}
        <div className="w-full text-center mb-12 flex flex-col items-center justify-center">
          <p className="text-gray-300 font-['Inter'] tracking-[0.25em] mb-3 text-xs sm:text-sm uppercase font-semibold">
            智慧 • FREQUENTLY ASKED QUESTIONS
          </p>
          <div className="w-full overflow-hidden flex justify-center text-center">
            <h2 
              className="faq-title text-center text-white font-['Bebas_Neue'] uppercase tracking-wider text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mx-auto inline-block" 
              style={{ perspective: '1000px' }}
            >
              SCROLL OF WISDOM
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-4 opacity-50" />
        </div>

        {/* Real-time Search Input */}
        <div className="w-full max-w-xl mb-10 relative">
          <input
            type="text"
            placeholder="Search questions (e.g., registration fee, team size, laptop)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 focus:border-white text-white placeholder:text-white/40 text-sm rounded-full py-3.5 pl-12 pr-10 outline-none transition-all shadow-xl backdrop-blur-md"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer">
              ✕
            </button>
          )}
        </div>

        {/* FAQ List */}
        <div className="faq-list flex flex-col w-full max-w-3xl">
          {filteredFaqs?.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white/5 rounded-2xl border border-white/10 font-['Inter'] backdrop-blur-md">
              No matching questions found.
            </div>
          ) : (
            filteredFaqs?.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
