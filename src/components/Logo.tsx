import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-lg opacity-50"></div>
        <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-2.5 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
      <span className="font-bold text-2xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent text-glow">
        ForexAI
      </span>
    </div>
  );
}