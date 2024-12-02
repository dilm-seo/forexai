import React from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyStrengthProps {
  currencyImpact: Record<string, { score: number; mentions: number }>;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function CurrencyStrength({ currencyImpact, onRefresh, isLoading }: CurrencyStrengthProps) {
  const sortedCurrencies = Object.entries(currencyImpact)
    .map(([currency, { score, mentions }]) => ({
      currency,
      strength: score / Math.max(1, mentions),
      mentions
    }))
    .sort((a, b) => b.strength - a.strength);

  const strongCurrencies = sortedCurrencies.slice(0, 3);
  const weakCurrencies = sortedCurrencies.slice(-3).reverse();

  return (
    <div className="bg-gradient-to-br from-white to-primary-50 shadow-xl rounded-2xl p-6 mb-12 border border-primary-100/50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Force Relative des Devises
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:-translate-y-0.5"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary-600">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Devises les plus fortes</h3>
          </div>
          <div className="space-y-3">
            {strongCurrencies.map(({ currency, strength }, index) => (
              <div 
                key={currency} 
                className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-white p-4 rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-lg text-primary-700 font-bold">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{currency}</span>
                </div>
                <span className="text-primary-600 font-semibold">+{strength.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-secondary-600">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Devises les plus faibles</h3>
          </div>
          <div className="space-y-3">
            {weakCurrencies.map(({ currency, strength }, index) => (
              <div 
                key={currency} 
                className="flex items-center justify-between bg-gradient-to-r from-secondary-50 to-white p-4 rounded-xl border border-secondary-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-secondary-100 rounded-lg text-secondary-700 font-bold">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{currency}</span>
                </div>
                <span className="text-secondary-600 font-semibold">{strength.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}