export type MCERLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SkillType = 'grammar' | 'vocab' | 'listening' | 'speaking' | 'reading' | 'writing';

export type AppView = 'cover' | 'class_index' | 'class_detail' | 'workbook' | 'settings' | 'api_console';

export type ContentStyle = 'academico' | 'cotidiano' | 'mixto';

export type EvaluationMode = 'estricto' | 'flexible';

export type TargetAudience = 'universitario' | 'profesional' | 'adulto' | 'joven';

export interface CourseSettings {
  targetLevel: MCERLevel;
  totalSessions: number;
  hoursPerSession: number;
  skills: Record<SkillType, boolean>;
  // Production engineering parameters (Admin / Engine only)
  itemsPerSession: number;
  skillQuota: Record<SkillType, number>;
  unitRef: string;
  videoAssetTag: string;
  xpPerCorrect: number;
  validationEngine: 'three_state_active' | 'single_attempt';
  contentStyle: ContentStyle;
  englishVoice: 'masculino' | 'femenino';
  spanishVoice: 'femenino' | 'masculino';
  evaluationMode: EvaluationMode;
  targetAudience: TargetAudience;
  aiCustomInstructions: string;
  includeLevelGoals: boolean;
  uploadedFileName: string | null;
  uploadedFileSize?: string;
  uploadedAt?: string;
}

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  id: string;
  code?: string; // e.g. EX_01, EX_02
  sessionNumber: number;
  level: MCERLevel;
  skill: SkillType;
  prompt: string;
  readingPassage?: string;
  contextHint?: string;
  audioPromptText?: string;
  options: ExerciseOption[];
  correctExplanation: string;
  failureExplanation: string;
  xpValue?: number;
}

export interface GrammarTip {
  title: string;
  rule: string;
  examples: {
    english: string;
    spanish: string;
    isCorrectUsage?: boolean;
  }[];
  commonMistake?: string;
}

export interface SessionData {
  id: string;
  sessionNumber: number;
  level: MCERLevel;
  title: string;
  subtitle: string;
  videoId: string; // YouTube embed ID
  videoTitle: string;
  grammarTip: GrammarTip;
  quickVocab: { word: string; translation: string }[];
  exercises: Exercise[];
}

export type ExerciseState = 'unanswered' | 'first_fail' | 'correct' | 'second_fail';

export interface ExerciseAttempt {
  count: number;
  selectedOptionId?: string;
  state: ExerciseState;
}

export type TipoCuenta = 'regular' | 'demo';

export interface User {
  user_id: string;
  email: string;
  nombre: string;
  avatar_url?: string | null;
  tipo_cuenta: TipoCuenta;
  nivel_actual: string;
  xp_total: number;
  clases_completadas: number;
  fecha_registro?: string;
  activo?: boolean;
}
