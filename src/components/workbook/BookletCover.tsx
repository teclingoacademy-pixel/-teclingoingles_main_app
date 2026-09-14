import React from 'react';
import { BookOpen, Clock, Layers, CheckSquare, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { TeclingoLogo } from './TeclingoLogo';

interface BookletCoverProps {
  onExploreContent: () => void;
  onOpenIndex?: () => void;
  onOpenSettings?: () => void;
  onOpenWorkbook?: () => void;
  onOpenDatasheet?: () => void;
}

export const BookletCover: React.FC<BookletCoverProps> = ({
  onExploreContent,
  onOpenIndex,
  onOpenSettings,
  onOpenWorkbook,
  onOpenDatasheet,
}) => {
  const handleStartClick = onOpenIndex || onExploreContent;
  const handleSettingsClick = onOpenSettings || onExploreContent;
  return (
    <div className="w-full max-w-4xl mx-auto my-auto relative select-none animate-fadeIn max-w-full">
      {/* Outer Booklet Cover Card */}
      <div 
        id="booklet-cover"
        className="relative w-full bg-[#1A1D20] border border-[#8A95A5]/30 rounded-2xl md:rounded-l-2xl md:rounded-r-[48px] shadow-[40px_40px_80px_rgba(0,0,0,0.85)] p-4 sm:p-10 lg:p-16 flex flex-col items-center justify-center text-center overflow-hidden booklet-shadow metallic-border"
      >
        {/* Subtle notebook page edge guide dashed border */}
        <div className="absolute inset-2 sm:inset-5 border border-dashed border-[#8A95A5]/20 rounded-xl md:rounded-l-xl md:rounded-r-[40px] pointer-events-none" />

        {/* Top Spine Highlight */}
        <div className="absolute top-0 left-4 sm:left-8 right-4 sm:right-8 h-[1px] bg-gradient-to-r from-transparent via-[#8A95A5]/35 to-transparent pointer-events-none" />

        {/* Ambient Corner Accent */}
        <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-bl from-[#39FF14]/10 via-transparent to-transparent pointer-events-none rounded-tr-[24px] md:rounded-tr-[48px]" />

        {/* Central Logo & Brand Header */}
        <div className="relative z-10 flex flex-col items-center mb-5 sm:mb-6">
          <TeclingoLogo size="lg" showBadge={false} />
          <div className="mt-3 text-[10px] sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#8A95A5] border-b border-[#39FF14]/40 pb-2 px-3 sm:px-6">
            CUADERNO DE EJERCICIOS
          </div>
        </div>

        {/* Main Title */}
        <div className="relative z-10 max-w-2xl mb-4 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> Edición Interactiva 2026
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif italic text-white leading-tight break-words">
            Programa Maestro de Inglés
          </h1>
        </div>

        {/* Course Description */}
        <p className="relative z-10 max-w-xl text-xs sm:text-base text-[#8A95A5] leading-relaxed mb-6 sm:mb-8 break-words px-1 sm:px-0">
          Un viaje estructurado desde el nivel <strong className="text-white font-semibold">A1 (Acceso)</strong> hasta el <strong className="text-white font-semibold">C2 (Maestría)</strong>. 
          Este cuaderno contiene la planeación completa, los ejercicios por habilidad y las metas claras para cada nivel, 
          diseñado bajo los estándares del <strong className="text-white font-semibold">Marco Común Europeo (MCER)</strong> y alineado con el <strong className="text-[#39FF14] font-semibold">TecNM</strong>.
        </p>

        {/* Meta Stats Badges */}
        <div className="relative z-10 flex flex-wrap gap-2.5 sm:gap-6 justify-center items-center bg-[#121416]/90 border border-[#8A95A5]/25 px-3.5 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl shadow-inner mb-6 sm:mb-9 max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-200">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#39FF14] shrink-0" />
            <span className="font-medium font-mono text-white">540 horas</span>
            <span className="text-[#8A95A5] hidden sm:inline">totales</span>
          </div>

          <div className="hidden sm:block w-[1px] h-5 bg-[#8A95A5]/25" />

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-200">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#39FF14] shrink-0" />
            <span className="font-medium font-mono text-white">6 niveles</span>
            <span className="text-[#8A95A5] hidden sm:inline">progresivos</span>
          </div>

          <div className="hidden sm:block w-[1px] h-5 bg-[#8A95A5]/25" />

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-200">
            <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#39FF14] shrink-0" />
            <span className="font-medium font-mono text-white">16,200</span>
            <span className="text-[#8A95A5]">ejercicios</span>
          </div>
        </div>

        {/* Actions Button Group */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md">
          {/* Primary Call to Action Button: Comenzar Curso -> Index */}
          <button
            id="btn-start-course-index"
            type="button"
            onClick={handleStartClick}
            title="Abrir Catálogo de 35 Clases del Curso A1"
            className="w-full group px-8 sm:px-12 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-95 text-white font-black text-xs sm:text-sm tracking-wide sm:tracking-[2px] uppercase shadow-[0_0_30px_rgba(102,126,234,0.45)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer active:scale-95 text-center"
          >
            <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0" />
            <span>Comenzar Curso (35 Clases)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
        </div>

        {/* Discretely placed Gear Icon in the bottom right corner (only visible in cover for admin access) */}
        <button
          id="btn-go-to-settings"
          type="button"
          onClick={handleSettingsClick}
          title="Configuración de producción (Admin / Settings)"
          aria-label="Configuración de producción"
          className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#121416] hover:bg-[#39FF14] text-[#8A95A5] hover:text-black border border-[#8A95A5]/30 hover:border-[#39FF14] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer group hover:rotate-90 active:scale-90"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
          <span className="sr-only">Configuración de producción</span>
        </button>

        {/* Bottom subtle footnote */}
        <div className="absolute bottom-3 left-6 text-[10px] font-mono text-[#8A95A5]/50 pointer-events-none hidden sm:block">
          TECLINGO ACADEMY • PORTADA DE PRODUCCIÓN
        </div>
      </div>
    </div>
  );
};

