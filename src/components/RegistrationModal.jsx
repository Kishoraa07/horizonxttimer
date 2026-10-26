import React, { useState, useEffect } from 'react';

export const isGoogleDriveUrl = (url) => {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  const pattern = /^https?:\/\/(www\.)?(drive|docs)\.google\.com\/.+/i;
  return pattern.test(trimmed);
};

export const INSTITUTION_OPTIONS = [
  'Trichy SRM Medical College Hospital & Research Centre',
  'Trichy SRM Allied Health Science',
  'SRM TRP Engineering College',
  'SRM Trichy College of Nursing',
  'SRM Trichy Arts & Science College',
  'SRM Institute of Science and Technology, Tiruchirapalli',
  'SRM Ramapuram'
];

export const SRM_IST_SUB_INSTITUTES = [
  'Engineering and Technology',
  'Physiotherapy',
  'Allied Health Sciences',
  'Science and Humanities',
  'Occupational Therapy'
];

const RegistrationModal = ({ isOpen, onClose, prefilledProblem }) => {
  if (!isOpen) return null;

  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('medaithon_registrations') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setExistingSubmission(stored[stored.length - 1]);
      }
    } catch (e) {
      console.warn('Could not read existing registration:', e);
    }
  }, [isOpen]);

  const downloadReceipt = () => {
    if (!existingSubmission) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(existingSubmission, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MEDAITHON_Registration_${existingSubmission.registrationId || 'receipt'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 font-['Inter']">
      <div className="glass-card border border-white/20 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white my-auto max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
        
        {/* Glow Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-90" />

        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-amber-300 font-bold tracking-widest uppercase">
              OFFICIAL NOTICE • MEDAITHON '26
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white text-xl flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Main Announcement Hero */}
        <div className="text-center py-4 space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-white/10 border-2 border-amber-400/60 rounded-full flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(251,191,36,0.35)] animate-pulse">
            <svg className="w-10 h-10 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>REGISTRATIONS CLOSED</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-['Bebas_Neue'] tracking-wider text-white m-0 uppercase leading-none drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">
            RESULTS WILL BE ANNOUNCED SOON
          </h2>

          <p className="text-neutral-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Online registrations for <strong className="text-white font-semibold">MEDAITHON '26 (October 26–28, 2026)</strong> are now officially closed.
            We received overwhelming participation from enthusiastic teams across the nation. Thank you for your inspiring responses!
          </p>
        </div>

        {/* 3-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-6 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-mono text-xs font-bold uppercase">
              <span>01</span>
              <span>• Abstract Review</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed m-0">
              Our interdisciplinary jury is diligently evaluating submitted solution abstracts across medical feasibility, technical depth, and innovation.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-mono text-xs font-bold uppercase">
              <span>02</span>
              <span>• Shortlist Release</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed m-0">
              The official list of shortlisted teams qualified for the 50-hour sprint will be published here and emailed directly to Team Leaders.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-mono text-xs font-bold uppercase">
              <span>03</span>
              <span>• On-Site Hackathon</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed m-0">
              Selected teams assemble on <strong className="text-white">Oct 26–28, 2026</strong> at SRM Trichy campus. 1 MBBS and 1 Nursing student will join each team on-site!
            </p>
          </div>
        </div>

        {/* Previous Submission Box (If found on this browser) */}
        {existingSubmission && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider block">
                YOUR PREVIOUS REGISTRATION
              </span>
              <p className="text-sm font-semibold text-white m-0">
                Team: <strong className="text-amber-300">{existingSubmission.teamName}</strong> • ID: <code className="bg-white/10 px-2 py-0.5 rounded text-white font-mono text-xs">{existingSubmission.registrationId}</code>
              </p>
            </div>
            <button
              onClick={downloadReceipt}
              type="button"
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-bold px-4 py-2.5 rounded-full text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Receipt</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-white/10">
          <a
            href="/ppt_template/MEDAITHON_Team_Template-2.pptx"
            download="MEDAITHON_Team_Template-2.pptx"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer border border-white/30 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Solution Template v2 (.pptx)</span>
          </a>

          <a
            href="/MED_AI_THON_2026_Rulebook.pdf"
            download="MED_AI_THON_2026_Rulebook.pdf"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer border border-white/30 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Rulebook PDF</span>
          </a>

          <button
            onClick={onClose}
            type="button"
            className="bg-white hover:bg-neutral-200 text-black font-extrabold px-7 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-all hover:scale-105"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegistrationModal;
