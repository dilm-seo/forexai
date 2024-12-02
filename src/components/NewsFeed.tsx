import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types/news';
import { fetchNews } from '../utils/api';
import NewsCard from './NewsCard';
import { updateNewsContext } from '../services/chatbot';
import { analyzeMarketConditions } from '../services/analysis';
import CurrencyStrength from './CurrencyStrength';
import Hero from './Hero';

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currencyImpact, setCurrencyImpact] = useState<Record<string, { score: number; mentions: number }>>({});

  const loadNews = async () => {
    try {
      const items = await fetchNews();
      setNews(items);
      updateNewsContext(items);
      const impact = analyzeMarketConditions(items);
      setCurrencyImpact(impact);
    } catch (err) {
      setError('Erreur lors du chargement des nouvelles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CurrencyStrength 
          currencyImpact={currencyImpact}
          onRefresh={loadNews}
          isLoading={loading}
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={`${item.guid}-${item.pubDate}`} news={item} />
          ))}
        </div>
      </div>
    </div>
  );
}