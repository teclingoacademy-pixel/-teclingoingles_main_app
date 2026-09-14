import React, { useEffect } from 'react';
import { Play, Sparkles, AlertCircle, Check, X, ExternalLink, Bookmark } from 'lucide-react';
import { SessionData } from '@/types/workbook/types';
import { stopSpeech } from '@/utils/workbook/audioFeedback';
import { AudioControl } from './AudioControl';

interface InstructionColumnProps {
  session: SessionData;
}

export const InstructionColumn: React.FC<InstructionColumnProps> = ({ session }) => {
  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-5 border-b md:border-b-0 md:border-r border-[#8A95A5]/10 pr-0 md:pr-6 bg-gradient-to-r from-[#1A1D20] to-[#1D2024]/60 p-2 sm:p-4 rounded-xl max-w-full overflow-hidden">
      {/* Session Title & Metadata */}
      <div>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold rounded uppercase tracking-tighter inline-flex items-center gap-1 shrink-0">
            <Bookmark className="w-3 h-3" /> Nivel {session.level}
          </span>
          <span className="text-[#8A95A5] text-[10px] font-mono uppercase shrink-0">
            Unidad {session.sessionNumber}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-white leading-tight break-words">
          {session.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#8A95A5] mt-1.5 sm:mt-2 leading-relaxed break-words">
          {session.subtitle}
        </p>
      </div>

      {/* Embedded Responsive Video Player */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#8A95A5]/30 bg-black shadow-inner group flex flex-col justify-between">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${session.videoId}?rel=0&modestbranding=1`}
          title={`Video Clase: ${session.videoTitle}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Video Player Meta Bar */}
        <div className="flex justify-between items-center text-[9px] text-[#8A95A5] font-mono px-2.5 py-1 bg-[#121416]/95 border-t border-[#8A95A5]/20 shrink-0">
          <span className="truncate mr-2">CLASE 0{session.sessionNumber}: {session.videoTitle}</span>
          <span className="text-[#8A95A5] shrink-0 font-medium hidden xs:inline">Video Clase</span>
        </div>
      </div>

      {/* Grammar Tip & Theory Card with Sophisticated Dark Styling */}
      <div className="p-3.5 sm:p-5 bg-[#121416]/80 border-l-4 border-[#39FF14] rounded-r-lg shadow-md relative w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
          <h3 className="text-[#39FF14] text-xs font-bold uppercase tracking-widest font-mono truncate">
            {session.grammarTip.title}
          </h3>
        </div>

        <p className="text-gray-300 text-xs italic leading-normal mb-2.5 sm:mb-3 break-words">
          "{session.grammarTip.rule}"
        </p>

        {/* Examples Section */}
        <div className="space-y-2 bg-[#1A1D20]/90 p-2.5 sm:p-3 rounded border border-[#8A95A5]/20 w-full">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A95A5] block">
            Ejemplos en contexto:
          </span>
          {session.grammarTip.examples.map((ex, i) => (
            <div key={i} className="text-xs flex items-start gap-2 justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-medium text-white break-words">
                  {ex.isCorrectUsage ? (
                    <Check className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                  )}
                  <span className="break-words">"{ex.english}"</span>
                </div>
                <div className="text-[#8A95A5] pl-5 text-[11px] break-words">{ex.spanish}</div>
              </div>
              <div className="shrink-0">
                <AudioControl
                  id={`instruction-ex-${session.sessionNumber}-${i}`}
                  text={ex.english}
                  lang="en-US"
                  size="xs"
                  title="Escuchar pronunciación"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Common Mistake Alert */}
        {session.grammarTip.commonMistake && (
          <div className="mt-2.5 sm:mt-3 p-2.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-2 text-[11px] text-[#F59E0B]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="break-words">
              <span className="font-semibold uppercase tracking-wider">Alerta:</span> {session.grammarTip.commonMistake}
            </div>
          </div>
        )}
      </div>

      {/* Quick Vocabulary Strip */}
      <div className="bg-[#121416]/80 border border-[#8A95A5]/20 rounded-lg p-2.5 sm:p-3 w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A95A5]">
            Vocabulario Clave
          </span>
          <span className="text-[9px] text-[#39FF14] font-mono">AUDIO NATIVO</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.quickVocab.map((v, idx) => (
            <div
              key={idx}
              className="text-xs px-2 sm:px-2.5 py-1 rounded border flex items-center gap-2 transition-all bg-[#1A1D20] border-[#8A95A5]/25 text-gray-200"
            >
              <span className="font-medium text-white">{v.word}</span>
              <span className="text-[#8A95A5] text-[10px]">({v.translation})</span>
              <AudioControl
                id={`instruction-vocab-${session.sessionNumber}-${idx}`}
                text={v.word}
                lang="en-US"
                size="xs"
                title={`Pronunciar ${v.word}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

