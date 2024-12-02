export interface RSSFeed {
  rss: {
    channel: {
      item: NewsItem[];
      title: string;
      link: string;
      description: string;
      lastBuildDate: string;
    };
  };
}