import React from 'react';
import { TrendingUp, Globe, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-radial from-primary-500 via-primary-700 to-secondary-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-conic from-primary-500/30 via-secondary-600/30 to-primary-500/30 mix-blend-multiply" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-secondary-200">
            Analyse Forex en Temps Réel
          </h1>
          <p className="text-xl text-primary-100 mb-16 max-w-3xl mx-auto leading-relaxed">
            Restez informé des dernières actualités du marché des changes avec notre assistant IA intelligent
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-primary-200" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Analyse en Direct</h3>
            </div>
            <p className="text-primary-100 leading-relaxed">
              Suivez l'évolution des marchés avec des analyses instantanées et pertinentes
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary-500/20 rounded-xl">
                <Globe className="w-8 h-8 text-secondary-200" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Couverture Mondiale</h3>
            </div>
            <p className="text-primary-100 leading-relaxed">
              Accédez aux actualités des marchés financiers du monde entier
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Zap className="w-8 h-8 text-primary-200" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Assistant IA</h3>
            </div>
            <p className="text-primary-100 leading-relaxed">
              Bénéficiez des conseils personnalisés de notre assistant alimenté par GPT-4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}