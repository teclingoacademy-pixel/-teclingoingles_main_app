/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Shared types for LibroVirtual unified component
 */

export type UserRole = 'alumno' | 'docente' | 'director';

export interface LibroVirtualProps {
  role: UserRole;
  studentId?: string;
  groupId?: string;
  initialWeek?: number;
}

export interface SemanaMalla {
  semana: number;
  eje_tematico: string;
  unidad_libro: string;
  fechas: string;
  paginas: string;
  kpi: string;
  grammar_focus?: string;
  table_headers?: string[];
  table_rows?: string[][];
  bullets?: string[];
  toefl_tip?: string;
}

export interface Reactivo {
  id: string;
  semana?: number;
  titulo: string;
  instruccion: string;
  tipo: 'inputs-dobles' | 'glosario' | 'dialogo' | 'error-check' | 'textarea' | 'multiple-choice' | 'fill-blanks' | 'speaking' | 'short-answer' | 'vocabulary' | 'paragraph';
  opciones?: string[];
  config?: {
    labelA?: string;
    labelB?: string;
    placeholderA?: string;
    placeholderB?: string;
    placeholder?: string;
    label1?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    promptIA1?: string;
    promptIA2?: string;
    errorKeywords?: string[];
    errorMessage?: string;
    correctKeywords?: string[];
  };
}

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  avatar: string;
  progress: number;
  grades: Record<number, number>;
  answers: Record<number, {
    classwork?: Record<string, string>;
    homework?: string;
    feedbackTeacher?: string;
    grade?: number;
  }>;
}

export interface WorkbookAnswers {
  [week: number]: {
    classwork: Record<string, string>;
    homework: string;
  };
}

export interface TheoryDetails {
  grammarFocus: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  bullets: string[];
  toeflTip: string;
}

// ==========================================
// EXERCISE DB (Google Sheets Architecture)
// ==========================================

export interface ExerciseRow {
  LESSON_ID: string;      // Ej: "N1-C01"
  Skill: string;          // Ej: "Grammar", "Vocabulary", "Reading", "Listening", "Writing", "Speaking"
  Prompt_ES: string;      // Instrucción en español (texto blanco grande)
  Prompt_EN: string;      // Instrucción en inglés (caja oscura con TTS)
  Options?: string;       // JSON de opciones para multiple choice
  Answer: string;         // Respuesta correcta
  Points: number;         // Puntos del ejercicio
  TTS_Speaker?: 'M' | 'F'; // Voz para TTS (M=masculino, F=femenino)
}

export interface ExerciseGroup {
  skill: string;
  exercises: ExerciseRow[];
  totalPoints: number;
}
