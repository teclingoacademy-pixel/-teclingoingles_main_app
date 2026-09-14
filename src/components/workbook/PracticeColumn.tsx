import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, Trophy, Clock, Target, CheckCircle2, BookOpen, HelpCircle } from 'lucide-react';
import { Exercise, ExerciseAttempt, SkillType } from '@/types/workbook/types';
import { stopSpeech } from '@/utils/workbook/audioFeedback';
import { ExerciseCard } from './ExerciseCard';
import { GrammarTutorialModal, GRAMMAR_TUTORIAL_STORAGE_KEY } from './GrammarTutorialModal';
import { ReadingGrammarTutorialModal, READING_GRAMMAR_TUTORIAL_STORAGE_KEY } from './ReadingGrammarTutorialModal';

interface PracticeColumnProps {
  exercises: Exercise[];
  attempts: Record<string, ExerciseAttempt>;
  onAnswer: (exerciseId: string, optionId: string, isCorrect: boolean) => void;
  onResetExercise: (exerciseId: string) => void;
  onResetAll: () => void;
  onNextSession?: () => void;
}

interface SkillTabConfig {
  id: SkillType | 'all';
  label: string;
  count: number;
}

export const PracticeColumn: React.FC<PracticeColumnProps> = ({
  exercises,
  attempts,
  onAnswer,
  onResetExercise,
  onResetAll,
}) => {
  // Skill focus active filter state. Default to 'grammar' as requested (or user can select any)
  const [activeFilter, setActiveFilter] = useState<SkillType | 'all'>('grammar');
  const [showGrammarTutorial, setShowGrammarTutorial] = useState<boolean>(false);
  const [showReadingTutorial, setShowReadingTutorial] = useState<boolean>(false);

  // Stop any active audio when switching tabs or unmounting
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [activeFilter]);

  // Check tutorial for grammar and reading
  useEffect(() => {
    if (activeFilter === 'grammar') {
      try {
        const seen = localStorage.getItem(GRAMMAR_TUTORIAL_STORAGE_KEY);
        if (seen !== 'true') {
          setShowGrammarTutorial(true);
        }
      } catch {
        setShowGrammarTutorial(true);
      }
    } else if (activeFilter === 'reading') {
      try {
        const seen = localStorage.getItem(READING_GRAMMAR_TUTORIAL_STORAGE_KEY);
        if (seen !== 'true') {
          setShowReadingTutorial(true);
        }
      } catch {
        setShowReadingTutorial(true);
      }
    }
  }, [activeFilter]);

  // Exact skill counts for the 6 required buttons
  const skillCountMap = useMemo(() => {
    const counts: Record<SkillType, number> = {
      grammar: 0,
      vocab: 0,
      reading: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    };
    exercises.forEach((ex) => {
      if (counts[ex.skill] !== undefined) {
        counts[ex.skill]++;
      }
    });
    return counts;
  }, [exercises]);

  // The 6 standard skill tabs + optional "Todos" tab
  const skillTabs: SkillTabConfig[] = [
    { id: 'grammar', label: 'Grammar', count: skillCountMap.grammar },
    { id: 'vocab', label: 'Vocabulary', count: skillCountMap.vocab },
    { id: 'reading', label: 'Reading', count: skillCountMap.reading },
    { id: 'listening', label: 'Listening', count: skillCountMap.listening },
    { id: 'writing', label: 'Writing', count: skillCountMap.writing },
    { id: 'speaking', label: 'Speaking', count: skillCountMap.speaking },
    { id: 'all', label: 'Todos', count: exercises.length },
  ];

  // Filter exercises according to the selected button
  const visibleExercises = useMemo(() => {
    if (activeFilter === 'all') {
      return exercises;
    }
    return exercises.filter((ex) => ex.skill === activeFilter);
  }, [exercises, activeFilter]);

  // Overall statistics across the entire unit (all 30 exercises, 500 XP total)
  const stats = useMemo(() => {
    let completed = 0;
    let correctCount = 0;
    let earnedXP = 0;
    let maxPossibleXP = 0;
    let remainingSeconds = 0;

    exercises.forEach((ex) => {
      const xp = ex.xpValue || (ex.skill === 'speaking' || ex.skill === 'listening' ? 20 : 15);
      maxPossibleXP += xp;

      const att = attempts[ex.id];
      const isResolved = att && (att.state === 'correct' || att.state === 'second_fail');
      
      if (isResolved) {
        completed++;
      }

      if (att && att.state === 'correct') {
        correctCount++;
        earnedXP += xp;
      } else {
        // Estimate remaining time for unanswered/unresolved items
        if (ex.skill === 'grammar') remainingSeconds += 45;
        else if (ex.skill === 'vocab') remainingSeconds += 30;
        else if (ex.skill === 'reading') remainingSeconds += 90;
        else if (ex.skill === 'listening') remainingSeconds += 90;
        else if (ex.skill === 'writing') remainingSeconds += 90;
        else if (ex.skill === 'speaking') remainingSeconds += 60;
      }
    });

    const total = exercises.length || 30;
    const progressPercent = Math.round((completed / total) * 100);
    const estimatedMinutes = Math.ceil(remainingSeconds / 60);
    const isAllCompleted = completed === total && total > 0;
    const isAllCorrect = correctCount === total && total > 0;

    return {
      total,
      completed,
      correctCount,
      earnedXP,
      maxPossibleXP: maxPossibleXP || 500,
      progressPercent,
      estimatedMinutes,
      isAllCompleted,
      isAllCorrect,
    };
  }, [exercises, attempts]);

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 max-w-full overflow-hidden">
      {/* Skill Focus Filter Bar (ALWAYS VISIBLE IN A ROW) */}
      <div className="bg-[#121416] p-3 sm:p-4 rounded-xl border border-[#8A95A5]/25 shadow-md flex flex-col gap-2.5 sm:gap-3 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#F7931E] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono truncate">
              Skill Focus
            </span>
            <span className="text-[10px] text-[#8A95A5] hidden sm:inline">
              • Filtra por habilidad
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeFilter === 'grammar' && (
              <button
                type="button"
                onClick={() => setShowGrammarTutorial(true)}
                title="Ver explicación y tutorial de Grammar"
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-500/40 text-blue-300 hover:text-white hover:border-blue-400 hover:bg-blue-950/40 text-[11px] transition-all cursor-pointer shrink-0"
              >
                <HelpCircle className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">Tutorial</span>
              </button>
            )}

            {/* Reset all user responses button */}
            <button
              type="button"
              onClick={onResetAll}
              title="Reiniciar todos los reactivos de la unidad"
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#8A95A5]/25 text-[#8A95A5] hover:text-white hover:border-[#8A95A5]/60 hover:bg-[#1A1D20] text-[11px] transition-all cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* 6 Skill Buttons in a Row (always visible with horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-[#8A95A5]/15 overflow-x-auto no-scrollbar py-1 w-full flex-nowrap sm:flex-wrap">
          {skillTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap select-none shrink-0 ${
                  isActive
                    ? 'bg-[#F7931E] text-white font-semibold shadow-[0_0_12px_rgba(247,147,30,0.35)] border border-[#F7931E]'
                    : 'bg-[#1A1D20] text-white hover:bg-[#23272B] border border-[#8A95A5]/25 hover:border-[#8A95A5]/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : tab.count > 0
                      ? 'bg-[#121416] text-[#39FF14]'
                      : 'bg-[#121416] text-[#8A95A5]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual purpose informational notice for Vocabulary skill (Master Data reference) */}
      {activeFilter === 'vocab' && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#0B1E36]/90 border border-[#F7931E]/40 text-xs text-gray-200 shadow-sm flex items-start gap-2.5 w-full">
          <BookOpen className="w-4 h-4 text-[#F7931E] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-semibold text-white block mb-0.5 text-xs">📚 Master Data & Glosario</span>
            <span className="text-gray-300 leading-relaxed text-[11px] break-words">
              Banco sincronizado con el repositorio léxico del nivel A2.
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Exercises List (Filtered by active skill) */}
      <div
        id="exercise-list"
        className="flex flex-col gap-3.5 overflow-y-auto max-h-[440px] pr-1 custom-scrollbar w-full"
      >
        {visibleExercises.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-[#8A95A5] bg-[#121416]/60 rounded-xl border border-dashed border-[#8A95A5]/30 my-3 flex flex-col items-center justify-center gap-2 w-full">
            <span className="text-2xl">📋</span>
            <p className="text-xs sm:text-sm font-medium text-gray-200 break-words">
              No hay ejercicios disponibles para esta habilidad en esta unidad.
            </p>
            <p className="text-[11px] text-[#8A95A5]">
              Selecciona otra habilidad para continuar.
            </p>
          </div>
        ) : (
          visibleExercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={idx}
              attempt={attempts[exercise.id]}
              onAnswer={onAnswer}
              onReset={onResetExercise}
            />
          ))
        )}
      </div>

      {/* Panel de Progreso y Forecast (SIEMPRE VISIBLE, FIJO EN LA PARTE INFERIOR) */}
      <div
        id="progress-forecast-panel"
        className="bg-[#0B1E36] border border-[#8A95A5]/30 rounded-xl p-3 sm:p-4 shadow-xl flex flex-col gap-2.5 sm:gap-3 mt-auto w-full"
      >
        {/* Row 1: Metrics Header */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pb-2 border-b border-[#8A95A5]/20">
          {/* XP Score */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 bg-[#121416]/70 p-1.5 sm:p-2 rounded-lg border border-[#8A95A5]/20 text-center sm:text-left min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-[#F7931E]/15 border border-[#F7931E]/30 flex items-center justify-center text-[#F7931E] shrink-0">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#8A95A5] uppercase font-mono block truncate">Puntos</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                {stats.earnedXP} XP
              </span>
            </div>
          </div>

          {/* Progress Counter */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 bg-[#121416]/70 p-1.5 sm:p-2 rounded-lg border border-[#8A95A5]/20 text-center sm:text-left min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-[#39FF14]/15 border border-[#39FF14]/30 flex items-center justify-center text-[#39FF14] shrink-0">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#8A95A5] uppercase font-mono block truncate">Progreso</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                {stats.completed}/{stats.total}
              </span>
            </div>
          </div>

          {/* Estimated Time Remaining */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 bg-[#121416]/70 p-1.5 sm:p-2 rounded-lg border border-[#8A95A5]/20 text-center sm:text-left min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-[#8A95A5]/15 border border-[#8A95A5]/30 flex items-center justify-center text-white shrink-0">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#8A95A5] uppercase font-mono block truncate">Tiempo</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                {stats.estimatedMinutes} min
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-300 text-[10px] sm:text-[11px] font-medium truncate">
              Completado: {stats.progressPercent}%
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#8A95A5] font-mono shrink-0">
              {stats.correctCount}/{stats.total} correctos
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-[#121416] rounded-full overflow-hidden border border-[#8A95A5]/25">
            <div
              className="h-full bg-gradient-to-r from-[#F7931E] via-[#39FF14] to-[#39FF14] transition-all duration-300 rounded-full"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Row 3: Goal / Achievement Banner */}
        <div
          className={`p-2 sm:p-2.5 rounded-lg border text-[11px] sm:text-xs flex items-center gap-2 transition-all w-full ${
            stats.isAllCompleted
              ? 'bg-[#39FF14]/15 border-[#39FF14]/50 text-[#39FF14] font-semibold'
              : 'bg-[#121416]/90 border-[#8A95A5]/25 text-gray-200'
          }`}
        >
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F7931E] shrink-0" />
          <span className="break-words">
            {stats.isAllCompleted
              ? "🎉 ¡Completada! Has dominado esta unidad."
              : '🎯 Completa el 100% para desbloquear la siguiente clase.'}
          </span>
        </div>
      </div>

      {/* Grammar Tutorial Modal */}
      <GrammarTutorialModal
        isOpen={showGrammarTutorial}
        onClose={() => setShowGrammarTutorial(false)}
      />

      {/* Reading + Sentence Completion Tutorial Modal */}
      <ReadingGrammarTutorialModal
        isOpen={showReadingTutorial}
        onClose={() => setShowReadingTutorial(false)}
      />
    </div>
  );
};

