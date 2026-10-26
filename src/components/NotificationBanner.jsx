import React from 'react'

const NotificationBanner = ({ visible = true, onClose }) => {
  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[10001] bg-black/80 backdrop-blur-2xl text-white border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">
      
      {/* Animated Shimmer Sweep Accent Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 pointer-events-none animate-pulse" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto py-1.5 sm:py-2.5 px-3 sm:px-6 relative z-10 flex items-center justify-between gap-2 sm:gap-4 text-xs font-['Inter']">
        
        {/* Banner Announcement Content */}
        <div className="min-w-0 flex-1 flex items-center gap-1.5 sm:gap-3 text-left">
          
          {/* Glowing Status Pulse */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
          </span>

          {/* Badge */}
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/50 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-['Bebas_Neue'] tracking-wider shrink-0 uppercase shadow-[0_0_10px_rgba(251,191,36,0.25)]">
            REGISTRATIONS CLOSED
          </span>

          {/* Responsive Text Message */}
          <div className="min-w-0 flex-1">
            <p className="m-0 text-gray-200 text-[11px] sm:text-xs leading-tight truncate sm:whitespace-normal font-medium">
              <span className="sm:hidden text-white font-semibold">Registrations Closed • Results will be announced soon!</span>
              <span className="hidden sm:inline">
                <strong className="text-white font-semibold">MEDAITHON '26 (26, 27 & 28 Oct 2026): </strong>
                Online registrations are now closed! Reviews in progress — <span className="text-amber-300 font-semibold">Results will be announced soon.</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons & Close */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Download PPT Button */}
          <a
            href="/ppt_template/MEDAITHON_Team_Template-2.pptx"
            download="MEDAITHON_Team_Template-2.pptx"
            className="group relative inline-flex items-center gap-1 bg-white hover:bg-gray-200 text-black font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-4 py-1 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_22px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap overflow-hidden border border-white"
          >
            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="sm:hidden">Download</span>
            <span className="hidden sm:inline">PPT v2.0</span>
          </a>

          {/* Rulebook Download Link (Desktop) */}
          <a
            href="/MED_AI_THON_2026_Rulebook.pdf"
            download="MED_AI_THON_2026_Rulebook.pdf"
            className="hidden md:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg border border-white/20 hover:border-white/50 transition-all duration-300 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Rulebook</span>
          </a>

          {/* Dismiss Button */}
          <button
            onClick={onClose}
            aria-label="Close Announcement"
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all duration-300 hover:rotate-90 cursor-pointer"
            title="Close Notification"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}

export default NotificationBanner
