import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, AlertTriangle, XCircle, RotateCcw, BookOpen, Check } from 'lucide-react';
import { Exercise, ExerciseAttempt } from '@/types/workbook/types';
import { stopSpeech } from '@/utils/workbook/audioFeedback';
import { AudioControl } from './AudioControl';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  attempt?: ExerciseAttempt;
  onAnswer: (exerciseId: string, optionId: string, isCorrect: boolean) => void;
  onReset?: (exerciseId: string) => void;
}

const DEFAULT_ATTEMPT: ExerciseAttempt = { count: 0, state: 'unanswered' };

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  attempt = DEFAULT_ATTEMPT,
  onAnswer,
  onReset,
}) => {
  const [stagedOptionId, setStagedOptionId] = useState<string | null>(null);

  const isLocked = attempt.state === 'correct' || attempt.state === 'second_fail';

  // Current selected option is either staged or from attempt
  const activeSelectedId = attempt.selectedOptionId || stagedOptionId;

  // Stop any active speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleSelectOption = (optId: string) => {
    if (isLocked) return;
    setStagedOptionId(optId);
  };

  const handleVerify = () => {
    if (isLocked || !stagedOptionId) return;
    const selectedOption = exercise.options.find((opt) => opt.id === stagedOptionId);
    if (selectedOption) {
      onAnswer(exercise.id, selectedOption.id, selectedOption.isCorrect);
    }
  };

  const handleResetCard = () => {
    setStagedOptionId(null);
    if (onReset) {
      onReset(exercise.id);
    }
  };

  // Card background & border state styling matching Sophisticated Dark
  let cardStateClasses = 'bg-[#121416] border border-[#8A95A5]/25 hover:border-[#8A95A5]/45 shadow-sm';
  if (attempt.state === 'first_fail') {
    cardStateClasses = 'bg-[#F59E0B]/5 border-2 border-[#F59E0B]/70 relative shadow-[0_4px_24px_rgba(245,158,11,0.12)]';
  } else if (attempt.state === 'correct') {
    cardStateClasses = 'bg-[#39FF14]/5 border-2 border-[#39FF14]/70 shadow-[0_4px_24px_rgba(57,255,20,0.15)]';
  } else if (attempt.state === 'second_fail') {
    cardStateClasses = 'bg-[#EF4444]/5 border-2 border-[#EF4444]/70 relative shadow-[0_4px_24px_rgba(239,68,68,0.12)]';
  }

  const exerciseCode = exercise.code || (index + 1 < 10 ? `EX_0${index + 1}` : `EX_${index + 1}`);
  const xpReward = exercise.xpValue || (exercise.skill === 'speaking' || exercise.skill === 'listening' ? 20 : 15);

  return (
    <div
      id={`card-${exercise.id}`}
      className={`p-3.5 sm:p-5 rounded-xl transition-all duration-200 w-full max-w-full overflow-hidden ${cardStateClasses}`}
    >
      {/* Top Header info matching educational view */}
      <div className="flex justify-between items-center mb-2.5 sm:mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* Unique Identifier Pill */}
          <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F7931E] bg-[#F7931E]/15 border border-[#F7931E]/30 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
            {exerciseCode}
          </span>

          {/* Skill Tag */}
          <span className="text-[10px] font-mono uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-[#1A1D20] text-white border border-[#8A95A5]/30 shrink-0">
            {exercise.skill}
          </span>

          {/* XP Reward badge */}
          <span className="text-[10px] font-mono font-medium text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-1.5 py-0.5 rounded shrink-0">
            +{xpReward} XP
          </span>

          {attempt.state === 'first_fail' && (
            <span className="text-[10px] text-[#F59E0B] font-medium flex items-center gap-1 bg-[#F59E0B]/15 px-1.5 sm:px-2 py-0.5 rounded border border-[#F59E0B]/30">
              <AlertTriangle className="w-3 h-3 shrink-0" /> <span className="truncate">Intento 2</span>
            </span>
          )}
          {attempt.state === 'correct' && (
            <span className="text-[10px] text-[#39FF14] font-medium flex items-center gap-1 bg-[#39FF14]/15 px-1.5 sm:px-2 py-0.5 rounded border border-[#39FF14]/30">
              <CheckCircle2 className="w-3 h-3 shrink-0" /> ¡Correcto!
            </span>
          )}
          {attempt.state === 'second_fail' && (
            <span className="text-[10px] text-[#EF4444] font-medium flex items-center gap-1 bg-[#EF4444]/15 px-1.5 sm:px-2 py-0.5 rounded border border-[#EF4444]/30">
              <XCircle className="w-3 h-3 shrink-0" /> Revelada
            </span>
          )}
        </div>

        {/* Reset / retry action button */}
        {isLocked && onReset && (
          <button
            type="button"
            onClick={handleResetCard}
            title="Volver a intentar este ejercicio"
            className="text-[#8A95A5] hover:text-white transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px] shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px]">Reintentar</span>
          </button>
        )}
      </div>

      {/* Reading Passage snippet if present */}
      {exercise.readingPassage && (
        <div className="mb-3 p-3 sm:p-3.5 rounded-lg bg-[#0B1E36]/60 border border-[#8A95A5]/30 text-xs text-gray-200 leading-relaxed font-sans shadow-inner w-full">
          <div className="flex items-center gap-1.5 text-[10px] text-[#F7931E] font-semibold uppercase font-mono mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#F7931E] shrink-0" />
            <span>Texto de Lectura:</span>
          </div>
          <p className="italic text-gray-200 whitespace-pre-line leading-relaxed break-words text-[11px] sm:text-xs">
            "{exercise.readingPassage}"
          </p>
        </div>
      )}

      {/* Audio player if audioPromptText is present */}
      {exercise.audioPromptText && (
        <div className="mb-3 p-2 sm:p-2.5 rounded bg-[#0B1E36]/80 border border-[#8A95A5]/30 flex items-center justify-between gap-2">
          <AudioControl
            id={`exercise-audio-${exercise.id}`}
            text={exercise.audioPromptText}
            lang="en-US"
            variant="pill"
            label="Escuchar Audio"
            size="sm"
          />
          <span className="text-[10px] text-[#8A95A5] font-mono shrink-0">Audio</span>
        </div>
      )}

      {/* Prompt Question */}
      <p className="text-xs sm:text-sm text-white mb-3 sm:mb-3.5 leading-relaxed font-medium break-words">
        {exercise.prompt}
      </p>

      {/* Options Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 w-full ${isLocked ? 'pointer-events-none' : ''}`}>
        {exercise.options.map((opt) => {
          const isStaged = stagedOptionId === opt.id;
          const isAttemptOption = attempt.selectedOptionId === opt.id;
          const isSelected = isStaged || isAttemptOption;

          let btnStyle = 'p-2.5 text-xs rounded-lg bg-[#1A1D20] border border-[#8A95A5]/25 text-gray-200 hover:border-[#F7931E]/60 hover:text-white';

          if (!isLocked && isStaged) {
            btnStyle = 'p-2.5 text-xs rounded-lg bg-[#F7931E]/20 border-2 border-[#F7931E] text-white font-medium shadow-[0_0_12px_rgba(247,147,30,0.2)]';
          }

          if (attempt.state === 'correct') {
            if (isSelected) {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#39FF14]/20 border border-[#39FF14] text-white font-medium';
            } else {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#121416] border border-[#8A95A5]/15 text-[#8A95A5] opacity-40';
            }
          } else if (attempt.state === 'first_fail') {
            if (isAttemptOption) {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/60 text-gray-300';
            } else if (isStaged) {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#F7931E]/20 border-2 border-[#F7931E] text-white font-medium';
            } else {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#1A1D20] border border-[#8A95A5]/30 text-white hover:border-[#F7931E]/60';
            }
          } else if (attempt.state === 'second_fail') {
            if (isAttemptOption) {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/60 text-[#EF4444] line-through opacity-70';
            } else if (opt.isCorrect) {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#39FF14]/20 border-2 border-[#39FF14] text-white font-semibold shadow-[0_0_10px_rgba(57,255,20,0.3)]';
            } else {
              btnStyle = 'p-2.5 text-xs rounded-lg bg-[#121416] border border-[#8A95A5]/15 text-[#8A95A5] opacity-30';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelectOption(opt.id)}
              className={`text-left transition-all duration-150 flex items-center justify-between break-words ${btnStyle} ${
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
              }`}
            >
              <span className="break-words mr-2">{opt.text}</span>
              {isSelected && attempt.state === 'correct' && (
                <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 ml-1.5" />
              )}
              {isAttemptOption && attempt.state === 'first_fail' && (
                <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 ml-1.5" />
              )}
              {isAttemptOption && attempt.state === 'second_fail' && (
                <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 ml-1.5" />
              )}
              {attempt.state === 'second_fail' && opt.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 ml-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Verification Action Button (when option selected and not yet resolved) */}
      {!isLocked && (
        <div className="mt-3 sm:mt-3.5 flex items-center justify-between pt-2 border-t border-[#8A95A5]/15 gap-2 flex-wrap">
          <div className="text-[11px] text-[#8A95A5] min-w-0">
            {stagedOptionId ? (
              <span className="text-white font-medium break-words">Opción seleccionada.</span>
            ) : (
              <span className="break-words">Elige una opción</span>
            )}
          </div>
          <button
            type="button"
            disabled={!stagedOptionId}
            onClick={handleVerify}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              stagedOptionId
                ? 'bg-[#F7931E] hover:bg-[#e07f12] text-white shadow-[0_0_14px_rgba(247,147,30,0.35)]'
                : 'bg-[#1A1D20] text-[#8A95A5] border border-[#8A95A5]/25 cursor-not-allowed opacity-60'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Verificar</span>
          </button>
        </div>
      )}

      {/* 3-State Feedback Message */}
      {attempt.state === 'correct' && (
        <div
          id={`feedback-${exercise.id}`}
          className="mt-3 text-xs text-[#39FF14] bg-[#39FF14]/10 p-2.5 sm:p-3 rounded-lg border border-[#39FF14]/30 flex items-start gap-2 animate-fadeIn break-words"
        >
          <CheckCircle2 className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
          <div className="min-w-0 break-words">
            <span className="font-bold">✓ Correcta (+{xpReward} XP):</span>{' '}
            <span className="text-gray-200">{exercise.correctExplanation}</span>
          </div>
        </div>
      )}

      {attempt.state === 'first_fail' && (
        <div
          id={`feedback-${exercise.id}`}
          className="mt-3 text-xs text-[#F59E0B] bg-[#F59E0B]/10 p-2.5 rounded-lg border border-[#F59E0B]/30 flex items-start gap-2 animate-fadeIn break-words"
        >
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="min-w-0 break-words">
            <span className="font-bold">⚠ Primer intento incorrecto:</span> Elige otra opción y verifica.
          </div>
        </div>
      )}

      {attempt.state === 'second_fail' && (
        <div
          id={`feedback-${exercise.id}`}
          className="mt-3 text-xs text-gray-300 bg-[#121416] p-2.5 sm:p-3 rounded-lg border border-[#EF4444]/40 flex items-start gap-2 animate-fadeIn break-words"
        >
          <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div className="min-w-0 break-words">
            <span className="font-bold text-[#EF4444]">✗ Agotados:</span>{' '}
            <span className="text-gray-200">{exercise.failureExplanation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

