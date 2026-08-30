/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ChevronRight, 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Calendar,
  Sparkles,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PioneerBadge } from './ui/PioneerBadge';
import { useAppContext } from '../context/AppContext';

interface ExtracurricularModalProps {
  onClose: () => void;
}

export function ExtracurricularModal({ onClose }: ExtracurricularModalProps) {
  const { userProgress, addGlobalEvent, setIsExtracurricularUnlocked } = useAppContext();
  const [accessView, setAccessView] = useState<'info' | 'auth'>('info');
  const [secretKey, setSecretKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const isEligibleByProgress = userProgress >= 80;
  const [availableSpots, setAvailableSpots] = useState(3); // First 10 challenge

  const playEffect = (type: 'fanfare' | 'race' | 'success') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'fanfare') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
    } else if (type === 'race') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
  };

  useEffect(() => {
    playEffect('fanfare');
  }, []);

  const handleClose = () => {
    playEffect('race');
    setTimeout(onClose, 800);
  };

  const handleVerifyKey = () => {
    setIsVerifying(true);
    setError('');
    
    setTimeout(() => {
      if (secretKey.toUpperCase() === 'TECLINGO_VIP') {
        setIsUnlocked(true);
        setIsExtracurricularUnlocked(true);
        playEffect('success');
        
        // Automated Calendar Log
        addGlobalEvent({
          id: Math.random().toString(36).substr(2, 9),
          day: new Date().getDate(),
          title: '📢 Hito Alcanzado: Nuevo Pioneer TECLINGO',
          type: 'TECLINGO',
          description: '¡Alumno_01 ha desbloqueado el acceso de élite y portará la Insignia Pioneer!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          visibility: ['GLOBAL']
        });
      } else {
        setError('Clave inválida. Solicítala a tu Director si ya superaste el 80% de tu curso.');
        setIsVerifying(false);
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-hidden"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#061a1a]/95 backdrop-blur-xl" onClick={handleClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl neo-glass border-[#DEFF9A]/20 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(222,255,154,0.1)] flex flex-col md:flex-row"
      >
         <button onClick={handleClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20">
            <X size={24} />
         </button>

         {/* Left Side: Badge and Status */}
         <div className="md:w-5/12 bg-white/[0.02] border-r border-white/5 p-12 flex flex-col items-center justify-center space-y-8">
            <PioneerBadge />
            
            <div className="text-center space-y-1">
               <h3 className="text-[#DEFF9A] text-xs font-black uppercase tracking-[0.4em]">Insignia Pioneer TECLINGO</h3>
               <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Acceso Exclusivo por Mérito</p>
            </div>

            <div className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Lugares Disponibles</span>
                  <span className="text-[#FBBF24] text-[10px] font-black">{availableSpots}/10</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(10 - availableSpots) * 10}%` }}
                    className="h-full bg-gradient-to-r from-[#FBBF24] to-[#DEFF9A]"
                  />
               </div>
               <p className="text-[8px] font-bold text-white/20 leading-relaxed text-center uppercase tracking-widest leading-loose">
                  Si creías que las herramientas actuales eran geniales, espera a ver lo que un Pioneer puede dominar.
               </p>
            </div>
         </div>

         {/* Right Side: Content and Actions */}
         <div className="md:w-7/12 p-12 flex flex-col justify-center">
            <AnimatePresence mode="wait">
               {isUnlocked ? (
                 <motion.div 
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                 >
                    <div className="w-20 h-20 bg-[#DEFF9A] rounded-full mx-auto flex items-center justify-center text-[#061a1a] shadow-[0_0_50px_rgba(222,255,154,0.4)]">
                       <ShieldCheck size={40} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">¡ACCESO CONCEDIDO!</h2>
                       <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em]">Hito Registrado en Calendario</p>
                    </div>
                    <div className="space-y-4">
                      <button 
                        onClick={() => {
                          handleClose();
                          // The mainboard will see isExtracurricularUnlocked is now true
                        }}
                        className="w-full py-5 rounded-[2rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(222,255,154,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                        Iniciar Exploración <ArrowRight size={18} />
                      </button>
                    </div>
                 </motion.div>
               ) : accessView === 'info' ? (
                 <motion.div 
                   key="info"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">EXTRACURRICULAR <br /><span className="text-cyan-400">ALTO VOLTAJE</span></h2>
                       <p className="text-white/60 text-sm font-medium leading-relaxed">
                          ¿Crees que las herramientas que usas son geniales? ¡Espera a ver lo que este botón esconde! <span className="text-white">Juegos inmersivos, retos de velocidad y actividades de pura adrenalina</span> te esperan.
                       </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 items-center">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                             <Calendar size={20} />
                          </div>
                          <div>
                             <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Vía A: Apertura Oficial</h4>
                             <p className="text-white/20 text-[9px] font-bold">DISPONIBLE EN TEMPORADA VACACIONAL.</p>
                          </div>
                       </div>

                       <div className={`p-6 rounded-3xl border flex gap-6 items-center transition-all ${isEligibleByProgress ? 'bg-[#DEFF9A]/5 border-[#DEFF9A]/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isEligibleByProgress ? 'bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                             <Trophy size={20} />
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-1">
                                <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Vía B: Mérito Académico</h4>
                                <span className={`text-[8px] font-black uppercase ${isEligibleByProgress ? 'text-[#DEFF9A]' : 'text-white/20'}`}>
                                   {userProgress}% / 80%
                                </span>
                             </div>
                             <p className="text-white/20 text-[9px] font-bold">DESBLOQUEA HOY CON CLAVE DE DIRECTOR.</p>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6">
                       <button 
                         onClick={() => setAccessView('auth')}
                         disabled={!isEligibleByProgress}
                         className="w-full py-5 rounded-[2rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_0_40px_rgba(222,255,154,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:scale-100"
                       >
                          Ingresar Clave <ArrowRight size={18} />
                       </button>
                       <p className="mt-4 text-center text-white/10 text-[8px] font-black uppercase tracking-[0.3em]">
                          {isEligibleByProgress ? '¡RECLAMA TU LUGAR EN EL CALENDARIO!' : 'SIGUE ESFORZÁNDOTE PARA DESBLOQUEAR EL RETO'}
                       </p>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="auth"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <button onClick={() => setAccessView('info')} className="flex items-center gap-2 text-white/20 hover:text-white transition-colors">
                       <ChevronRight size={16} className="rotate-180" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Regresar</span>
                    </button>

                    <div className="space-y-4">
                       <h2 className="text-3xl font-black text-white uppercase tracking-tight">VERIFICAR <span className="text-[#DEFF9A]">AUTORIZACIÓN</span></h2>
                       <p className="text-white/40 text-xs font-medium leading-relaxed">
                          Has superado el 80% de progreso. Ingresa la Clave Maestra proporcionada por tu Director para reclamar tu Insignia Pioneer.
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-white/20 text-[9px] font-black uppercase tracking-widest ml-4">Clave de Director</label>
                          <div className="relative">
                             <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-[#DEFF9A]/40" size={18} />
                             <input 
                               type="text"
                               value={secretKey}
                               onChange={(e) => setSecretKey(e.target.value)}
                               placeholder="•••• •••• ••••"
                               autoFocus
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-black uppercase tracking-[0.4em] focus:outline-none focus:border-[#DEFF9A]/50 focus:ring-1 focus:ring-[#DEFF9A]/20 transition-all placeholder:text-white/5"
                             />
                          </div>
                          {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[9px] font-black uppercase ml-4">{error}</motion.p>
                          )}
                       </div>

                       <button 
                         onClick={handleVerifyKey}
                         disabled={!secretKey || isVerifying}
                         className="w-full py-6 rounded-[2rem] bg-[#DEFF9A] text-[#061a1a] text-xs font-black uppercase tracking-widest shadow-[0_0_50px_rgba(222,255,154,0.4)] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                       >
                          {isVerifying ? (
                            <Zap size={20} className="animate-spin" />
                          ) : (
                            <>VALIDAR Y ANUNCIAR <ShieldCheck size={20} /></>
                          )}
                       </button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </motion.div>
    </motion.div>
  );
}
