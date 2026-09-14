import React from 'react';
import { SessionData } from '@/types/workbook/types';
import { BookOpen, CheckCircle, Flame } from 'lucide-react';
import { stopSpeech } from '@/utils/workbook/audioFeedback';

interface BookletTabsProps {
  sessions: SessionData[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  sessionScores?: Record<string, { total: number; correct: number }>;
}

export const BookletTabs: React.FC<BookletTabsProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  sessionScores = {},
}) => {
  const handleSelect = (sessionId: string) => {
    stopSpeech();
    onSelectSession(sessionId);
  };

  return (
    <>
      {/* Desktop Vertical Tabs (Sticking out of the right edge of the booklet) */}
      <div 
        id="booklet-tabs" 
        className="hidden md:flex flex-col gap-3 absolute -right-8 lg:-right-9 top-20 z-20 select-none"
      >
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const score = sessionScores[session.id];
          const isCompleted = score && score.total > 0 && score.correct === score.total;

          return (
            <button
              key={session.id}
              onClick={() => handleSelect(session.id)}
              title={`${session.title} (${session.level})`}
              className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#39FF14] text-black font-bold text-[10px] py-4 px-2 writing-vertical rounded-r-md shadow-lg translate-x-1 tracking-wider'
                  : 'bg-[#1A1D20] text-[#8A95A5] text-[10px] py-4 px-2 writing-vertical rounded-r-md border-y border-r border-[#8A95A5]/30 hover:text-white hover:border-[#8A95A5]/60 hover:bg-[#121416]'
              }`}
            >
              <span>SESIÓN 0{session.sessionNumber}</span>

              {/* Completion Star or Badge */}
              {isCompleted && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-black text-[#39FF14] flex items-center justify-center shadow">
                  <CheckCircle className="w-2.5 h-2.5" />
                </div>
              )}

              {/* Hover Flyout label */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#121416] border border-[#8A95A5]/40 text-xs px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Sesión {session.sessionNumber}: {session.title}</span>
                  <span className="text-[#39FF14] text-[10px] font-mono bg-[#39FF14]/10 px-1.5 py-0.5 rounded border border-[#39FF14]/20">
                    {session.level}
                  </span>
                </div>
                <div className="text-[10px] text-[#8A95A5] mt-0.5">{session.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Horizontal Tabs Bar */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 mb-3 border-b border-[#8A95A5]/20 select-none">
        <span className="text-xs text-[#8A95A5] font-semibold flex items-center gap-1 shrink-0 mr-1">
          <BookOpen className="w-3.5 h-3.5 text-[#39FF14]" />
          Sesiones:
        </span>
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <button
              key={session.id}
              onClick={() => handleSelect(session.id)}
              className={`px-3 py-1 rounded-md text-xs font-bold shrink-0 transition-all border ${
                isActive
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-md'
                  : 'bg-[#1A1D20] border-[#8A95A5]/30 text-[#8A95A5] hover:text-white'
              }`}
            >
              SESIÓN 0{session.sessionNumber} ({session.level})
            </button>
          );
        })}
      </div>
    </>
  );
};

