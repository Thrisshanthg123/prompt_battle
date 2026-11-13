import React from 'react';
import { Heart, Bus, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800">SANCHAARI Mobility Network</span>
          <span>— When the bus stops, the journey doesn't.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Hackathon Foundation Ready
          </span>
          <span>•</span>
          <span>Built for safe student transit</span>
        </div>
      </div>
    </footer>
  );
}
