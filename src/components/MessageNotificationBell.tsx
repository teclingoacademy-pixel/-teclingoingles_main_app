/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { Bell, MessageCircle, X, Users, Crown, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

interface MessageNotificationBellProps {
  onNavigateToChat: (chatId: string) => void;
  accentColor?: string;
}

export function MessageNotificationBell({ onNavigateToChat, accentColor = '#DEFF9A' }: MessageNotificationBellProps) {
  const { chats, userEmail, markChatAsRead } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const chatsWithUnread = useMemo(() => {
    return chats
      .filter(c => c.unreadCount > 0)
      .sort((a, b) => b.unreadCount - a.unreadCount);
  }, [chats]);

  const totalUnread = chatsWithUnread.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  const handleChatClick = (chatId: string) => {
    markChatAsRead(chatId);
    setExpanded(false);
    onNavigateToChat(chatId);
  };

  if (!userEmail) return null;

  if (minimized) {
    return (
      <div ref={containerRef} className="fixed top-4 right-4 z-[200]">
        <button
          onClick={() => { setMinimized(false); setExpanded(true); }}
          title="Mostrar mensajes"
          className="relative w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all shadow-lg"
        >
          <MessageSquare size={16} />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-[#061a1a] animate-pulse">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-[200]">
      <div className="flex flex-col items-end gap-2">
        {/* Bell Button */}
        <button
          onClick={() => setExpanded(o => !o)}
          title="Mensajes"
          aria-label="Mensajes"
          className="relative w-11 h-11 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all active:scale-95 shadow-lg"
        >
          <Bell size={18} />
          <AnimatePresence>
            {totalUnread > 0 && (
              <motion.span
                key={totalUnread}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.6)] border-2 border-[#061a1a]"
              >
                {totalUnread > 99 ? '99+' : totalUnread}
              </motion.span>
            )}
          </AnimatePresence>
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
          )}
        </button>

        {/* Minimize Button */}
        <button
          onClick={() => { setMinimized(true); setExpanded(false); }}
          title="Minimizar"
          className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
        >
          <ChevronUp size={12} />
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="w-[min(360px,calc(100vw-2rem))] max-h-[60vh] bg-[#0a0f1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} style={{ color: accentColor }} />
                  <span className="text-white text-[11px] font-black uppercase tracking-widest">
                    Mensajes
                  </span>
                  {totalUnread > 0 && (
                    <span className="text-[8px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                      {totalUnread} NUEVOS
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-white/30 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[50vh] custom-scrollbar">
                {chatsWithUnread.length === 0 ? (
                  <div className="py-10 px-6 text-center space-y-3">
                    <MessageSquare size={28} className="text-white/10 mx-auto" />
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                      Sin mensajes nuevos
                    </p>
                    <p className="text-white/15 text-[9px]">
                      Tus conversaciones estan al dia
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {chatsWithUnread.map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className="w-full text-left px-4 py-3 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors flex items-start gap-3 group"
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/20 transition-all">
                            {chat.type === 'GROUP' ? <Users size={16} /> :
                             chat.type === 'GLOBAL' ? <Crown size={16} /> :
                             <MessageCircle size={16} />}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center border-2 border-[#0a0f1a]">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className="text-white text-[11px] font-black uppercase tracking-tight truncate group-hover:text-[color:var(--accent)] transition-colors" style={{ '--accent': accentColor } as React.CSSProperties}>
                              {chat.name}
                            </p>
                            <span className="text-[8px] text-white/30 uppercase tracking-widest shrink-0">
                              {chat.lastMessage?.slice(0, 20) || ''}
                            </span>
                          </div>
                          <p className="text-white/50 text-[10px] truncate leading-snug">
                            {chat.lastMessage || 'Nuevo mensaje'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                              chat.type === 'GLOBAL' ? 'bg-orange-500/20 text-orange-400' :
                              chat.type === 'GROUP' ? 'bg-[#DEFF9A]/20 text-[#DEFF9A]' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {chat.type}
                            </span>
                            <span className="text-white/20 text-[8px]">
                              {chat.unreadCount} {chat.unreadCount === 1 ? 'mensaje' : 'mensajes'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {chatsWithUnread.length > 0 && (
                <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
                  <p className="text-white/30 text-[8px] text-center font-bold uppercase tracking-widest">
                    Click en un chat para abrirlo
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
