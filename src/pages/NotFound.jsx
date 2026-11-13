import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-12 shadow-sm space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Bus className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-800">404 - Stop Not Found</h1>
      <p className="text-xs text-slate-500">
        The transit route or page you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow"
      >
        <Home className="w-4 h-4" />
        <span>Return to Student Dashboard</span>
      </Link>
    </div>
  );
}
