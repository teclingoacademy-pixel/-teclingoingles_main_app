/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AudioControl.tsx
 * Componente Global de Control de Audio / TTS
 * Al ejecutarse, el ícono de bocina se transforma o despliega los botones
 * interactivos de PAUSE, PLAY/RESUME y STOP con indicador de onda sonoro.
 */

import React, { useEffect, useState } from 'react';
import { Volume2, Pause, Play, Square } from 'lucide-react';
import {
  subscribeGlobalAudio,
  toggleGlobalAudio,
  pauseGlobalAudio,
  resumeGlobalAudio,
  stopGlobalAudio,
  getGlobalAudioState,
  GlobalAudioState,
  SpeakOptions
} from '@/utils/workbook/audioFeedback';

export interface AudioControlProps {
  id: string;
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'pill' | 'table' | 'banner';
  label?: string;
  title?: string;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  stopPropagation?: boolean;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  id,
  text,
  lang = 'en-US',
  rate = 0.88,
  pitch = 1.0,
  size = 'md',
  variant = 'icon',
  label,
  title = 'Escuchar pronunciación',
  className = '',
  onPlayStart,
  onPlayEnd,
  stopPropagation = true,
}) => {
  const [audioState, setAudioState] = useState<GlobalAudioState>(getGlobalAudioState);

  useEffect(() => {
    const unsubscribe = subscribeGlobalAudio((newState) => {
      setAudioState(newState);
    });
    return unsubscribe;
  }, []);

  const isThisActive = audioState.activeId === id;
  const isPlaying = isThisActive && audioState.isPlaying;
  const isPaused = isThisActive && audioState.isPaused;

  const handleStart = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    const opts: SpeakOptions = {
      lang,
      rate,
      pitch,
      id,
      onStart: onPlayStart,
      onEnd: onPlayEnd,
    };
    toggleGlobalAudio(id, text, opts);
  };

  const handlePause = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    pauseGlobalAudio();
  };

  const handleResume = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    resumeGlobalAudio();
  };

  const handleStop = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    stopGlobalAudio();
  };

  // Icon sizing
  const iconSizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  }[size];

  // Button padding sizing
  const btnPaddingClasses = {
    xs: 'p-1.5 text-[10px]',
    sm: 'p-2 text-xs',
    md: 'p-2 text-xs',
    lg: 'px-3 py-2 text-sm',
  }[size];

  // ==========================================================================
  // ESTADO ACTIVO: Muestra controles STOP y PAUSE / RESUME + Indicador de audio
  // ==========================================================================
  if (isThisActive && (isPlaying || isPaused)) {
    return (
      <div
        id={`audio-active-controls-${id}`}
        onClick={(e) => stopPropagation && e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-900/90 border border-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.5)] select-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Equalizer animation / Wave indicator */}
        <div className="flex items-center gap-0.5 px-1">
          <span
            className={`w-1 rounded-full bg-blue-300 ${
              isPlaying ? 'animate-[bounce_0.6s_infinite_ease-in-out]' : 'h-2'
            }`}
            style={{ height: isPlaying ? '12px' : '6px' }}
          />
          <span
            className={`w-1 rounded-full bg-[#00F5D4] ${
              isPlaying ? 'animate-[bounce_0.8s_infinite_ease-in-out_0.15s]' : 'h-3'
            }`}
            style={{ height: isPlaying ? '16px' : '8px' }}
          />
          <span
            className={`w-1 rounded-full bg-blue-300 ${
              isPlaying ? 'animate-[bounce_0.6s_infinite_ease-in-out_0.3s]' : 'h-2'
            }`}
            style={{ height: isPlaying ? '10px' : '5px' }}
          />
        </div>

        {/* Botón PAUSE / RESUME */}
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            title="Pausar audio (Pause)"
            aria-label="Pausar audio"
            className="p-1 sm:p-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleResume}
            title="Reanudar audio (Play)"
            aria-label="Reanudar audio"
            className="p-1 sm:p-1.5 rounded-full bg-[#00F5D4] hover:bg-[#2dd4bf] text-black font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
          </button>
        )}

        {/* Botón STOP */}
        <button
          type="button"
          onClick={handleStop}
          title="Detener audio por completo (Stop)"
          aria-label="Detener audio"
          className="p-1 sm:p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
        >
          <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
        </button>

        {/* Etiqueta opcional de estado */}
        <span className="text-[10px] font-mono font-bold text-blue-200 hidden sm:inline pr-1">
          {isPlaying ? 'Reproduciendo...' : 'Pausado'}
        </span>
      </div>
    );
  }

  // ==========================================================================
  // ESTADO IDLE / INACTIVO: Botón de Bocina Estándar con Feedback Visual
  // ==========================================================================
  if (variant === 'pill') {
    return (
      <button
        id={`audio-btn-${id}`}
        type="button"
        onClick={handleStart}
        title={title}
        aria-label={title}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-400/30 transition-all active:scale-95 cursor-pointer font-sans font-semibold text-xs shadow-xs ${className}`}
      >
        <Volume2 className={iconSizeClasses} />
        <span>{label || 'Escuchar'}</span>
      </button>
    );
  }

  if (variant === 'table') {
    return (
      <button
        id={`audio-btn-${id}`}
        type="button"
        onClick={handleStart}
        title={title}
        aria-label={title}
        className={`p-1.5 rounded-full bg-white/10 hover:bg-[#00F5D4] text-gray-300 hover:text-black border border-white/10 transition-all active:scale-95 cursor-pointer inline-flex items-center justify-center ${className}`}
      >
        <Volume2 className={iconSizeClasses} />
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <button
        id={`audio-btn-${id}`}
        type="button"
        onClick={handleStart}
        title={title}
        aria-label={title}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Volume2 className={iconSizeClasses} />
        <span>{label || 'Escuchar lección'}</span>
      </button>
    );
  }

  // Variant 'icon' default
  return (
    <button
      id={`audio-btn-${id}`}
      type="button"
      onClick={handleStart}
      title={title}
      aria-label={title}
      className={`rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all cursor-pointer inline-flex items-center justify-center border border-blue-200 shadow-sm hover:shadow-md active:scale-95 ${btnPaddingClasses} ${className}`}
    >
      <Volume2 className={iconSizeClasses} />
      {label && <span className="ml-1.5">{label}</span>}
    </button>
  );
};

