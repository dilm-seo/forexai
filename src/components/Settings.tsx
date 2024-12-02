import React from 'react';
import { useSettingsStore } from '../store/settings';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { apiKey, model, prompt, context, setApiKey, setModel, setPrompt, setContext } = useSettingsStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clé API OpenAI
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle OpenAI
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt d'analyse
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contexte système
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}