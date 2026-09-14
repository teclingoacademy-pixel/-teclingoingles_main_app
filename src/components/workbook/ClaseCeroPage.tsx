import React, { useState, useEffect } from 'react';
import { 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Lock, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Brain,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Bookmark,
  LayoutGrid,
  ExternalLink
} from 'lucide-react';
import { soundManager, stopSpeech } from '@/utils/workbook/audioFeedback';
import { INITIAL_TEXTO_EXPLICATIVO } from '@/data/workbook/googleDatasheetA1';
import { TeacherVirtualCard } from './TeacherVirtualCard';
import { AudioControl } from './AudioControl';

interface ClaseCeroPageProps {
  onNavigateCover?: () => void;
  onNavigateIndex?: () => void;
  onNavigateSettings?: () => void;
  onNavigateDatasheet?: () => void;
  onStartExercises?: () => void;
}

export const ClaseCeroPage: React.FC<ClaseCeroPageProps> = ({
  onNavigateCover,
  onNavigateIndex,
  onNavigateSettings,
  onNavigateDatasheet,
  onStartExercises,
}) => {
  // Estado para simular la interacción de los ejercicios
  const [selectedEx1, setSelectedEx1] = useState<string | null>(null);
  const [selectedEx2, setSelectedEx2] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string>('grammar');

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Exercise 1 handling
  const handleSelectEx1 = (opt: string) => {
    setSelectedEx1(opt);
    if (opt === 'child') {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
  };

  // Exercise 2 handling
  const handleSelectEx2 = (opt: string) => {
    setSelectedEx2(opt);
    if (opt === 'books') {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleResetExercises = () => {
    setSelectedEx1(null);
    setSelectedEx2(null);
  };

  // Live calculation of stats
  const ex1Correct = selectedEx1 === 'child';
  const ex2Correct = selectedEx2 === 'books';
  const correctCount = (ex1Correct ? 1 : 0) + (ex2Correct ? 1 : 0);
  const answeredCount = (selectedEx1 ? 1 : 0) + (selectedEx2 ? 1 : 0);
  const earnedXp = (ex1Correct ? 15 : 0) + (ex2Correct ? 15 : 0);
  const progressPercent = Math.round((correctCount / 31) * 100);

  const vocabList = [
    { en: 'book', ipa: '/bʊk/', es: 'libro' },
    { en: 'books', ipa: '/bʊks/', es: 'libros' },
    { en: 'child', ipa: '/tʃaɪld/', es: 'niño' },
    { en: 'children', ipa: '/ˈtʃɪldrən/', es: 'niños' },
    { en: 'person', ipa: '/ˈpɜːrsən/', es: 'persona' },
    { en: 'people', ipa: '/ˈpiːpl/', es: 'personas' }
  ];

  const skillTabs = [
    { id: 'grammar', label: 'Grammar (5)' },
    { id: 'vocab', label: 'Vocabulary (6)' },
    { id: 'reading', label: 'Reading (5)' },
    { id: 'listening', label: 'Listening (5)' },
    { id: 'writing', label: 'Writing (5)' },
    { id: 'speaking', label: 'Speaking (5)' },
    { id: 'all', label: 'Todos (31 reactivos)' },
  ];

  const baseTextContent = "One book is here. Two books are here. One child is happy. Many children are playing. One person is here. Many people are here. Books and children are plural.";

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-gray-800 rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-gray-200 overflow-x-hidden my-0 sm:my-4 max-w-full">
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight">TECLINGO</span>
            <span className="text-gray-300">|</span>
            <span className="text-[11px] sm:text-sm font-medium text-gray-600 truncate max-w-[140px] sm:max-w-none">Cuaderno Digital</span>
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-4 text-xs sm:text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar py-0.5">
            {onNavigateCover && (
              <button 
                type="button" 
                onClick={onNavigateCover}
                className="hover:text-blue-600 px-2 py-1 transition-colors cursor-pointer shrink-0"
              >
                Portada
              </button>
            )}
            {onNavigateIndex && (
              <button 
                type="button" 
                onClick={onNavigateIndex}
                className="flex items-center gap-1 hover:text-blue-600 px-2 py-1 transition-colors cursor-pointer text-blue-600 font-semibold shrink-0"
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>Índice A1</span>
              </button>
            )}
            <span className="text-blue-600 border-b-2 border-blue-600 px-2 py-1 font-bold cursor-default shrink-0">
              Cuaderno
            </span>
            {onNavigateSettings && (
              <button 
                type="button" 
                onClick={onNavigateSettings}
                className="hover:text-blue-600 px-2 py-1 transition-colors cursor-pointer shrink-0"
              >
                Admin
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-7 max-w-full overflow-hidden">
        {/* BADGE DE NIVEL Y CLASE */}
        <div className="mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-sm max-w-full">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse shrink-0" />
            <span className="truncate">NIVEL A1 · CLASE 01 · SEMANA 1 · SESIÓN A</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 sm:mt-3 break-words">
            Fase Cero: Singular & Plural
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-gray-600 mt-1 font-normal break-words">
            La Regla de Oro del Inglés: <span className="font-semibold text-blue-700">YOU siempre es plural</span>
          </p>
        </div>

        {/* GRID PRINCIPAL: 60% Izquierda (3 cols), 40% Derecha (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-7 w-full">
          
          {/* ================= COLUMNA IZQUIERDA (60%) ================= */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 w-full">
            
            {/* 1. VIDEO TECLINGO (YOUTUBE SHORTS 9:16) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
              {/* Header de la tarjeta del video */}
              <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    FASE CERO TECLINGO
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shrink-0">
                    9:16
                  </span>
                </div>
                <a 
                  href="https://youtube.com/shorts/JBB6JZT4VIc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors shrink-0"
                  title="Abrir en YouTube Shorts"
                >
                  <span className="hidden sm:inline">Abrir en YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Contenedor vertical responsive 9:16 optimizado para celulares */}
              <div className="bg-slate-950 p-2 sm:p-5 flex justify-center items-center w-full">
                <div className="w-full max-w-[280px] sm:max-w-[340px] aspect-[9/16] relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
                  <iframe
                    className="w-full h-full absolute inset-0 border-0"
                    src="https://www.youtube.com/embed/JBB6JZT4VIc?controls=1&rel=0&modestbranding=1&playsinline=1"
                    title="FASE CERO TECLINGO: El Secreto de los Singulares y Plurales"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Footer con controles y fallback directo */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <p className="text-gray-700 text-[11px] sm:text-xs break-words">
                  <span className="font-semibold text-gray-900">CLASE 01:</span> El Secreto de los Singulares y Plurales
                </p>
                <a 
                  href="https://youtube.com/shorts/JBB6JZT4VIc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors"
                >
                  <Play className="w-3 h-3 fill-red-600 shrink-0" />
                  <span>Ver en YouTube</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* TEACHER VIRTUAL BILINGÜE: EXPLICACIÓN EN ESPAÑOL CON EJEMPLOS EN INGLÉS */}
            <TeacherVirtualCard 
              explicacion={INITIAL_TEXTO_EXPLICATIVO.find((e) => e.clase_id === 'A1_C01') || INITIAL_TEXTO_EXPLICATIVO[0]} 
              claseId="A1_C01" 
              theme="light" 
            />

            {/* 2. GRAMMAR TIP: "LA REGLA DE ORO" */}
            <div className="bg-blue-50 rounded-xl border-l-4 border-blue-600 p-4 sm:p-5 shadow-xs w-full">
              <h3 className="flex items-center text-blue-900 font-bold text-sm sm:text-lg mb-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 shrink-0" />
                <span>GRAMMAR TIP: "LA REGLA DE ORO"</span>
              </h3>
              <p className="text-gray-800 mb-3 text-xs sm:text-base leading-relaxed break-words">
                En inglés, <strong>YOU</strong> siempre funciona como <strong>PLURAL</strong>, incluso cuando hablas de una sola persona.
              </p>
              <div className="space-y-2 text-xs sm:text-sm font-medium">
                <div className="flex flex-col sm:flex-row sm:items-center text-red-600 bg-red-50/90 border border-red-200/60 p-2.5 rounded-lg gap-1">
                  <div className="flex items-center">
                    <span className="font-mono text-sm mr-2">❌</span>
                    <span>"You is my friend"</span>
                  </div>
                  <span className="text-[11px] text-red-500 sm:ml-auto">(Incorrecto: YOU nunca usa 'is')</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center text-green-800 bg-green-50 border border-green-200/80 p-2.5 rounded-lg gap-1">
                  <div className="flex items-center">
                    <span className="font-mono text-sm mr-2">✅</span>
                    <span>"You are my friend"</span>
                  </div>
                  <span className="text-[11px] text-green-600 sm:ml-auto">(Correcto: YOU siempre usa 'are')</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-xs sm:text-sm">
                <p className="font-bold text-blue-700">Regla: YOU + ARE (siempre)</p>
                <span className="text-[11px] text-blue-600 font-mono">Fase Cero · #1</span>
              </div>
            </div>

            {/* 3. VOCABULARIO CLAVE DE LA SESIÓN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-gray-900 text-xs sm:text-base flex items-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600 shrink-0" />
                  <span>VOCABULARIO CLAVE</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  6 Palabras
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {vocabList.map((word, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50/80 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{word.en}</span>
                        <span className="text-gray-500 text-[11px] font-mono">{word.ipa}</span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5">{word.es}</p>
                    </div>
                    <AudioControl
                      id={`clase-cero-vocab-${word.en}`}
                      text={word.en}
                      lang="en-US"
                      size="xs"
                      title={`Escuchar ${word.en}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TEXTO BASE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-bold text-gray-900 text-xs sm:text-base flex items-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600 shrink-0" />
                  <span>TEXTO BASE: "Singular & Plural"</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono">
                  30 palabras
                </span>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-3">
                <p className="text-gray-800 leading-relaxed italic text-xs sm:text-base break-words">
                  "{baseTextContent}"
                </p>
              </div>
              <AudioControl
                id="clase-cero-texto-base"
                text={baseTextContent}
                lang="en-US"
                variant="pill"
                label="Escuchar Texto Base"
                size="sm"
              />
            </div>

            {/* 5. PROTOCOLO / ALERTA (Rojo #ef4444) */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 w-full">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h4 className="font-bold text-red-800 text-[11px] sm:text-sm mb-0.5 uppercase tracking-wider font-mono">
                  PROTOCOLO / ALERTA
                </h4>
                <p className="text-red-700 text-xs sm:text-sm leading-relaxed break-words">
                  ⚠️ Recuerda: <strong>"people"</strong> es el plural de <strong>"person"</strong>, NO "persons". Es un plural irregular que debes memorizar.
                </p>
              </div>
            </div>
          </div>

          {/* ================= COLUMNA DERECHA (40%) ================= */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full">
            
            {/* 1. SKILL FOCUS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-xs sm:text-base flex items-center gap-1.5">
                  <span>🎯 SKILL FOCUS</span>
                </h3>
                <button
                  type="button"
                  onClick={handleResetExercises}
                  title="Reiniciar intentos de los ejercicios"
                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {skillTabs.slice(0, 6).map((tab) => {
                  const isActive = activeSkill === tab.id;
                  return (
                    <button 
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSkill(tab.id)}
                      className={`text-left px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-all border cursor-pointer truncate ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                          : 'bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700 border-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
                <button 
                  type="button"
                  onClick={() => setActiveSkill('all')}
                  className={`col-span-2 text-center px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all mt-0.5 cursor-pointer border ${
                    activeSkill === 'all'
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                  }`}
                >
                  Todos (31 reactivos)
                </button>
              </div>
            </div>

            {/* 2. EJERCICIOS PREVIEW (EX_01 y EX_02) */}
            <div className="space-y-3.5 sm:space-y-4 w-full">
              {/* EX_01 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">📝 EX_01 · GRAMMAR</h4>
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-mono">
                    +15 XP
                  </span>
                </div>
                <p className="text-gray-900 font-medium text-xs sm:text-sm mb-2.5">
                  One ___ is here.
                </p>
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    { id: 'book', label: 'book' },
                    { id: 'books', label: 'books' },
                    { id: 'child', label: 'child' },
                    { id: 'children', label: 'children' },
                  ].map((opt, idx) => {
                    const isSelected = selectedEx1 === opt.id;
                    const isCorrect = opt.id === 'child';
                    let btnClass = 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700';

                    if (isSelected) {
                      if (isCorrect) {
                        btnClass = 'border-green-600 bg-green-50 text-green-900 font-bold';
                      } else {
                        btnClass = 'border-red-500 bg-red-50 text-red-900 font-medium';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectEx1(opt.id)}
                        className={`w-full text-left px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>
                          <strong className="mr-1.5">{String.fromCharCode(65 + idx)})</strong> {opt.label}
                        </span>
                        {isSelected && (
                          isCorrect ? (
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Feedback Explicativo */}
                {selectedEx1 === 'child' && (
                  <div className="mt-2.5 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 flex items-start">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-green-600 shrink-0" />
                    <span>¡Correcto! "Child" es singular (uno solo).</span>
                  </div>
                )}
                {selectedEx1 && selectedEx1 !== 'child' && (
                  <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start">
                    <XCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-red-500 shrink-0" />
                    <span>Intenta nuevamente: "One" requiere sustantivo singular.</span>
                  </div>
                )}
              </div>

              {/* EX_02 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 w-full">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">📝 EX_02 · GRAMMAR</h4>
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-mono">
                    +15 XP
                  </span>
                </div>
                <p className="text-gray-900 font-medium text-xs sm:text-sm mb-2.5">
                  The plural of "book" is ___.
                </p>
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    { id: 'book', label: 'book' },
                    { id: 'books', label: 'books' },
                    { id: 'children', label: 'children' },
                    { id: 'people', label: 'people' },
                  ].map((opt, idx) => {
                    const isSelected = selectedEx2 === opt.id;
                    const isCorrect = opt.id === 'books';
                    let btnClass = 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700';

                    if (isSelected) {
                      if (isCorrect) {
                        btnClass = 'border-green-600 bg-green-50 text-green-900 font-bold';
                      } else {
                        btnClass = 'border-red-500 bg-red-50 text-red-900 font-medium';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectEx2(opt.id)}
                        className={`w-full text-left px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>
                          <strong className="mr-1.5">{String.fromCharCode(65 + idx)})</strong> {opt.label}
                        </span>
                        {isSelected && (
                          isCorrect ? (
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Explicativo */}
                {selectedEx2 === 'books' && (
                  <div className="mt-2.5 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 flex items-start">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-green-600 shrink-0" />
                    <span>¡Correcto! Regla regular: book + s = books.</span>
                  </div>
                )}
                {selectedEx2 && selectedEx2 !== 'books' && (
                  <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start">
                    <XCircle className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-red-500 shrink-0" />
                    <span>Intenta nuevamente: El plural regular se forma con "-s".</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. ESTADÍSTICAS DE LA SESIÓN */}
            <div className="bg-gray-950 text-white rounded-xl shadow-lg p-3.5 sm:p-5 border border-gray-800 w-full">
              <h4 className="font-bold text-gray-300 text-[11px] uppercase tracking-wider mb-2.5 font-mono">
                Estadísticas de la Sesión
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center mb-3 sm:mb-4">
                <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                  <p className="text-base sm:text-2xl font-extrabold text-blue-400 font-mono">
                    {earnedXp}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-mono mt-0.5">XP</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                  <p className="text-base sm:text-2xl font-extrabold text-blue-400 font-mono">
                    {answeredCount}/31
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-mono mt-0.5">Progreso</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                  <p className="text-base sm:text-2xl font-extrabold text-blue-400 font-mono">
                    31
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-mono mt-0.5">Min</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-2.5">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-gray-400">Completado</span>
                  <span className="font-bold text-white font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.max(progressPercent, 0)}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5 text-center font-mono">
                  {correctCount} correctos de 31 reactivos
                </p>
              </div>
            </div>

            {/* 4. META Y ACCIÓN */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 sm:p-5 text-center w-full">
              <h4 className="font-bold text-blue-900 text-xs sm:text-sm mb-1.5 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" />
                <span>META DE LA SESIÓN</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-blue-900 mb-3 leading-relaxed break-words">
                Completa el 100% para desbloquear <strong className="text-blue-950">A1_C02 (Verbo To Be)</strong>
              </p>
              <button 
                type="button"
                onClick={onStartExercises}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
                <span>INICIAR EJERCICIOS</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-6 sm:mt-10 py-4 sm:py-5 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-[11px] sm:text-xs text-gray-700 font-medium">
            🟢 Plataforma Digital: <span className="text-blue-700 font-bold">TECLINGO</span> · Acelerador de Bilingüismo
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-500">
            MCER: A1 · A2 · B1 · B2 · C1
          </p>
        </div>
      </footer>
    </div>
  );
};

