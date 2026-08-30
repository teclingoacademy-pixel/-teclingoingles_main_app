/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Zap, 
  Leaf, 
  History, 
  Medal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { obtenerLogros } from '../services/identityService';
import { useAppContext } from '../context/AppContext';

interface Achievement {
  id: string;
  category: 'TEACHER' | 'PLANET' | 'HISTORY' | 'STUDENT';
  title: string;
  description: string;
  value: string;
  icon: any;
  accent: 'green' | 'cyan' | 'orange' | 'purple';
  isLeader?: boolean;
  studentName?: string;
  createdAt?: string;
}

const defaultMockAchievements: any[] = [
  { 
    id: '1', 
    category: 'STUDENT', 
    title: 'The Bridge: Elite Pronunciation', 
    description: 'Alcanzada precisión vocal del 98% en escenarios de viaje.', 
    value: 'Nivel 10', 
    iconName: 'Zap',
    accent: 'green',
    isLeader: true,
    studentName: 'Juan Pérez',
    createdAt: 'HOY'
  },
  { 
    id: '2', 
    category: 'STUDENT', 
    title: 'Streak: Burning Flame', 
    description: '21 días consecutivos de interacción con el ecosistema IA.', 
    value: 'Legendario', 
    iconName: 'Sparkles',
    accent: 'orange',
    isLeader: true,
    studentName: 'Sofía Méndez',
    createdAt: 'AYER'
  },
  { 
    id: '3', 
    category: 'PLANET', 
    title: 'Zero Paper Master', 
    description: 'Reducción de 2.5 toneladas de huella de carbono este ciclo.', 
    value: '-92% Papel', 
    iconName: 'Leaf',
    accent: 'cyan',
    studentName: 'Mateo Sandoval',
    createdAt: 'HACE 2 DÍAS'
  },
  { 
    id: '4', 
    category: 'STUDENT', 
    title: 'Grammar Fixer Expert', 
    description: '100 correcciones de texto aplicadas con éxito.', 
    value: 'Silver Med', 
    iconName: 'Medal',
    accent: 'purple',
    studentName: 'Valentina Rojas',
    createdAt: 'HACE 3 DÍAS'
  },
];

const recentFeed = [
  { user: 'Martha S.', text: 'Alcanzó Nivel B2 con 98% de precisión vocal', time: '12m' },
  { user: 'Pedro J.', text: 'Completó 50 horas de práctica en The Bridge', time: '45m' },
  { user: 'Inst. TECLINGO', text: 'Nueva reducción de costos operativos: $12k USD', time: '2h' },
];

