import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TradingSession {
  name: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

interface SessionsState {
  sessions: TradingSession[];
  isVisible: boolean;
  updateSessions: () => void;
  toggleVisibility: () => void;
}

export const useSessionsStore = create<SessionsState>()(
  persist(
    (set) => ({
      sessions: [
        { name: 'Sydney', startTime: '22:00', endTime: '07:00', isOpen: false },
        { name: 'Tokyo', startTime: '00:00', endTime: '09:00', isOpen: false },
        { name: 'Londres', startTime: '08:00', endTime: '17:00', isOpen: false },
        { name: 'New York', startTime: '13:00', endTime: '22:00', isOpen: false },
      ],
      isVisible: true,
      updateSessions: () => {
        set((state) => {
          const now = new Date();
          const parisTime = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit',
          }).format(now);

          const currentHour = parseInt(parisTime.split(':')[0], 10);
          const currentMinute = parseInt(parisTime.split(':')[1], 10);
          const currentTimeInMinutes = currentHour * 60 + currentMinute;

          const updatedSessions = state.sessions.map((session) => {
            const startHour = parseInt(session.startTime.split(':')[0], 10);
            const startMinute = parseInt(session.startTime.split(':')[1], 10);
            const endHour = parseInt(session.endTime.split(':')[0], 10);
            const endMinute = parseInt(session.endTime.split(':')[1], 10);

            const startTimeInMinutes = startHour * 60 + startMinute;
            const endTimeInMinutes = endHour * 60 + endMinute;

            let isOpen = false;
            if (endTimeInMinutes > startTimeInMinutes) {
              isOpen = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
            } else {
              isOpen = currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes < endTimeInMinutes;
            }

            return { ...session, isOpen };
          });

          return { sessions: updatedSessions };
        });
      },
      toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
    }),
    {
      name: 'trading-sessions',
    }
  )
);