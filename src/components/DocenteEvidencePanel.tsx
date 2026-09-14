/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Camera, 
  ExternalLink, 
  Download, 
  Calendar, 
  Users, 
  Search,
  Image as ImageIcon,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';
import { fetchEvidenciasPorGrupo, listarGruposIngles, type Evidencia, type GrupoIngles } from '../services/identityService';

export function DocenteEvidencePanel() {
  const { userEmail } = useAppContext();
  const [grupos, setGrupos] = useState<GrupoIngles[]>([]);
  const [selectedGrupoId, setSelectedGrupoId] = useState<string>('');
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvidencias, setLoadingEvidencias] = useState(false);
  const [fechaFiltro, setFechaFiltro] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Load docente's groups
  useEffect(() => {
    const loadGrupos = async () => {
      if (!userEmail) return;
      try {
        const misGrupos = await listarGruposIngles(userEmail);
        setGrupos(misGrupos);
        if (misGrupos.length > 0) {
          setSelectedGrupoId(misGrupos[0].grupo_id);
        }
      } catch (err) {
        console.warn('[DocenteEvidencePanel] Error loading groups:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGrupos();
  }, [userEmail]);

  // Load evidence when group changes
  useEffect(() => {
    const loadEvidencias = async () => {
      if (!userEmail || !selectedGrupoId) {
        setEvidencias([]);
        return;
      }
      setLoadingEvidencias(true);
      try {
        const result = await fetchEvidenciasPorGrupo(userEmail, selectedGrupoId, fechaFiltro);
        if (result.ok && result.evidencias) {
          setEvidencias(result.evidencias);
        } else {
          setEvidencias([]);
        }
      } catch (err) {
        console.warn('[DocenteEvidencePanel] Error loading evidence:', err);
        setEvidencias([]);
      } finally {
        setLoadingEvidencias(false);
      }
    };
    loadEvidencias();
  }, [userEmail, selectedGrupoId, fechaFiltro]);

  // Filter by search term
  const filteredEvidencias = evidencias.filter(e => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.nombre.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.file_name.toLowerCase().includes(term) ||
      e.tipo.toLowerCase().includes(term)
    );
  });

  const selectedGrupo = grupos.find(g => g.grupo_id === selectedGrupoId);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h2 className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Evidencias Recibidas</h2>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Cargando...</h1>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#4ADE80]/30 border-t-[#4ADE80] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Evidencias Recibidas</h2>
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Evidencia de tus Grupos</h1>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Group Selector */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Grupo</label>
          <div className="relative">
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <select
              value={selectedGrupoId}
              onChange={(e) => setSelectedGrupoId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-xs font-bold focus:border-[#4ADE80]/40 outline-none appearance-none"
            >
              <option value="" className="bg-[#061a1a]">-- Selecciona grupo --</option>
              {grupos.map(g => (
                <option key={g.grupo_id} value={g.grupo_id} className="bg-[#061a1a]">
                  {g.code_id || g.grupo_id} - {g.nombre || `Grupo ${g.grupo}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Fecha</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-xs font-bold focus:border-[#4ADE80]/40 outline-none"
            />
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Buscar</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, email, archivo..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-xs font-bold focus:border-[#4ADE80]/40 outline-none placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="px-4 py-2 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20">
          <span className="text-[#4ADE80] text-[10px] font-black uppercase tracking-widest">
            {filteredEvidencias.length} evidencia{filteredEvidencias.length !== 1 ? 's' : ''}
          </span>
        </div>
        {selectedGrupo && (
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
              {selectedGrupo.code_id || selectedGrupo.grupo_id} — {selectedGrupo.nombre || `Grupo ${selectedGrupo.grupo}`}
            </span>
          </div>
        )}
      </div>

      {/* Evidence Grid */}
      {loadingEvidencias ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#4ADE80]/30 border-t-[#4ADE80] rounded-full animate-spin" />
        </div>
      ) : filteredEvidencias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Camera size={48} className="text-white/10 mb-4" />
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
            {evidencias.length === 0 ? 'No hay evidencias para este grupo' : 'No se encontraron resultados'}
          </p>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-2">
            {evidencias.length === 0 ? 'Los alumnos aún no han subido evidencias' : 'Prueba con otros filtros'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvidencias.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group"
            >
              <GlassCard className="!p-0 overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-video bg-black/40 relative overflow-hidden">
                  {ev.file_url ? (
                    <img
                      src={ev.file_url.replace('/view', '/uc?export=view')}
                      alt={ev.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} className="text-white/10" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={ev.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#4ADE80] flex items-center justify-center text-[#061a1a] hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <a
                      href={ev.file_url.replace('/view', '/export?format=jpg')}
                      download={ev.file_name}
                      className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">
                    {ev.nombre}
                  </p>
                  <div className="flex items-center gap-2 text-white/40 text-[8px] font-bold">
                    <Calendar size={10} />
                    <span>{ev.fecha}</span>
                    <span>•</span>
                    <span className="uppercase">{ev.tipo}</span>
                  </div>
                  <p className="text-white/30 text-[8px] font-bold truncate">
                    {ev.file_name}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