export function AchievementWall() {
  const { userEmail } = useAppContext();
  const [list, setList] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        // 1. Intentar cargar desde el Lake
        if (userEmail) {
          const logrosLake = await obtenerLogros(userEmail);
          if (logrosLake.length > 0) {
            const mapped = logrosLake.map((item: any) => {
              let iconComp = Award;
              const iconName = item.iconName || item.icon_name || 'Award';
              if (iconName === 'Zap') iconComp = Zap;
              else if (iconName === 'Star') iconComp = Star;
              else if (iconName === 'Trophy') iconComp = Trophy;
              else if (iconName === 'Leaf') iconComp = Leaf;
              else if (iconName === 'Medal') iconComp = Medal;
              else if (iconName === 'Sparkles') iconComp = Sparkles;
              else if (iconName === 'History') iconComp = History;
              return {
                id: item.id || item.logro_id,
                category: item.app_origen || 'STUDENT',
                title: item.titulo || item.title || 'Logro',
                description: item.descripcion || item.description || '',
                value: item.valor || item.value || '',
                icon: iconComp,
                accent: item.accent || 'green',
                studentName: item.studentName || '',
                createdAt: item.fecha || item.created_at || ''
              };
            });
            setList(mapped);
            return;
          }
        }

        // 2. Fallback: localStorage
        const saved = localStorage.getItem('library_student_achievements');
        let rawList = defaultMockAchievements;
        if (saved) {
          rawList = JSON.parse(saved);
        }

        const seen = new Set<string>();
        const uniqueList: any[] = [];
        for (const item of rawList) {
          let id = item.id;
          if (!id || seen.has(id)) {
            id = 'ach_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
          }
          seen.add(id);
          uniqueList.push({ ...item, id });
        }

        const mapped = uniqueList.map((item: any) => {
          let iconComp = Award;
          if (item.iconName === 'Zap') iconComp = Zap;
          else if (item.iconName === 'Star') iconComp = Star;
          else if (item.iconName === 'Trophy') iconComp = Trophy;
          else if (item.iconName === 'Leaf') iconComp = Leaf;
          else if (item.iconName === 'Medal') iconComp = Medal;
          else if (item.iconName === 'Sparkles') iconComp = Sparkles;
          else if (item.iconName === 'History') iconComp = History;
          return { ...item, icon: iconComp };
        });

        setList(mapped);
        localStorage.setItem('library_student_achievements', JSON.stringify(uniqueList));
      } catch (e) {
        console.error('[AchievementWall] Error loading:', e);
      }
    };

    loadAchievements();
  }, [userEmail]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-12 gap-8 pb-32 text-left"
    >
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Reconocimiento Institucional</h2>
            <h1 className="text-4xl font-black tracking-tighter text-white bevel-text uppercase tracking-tight leading-none mb-1">Muro de Logros</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Cada hito es una medalla digital 3D grabada en tu perfil.</p>
          </div>
          
          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10">
             <div className="text-right">
                <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Impacto</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-3xl font-black text-[#DEFF9A] leading-none">{list.length}</p>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Alcanzados</p>
                </div>
             </div>
             <Trophy size={40} className="text-[#F59E0B] shadow-[0_0_30px_#F59E0B] opacity-50" />
          </div>
        </header>

        {list.length === 0 ? (
          <div className="py-24 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01]">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">No hay medallas asignadas actualmente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {list.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className={`relative group rounded-[2.5rem] p-8 border overflow-hidden transition-all duration-500 ${
                  item.isLeader 
                    ? 'bg-gradient-to-br from-white/[0.08] to-white/0 border-[#DEFF9A]/30 shadow-[0_20px_50px_rgba(222,255,154,0.05)]' 
                    : 'bg-white/[0.02] border-white/10'
                }`}
              >
                {/* Shine effect for leaders */}
                {item.isLeader && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#DEFF9A]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                )}
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl ${item.accent === 'green' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : item.accent === 'cyan' ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : item.accent === 'orange' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-purple-500/10 text-purple-400'}`}>
                      {item.icon ? <item.icon size={32} /> : <Award size={32} />}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Métrica</p>
                      <p className={`text-xl font-black ${item.accent === 'green' ? 'text-[#DEFF9A]' : item.accent === 'cyan' ? 'text-[#22D3EE]' : item.accent === 'orange' ? 'text-[#F59E0B]' : 'text-purple-400'} bevel-text`}>
                        {item.value}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#DEFF9A]/10 text-[#DEFF9A] text-[8px] font-mono leading-none tracking-wider uppercase font-black">
                        {item.studentName || 'GLOBAL'}
                      </span>
                      {item.createdAt && (
                        <span className="text-white/20 text-[8px] font-bold uppercase">{item.createdAt}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">{item.title}</h3>
                    <p className="text-white/40 text-xs font-medium leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={`${item.id}-avatar-${i}`} className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#061a1a]" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#061a1a] flex items-center justify-center text-[10px] text-white/40 font-bold">+12</div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#DEFF9A]/60 hover:text-[#DEFF9A] transition-colors">
                      Ver Detalles <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-3">
        <GlassCard title="Últimos Logros" icon={Sparkles} accent="green">
          <div className="space-y-6">
            {recentFeed.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#DEFF9A]/20 transition-all overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-[0.1em]">{log.user}</span>
                   <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{log.time}</span>
                </div>
                <p className="text-[11px] text-white/60 font-medium leading-snug">{log.text}</p>
                
                {/* Confetti Animation Placeholder Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="absolute top-0 left-1/4 w-1 h-1 bg-[#DEFF9A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                   <div className="absolute top-2 left-3/4 w-1 h-1 bg-[#22D3EE] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                   <div className="absolute bottom-4 left-1/2 w-1 h-1 bg-[#F59E0B] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </motion.div>
            ))}
            
            <button className="w-full py-4 mt-4 rounded-2xl border border-dashed border-white/10 text-white/20 text-[10px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white/40 transition-all">
              Cargar Más Histórico
            </button>
          </div>
        </GlassCard>

        <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-[#DEFF9A]/20 to-transparent border border-[#DEFF9A]/20 text-center space-y-4">
           <div className="w-16 h-16 rounded-full bg-[#DEFF9A] shadow-[0_0_30px_#DEFF9A80] mx-auto flex items-center justify-center text-[#061a1a]">
              <Trophy size={32} />
           </div>
           <h4 className="text-white text-lg font-black uppercase tracking-tighter">Líder Semanal</h4>
           <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Inmersion Hub Dallas</p>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                className="h-full bg-[#DEFF9A]"
              />
           </div>
           <p className="text-[10px] text-[#DEFF9A] font-black uppercase tracking-widest">850 Puntos de Reducción CO2</p>
        </div>
      </div>
    </motion.div>
  );
}
