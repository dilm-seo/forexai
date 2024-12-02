import React, { useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSessionsStore } from '../store/sessions';

export default function TradingSessions() {
  const { sessions, isVisible, updateSessions, toggleVisibility } = useSessionsStore();

  useEffect(() => {
    updateSessions();
    const interval = setInterval(updateSessions, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateSessions]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end">
      <div className={`transform transition-all duration-300 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-4 w-64">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Sessions de Trading</h3>
          </div>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.name}
                className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 border border-gray-700/30"
              >
                <div className="flex items-center gap-2">
                  {session.isOpen ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium text-gray-300">
                    {session.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {session.startTime}-{session.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={toggleVisibility}
        className="ml-2 p-2 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 text-primary-400 hover:text-primary-300 transition-colors"
      >
        {isVisible ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
}