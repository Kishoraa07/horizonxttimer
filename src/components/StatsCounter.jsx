import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { stats } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const STAT_ICONS = [
  <svg key="0" className="w-7 h-7 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="1" className="w-7 h-7 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  <svg key="2" className="w-7 h-7 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2 0h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  <svg key="3" className="w-7 h-7 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.594 15.12a2 2 0 00-1.022.547l-1.42 1.42A2 2 0 004.566 20.5h14.868a2 2 0 001.414-3.414l-1.42-1.42z" /></svg>
];

const StatsCounter = ({ className = '' }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const statItems = gsap.utils.toArray('.stat-item');

    statItems.forEach((item, i) => {
      const numEl = item.querySelector('.stat-number');
      const targetVal = parseFloat(stats[i].value);

      let zero = { val: 0 };

      gsap.to(zero, {
        val: targetVal,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
        onUpdate: () => {
          if (numEl) numEl.textContent = Math.round(zero.val);
        }
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-item relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 hover:border-white/50 group overflow-hidden"
          >
            {/* Ambient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="mb-2 opacity-90 group-hover:scale-110 transition-transform flex items-center justify-center">
              {STAT_ICONS[index]}
            </span>

            <div className="flex items-baseline justify-center">
              <span className="stat-number font-['Bebas_Neue'] text-4xl sm:text-6xl text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.5)]">0</span>
              <span className="font-['Bebas_Neue'] text-2xl sm:text-4xl text-white ml-0.5 drop-shadow-[0_2px_15px_rgba(255,255,255,0.5)]">{stat.suffix}</span>
            </div>
            
            <span className="font-['Inter'] text-xs sm:text-sm text-gray-300 uppercase font-bold tracking-wider mt-2 group-hover:text-white transition-colors">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;
