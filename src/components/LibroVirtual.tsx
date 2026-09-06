/**
@license
SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Brain, Headphones, Mic, PenTool, MessageSquare, Volume2,
  CheckCircle, AlertCircle, Loader2, ChevronDown, ShieldAlert, Save,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// CONFIGURACIÓN API
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycby7SoFITEh4jp_MdvH3pwoi8HhdvOwJfmDC0l-0E6lTY0FBbs5y3MGyBLLJcoEnxpit/exec";

// ==========================================
// INTERFACES TIPO (TypeScript)
// ==========================================
interface LessonMetadata {
  LESSON_ID: string;
  LEVEL_MCER: string;
  TITLE_EN: string;
  TITLE_ES: string;
  LESSON_DESCRIPTION: string;
  THEORY_SUMMARY: string;
  DESCRIPTOR_MCER: string;
  YOUTUBE_VIDEO_URL: string;
  horas_json: any[];
  grammar_focus: string;
  table_headers_json: string[];
  table_rows_json: any[][];
  bullets_json: string[];
  toefl_tip: string;
  kpi: string;
  paginas: string;
  fechas: string;
}

interface ExerciseRow {
  Exercise_ID: string;
  Skill: string;
  Prompt_EN: string;
  Prompt_ES: string;
  Options_Pipe_Separated: string;
  Correct_Answer: string;
  Audio_Script: string;
  Feedback_Rule: string;
}

interface LibroVirtualProps {
  lessonId?: string;
  role: 'alumno' | 'docente' | 'director';
}

// ==========================================
// CONFIGURACIÓN DE HABILIDADES (TABS DE COLORES)
// ==========================================
const SKILL_TABS: Record<string, {
  icon: React.ElementType;
  label: string;
  color: string;
  borderColor: string;
  textColor: string;
}> = {
  grammar: { icon: Brain, label: "Grammar", color: "bg-purple-500", borderColor: "border-purple-500", textColor: "text-purple-400" },
  vocabulary: { icon: BookOpen, label: "Vocabulary", color: "bg-blue-500", borderColor: "border-blue-500", textColor: "text-blue-400" },
  reading: { icon: MessageSquare, label: "Reading", color: "bg-emerald-500", borderColor: "border-emerald-500", textColor: "text-emerald-400" },
  listening: { icon: Headphones, label: "Listening", color: "bg-cyan-500", borderColor: "border-cyan-500", textColor: "text-cyan-400" },
  writing: { icon: PenTool, label: "Writing", color: "bg-amber-500", borderColor: "border-amber-500", textColor: "text-amber-400" },
  speaking: { icon: Mic, label: "Speaking", color: "bg-rose-500", borderColor: "border-rose-500", textColor: "text-rose-400" }
};

// ==========================================
// FUNCIÓN AUXILIAR: EXTRAER ID DE YOUTUBE
// ==========================================
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\/shorts\/|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ==========================================
// TRANSFORMAR FILA DE MALLACURRICULAR A LESSON
// ==========================================
const transformMallaRowToLesson = (row: any, index: number): LessonMetadata => {
  const lessonId = `N1-C${String(index + 1).padStart(2, '0')}`;
  const horas = Array.isArray(row.horas_json) ? row.horas_json : [];
  const firstVideoId = horas[0]?.videoId || '';
  const youtubeUrl = firstVideoId ? `https://www.youtube.com/watch?v=${firstVideoId}` : '';

  const bullets: string[] = Array.isArray(row.bullets_json) ? row.bullets_json : [];
  const grammarFocus = row.grammar_focus || '';
  const theorySummary = [grammarFocus, ...bullets].filter(Boolean).join('\n\n');

  return {
    LESSON_ID: lessonId,
    LEVEL_MCER: row.semestre || 'N/A',
    TITLE_EN: row.eje_tematico || 'Untitled',
    TITLE_ES: row.unidad_libro || 'Sin título',
    LESSON_DESCRIPTION: `${row.eje_tematico || ''} — ${row.unidad_libro || ''} (${row.fechas || ''})`,
    THEORY_SUMMARY: theorySummary,
    DESCRIPTOR_MCER: `${row.semestre || ''} • ${row.fechas || ''} • ${row.paginas || ''}`,
    YOUTUBE_VIDEO_URL: youtubeUrl,
    horas_json: horas,
    grammar_focus: grammarFocus,
    table_headers_json: Array.isArray(row.table_headers_json) ? row.table_headers_json : [],
    table_rows_json: Array.isArray(row.table_rows_json) ? row.table_rows_json : [],
    bullets_json: bullets,
    toefl_tip: row.toefl_tip || '',
    kpi: row.kpi || '',
    paginas: row.paginas || '',
    fechas: row.fechas || '',
  };
};

// ==========================================
// GENERAR EJERCICIOS DESDE FILA MALLA
// ==========================================
const generateExercisesFromRow = (row: any, lessonId: string): ExerciseRow[] => {
  const exercises: ExerciseRow[] = [];
  let exIdx = 1;

  const headers: string[] = Array.isArray(row.table_headers_json) ? row.table_headers_json : [];
  const rows: any[][] = Array.isArray(row.table_rows_json) ? row.table_rows_json : [];
  const bullets: string[] = Array.isArray(row.bullets_json) ? row.bullets_json : [];
  const horas: any[] = Array.isArray(row.horas_json) ? row.horas_json : [];

  // 1. Grammar: ejercicios de opción múltiple desde la tabla
  if (rows.length > 0) {
    rows.forEach((tableRow: any[], rIdx: number) => {
      if (tableRow && tableRow.length > 0) {
        const correctAnswer = String(tableRow[0] || '');
        const wrongOptions = rows
          .filter((_: any, i: number) => i !== rIdx)
          .map((r: any[]) => String(r[0] || ''))
          .filter((v: string) => v && v !== correctAnswer)
          .slice(0, 3);

        if (correctAnswer && wrongOptions.length > 0) {
          const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
          // Usar grammar_focus como pregunta principal
          const promptQuestion = row.grammar_focus || 'Complete the sentence with the correct option';
          exercises.push({
            Exercise_ID: `${lessonId}-G${String(exIdx++).padStart(2, '0')}`,
            Skill: 'grammar',
            Prompt_EN: promptQuestion,
            Prompt_ES: `Selecciona la opción correcta: ${correctAnswer.replace(/\*\*/g, '')}`,
            Options_Pipe_Separated: allOptions.join('|'),
            Correct_Answer: correctAnswer,
            Audio_Script: '',
            Feedback_Rule: bullets[0] || row.toefl_tip || '',
          });
        }
      }
    });
  }

  // 2. Vocabulary: desde horas_json lecciones
  horas.forEach((hora: any, hIdx: number) => {
    if (hora.leccion) {
      const trackParts = (hora.track || '').replace(/[\[\]]/g, '').split('|').map((s: string) => s.trim()).filter(Boolean);
      const skill = trackParts.length > 0 ? trackParts[0].toLowerCase() : 'vocabulary';

      exercises.push({
        Exercise_ID: `${lessonId}-V${String(hIdx + 1).padStart(2, '0')}`,
        Skill: skill,
        Prompt_EN: `${hora.leccion}: ${hora.enfoque || ''}`,
        Prompt_ES: `Lección ${hora.hora || hIdx + 1}: ${hora.enfoque || hora.leccion}`,
        Options_Pipe_Separated: '',
        Correct_Answer: '',
        Audio_Script: '',
        Feedback_Rule: hora.enfoque || '',
      });
    }
  });

  // 3. Reading: bullets como ejercicios de comprensión
  if (bullets.length > 1) {
    bullets.forEach((bullet: string, bIdx: number) => {
      if (bullet && bullet.length > 10) {
        exercises.push({
          Exercise_ID: `${lessonId}-R${String(bIdx + 1).padStart(2, '0')}`,
          Skill: 'reading',
          Prompt_EN: bullet,
          Prompt_ES: `Regla ${bIdx + 1}: ${bullet.substring(0, 80)}...`,
          Options_Pipe_Separated: '',
          Correct_Answer: '',
          Audio_Script: '',
          Feedback_Rule: row.toefl_tip || '',
        });
      }
    });
  }

  // 4. TOEFL Tip como writing exercise
  if (row.toefl_tip) {
    exercises.push({
      Exercise_ID: `${lessonId}-W01`,
      Skill: 'writing',
      Prompt_EN: row.toefl_tip,
      Prompt_ES: `Escribe un párrafo aplicando la regla TOEFL de esta lección.`,
      Options_Pipe_Separated: '',
      Correct_Answer: '',
      Audio_Script: '',
      Feedback_Rule: row.toefl_tip,
    });
  }

  // 5. Speaking: si hay video, pedir práctica oral
  if (horas.length > 0) {
    exercises.push({
      Exercise_ID: `${lessonId}-S01`,
      Skill: 'speaking',
      Prompt_EN: `Practice speaking about: ${row.eje_tematico || 'this topic'}. Use the vocabulary and grammar from this lesson.`,
      Prompt_ES: `Practica hablando sobre: ${row.eje_tematico || 'este tema'}. Usa el vocabulario y la gramática de esta lección.`,
      Options_Pipe_Separated: '',
      Correct_Answer: '',
      Audio_Script: '',
      Feedback_Rule: 'Intenta hablar durante al menos 45 segundos usando las estructuras de esta lección.',
    });
  }

  // 6. Listening placeholder si hay videos
  const hasListening = horas.some((h: any) => (h.track || '').toLowerCase().includes('listening'));
  if (hasListening) {
    exercises.push({
      Exercise_ID: `${lessonId}-L01`,
      Skill: 'listening',
      Prompt_EN: `Listen to the class video and identify key vocabulary about: ${row.eje_tematico || 'this topic'}.`,
      Prompt_ES: `Escucha el video de la clase e identifica el vocabulario clave sobre: ${row.eje_tematico || 'este tema'}.`,
      Options_Pipe_Separated: '',
      Correct_Answer: '',
      Audio_Script: '',
      Feedback_Rule: 'Revisa el video de la lección y toma nota de las palabras nuevas.',
    });
  }

  return exercises;
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export function LibroVirtual({ lessonId = "N1-C01", role }: LibroVirtualProps) {
  const [metadata, setMetadata] = useState<LessonMetadata | null>(null);
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string>("grammar");

  // Estados para navegación entre lecciones
  const [allLessons, setAllLessons] = useState<string[]>([]);
  const [allLessonsData, setAllLessonsData] = useState<LessonMetadata[]>([]);
  const [mallaRawData, setMallaRawData] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState(lessonId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [tempGrade, setTempGrade] = useState("100");

  // ==========================================
  // CARGA DE DATOS DESDE MALLACURRICULAR
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}?action=read&sheet=MallaCurricular`);
        const rawData = await res.json();
        const data: any[] = Array.isArray(rawData)
          ? rawData
          : (rawData?.rows || rawData?.data || rawData?.result || []);

        if (!data || data.length === 0) {
          setError('No se encontraron datos en MallaCurricular');
          setIsLoading(false);
          return;
        }

        const lessons: LessonMetadata[] = data.map((row, idx) => transformMallaRowToLesson(row, idx));
        const lessonIds = lessons.map(l => l.LESSON_ID);

        setMallaRawData(data);
        setAllLessonsData(lessons);
        setAllLessons(lessonIds);

        let targetIdx = lessonIds.indexOf(lessonId);
        if (targetIdx === -1) targetIdx = 0;

        setCurrentLessonIndex(targetIdx);
        setCurrentLessonId(lessonIds[targetIdx]);
        setMetadata(lessons[targetIdx]);
        setExercises(generateExercisesFromRow(data[targetIdx], lessonIds[targetIdx]));

      } catch (err: any) {
        console.error("Error cargando Base de Conocimiento:", err);
        setError(err.message || "Error de conexión con la Base de Conocimiento");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lessonId]);

  // ==========================================
  // NAVEGACIÓN ENTRE LECCIONES
  // ==========================================
  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1;
      const newId = allLessons[newIndex];
      setCurrentLessonIndex(newIndex);
      setCurrentLessonId(newId);
      setMetadata(allLessonsData[newIndex]);
      setExercises(generateExercisesFromRow(mallaRawData[newIndex], newId));
      setAnswers({});
      setShowFeedback({});
      setExpandedExerciseId(null);
      setActiveSkill('grammar');
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const newIndex = currentLessonIndex + 1;
      const newId = allLessons[newIndex];
      setCurrentLessonIndex(newIndex);
      setCurrentLessonId(newId);
      setMetadata(allLessonsData[newIndex]);
      setExercises(generateExercisesFromRow(mallaRawData[newIndex], newId));
      setAnswers({});
      setShowFeedback({});
      setExpandedExerciseId(null);
      setActiveSkill('grammar');
    }
  };

  const loadLesson = (newLessonId: string) => {
    const idx = allLessons.indexOf(newLessonId);
    if (idx >= 0 && allLessonsData[idx]) {
      setCurrentLessonIndex(idx);
      setCurrentLessonId(newLessonId);
      setMetadata(allLessonsData[idx]);
      setExercises(generateExercisesFromRow(mallaRawData[idx], newLessonId));
      setAnswers({});
      setShowFeedback({});
      setExpandedExerciseId(null);
      setActiveSkill('grammar');
    }
  };

  // ==========================================
  // PARSER TTS (Marcado de Audio)
  // ==========================================
  const renderTTSText = (text: string) => {
    if (!text || typeof text !== 'string') return null;
    const parts = text.split(/(".*?")/g);
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        const cleanText = part.replace(/"/g, '');
        const isMale = cleanText.startsWith('**') && cleanText.endsWith('**');
        const finalText = isMale ? cleanText.replace(/\*\*/g, '') : cleanText;
        return (
          <span key={index} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded mx-0.5 text-xs ${isMale ? 'bg-blue-500/20 text-blue-300 font-bold' : 'bg-pink-500/20 text-pink-300'}`}>
            <Volume2 size={10} />
            <span className="font-mono">"{finalText}"</span>
          </span>
        );
      }
      return <span key={index} className="text-slate-700">{part}</span>;
    });
  };

  // ==========================================
  // AGRUPAR EJERCICIOS POR HABILIDAD
  // ==========================================
  const exercisesBySkill = useMemo(() => {
    const grouped: Record<string, ExerciseRow[]> = {};
    exercises.forEach((ex: ExerciseRow) => {
      if (!grouped[ex.Skill]) grouped[ex.Skill] = [];
      grouped[ex.Skill].push(ex);
    });
    return grouped;
  }, [exercises]);

  const skillExercises: ExerciseRow[] = exercisesBySkill[activeSkill] || [];
  const tabConfig = SKILL_TABS[activeSkill] || SKILL_TABS.grammar;

  // Contenido dinámico de teoría según skill activo
  const getTheoryContent = () => {
    const horas = metadata.horas_json || [];
    const bullets = metadata.bullets_json || [];
    
    switch (activeSkill) {
      case 'grammar':
        return {
          title: 'Grammar Focus',
          content: metadata.grammar_focus || metadata.THEORY_SUMMARY,
          details: bullets.length > 0 ? bullets.join('\n\n') : ''
        };
      case 'vocabulary':
        const vocabLessons = horas.filter((h: any) => h.leccion);
        return {
          title: 'Vocabulary Lessons',
          content: vocabLessons.map((h: any) => `${h.leccion}: ${h.enfoque || ''}`).join('\n') || 'Vocabulary content from class materials',
          details: ''
        };
      case 'reading':
        return {
          title: 'Reading Comprehension',
          content: bullets.length > 0 ? bullets.join('\n\n') : 'Reading exercises based on grammar rules',
          details: ''
        };
      case 'listening':
        const listeningTracks = horas.filter((h: any) => (h.track || '').toLowerCase().includes('listening'));
        return {
          title: 'Listening Practice',
          content: listeningTracks.length > 0 
            ? `Listen to: ${listeningTracks.map((h: any) => h.leccion).join(', ')}`
            : 'Listen to the class video and identify key vocabulary',
          details: ''
        };
      case 'writing':
        return {
          title: 'Writing Practice',
          content: metadata.toefl_tip || 'Write a paragraph applying the grammar rules from this lesson',
          details: ''
        };
      case 'speaking':
        return {
          title: 'Speaking Practice',
          content: `Practice speaking about: ${metadata.TITLE_ES}. Use the vocabulary and grammar from this lesson.`,
          details: ''
        };
      default:
        return {
          title: 'Theory Summary',
          content: metadata.THEORY_SUMMARY,
          details: ''
        };
    }
  };

  const theoryContent = getTheoryContent();

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAnswerSelect = (exerciseId: string, answer: string) => {
    if (role === 'alumno') {
      setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    }
  };

  const handleCheckAnswer = (exerciseId: string) => {
    if (role === 'alumno') {
      setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));
    }
  };

  const isCorrect = (exercise: ExerciseRow): boolean => {
    const userAnswer = answers[exercise.Exercise_ID];
    if (!userAnswer || !exercise.Correct_Answer) return false;
    const cleanUser = String(userAnswer).replace(/\*\*/g, '').replace(/"/g, '').trim().toLowerCase();
    const cleanCorrect = String(exercise.Correct_Answer).replace(/\*\*/g, '').replace(/"/g, '').trim().toLowerCase();
    return cleanUser === cleanCorrect;
  };

  // ==========================================
  // RENDER: LOADING
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 size={48} className="text-emerald-400 animate-spin mx-auto" />
          <p className="text-white/60 text-sm font-bold uppercase tracking-wider mt-4">Cargando Base de Conocimiento...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ERROR
  // ==========================================
  if (error || !metadata) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto" />
          <p className="text-red-400 text-sm font-bold uppercase tracking-wider mt-4">{error || "Lección no encontrada"}</p>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(metadata.YOUTUBE_VIDEO_URL);

  // ==========================================
  // RENDER: PRINCIPAL
  // ==========================================
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* ==========================================
          HEADER DE LA CLASE + VIDEO PLAYER + NAVEGACIÓN
      ========================================== */}
      <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 space-y-3">
        
        {/* Navegación Superior */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              {metadata.LEVEL_MCER} • {currentLessonId}
            </span>
            <span className="text-[10px] font-mono text-white/40">
              Clase {currentLessonIndex + 1} de {allLessons.length}
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/40 uppercase">Vista: {role.toUpperCase()}</span>
        </div>

        {/* Título y Descripción */}
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          {metadata.TITLE_ES}
        </h1>
        <p className="text-white/60 text-sm">
          {metadata.DESCRIPTOR_MCER}
        </p>

        {/* REPRODUCTOR DE VIDEO NATIVO */}
        {videoId && (
          <div className="w-full mt-4 rounded-2xl overflow-hidden border border-red-500/20 bg-black/60 shadow-lg">
            <div className="relative w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={`Video Clase ${currentLessonId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-3 bg-black/40 border-t border-red-500/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                Video Clase Integrado • {currentLessonId}
              </span>
            </div>
          </div>
        )}

        {/* Navegación Inferior (Flechas) */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={goToPreviousLesson}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          >
            <ChevronLeft size={16} />
            Clase Anterior
          </button>

          <div className="flex items-center gap-2">
            {allLessons.map((id, idx) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentLessonIndex(idx);
                  setCurrentLessonId(id);
                  loadLesson(id);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentLessonIndex 
                    ? 'bg-emerald-400 w-6' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`Ir a ${id}`}
              />
            ))}
          </div>

          <button
            onClick={goToNextLesson}
            disabled={currentLessonIndex === allLessons.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          >
            Clase Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ==========================================
          TABS DE HABILIDADES (COLORES)
      ========================================== */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SKILL_TABS).map(([key, config]) => {
          const Icon = config.icon;
          const count = exercisesBySkill[key]?.length || 0;
          const isActive = activeSkill === key;

          return (
            <button
              key={key}
              onClick={() => setActiveSkill(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                isActive
                  ? `${config.borderColor} ${config.color} text-white shadow-lg`
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs font-bold uppercase">{config.label}</span>
              <span className="text-[10px] font-mono bg-black/30 px-1.5 rounded">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==========================================
          CONTENIDO: TEORÍA + EJERCICIOS
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO - TEORÍA (TIPO LIBRO PDF) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                TECLINGO ACADEMIC LIBRARY
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                {currentLessonId}
              </span>
            </div>

            <div className="p-6 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                  {metadata.LEVEL_MCER}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-slate-100 text-slate-700`}>
                  {tabConfig.label}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase block text-emerald-600">
                  {currentLessonId} • {tabConfig.label.toUpperCase()} FOCUS
                </span>
                <h2 className="text-lg font-black text-slate-900 uppercase leading-tight">
                  {metadata.TITLE_ES}
                </h2>
              </div>

              {metadata.LESSON_DESCRIPTION && (
                <div className="text-[12px] text-slate-700 leading-relaxed">
                  {metadata.LESSON_DESCRIPTION}
                </div>
              )}

              {theoryContent.content && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{theoryContent.title}</span>
                  </div>
                  <div className="p-4 text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {theoryContent.content}
                  </div>
                  {theoryContent.details && (
                    <div className="px-4 pb-4 text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                      {theoryContent.details}
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 italic">
                <strong>TOEFL Tip:</strong> En la sección de Structure, el sujeto nunca se omite en inglés.
              </div>
            </div>
          </div>

          {/* PANEL DE AUDITORÍA/CALIFICACIÓN (Docente/Director) */}
          {(role === 'docente' || role === 'director') && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-indigo-50 border-b border-indigo-200 p-4 flex items-center gap-2">
                <ShieldAlert size={14} className="text-indigo-600" />
                <span className="text-[10px] font-mono font-black text-indigo-700 uppercase tracking-widest">
                  PANEL DE {role === 'director' ? 'AUDITORÍA' : 'CALIFICACIÓN'}
                </span>
              </div>
              <div className="p-4 space-y-4">
                {role === 'docente' && (
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] text-slate-500 block font-bold">Calificar Entrega (0 - 100):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempGrade}
                      onChange={(e) => setTempGrade(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none rounded-xl p-2.5 text-center text-xl font-mono text-emerald-600 font-black"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <span className="text-[9.5px] text-slate-500 block font-bold">Anotaciones:</span>
                  <textarea
                    rows={4}
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    placeholder="Escribe la retroalimentación..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 resize-y"
                  />
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest p-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Save size={14} /> Guardar {role === 'director' ? 'Auditoría' : 'Calificación'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PANEL DERECHO - EJERCICIOS CON ACORDEÓN */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold uppercase ${tabConfig.textColor}`}>
                {tabConfig.label} EXERCISES
              </h3>
              <span className="text-[10px] text-white/40 font-mono">
                {skillExercises.length} ejercicios
              </span>
            </div>

            {skillExercises.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <p className="text-sm">No hay ejercicios disponibles para esta habilidad</p>
              </div>
            ) : (
              skillExercises.map((ex: ExerciseRow, idx: number) => {
                const isExpanded = expandedExerciseId === ex.Exercise_ID;
                const options = ex.Options_Pipe_Separated ? String(ex.Options_Pipe_Separated).split('|').filter((o: string) => o.trim()) : [];
                const userAnswer = answers[ex.Exercise_ID];
                const feedbackVisible = showFeedback[ex.Exercise_ID] || role !== 'alumno';
                const correct = isCorrect(ex);

                return (
                  <div key={ex.Exercise_ID} className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 mb-3 transition-all duration-300">
                    
                    {/* CABECERA DEL ACORDEÓN */}
                    <button
                      onClick={() => setExpandedExerciseId(isExpanded ? null : ex.Exercise_ID)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`text-[10px] font-mono font-black px-2 py-1 rounded shrink-0 ${
                          isExpanded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-white truncate">
                          {ex.Prompt_ES.length > 40 ? ex.Prompt_ES.substring(0, 40) + '...' : ex.Prompt_ES}
                        </span>
                      </div>
                      <ChevronDown 
                        size={18} 
                        className={`text-white/40 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} 
                      />
                    </button>

                    {/* CUERPO DEL EJERCICIO (Animado) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                            
                            {/* Texto en inglés con TTS */}
                            {ex.Prompt_EN && (
                              <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-sm mt-2">
                                {renderTTSText(String(ex.Prompt_EN))}
                              </div>
                            )}

                            {/* Opciones de respuesta */}
                            {options.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2 mt-3">
                                {options.map((opt: string, optIdx: number) => {
                                  const isSelected = userAnswer === opt;
                                  const isCorrectOption = feedbackVisible &&
                                    String(opt).replace(/\*\*/g, '').replace(/"/g, '').trim().toLowerCase() ===
                                    String(ex.Correct_Answer).replace(/\*\*/g, '').replace(/"/g, '').trim().toLowerCase();
                                  
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleAnswerSelect(ex.Exercise_ID, opt)}
                                      disabled={role !== 'alumno' || feedbackVisible}
                                      className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center gap-3 ${
                                        isSelected
                                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                          : isCorrectOption
                                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                            : 'bg-white/5 border-white/10 text-white/80 hover:border-white/30'
                                      } ${role !== 'alumno' || feedbackVisible ? 'cursor-not-allowed opacity-70' : ''}`}
                                    >
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                        isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'
                                      }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                                      </div>
                                      <span className="flex-1">{renderTTSText(String(opt))}</span>
                                      {isCorrectOption && feedbackVisible && (
                                        <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <textarea
                                value={userAnswer || ''}
                                onChange={(e) => handleAnswerSelect(ex.Exercise_ID, e.target.value)}
                                disabled={role !== 'alumno'}
                                placeholder="Escribe tu respuesta aquí..."
                                rows={3}
                                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none disabled:opacity-50 mt-2"
                              />
                            )}

                            {/* Botón verificar (solo alumno) */}
                            {role === 'alumno' && !feedbackVisible && userAnswer && (
                              <button
                                onClick={() => handleCheckAnswer(ex.Exercise_ID)}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition"
                              >
                                Verificar Respuesta
                              </button>
                            )}

                            {/* Feedback Pedagógico */}
                            {feedbackVisible && ex.Feedback_Rule && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-xl border ${correct ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}
                              >
                                <p className={`text-[10px] font-black uppercase mb-1 ${correct ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {correct ? '¡Correcto!' : 'Regla Pedagógica:'}
                                </p>
                                <p className="text-xs text-white/80 leading-relaxed">{String(ex.Feedback_Rule)}</p>
                                {!correct && ex.Correct_Answer && (
                                  <p className="text-xs text-emerald-400 font-bold mt-2">
                                    Respuesta correcta: {String(ex.Correct_Answer).replace(/\*\*/g, '').replace(/"/g, '')}
                                  </p>
                                )}
                              </motion.div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}