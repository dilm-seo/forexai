import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { RSSFeed, NewsItem } from '../types';
import { useSettingsStore } from '../store/settings';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const RSS_URL = 'https://www.forexlive.com/feed/news/';

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(RSS_URL)}`);
    const parser = new XMLParser({ ignoreAttributes: false });
    const feed: RSSFeed = parser.parse(response.data);
    return feed.rss.channel.item;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const analyzeNews = async (newsItem: NewsItem) => {
  const settings = useSettingsStore.getState();
  const openai = new OpenAI({ apiKey: settings.apiKey });
  
  try {
    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: settings.context },
        { role: 'user', content: `${settings.prompt}\n\nArticle:\n${newsItem.title}\n${newsItem.description}` }
      ],
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing news:', error);
    throw error;
  }
};