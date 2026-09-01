/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Eye, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { UserHierarchyModal } from './UsersMaster';
import { chatToUser } from './MessagingModule';
import identityService from '../services/identityService';

interface QuickChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  senderName?: string;
  timestamp: string;
}

export function QuickChat({ onNavigateToFullChat }: { onNavigateToFullChat: (userId: string) => void }) {
  const { quickChatUser, setQuickChatUser, userEmail, userName, currentRole, addMessage, chats, cargarMensajesChat } = useAppContext();
  const [showDossier, setShowDossier] = useState(false);
  const [messages, setMessages] = useState<QuickChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Crear o encontrar chat directo al abrir
  useEffect(() => {
    if (!quickChatUser || !userEmail) return;

    const directChatId = `DIRECT-${[userEmail, quickChatUser.email].sort().join('_')}`;
    setChatId(directChatId);

    // Buscar si ya existe el chat en el contexto
    const existingChat = chats.find(c => c.id === directChatId);
    if (existingChat && existingChat.messages.length > 0) {
      const mapped: QuickChatMessage[] = existingChat.messages.map(m => ({
        id: m.id,
        text: m.content,
        sender: m.senderId === 'ME' ? 'me' : 'them',
        senderName: m.senderName,
        timestamp: m.timestamp
      }));
      setMessages(mapped);
    } else {
      setMessages([
        { id: 'welcome', text: `Hola, soy ${userName || 'yo'}. ¿En qué puedo apoyarte?`, sender: 'me', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      // Registrar chat en Data Lake si no existe (idempotente — backend hace upsert)
      identityService.registrarChat(
        userEmail,
        directChatId,
        quickChatUser.name || quickChatUser.email,
        'DIRECT',
        [userEmail, quickChatUser.email]
      ).catch(() => {});
    }
  }, [quickChatUser, userEmail, userName, chats]);

  // Auto-navegar al chat completo después de 3 mensajes
  useEffect(() => {
    if (messageCount >= 3 && quickChatUser && chatId) {
      const timer = setTimeout(() => {
        onNavigateToFullChat(chatId);
        setQuickChatUser(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messageCount, quickChatUser, chatId, onNavigateToFullChat, setQuickChatUser]);

  if (!quickChatUser) return null;

  const handleSend = async () => {
    if (!inputText.trim() || !chatId || !userEmail) return;

    const newMsg: QuickChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      senderName: userName || 'Usuario',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setMessageCount(prev => prev + 1);

    // Persistir al Data Lake
    const senderRole = currentRole === 'DIRECTOR' ? 'DIRECTOR' : currentRole === 'DOCENTE' ? 'DOCENTE' : 'ALUMNO';
    addMessage(chatId, {
      id: newMsg.id,
      senderId: 'ME',
      senderName: userName || 'Usuario',
      senderRole: currentRole,
      content: newMsg.text,
      timestamp: newMsg.timestamp,
      isDirector: currentRole === 'DIRECTOR'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 right-6 z-[1000] w-[340px] h-[500px] rounded-[2rem] bg-[#0a0f1a] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#DEFF9A] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#061a1a] flex items-center justify-center text-[#DEFF9A] text-xs font-black">
              {quickChatUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
            </div>
            <div>
              <p className="text-[#061a1a] text-[11px] font-black uppercase tracking-tight leading-none">{quickChatUser.name}</p>
              <p className="text-[#061a1a]/50 text-[8px] font-bold uppercase tracking-widest">DIRECT CHAT</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowDossier(true)} className="p-1.5 hover:bg-[#061a1a]/10 rounded-lg transition-colors">
              <Info size={14} className="text-[#061a1a]/60" />
            </button>
            <button onClick={() => setQuickChatUser(null)} className="p-1.5 hover:bg-[#061a1a]/10 rounded-lg transition-colors">
              <X size={14} className="text-[#061a1a]/60" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[10px] font-medium ${
                msg.sender === 'me'
                  ? 'bg-[#DEFF9A] text-[#061a1a] rounded-br-md'
                  : 'bg-white/10 text-white/80 rounded-bl-md'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[7px] mt-1 ${msg.sender === 'me' ? 'text-[#061a1a]/40' : 'text-white/20'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {messageCount >= 2 && (
            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-[8px] font-bold uppercase tracking-widest animate-pulse">
                Abriendo chat completo...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-[10px] focus:outline-none focus:border-[#DEFF9A]/30"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 bg-[#DEFF9A] text-[#061a1a] rounded-xl hover:scale-105 transition-all disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Dossier Modal */}
        {showDossier && (
          <UserHierarchyModal
            user={chatToUser(quickChatUser)}
            onClose={() => setShowDossier(false)}
            onSave={() => {}}
            onUpdateRole={() => {}}
            onToggleStatus={() => {}}
            onResetADN={() => {}}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
