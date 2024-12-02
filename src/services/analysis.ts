import { NewsItem } from '../types/news';

interface MarketCondition {
  keyword: string;
  impact: number;
  currencies: string[];
}

const MARKET_CONDITIONS: MarketCondition[] = [
  { keyword: "hawkish", impact: 1, currencies: ["USD", "EUR", "GBP"] },
  { keyword: "dovish", impact: -1, currencies: ["USD", "EUR", "GBP"] },
  { keyword: "inflation", impact: 1, currencies: ["USD", "EUR", "GBP"] },
  { keyword: "GDP", impact: 0.8, currencies: ["USD", "EUR", "GBP", "JPY"] },
  { keyword: "employment", impact: 0.9, currencies: ["USD", "EUR", "GBP", "CAD"] },
  { keyword: "PMI", impact: 0.7, currencies: ["EUR", "GBP", "JPY"] },
  { keyword: "retail sales", impact: 0.6, currencies: ["USD", "GBP", "AUD"] },
  { keyword: "interest rate", impact: 1, currencies: ["USD", "EUR", "GBP", "JPY"] },
];

export const analyzeMarketConditions = (news: NewsItem[]) => {
  const currencyImpact: Record<string, { score: number; mentions: number }> = {};
  const recentNews = news.slice(0, 10); // Analyse des 10 dernières nouvelles

  recentNews.forEach(item => {
    const content = `${item.title} ${item.description}`.toLowerCase();
    
    MARKET_CONDITIONS.forEach(condition => {
      if (content.includes(condition.keyword.toLowerCase())) {
        condition.currencies.forEach(currency => {
          if (!currencyImpact[currency]) {
            currencyImpact[currency] = { score: 0, mentions: 0 };
          }
          currencyImpact[currency].score += condition.impact;
          currencyImpact[currency].mentions++;
        });
      }
    });
  });

  return currencyImpact;
};

export const identifyTradingOpportunities = (currencyImpact: Record<string, { score: number; mentions: number }>) => {
  const pairs: { pair: string; strength: number; confidence: number }[] = [];
  const currencies = Object.keys(currencyImpact);

  for (let i = 0; i < currencies.length; i++) {
    for (let j = i + 1; j < currencies.length; j++) {
      const base = currencies[i];
      const quote = currencies[j];
      
      const baseScore = currencyImpact[base].score / Math.max(1, currencyImpact[base].mentions);
      const quoteScore = currencyImpact[quote].score / Math.max(1, currencyImpact[quote].mentions);
      
      const strength = baseScore - quoteScore;
      const confidence = Math.min(currencyImpact[base].mentions, currencyImpact[quote].mentions) / 10;

      if (Math.abs(strength) >= 0.5 && confidence >= 0.3) {
        pairs.push({
          pair: `${base}/${quote}`,
          strength: strength,
          confidence: confidence
        });
      }
    }
  }

  return pairs.sort((a, b) => Math.abs(b.strength) - Math.abs(a.strength));
};

export const getTradingSuggestion = (opportunities: { pair: string; strength: number; confidence: number }[]) => {
  if (opportunities.length === 0) {
    return "Pas d'opportunités significatives détectées pour le moment.";
  }

  const bestOpp = opportunities[0];
  const direction = bestOpp.strength > 0 ? "LONG" : "SHORT";
  const confidenceLevel = bestOpp.confidence >= 0.7 ? "élevée" : bestOpp.confidence >= 0.5 ? "moyenne" : "modérée";

  return `
    <div class="space-y-2">
      <p><strong class="text-indigo-700">Meilleure opportunité:</strong> ${bestOpp.pair}</p>
      <p><strong class="text-indigo-700">Direction:</strong> ${direction}</p>
      <p><strong class="text-indigo-700">Force du signal:</strong> ${Math.abs(bestOpp.strength).toFixed(2)}</p>
      <p><strong class="text-indigo-700">Confiance:</strong> ${confidenceLevel} (${(bestOpp.confidence * 100).toFixed(1)}%)</p>
    </div>
  `;
};