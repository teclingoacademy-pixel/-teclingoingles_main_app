/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { SafeResponsiveContainer } from './SafeResponsiveContainer';
import { 
  Search, 
  Filter, 
  Layers, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  GraduationCap,
  Calendar,
  Zap,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

interface AcademicActivityProps {
  role: 'DIRECTOR' | 'DOCENTE';
}

const skillMatrixData = [
  { skill: 'Speaking', level: 65, color: '#DEFF9A', trend: '+12%' },
  { skill: 'Listening', level: 82, color: '#4ADE80', trend: '+5%' },
  { skill: 'Reading', level: 74, color: '#22D3EE', trend: '+8%' },
  { skill: 'Writing', level: 58, color: '#F59E0B', trend: '-2%' },
  { skill: 'Grammar', level: 71, color: '#8B5CF6', trend: '+15%' },
];

const toolImpactData = [
  { name: 'The Bridge', value: 35, color: '#DEFF9A' },
  { name: 'AR Portal', value: 25, color: '#22D3EE' },
  { name: 'AI Tutor', value: 20, color: '#4ADE80' },
  { name: 'Listening Lab', value: 15, color: '#F59E0B' },
  { name: 'Grammar Fixer', value: 5, color: '#8B5CF6' },
];

const learningCurveData = [
  { week: 'W1', value: 10 },
  { week: 'W2', value: 18 },
  { week: 'W3', value: 32 },
  { week: 'W4', value: 28 },
  { week: 'W5', value: 45 },
  { week: 'W6', value: 58 },
  { week: 'W7', value: 72 },
  { week: 'W8', value: 85 },
];

const getDynamicStats = (groupId: string) => {
  if (groupId === 'all') {
    return {
      skillMatrix: skillMatrixData,
      toolImpact: toolImpactData,
      learningCurve: learningCurveData,
      averageScore: '70.4 Advanced',
      readiness: 82,
    };
  }

  // Deterministic calculations based on Group ID to construct highly realistic mock metrics
  let hash = 0;
  for (let i = 0; i < groupId.length; i++) {
    hash += groupId.charCodeAt(i);
  }

  const offset = (hash % 14) - 7; // range -7 to +6

  const skillMatrix = skillMatrixData.map(item => {
    let newLevel = Math.min(100, Math.max(40, item.level + offset));
    if (item.skill === 'Speaking') {
      newLevel = Math.min(100, Math.max(30, item.level + (hash % 16) - 8));
    }
    return {
      ...item,
      level: newLevel,
      trend: offset >= 0 ? `+${Math.abs(offset) + 3}%` : `-${Math.abs(offset) + 1}%`
    };
  });

  const toolImpact = toolImpactData.map((item, idx) => {
    let val = item.value;
    if (idx === 0) val = Math.max(10, item.value + offset);
    else if (idx === 1) val = Math.max(10, item.value - offset);
    return { ...item, value: val };
  });

  const learningCurve = learningCurveData.map((item, idx) => {
    const valOffset = Math.round(offset * (idx / learningCurveData.length));
    return {
      ...item,
      value: Math.min(100, Math.max(5, item.value + valOffset))
    };
  });

  const readiness = Math.min(100, Math.max(50, 82 + offset));
  const avgVal = Math.round(70.4 + offset * 0.8);
  const averageScore = `${avgVal}% ${avgVal >= 75 ? 'Advanced Plus' : avgVal >= 65 ? 'Advanced' : 'Intermediate'}`;

  return {
    skillMatrix,
    toolImpact,
    learningCurve,
    averageScore,
    readiness,
  };
};

export function StudentAcademicActivity({ role }: AcademicActivityProps) {
  const { groups } = useAppContext();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentStats = getDynamicStats(selectedGroupId);

  const alerts = [
    { type: 'risk', title: 'Rezago en Speaking', desc: 'Grupo A1-104 muestra 15% menos progreso este mes.', tag: 'CRÍTICO' },
    { type: 'star', title: 'Alto Engagement', desc: 'El 92% del Grupo B2-201 completó sus sesiones de AR Portal.', tag: 'DOCENTE DESTACADO' },
    { type: 'warning', title: 'Writing Block', desc: '3 alumnos de 5to Semestre requieren refuerzo en conectores.', tag: 'ACCIÓN SUGERIDA' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Filter Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
            {role === 'DIRECTOR' ? 'Actividad Global Académica' : 'Actividad de Mis Grupos'}
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Business Intelligence Engine v.2.0</p>
        </div>

        <div className="flex flex-wrap gap-4 p-2 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl items-center">
           <div className="flex items-center gap-2 pl-3">
             <Users size={14} className="text-[#DEFF9A]" />
             <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Grupo:</span>
           </div>
           
           <div className="relative flex items-center">
             <select 
               className="appearance-none bg-transparent pr-8 pl-1 py-1 text-[10px] font-black uppercase tracking-widest text-[#4ADE80] focus:outline-none cursor-pointer transition-colors"
               value={selectedGroupId}
               onChange={(e) => setSelectedGroupId(e.target.value)}
               style={{ colorScheme: 'dark' }}
             >
                <option value="all" className="bg-[#111215] text-[#4ADE80]">🌎 Todos los Grupos (Global)</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id} className="bg-[#111215] text-white">
                     {g.name} — {g.level}
                  </option>
                ))}
             </select>
             <div className="absolute right-2 pointer-events-none text-white/40">
               <ChevronRight size={10} className="rotate-90" />
             </div>
           </div>

           <div className="h-6 w-px bg-white/10" />

           <div className="relative flex items-center mr-2">
              <Search className="absolute left-4 text-white/20" size={14} />
              <input 
                placeholder="BUSCAR ALUMNO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[9px] font-black uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-[#DEFF9A]/30 transition-all w-48"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Progress Matrix (5 Skills) */}
        <div className="col-span-12 lg:col-span-8">
           <GlassCard title="Master Skill Matrix" icon={Layers} accent="green">
              <div className="space-y-8 mt-4">
                 {currentStats.skillMatrix.map((item) => (
                   <div key={item.skill} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <div className="flex items-center gap-3">
                            <span className="text-white text-xs font-black uppercase tracking-widest">{item.skill}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${item.trend.startsWith('+') ? 'bg-[#DEFF9A]/10 text-[#DEFF9A]' : 'bg-red-500/10 text-red-400'}`}>
                               {item.trend}
                            </span>
                         </div>
                         <span className="text-white font-black text-xl">{item.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.level}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="h-full rounded-full shadow-[0_0_15px_rgba(222,255,154,0.3)]"
                           style={{ backgroundColor: item.color }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#DEFF9A]/10 text-[#DEFF9A]">
                       <Trophy size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Puntaje Promedio</p>
                       <p className="text-white text-lg font-black uppercase tracking-tighter">{currentStats.averageScore}</p>
                    </div>
                 </div>
                 <button className="text-[9px] font-black text-[#DEFF9A] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">Ver Reporte Detallado</button>
              </div>
           </GlassCard>
        </div>

        {/* Tool Insights */}
        <div className="col-span-12 lg:col-span-4">
           <GlassCard title="AI Tool Impact" icon={Sparkles} accent="cyan">
              <div className="h-[280px] w-full mt-6">
                 <SafeResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={currentStats.toolImpact}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                       >
                          {currentStats.toolImpact.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                       <Tooltip 
                        contentStyle={{ backgroundColor: '#0a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900' }}
                       />
                    </PieChart>
                 </SafeResponsiveContainer>
              </div>
              <div className="space-y-3 mt-6">
                 {currentStats.toolImpact.map((tool) => (
                   <div key={tool.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.color }} />
                         <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{tool.name}</span>
                      </div>
                      <span className="text-white text-[10px] font-black">{tool.value}%</span>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>

        {/* Trends & Learning Curve */}
        <div className="col-span-12 lg:col-span-9">
           <GlassCard title="Learning Curve Evolution" icon={TrendingUp} accent="cyan">
              <div className="h-[350px] w-full mt-8">
                 <SafeResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentStats.learningCurve}>
                       <defs>
                          <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis 
                         dataKey="week" 
                         stroke="#ffffff20" 
                         fontSize={10} 
                         tickLine={false} 
                         axisLine={false} 
                       />
                       <YAxis 
                         stroke="#ffffff20" 
                         fontSize={10} 
                         tickLine={false} 
                         axisLine={false} 
                       />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0a1a1a', border: '1px solid #8B5CF620', borderRadius: '12px' }}
                         itemStyle={{ color: '#8B5CF6', fontSize: '12px' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke="#8B5CF6" 
                         fillOpacity={1} 
                         fill="url(#colorCurve)" 
                         strokeWidth={4}
                         dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#061a1a' }}
                       />
                    </AreaChart>
                 </SafeResponsiveContainer>
              </div>
           </GlassCard>
        </div>

        {/* Certification Readiness & Alarms */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
           {/* Readiness Dial */}
           <div className="p-8 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-2 text-white/40">
                    <GraduationCap size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Certification Readiness</span>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-white italic">{currentStats.readiness}<span className="text-2xl">%</span></span>
                 </div>
                 <p className="text-white/30 text-[9px] font-bold leading-relaxed">Proyeccón IA para Oxford Test of English.</p>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div 
                      animate={{ width: `${currentStats.readiness}%` }}
                      className="h-full bg-white shadow-[0_0_10px_white]"
                    />
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -translate-y-1/2 translate-x-1/2 rounded-full" />
           </div>

           {/* AI Alarms */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-white/20 text-[9px] font-black uppercase tracking-widest">Notificaciones de Data Cloud</h4>
                 <Zap size={12} className="text-[#DEFF9A]" />
              </div>
              {alerts.map((alert, i) => (
                <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start group">
                   <div className={`mt-1 shrink-0 ${alert.type === 'risk' ? 'text-red-400' : alert.type === 'star' ? 'text-[#DEFF9A]' : 'text-blue-400'}`}>
                      {alert.type === 'risk' ? <AlertCircle size={16} /> : alert.type === 'star' ? <Trophy size={16} /> : <Zap size={16} />}
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <h5 className="text-white text-[10px] font-black uppercase tracking-tight">{alert.title}</h5>
                         <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full bg-white/5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{alert.tag}</span>
                      </div>
                      <p className="text-[9px] text-white/30 font-medium leading-relaxed">{alert.desc}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Director Exclusive: Group Ranking */}
           {role === 'DIRECTOR' && (
             <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-[#DEFF9A]/20">
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Ranking Institucional</h4>
                <div className="space-y-4">
                   {[
                     { name: 'B2-201', score: 94, teacher: 'L. Garcia' },
                     { name: 'C1-304', score: 89, teacher: 'A. López' },
                     { name: 'A2-105', score: 82, teacher: 'P. Sánchez' }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-[#DEFF9A]">{idx + 1}º</span>
                           <div>
                              <p className="text-white text-[10px] font-black uppercase tracking-tight">{item.name}</p>
                              <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">{item.teacher}</p>
                           </div>
                        </div>
                        <span className="text-white font-black text-xs">{item.score} pts</span>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
