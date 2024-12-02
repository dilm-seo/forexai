import OpenAI from 'openai';
import { useSettingsStore } from '../store/settings';
import { NewsItem } from '../types/news';
import { estimateCost, CostEstimate } from '../utils/openai';
import { analyzeMarketConditions, identifyTradingOpportunities, getTradingSuggestion } from './analysis';

let newsContext: NewsItem[] = [];

export const updateNewsContext = (news: NewsItem[]) => {
  newsContext = news;
};

const formatNewsForContext = (news: NewsItem[]) => {
  return news
    .slice(0, 5)
    .map((item, index) => `
Article ${index + 1}:
Titre: ${item.title}
Date: ${item.pubDate}
Description: ${item.description}
    `.trim())
    .join('\n\n');
};

const formatResponse = (content: string): string => {
  const sections = content.split('\n').filter(line => line.trim());
  
  return `
<div class="space-y-2">
  ${sections.map(section => {
    if (section.startsWith('-') || section.startsWith('•')) {
      return `<p class="flex gap-2"><span class="text-indigo-500">•</span>${section.substring(1).trim()}</p>`;
    }
    if (section.includes(':')) {
      const [title, value] = section.split(':');
      return `<p><strong class="text-indigo-700">${title}:</strong> ${value.trim()}</p>`;
    }
    return `<p>${section}</p>`;
  }).join('')}
</div>`;
};

const enhanceResponseWithAnalysis = (content: string, message: string): string => {
  if (message.toLowerCase().includes('opportunité') || 
      message.toLowerCase().includes('trading') || 
      message.toLowerCase().includes('trade')) {
    const marketConditions = analyzeMarketConditions(newsContext);
    const opportunities = identifyTradingOpportunities(marketConditions);
    const suggestion = getTradingSuggestion(opportunities);

    return `
      ${content}
      <div class="mt-4 pt-4 border-t border-indigo-100">
        <p class="font-medium text-indigo-800 mb-2">Analyse approfondie:</p>
        ${suggestion}
      </div>
    `;
  }
  return content;
};

interface ChatResponse {
  content: string;
  costEstimate: CostEstimate;
  suggestions?: string[];
}

const generateSuggestions = async (message: string, response: string): Promise<string[]> => {
  const settings = useSettingsStore.getState();
  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const suggestionResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Vous êtes un assistant spécialisé dans le trading forex. Générez 3 questions de suivi pertinentes basées sur la conversation précédente. Les questions doivent être courtes, précises et orientées trading.'
        },
        {
          role: 'user',
          content: `Question de l'utilisateur: "${message}"\nRéponse précédente: "${response}"\n\nGénérez 3 questions de suivi pertinentes.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const suggestions = suggestionResponse.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3) || [];

    return suggestions;
  } catch (error) {
    console.error('Erreur lors de la génération des suggestions:', error);
    return [];
  }
};

export const getChatbotResponse = async (message: string): Promise<ChatResponse> => {
  const settings = useSettingsStore.getState();
  
  if (!settings.apiKey) {
    throw new Error('Clé API OpenAI non configurée');
  }

  const openai = new OpenAI({
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true
  });

  const messages = [
    {
      role: 'system',
      content: `${settings.context}\n\nVous avez accès aux dernières nouvelles du marché forex. Fournissez des réponses courtes et précises.`
    },
    {
      role: 'user',
      content: `${message}\n\nBasé sur ces nouvelles:\n${formatNewsForContext(newsContext)}`
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: settings.model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    let content = response.choices[0].message.content || 'Désolé, je n\'ai pas pu analyser cette demande.';
    content = formatResponse(content);
    content = enhanceResponseWithAnalysis(content, message);
    
    const costEstimate = estimateCost(
      settings.model,
      messages,
      content.length
    );

    const suggestions = await generateSuggestions(message, content);

    return {
      content,
      costEstimate,
      suggestions
    };
  } catch (error) {
    console.error('Erreur lors de la communication avec OpenAI:', error);
    throw new Error('Erreur lors de l\'analyse. Veuillez réessayer.');
  }
};