import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import Settings from './components/Settings';
import ChatBot from './components/ChatBot';
import TradingSessions from './components/TradingSessions';
import Logo from './components/Logo';
import { Settings as SettingsIcon, Newspaper } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex-shrink-0">
                  <Logo />
                </Link>
                <div className="hidden sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="flex items-center px-4 text-gray-300 hover:text-primary-400 border-b-2 border-transparent hover:border-primary-400 transition-colors"
                  >
                    <Newspaper className="w-5 h-5 mr-2" />
                    Actualités
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 text-gray-300 hover:text-primary-400 border-b-2 border-transparent hover:border-primary-400 transition-colors"
                  >
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Paramètres
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <TradingSessions />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;