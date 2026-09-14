import React from 'react';
import { Volume2, VolumeX, BookMarked, Settings } from 'lucide-react';
import { TeclingoLogo } from './TeclingoLogo';

interface BookletHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onGoToCover?: () => void;
  onGoToSettings?: () => void;
}

export const BookletHeader: React.FC<BookletHeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onGoToCover,
  onGoToSettings,
}) => {
  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-4 pb-3 mb-4 border-b border-[#8A95A5]/25">
      {/* Brand Logo with metallic TC emblem */}
      <div className="flex items-center gap-3">
        <TeclingoLogo size="md" />
      </div>

      {/* Right action controls */}
      <div className="flex items-center gap-2">
        {/* Back to Cover Button */}
        {onGoToCover && (
          <button
            type="button"
            onClick={onGoToCover}
            title="Volver a la portada del cuaderno"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121416] border border-[#8A95A5]/30 text-xs text-[#8A95A5] hover:text-white hover:border-[#8A95A5]/60 transition-colors cursor-pointer"
          >
            <BookMarked className="w-3.5 h-3.5 text-[#39FF14]" />
            <span className="hidden sm:inline">Portada</span>
          </button>
        )}

        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#1A1D20] text-[#39FF14] border-[#8A95A5]/30 hover:border-[#39FF14]/50'
              : 'bg-[#121416] text-[#8A95A5] border-[#8A95A5]/20 hover:text-white'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Admin / Settings shortcut */}
        {onGoToSettings && (
          <button
            type="button"
            onClick={onGoToSettings}
            title="Panel de Configuración y Producción (Admin)"
            className="p-2 rounded-lg bg-[#121416] border border-[#8A95A5]/30 text-[#8A95A5] hover:text-[#39FF14] hover:border-[#39FF14]/40 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

