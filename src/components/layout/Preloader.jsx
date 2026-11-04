import React from 'react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] text-[#E2DFD7] select-none">
      <div className="border border-white/15 px-10 py-8 relative bg-[#121212]/90 backdrop-blur-md">
        {/* Technical Wireframe Anchor Nodes */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#C84B82]" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C84B82]" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#C84B82]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#C84B82]" />

        <p className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mb-2">
          Initializing Portfolio
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-[#E2DFD7] animate-pulse">
          JANICA CENTINO
        </h2>
      </div>
    </div>
  );
}