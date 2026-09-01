/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, GraduationCap, Mail, Phone, Clock,
  ChevronRight, Filter, LayoutGrid, List, Copy, Check,
  BookOpen, UserCheck, UserX, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import identityService, { UsuarioComunidad, GrupoIngles } from '../services/identityService';
import { GlassCard } from './GlassCard';

type ViewMode = 'cards' | 'table';
type StatusFilter = 'TODOS' | 'ACTIVE' | 'SUSPENDED';

interface TeacherWithGroups extends UsuarioComunidad {
  grupos: GrupoIngles[];
  id_empleado: string;
}

export function TeachersMaster() {
  const { userEmail } = useAppContext();
  const email = userEmail || '';

  const [docentes, setDocentes] = useState<TeacherWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    cargarDocentes();
  }, [email]);

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const usuarios = await identityService.listarUsuarios('DOCENTE');
      const grupos = await identityService.listarGruposIngles(email);

      const docentesConGrupos: TeacherWithGroups[] = usuarios.map(u => ({
        ...u,
        id_empleado: u.id_empleado || '',
        grupos: grupos.filter(g => g.docente_email === u.email),
      }));

      setDocentes(docentesConGrupos);
    } catch (err) {
      console.error('[TeachersMaster] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return docentes.filter(d => {
      const matchSearch =
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.id_empleado || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === 'TODOS' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [docentes, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: docentes.length,
    activos: docentes.filter(d => d.status === 'ACTIVE').length,
    inactivos: docentes.filter(d => d.status === 'SUSPENDED').length,
    conGrupos: docentes.filter(d => d.grupos.length > 0).length,
  }), [docentes]);

  const copiar = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Recursos Humanos</h2>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            PLANTILLA <span className="text-[#DEFF9A]">DOCENTE</span>
          </h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
            Listado de docentes vinculados y sus grupos asignados
          </p>
        </div>
        <button
          onClick={cargarDocentes}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 flex items-center gap-2 hover:bg-[#DEFF9A]/10 hover:text-[#DEFF9A] hover:border-[#DEFF9A]/30 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </header>

      {/* STATS + FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard className="!p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
            <Users size={16} />
          </div>
          <div>
            <p className="text-lg font-black text-white leading-none">{stats.total}</p>
            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Total</p>
          </div>
        </GlassCard>
        <GlassCard className="!p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <UserCheck size={16} />
          </div>
          <div>
            <p className="text-lg font-black text-green-400 leading-none">{stats.activos}</p>
            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Activos</p>
          </div>
        </GlassCard>
        <GlassCard className="!p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
            <UserX size={16} />
          </div>
          <div>
            <p className="text-lg font-black text-red-400 leading-none">{stats.inactivos}</p>
            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Inactivos</p>
          </div>
        </GlassCard>
        <GlassCard className="!p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <BookOpen size={16} />
          </div>
          <div>
            <p className="text-lg font-black text-blue-400 leading-none">{stats.conGrupos}</p>
            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Con Grupos</p>
          </div>
        </GlassCard>
      </div>

      {/* SEARCH + VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DEFF9A] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID Empleado..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-[#DEFF9A]/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* Status filter */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {(['TODOS', 'ACTIVE', 'SUSPENDED'] as StatusFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === f
                    ? 'bg-[#DEFF9A] text-[#061a1a]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {f === 'TODOS' ? 'Todos' : f === 'ACTIVE' ? 'Activos' : 'Inactivos'}
              </button>
            ))}
          </div>
          {/* View mode */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 transition-all ${viewMode === 'cards' ? 'bg-[#DEFF9A] text-[#061a1a]' : 'text-white/40 hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-all ${viewMode === 'table' ? 'bg-[#DEFF9A] text-[#061a1a]' : 'text-white/40 hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-20 text-white/30 text-xs">Cargando docentes...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-xs">
          {docentes.length === 0
            ? 'No hay docentes registrados en el Data Lake.'
            : 'No se encontraron docentes con esos filtros.'}
        </div>
      ) : viewMode === 'cards' ? (
        /* ===== VISTA TARJETA ===== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <GlassCard key={d.id} className="!p-0 group relative overflow-hidden hover:border-[#DEFF9A]/30 transition-all border-white/5">
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[#DEFF9A] text-lg font-black border border-white/10 group-hover:bg-[#DEFF9A] group-hover:text-black transition-all shrink-0">
                      {d.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight italic truncate group-hover:text-[#DEFF9A] transition-colors">
                        {d.nombre}
                      </h3>
                      {d.id_empleado && (
                        <p className="text-[#DEFF9A] text-[9px] font-mono font-bold tracking-wider">{d.id_empleado}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shrink-0 ${
                    d.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {d.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-white/40 text-[9px] font-bold font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={10} className="opacity-40 shrink-0" />
                    <span className="truncate">{d.email}</span>
                  </div>
                  {d.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={10} className="opacity-40 shrink-0" />
                      <span>{d.phone}</span>
                    </div>
                  )}
                </div>

                {/* Grupos asignados */}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-2">Grupos Asignados</p>
                  {d.grupos.length === 0 ? (
                    <p className="text-white/15 text-[9px] italic">Sin grupos asignados</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {d.grupos.map(g => (
                        <span key={g.grupo_id} className="px-2 py-0.5 rounded bg-[#DEFF9A]/10 text-[#DEFF9A] text-[8px] font-bold border border-[#DEFF9A]/20">
                          {g.nombre} — {g.nivel}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1 text-white/20 text-[8px] font-bold">
                    <Clock size={10} />
                    <span>Registro: {d.joinDate || '—'}</span>
                  </div>
                  <button
                    onClick={() => copiar(d.email, d.id)}
                    className="text-white/20 hover:text-[#DEFF9A] transition-colors"
                  >
                    {copiedId === d.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#DEFF9A]/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </GlassCard>
          ))}
        </div>
      ) : (
        /* ===== VISTA TABLA ===== */
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Docente</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">ID Empleado</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Email</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Teléfono</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Grupos</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Estado</th>
                <th className="px-4 py-3 text-[8px] font-black uppercase tracking-widest text-white/30">Registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A] text-[10px] font-black shrink-0">
                        {d.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                      </div>
                      <span className="text-white text-xs font-bold truncate max-w-[150px]">{d.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {d.id_empleado ? (
                      <span className="text-[#DEFF9A] text-[10px] font-mono font-bold">{d.id_empleado}</span>
                    ) : (
                      <span className="text-white/20 text-[10px]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-[10px] font-mono truncate max-w-[200px]">{d.email}</td>
                  <td className="px-4 py-3 text-white/60 text-[10px] font-mono">{d.phone || '—'}</td>
                  <td className="px-4 py-3">
                    {d.grupos.length === 0 ? (
                      <span className="text-white/15 text-[9px]">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {d.grupos.map(g => (
                          <span key={g.grupo_id} className="px-1.5 py-0.5 rounded bg-[#DEFF9A]/10 text-[#DEFF9A] text-[8px] font-bold">
                            {g.nombre}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      d.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {d.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-[10px]">{d.joinDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
