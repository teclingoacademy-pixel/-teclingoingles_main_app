import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown, 
  Users, 
  Grid, 
  HeartHandshake, 
  HelpCircle,
  Sparkles,
  BookOpen,
  Lock,
  MessageSquareOff,
  Search,
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { SafeResponsiveContainer } from './SafeResponsiveContainer';
import { SAFEZONE_MOCK_DATA, VELOCITY_PRESETS } from '../data/safeZoneContext';

export function SafeZoneTeacherAnalytics() {
  const [selectedStudent, setSelectedStudent] = useState<string>('Estudiante de Prueba - ITSP Pánuco');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Local state or interactive overrides for demo purposes
  const mockStudents = [
    {
      nombre: 'Estudiante de Prueba - ITSP Pánuco',
      intereses: SAFEZONE_MOCK_DATA.intereses_cotidianos,
      percepcion: SAFEZONE_MOCK_DATA.auto_percepcion,
      ansiedad: 100 - SAFEZONE_MOCK_DATA.auto_percepcion.nivel_conversacional_percibido,
      evolucion: [
        { semana: 'Semana 1', usoPanico: 85, velocidadMedia: 0.75 },
        { semana: 'Semana 2', usoPanico: 60, velocidadMedia: 1.0 },
        { semana: 'Semana 3', usoPanico: 45, velocidadMedia: 1.0 },
        { semana: 'Semana 4', usoPanico: 20, velocidadMedia: 1.25 }
      ],
      interaccionesTotales: 42,
      estado: 'Seguridad Consolidada'
    },
    {
      nombre: 'Javier Domínguez Rivas',
      intereses: { actividad_preferida: 'Videojuegos', red_social: 'YouTube', entretenimiento: 'Podcast Geek' },
      percepcion: { nivel_escrito_percibido: 60, nivel_conversacional_percibido: 35 },
      ansiedad: 65,
      evolucion: [
        { semana: 'Semana 1', usoPanico: 90, velocidadMedia: 0.75 },
        { semana: 'Semana 2', usoPanico: 75, velocidadMedia: 0.75 },
        { semana: 'Semana 3', usoPanico: 55, velocidadMedia: 1.0 },
        { semana: 'Semana 4', usoPanico: 35, velocidadMedia: 1.0 }
      ],
      interaccionesTotales: 36,
      estado: 'En Progreso Seguro'
    },
    {
      nombre: 'María Fernanda Cruz',
      intereses: { actividad_preferida: 'Deportes', red_social: 'Instagram', entretenimiento: 'Música' },
      percepcion: { nivel_escrito_percibido: 80, nivel_conversacional_percibido: 70 },
      ansiedad: 30,
      evolucion: [
        { semana: 'Semana 1', usoPanico: 30, velocidadMedia: 1.0 },
        { semana: 'Semana 2', usoPanico: 15, velocidadMedia: 1.25 },
        { semana: 'Semana 3', usoPanico: 10, velocidadMedia: 1.5 },
        { semana: 'Semana 4', usoPanico: 5, velocidadMedia: 1.5 }
      ],
      interaccionesTotales: 58,
      estado: 'Seguridad Consolidada'
    }
  ];

  // Grouped aggregated analytics for the general tab
  const groupInterestsStats = {
    actividades: [
      { name: 'Comida/Restaurantes', porcentaje: 45 },
      { name: 'Videojuegos', porcentaje: 30 },
      { name: 'Deportes', porcentaje: 15 },
      { name: 'Viajes', porcentaje: 10 }
    ],
    redes: [
      { name: 'TikTok', porcentaje: 48 },
      { name: 'Instagram', porcentaje: 26 },
      { name: 'YouTube', porcentaje: 20 },
      { name: 'X/Reddit', porcentaje: 6 }
    ],
    entretenimiento: [
      { name: 'Películas de terror / Series', porcentaje: 40 },
      { name: 'Música', porcentaje: 35 },
      { name: 'Podcast Geek', porcentaje: 15 },
      { name: 'Cocina', porcentaje: 10 }
    ]
  };

  const filteredStudents = mockStudents.filter(st => 
    st.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeStudentData = mockStudents.find(st => st.nombre === selectedStudent) || mockStudents[0];

  return (
    <div className="w-full text-white space-y-8">
      {/* Header alert about privacy commitment */}
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#10b981]/5 to-transparent p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full filter blur-[40px] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="flex items-start gap-3 text-left">
            <div className="p-2 bg-[#10b981]/15 rounded-xl text-[#10b981] border border-[#10b981]/25 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-[8.5px] font-mono font-black text-[#10b981] tracking-[0.25em] uppercase block">PROTOCOL DE CONFIDENCIALIDAD ESTRELLA</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Privacidad Total SafeZone AI Activo</h3>
              <p className="text-xs text-white/50 font-medium leading-relaxed max-w-2xl">
                Para garantizar un ambiente de práctica 100% libre de juicio y ansiedad, el chat de SafeZone es privado. El docente audita únicamente los índices de ansiedad, el pasaporte de intereses cotidianos y el relevo en el uso de los botones de pánico.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-black/60 border border-white/5 rounded-2xl">
            <Lock size={12} className="text-[#10b981]" />
            <span className="text-[9px] font-mono font-black text-white/70 uppercase tracking-widest leading-none">Chats Encriptados</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side has Students List and general stats, Right Side has Detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (col-span-4/5) - Students selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-black/40 p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Users size={12} className="text-[#10b981]" /> Estudiantes ({filteredStudents.length})
              </h4>
              <span className="text-[9px] font-mono font-bold text-white/40">GRUPO 401</span>
            </div>

            {/* Simple Searchbar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar estudiante..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2 pl-9 pr-4 text-[11px] focus:outline-none focus:border-[#10b981]/30 text-white"
              />
              <Search className="absolute left-3 top-2.5 text-white/30" size={12} />
            </div>

            {/* Students List */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5 cursor-pointer">
              {filteredStudents.map((st) => (
                <button
                  key={st.nombre}
                  onClick={() => setSelectedStudent(st.nombre)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                    selectedStudent === st.nombre
                      ? 'bg-[#10b981]/10 border-[#10b981]/30 text-white'
                      : 'bg-white/[0.01] border-white/5 text-white/60 hover:border-white/10 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[11px] font-bold font-sans truncate pr-2">{st.nombre}</span>
                    <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                      st.ansiedad > 60 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                        : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/10'
                    }`}>
                      Ansiedad: {st.ansiedad}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[9px] text-white/40 font-medium">
                    <span className="truncate">Temas: {st.intereses.actividad_preferida} • {st.intereses.red_social}</span>
                    <span className="font-mono text-[9px] shrink-0 text-white/60">{st.interaccionesTotales} msgs</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group General Interests Stats card */}
          <div className="rounded-3xl border border-white/5 bg-black/40 p-5 space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2 pb-3 border-b border-white/5">
              <Grid size={12} className="text-[#10b981]" /> Pasaporte Grupal Consolidado
            </h4>
            
            <div className="space-y-4 pt-1 text-left">
              {/* Top Topic */}
              <div className="space-y-2 text-left">
                <span className="text-[8.5px] font-mono font-bold text-white/40 uppercase tracking-wider block">1. Actividad Favorita del Grupo</span>
                <div className="space-y-2">
                  {groupInterestsStats.actividades.map((act, i) => (
                    <div key={i} className="text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/70 font-bold">{act.name}</span>
                        <span className="font-mono text-[#10b981]">{act.porcentaje}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div className="bg-[#10b981] h-1 rounded-full" style={{ width: `${act.porcentaje}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Social Net */}
              <div className="space-y-2 pt-1 text-left">
                <span className="text-[8.5px] font-mono font-bold text-white/40 uppercase tracking-wider block">2. Red de Mayor Impacto</span>
                <div className="space-y-2">
                  {groupInterestsStats.redes.map((soc, i) => (
                    <div key={i} className="text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/70 font-bold">{soc.name}</span>
                        <span className="font-mono text-[#10b981]">{soc.porcentaje}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div className="bg-[#10b981] h-1 rounded-full" style={{ width: `${soc.porcentaje}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (col-span-8) - Detailed student metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-black/30 p-6 space-y-6">
            
            {/* Student Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
              <div className="space-y-1 text-left">
                <span className="text-[8.5px] font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase tracking-widest">
                  {activeStudentData.estado}
                </span>
                <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">{activeStudentData.nombre}</h3>
                <p className="text-xs text-white/40">Filtro de confianza personalizado activo con el Tutor Conversacional</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center shrink-0">
                <div className="text-xs text-white/40 font-mono font-bold uppercase tracking-wider pb-1">Ansiedad Lingüística:</div>
                <div className="text-2xl font-black font-mono text-[#10b981]">{activeStudentData.ansiedad}%</div>
                <div className="text-[8px] font-mono text-[#10b981] opacity-75 uppercase tracking-widest pt-1">RANGO SEGURO</div>
              </div>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Indicator 1: Written auto percent */}
              <div className="p-4 rounded-2xl bg-[#0b0f19] border border-white/5 space-y-2 text-left">
                <span className="text-[8.5px] font-mono font-black text-white/40 uppercase tracking-wider block">Nivel Escrito Percibido</span>
                <div className="text-xl font-mono font-black text-white">{activeStudentData.percepcion.nivel_escrito_percibido}%</div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-[#10b981] h-1.5 rounded-full" style={{ width: `${activeStudentData.percepcion.nivel_escrito_percibido}%` }} />
                </div>
                <p className="text-[9.5px] text-white/50 leading-relaxed font-sans pt-1">Consistencia y autoconcepto ante el teclado según su pasaporte.</p>
              </div>

              {/* Indicator 2: Speaking auto percent */}
              <div className="p-4 rounded-2xl bg-[#0b0f19] border border-white/5 space-y-2 text-left">
                <span className="text-[8.5px] font-mono font-black text-white/40 uppercase tracking-wider block">Nivel Hablado Percibido</span>
                <div className="text-xl font-mono font-black text-white">{activeStudentData.percepcion.nivel_conversacional_percibido}%</div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className="bg-[#10b981] h-1.5 rounded-full" style={{ width: `${activeStudentData.percepcion.nivel_conversacional_percibido}%` }} />
                </div>
                <p className="text-[9.5px] text-white/50 leading-relaxed font-sans pt-1">Seguridad autopercibida al comunicarse libre de juicios con la IA.</p>
              </div>

              {/* Indicator 3: Personal passport summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#10b981]/5 to-transparent border border-[#10b981]/15 space-y-2 text-left">
                <span className="text-[8.5px] font-mono font-black text-[#10b981] uppercase tracking-wider block">Temas Conversacionales</span>
                <div className="space-y-1 pt-1 text-[10.5px]">
                  <p className="text-white/80"><strong className="text-white font-black uppercase text-[9px] font-mono text-white/50">Hobby:</strong> {activeStudentData.intereses.actividad_preferida}</p>
                  <p className="text-white/80"><strong className="text-white font-black uppercase text-[9px] font-mono text-white/50">Red:</strong> {activeStudentData.intereses.red_social}</p>
                  <p className="text-white/80"><strong className="text-white font-black uppercase text-[9px] font-mono text-white/50">Ocio:</strong> {activeStudentData.intereses.entretenimiento}</p>
                </div>
              </div>
            </div>

            {/* Recharts Curve: Translation panic buttons release from Week 1 to Week 4 */}
            <div className="p-5 rounded-3xl bg-[#0b0f19] border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8.5px] font-mono font-black text-[#10b981] tracking-[0.2em] uppercase block">EVOLUCIÓN SEMANAL</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <TrendingDown size={12} className="text-[#10b981]" /> Relevo de Botones de Pánico (Traducción auxiliar)
                  </h4>
                </div>
                <span className="text-[9.5px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20 font-black uppercase">
                  Semana 1: {activeStudentData.evolucion[0].usoPanico}% → Semana 4: {activeStudentData.evolucion[3].usoPanico}%
                </span>
              </div>

              <div className="h-48 pt-4">
                <SafeResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activeStudentData.evolucion}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPanico" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="semana" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={9}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={9}
                      domain={[0, 100]}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ fontSize: 9, fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}
                      itemStyle={{ fontSize: 10, color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="usoPanico" 
                      name="Uso de Auxilios (%)"
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPanico)" 
                    />
                  </AreaChart>
                </SafeResponsiveContainer>
              </div>

              <p className="text-[9.5px] text-white/40 font-mono text-center tracking-normal leading-relaxed leading-none">
                *Indica el % de veces por sesión en que el alumno recurrió al botón "Botón de Auxilio (Traducir)" ante las intervenciones del bot conversacional.
              </p>
            </div>

            {/* Cockpit Velocity evolution parameter audit */}
            <div className="p-4 rounded-2xl bg-[#0b0f19] border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
              <div className="space-y-1">
                <div className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <Sliders size={12} className="text-[#10b981]" /> Velocidad de Reproducción Promedio
                </div>
                <p className="text-[10px] text-white/50 font-medium">
                  Velocidad de audio sintonizada por el alumno en su control deslizable para entrenar la audición.
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {activeStudentData.evolucion.map((ev, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center min-w-[70px]">
                    <div className="text-[7.5px] font-mono text-white/45 uppercase tracking-wider">{ev.semana}</div>
                    <div className="text-xs font-mono font-black text-[#10b981] mt-1">{ev.velocidadMedia}x</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
