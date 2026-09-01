import { useState, useEffect } from 'react';
import { Languages, Plus, Users, Copy, Check, Trash2, UserPlus, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import identityService from '../services/identityService';
import { obtenerConfigAcademica, listarUsuarios } from '../services/identityService';
import type { GrupoIngles, MiembroGrupo, UsuarioComunidad } from '../services/identityService';

const MODULOS = ['MODULO I', 'MODULO II', 'MODULO III', 'MODULO IV', 'MODULO V', 'MODULO VI'];

const DIAS_SEMANA = [
  { key: 'LU', label: 'LU', full: 'Lunes' },
  { key: 'MA', label: 'MA', full: 'Martes' },
  { key: 'MI', label: 'MI', full: 'Miércoles' },
  { key: 'JU', label: 'JU', full: 'Jueves' },
  { key: 'VI', label: 'VI', full: 'Viernes' },
  { key: 'SA', label: 'SA', full: 'Sábado' },
  { key: 'DO', label: 'DO', full: 'Domingo' },
];

export function GruposInglesDirector() {
  const { userEmail } = useAppContext();
  const email = userEmail || '';
  const [grupos, setGrupos] = useState<GrupoIngles[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAsignar, setShowAsignar] = useState<string | null>(null);
  const [showMiembros, setShowMiembros] = useState<string | null>(null);
  const [miembros, setMiembros] = useState<MiembroGrupo[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<string[]>([]);
  const [docentes, setDocentes] = useState<UsuarioComunidad[]>([]);
  const [form, setForm] = useState({
    nombre: 'MODULO I',
    grupo: 'A',
    nivel: 'A1',
    turno: '',
    horarioInicio: '08:00',
    horarioFin: '10:00',
    dias: 'LU,MA,MI,JU,VI',
    diasArr: ['LU', 'MA', 'MI', 'JU', 'VI'],
    capacidad: 30
  });
  const [docenteEmail, setDocenteEmail] = useState('');
  const [error, setError] = useState('');

  const cargarGrupos = async () => {
    setLoading(true);
    const data = await identityService.listarGruposIngles(email);
    setGrupos(data);
    setLoading(false);
  };

  const cargarTurnos = async () => {
    if (!email) return;
    const cfg = await obtenerConfigAcademica({ email });
    if (cfg.ok && Array.isArray(cfg.turnos)) {
      setTurnos(cfg.turnos);
      if (cfg.turnos.length > 0 && !form.turno) {
        setForm(prev => ({ ...prev, turno: cfg.turnos![0] }));
      }
    }
  };

  const cargarDocentes = async () => {
    const data = await listarUsuarios('DOCENTE');
    setDocentes(data);
  };

  useEffect(() => { cargarGrupos(); }, [email]);
  useEffect(() => { cargarTurnos(); }, [email]);
  useEffect(() => { cargarDocentes(); }, []);

  const handleCrear = async () => {
    setError('');
    if (!form.nombre.trim()) { setError('Selecciona un módulo'); return; }
    if (!form.turno) { setError('Selecciona un turno'); return; }

    const horario = `${form.horarioInicio}-${form.horarioFin}`;
    const payload = {
      nombre: form.nombre,
      grupo: form.grupo,
      nivel: form.nivel,
      turno: form.turno,
      horario,
      dias: form.dias,
      capacidad: form.capacidad
    };

    const res = await identityService.crearGrupoIngles(email, payload);
    if (res.ok) {
      setShowCreate(false);
      setForm({ nombre: 'MODULO I', grupo: 'A', nivel: 'A1', turno: turnos[0] || '', horarioInicio: '08:00', horarioFin: '10:00', dias: 'LU,MA,MI,JU,VI', diasArr: ['LU', 'MA', 'MI', 'JU', 'VI'], capacidad: 30 });
      cargarGrupos();
    } else {
      setError(res.error || 'Error al crear grupo');
    }
  };

  const handleAsignar = async (grupoId: string) => {
    setError('');
    if (!docenteEmail.trim()) { setError('Email del docente requerido'); return; }
    const res = await identityService.asignarDocenteAGrupo(email, grupoId, docenteEmail);
    if (res.ok) {
      setShowAsignar(null);
      setDocenteEmail('');
      cargarGrupos();
    } else {
      setError(res.error || 'Error al asignar docente');
    }
  };

  const handleEliminar = async (grupoId: string) => {
    if (!confirm('¿Desactivar este grupo?')) return;
    await identityService.eliminarGrupoIngles(email, grupoId);
    cargarGrupos();
  };

  const cargarMiembros = async (grupoId: string) => {
    setShowMiembros(grupoId);
    const data = await identityService.obtenerMiembrosDeGrupo(email, grupoId);
    setMiembros(data);
  };

  const copiarCode = (codeId: string) => {
    navigator.clipboard.writeText(codeId);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-1">English Course Groups</h2>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            GRUPOS <span className="text-[#DEFF9A]">INGLES</span>
          </h1>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-[#DEFF9A] text-[#061a1a] font-black text-xs uppercase rounded hover:bg-[#c5e68a] transition-colors"
        >
          <Plus size={16} /> Crear Grupo
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs">{error}</div>
      )}

      {showCreate && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5">
          <h3 className="text-white font-bold text-sm uppercase">Nuevo Grupo de Inglés</h3>

          {/* Fila 1: Módulo + Grupo + Nivel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Módulo</label>
              <select
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A]"
              >
                {MODULOS.map(m => (
                  <option key={m} value={m} className="bg-[#061a1a]">{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Grupo</label>
              <select
                value={form.grupo}
                onChange={e => setForm({ ...form, grupo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A]"
              >
                {['A','B','C','D','E','F','G'].map(g => (
                  <option key={g} value={g} className="bg-[#061a1a]">Grupo {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Nivel</label>
              <select
                value={form.nivel}
                onChange={e => setForm({ ...form, nivel: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A]"
              >
                {['A1','A1+','A2','A2+','B1','B1+','B2','B2+','C1','C2'].map(n => (
                  <option key={n} value={n} className="bg-[#061a1a]">{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Turno */}
          <div>
            <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Turno</label>
            {turnos.length > 0 ? (
              <select
                value={form.turno}
                onChange={e => setForm({ ...form, turno: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A]"
              >
                {turnos.map(t => (
                  <option key={t} value={t} className="bg-[#061a1a]">{t}</option>
                ))}
              </select>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/30 text-xs italic">
                No hay turnos configurados. Ve a Configuración → Turnos para agregar.
              </div>
            )}
          </div>

          {/* Fila 3: Horario estilo reloj */}
          <div>
            <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Clock size={12} className="inline mr-1" /> Horario de Clase
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-white/20 text-[9px] font-bold uppercase mb-1">Hora Inicio</label>
                <input
                  type="time"
                  value={form.horarioInicio}
                  onChange={e => setForm({ ...form, horarioInicio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A] [color-scheme:dark]"
                />
              </div>
              <div className="text-white/30 text-lg font-bold mt-5">—</div>
              <div className="flex-1">
                <label className="block text-white/20 text-[9px] font-bold uppercase mb-1">Hora Fin</label>
                <input
                  type="time"
                  value={form.horarioFin}
                  onChange={e => setForm({ ...form, horarioFin: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A] [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Fila 4: Días + Límite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Días de Clase</label>
              <div className="flex gap-1.5">
                {DIAS_SEMANA.map(d => {
                  const activo = form.diasArr.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        const nuevaArr = activo
                          ? form.diasArr.filter(k => k !== d.key)
                          : [...form.diasArr, d.key];
                        setForm({ ...form, diasArr: nuevaArr, dias: nuevaArr.join(',') });
                      }}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                        activo
                          ? 'bg-[#DEFF9A] text-[#061a1a] shadow-[0_0_8px_rgba(222,255,154,0.3)]'
                          : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/50'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
              {form.diasArr.length > 0 ? (
                <p className="text-white/40 text-[10px] mt-1.5">
                  Seleccionados: <span className="text-[#DEFF9A] font-bold">{form.diasArr.map(k => DIAS_SEMANA.find(d => d.key === k)?.full).filter(Boolean).join(', ')}</span>
                </p>
              ) : (
                <p className="text-white/20 text-[10px] mt-1.5 italic">Selecciona al menos un día</p>
              )}
            </div>
            <div>
              <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">Límite de Alumnos</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.capacidad}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setForm({ ...form, capacidad: val });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#DEFF9A]"
              />
              <p className="text-white/20 text-[9px] mt-1">Máximo de alumnos permitidos en este grupo</p>
            </div>
          </div>

          <button
            onClick={handleCrear}
            disabled={!turnos.length}
            className="px-4 py-2 bg-[#DEFF9A] text-[#061a1a] font-black text-xs uppercase rounded hover:bg-[#c5e68a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Crear Grupo
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-white/40 text-xs">Cargando grupos...</div>
      ) : grupos.length === 0 ? (
        <div className="text-white/40 text-xs text-center py-12">No hay grupos de inglés creados aún.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {grupos.map(g => (
            <div key={g.grupo_id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">{g.nombre} — Grupo {g.grupo}</h3>
                  <p className="text-white/50 text-xs">{g.nivel} · {g.turno || 'Sin turno'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#DEFF9A]/10 text-[#DEFF9A]">{g.status}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/40 text-xs">Code:</span>
                <span className="text-[#DEFF9A] font-mono font-bold text-sm tracking-wider">{g.code_id}</span>
                <button onClick={() => copiarCode(g.code_id)} className="ml-auto text-white/40 hover:text-[#DEFF9A] transition-colors">
                  {copiedCode === g.code_id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-white/20 text-[9px] italic">
                * El alumno se vincula al grupo usando este Code ID desde su perfil → "Unirse a Grupo"
              </p>

              <div className="text-xs text-white/50 space-y-1">
                <p>
                  Alumnos: <span className="text-white font-bold">{g.alumnos_inscritos || 0}</span>
                  <span className="text-white/30"> / {g.capacidad} (límite)</span>
                </p>
                {g.docente_email && <p>Docente: <span className="text-white">{g.docente_email}</span></p>}
                {g.horario && <p>Horario: <span className="text-white">{g.horario}</span></p>}
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setShowAsignar(g.grupo_id)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white/60 text-[10px] font-bold uppercase hover:bg-[#DEFF9A]/10 hover:text-[#DEFF9A] transition-colors"
                >
                  <UserPlus size={12} /> Asignar Docente
                </button>
                <button
                  onClick={() => cargarMiembros(g.grupo_id)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white/60 text-[10px] font-bold uppercase hover:bg-[#DEFF9A]/10 hover:text-[#DEFF9A] transition-colors"
                >
                  <Users size={12} /> Ver Miembros
                </button>
                <button
                  onClick={() => handleEliminar(g.grupo_id)}
                  className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {showAsignar === g.grupo_id && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider">Seleccionar Docente</label>
                  {docentes.length > 0 ? (
                    <select
                      value={docenteEmail}
                      onChange={e => setDocenteEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#DEFF9A]"
                    >
                      <option value="" className="bg-[#061a1a]">— Selecciona un docente —</option>
                      {docentes.map(d => (
                        <option key={d.id} value={d.email} className="bg-[#061a1a]">
                          {d.id_empleado ? `[${d.id_empleado}] ` : ''}{d.nombre} — {d.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/30 text-xs italic">
                      No hay docentes registrados. Ve a Plantilla Docente para agregar.
                    </div>
                  )}
                  <button
                    onClick={() => handleAsignar(g.grupo_id)}
                    disabled={!docenteEmail}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#DEFF9A] text-[#061a1a] font-bold text-[10px] uppercase rounded hover:bg-[#c5e68a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <UserPlus size={12} /> Asignar Docente
                  </button>
                </div>
              )}

              {showMiembros === g.grupo_id && (
                <div className="pt-2 border-t border-white/5 space-y-1 max-h-40 overflow-y-auto">
                  {miembros.length === 0 ? (
                    <p className="text-white/30 text-[10px]">No hay miembros inscritos aún.</p>
                  ) : (
                    miembros.map(m => (
                      <div key={m.asignacion_id} className="flex items-center gap-2 text-[10px] text-white/50">
                        <span className="text-white">{m.nombre}</span>
                        <span className="text-white/30">({m.email})</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded bg-white/5 text-white/40">{m.rol_en_grupo}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
