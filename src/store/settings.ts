import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  model: string;
  prompt: string;
  context: string;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setPrompt: (prompt: string) => void;
  setContext: (context: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      model: 'gpt-4-turbo-preview',
      prompt: `Analysez cette nouvelle du marché forex et fournissez une analyse détaillée incluant:
- Devises concernées
- Paires de devises impactées
- Opportunités de trading
- Sentiment du marché
- Meilleur moment pour trader
- Volatilité attendue
- Raisonnement détaillé`,
      context: `Vous êtes un expert en analyse des marchés forex avec plus de 20 ans d'expérience. 
Votre expertise vous permet d'identifier rapidement les implications des nouvelles économiques sur les différentes paires de devises.`,
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      setPrompt: (prompt) => set({ prompt }),
      setContext: (context) => set({ context }),
    }),
    {
      name: 'forex-settings',
    }
  )
);