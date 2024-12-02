export interface NewsItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  creator: string;
  category: string;
  description: string;
  analysis?: {
    sentiment: string;
    currencies: string[];
    pairs: string[];
    opportunity: string;
    volatility: string;
    tradingTime: string;
    reasoning: string;
  };
}