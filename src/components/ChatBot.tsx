import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, X, ChevronDown, Sparkles, History, Bookmark, ArrowRight } from 'lucide-react';
import { getChatbotResponse } from '../services/chatbot';
import { useSettingsStore } from '../store/settings';
import { CostEstimate } from '../utils/openai';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRESET_QUESTIONS = [
  "Quelles sont les meilleures opportunités de trading actuellement ?",
  "Identifiez les paires de devises avec le plus fort potentiel",
  "Analysez les conditions du marché pour EUR/USD",
  "Quels sont les mouvements les plus probables sur les principales paires ?",
  "Y a-t-il des signaux techniques importants à surveiller ?",
  "Quelles devises montrent le plus de force ?",
  "Identifiez les meilleures configurations risk/reward"
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  costEstimate?: CostEstimate;
  bookmarked?: boolean;
  suggestions?: string[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const { apiKey } = useSettingsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg
    ));
  };

  const sendMessage = async (text: string) => {
    if (!apiKey) {
      setMessages(prev => [...prev, 
        { id: Date.now().toString(), text, isUser: true, timestamp: new Date() },
        { id: (Date.now() + 1).toString(), text: "Veuillez configurer votre clé API OpenAI dans les paramètres.", isUser: false, timestamp: new Date() }
      ]);
      setInput('');
      return;
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), text, isUser: true, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await getChatbotResponse(text);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        text: response.content, 
        isUser: false, 
        timestamp: new Date(),
        costEstimate: response.costEstimate,
        suggestions: response.suggestions
      }]);
      setTotalCost(prev => prev + response.costEstimate.totalCost);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur est survenue. Veuillez réessayer.", 
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 rounded-t-2xl">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold">Assistant Trading</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-white/80 text-xs flex items-center justify-between">
              <span>Coût total: {totalCost.toFixed(4)}€</span>
              <button 
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {showSuggestions ? 'Masquer suggestions' : 'Afficher suggestions'}
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative rounded-2xl p-3 max-w-[80%] ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' 
                    : 'bg-gray-100'
                }`}>
                  {!msg.isUser && (
                    <button
                      onClick={() => toggleBookmark(msg.id)}
                      className="absolute -left-6 top-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${msg.bookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                    </button>
                  )}
                  {msg.isUser ? (
                    <p className="text-sm">{msg.text}</p>
                  ) : (
                    <div>
                      <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text }} />
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <p className="text-xs font-medium text-indigo-600">Questions suggérées :</p>
                          {msg.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(suggestion)}
                              className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors w-full text-left"
                            >
                              <ArrowRight className="w-3 h-3" />
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.costEstimate && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                          Coût: {msg.costEstimate.totalCost.toFixed(4)}€
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {format(msg.timestamp, 'HH:mm', { locale: fr })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            {showSuggestions && (
              <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto">
                {PRESET_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="text-xs bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 px-3 py-1.5 rounded-full hover:from-indigo-100 hover:to-violet-100 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {q}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                disabled={isLoading}
                className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                onKeyPress={(e) => e.key === 'Enter' && input && sendMessage(input)}
              />
              <button
                onClick={() => input && sendMessage(input)}
                disabled={isLoading || !input}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-2 rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}