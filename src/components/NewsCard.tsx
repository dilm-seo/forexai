import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NewsItem } from '../types/news';
import { MessageSquare, ExternalLink, Clock, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import he from 'he';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const formattedDate = format(new Date(news.pubDate), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  const decodedDescription = he.decode(news.description.replace(/<[^>]*>/g, ''));

  const getSentimentColor = (sentiment: string) => {
    if (sentiment.toLowerCase().includes('positif')) return 'text-primary-400';
    if (sentiment.toLowerCase().includes('négatif')) return 'text-secondary-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment.toLowerCase().includes('positif')) return <TrendingUp className="w-4 h-4" />;
    if (sentiment.toLowerCase().includes('négatif')) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-700/50 transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-6 py-5 border-b border-gray-700/50">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-xl font-bold text-white flex-1">{he.decode(news.title)}</h2>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
          <Clock className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 mb-6 line-clamp-3">{decodedDescription}</p>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-700/50"
          >
            <MessageSquare className="w-4 h-4" />
            {showAnalysis ? "Masquer l'analyse" : "Voir l'analyse"}
          </button>
        </div>

        {showAnalysis && news.analysis && (
          <div className="mt-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                {news.analysis.sentiment && getSentimentIcon(news.analysis.sentiment)}
              </div>
              <h3 className="font-bold text-xl text-white">
                Analyse
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm font-semibold text-primary-400 mb-3">Devises concernées</p>
                <div className="flex flex-wrap gap-2">
                  {news.analysis.currencies.map((currency, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary-900/30 text-primary-400 rounded-lg text-sm font-medium border border-primary-700/30">
                      {currency}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm font-semibold text-secondary-400 mb-3">Paires</p>
                <div className="flex flex-wrap gap-2">
                  {news.analysis.pairs.map((pair, i) => (
                    <span key={i} className="px-3 py-1.5 bg-secondary-900/30 text-secondary-400 rounded-lg text-sm font-medium border border-secondary-700/30">
                      {pair}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm font-semibold text-primary-400 mb-2">Sentiment</p>
                <p className={`text-sm font-medium ${getSentimentColor(news.analysis.sentiment)}`}>
                  {news.analysis.sentiment}
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm font-semibold text-primary-400 mb-2">Volatilité</p>
                <p className="text-sm font-medium text-gray-300">{news.analysis.volatility}</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm font-semibold text-primary-400 mb-2">Meilleur moment</p>
                <p className="text-sm font-medium text-gray-300">{news.analysis.tradingTime}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <p className="text-sm font-semibold text-primary-400 mb-2">Opportunité</p>
              <p className="text-sm font-medium text-gray-300">{news.analysis.opportunity}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-sm font-semibold text-primary-400 mb-2">Raisonnement</p>
              <p className="text-sm font-medium text-gray-300">{news.analysis.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}