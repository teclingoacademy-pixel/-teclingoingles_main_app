/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  Save, 
  ShieldAlert, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface StudentSubmission {
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

interface AuditDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  students: StudentSubmission[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  semanaActual: {
    semana: number;
  };
  teacherFeedback: string;
  onFeedbackChange: (value: string) => void;
  tempGrade: string;
  onGradeChange: (value: string) => void;
  onSaveFeedback: () => void;
  alertSaved: boolean;
  totalSemanas: number;
}

export function AuditDrawer({
  isOpen,
  onToggle,
  students,
  selectedStudentId,
  onSelectStudent,
  semanaActual,
  teacherFeedback,
  onFeedbackChange,
  tempGrade,
  onGradeChange,
  onSaveFeedback,
  alertSaved,
  totalSemanas
}: AuditDrawerProps) {
  const activeStudent = students.find(s => s.studentId === selectedStudentId) || students[0];

  return (
    <>
      {/* Mobile: Floating Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#10b981] text-black p-4 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#059669] transition-colors"
      >
        {isOpen ? <ChevronDown size={20} /> : <Users size={20} />}
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          {isOpen ? 'Cerrar' : 'Auditoría'}
        </span>
      </button>

      {/* Mobile: Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-[#051120] border-t border-white/10 rounded-t-3xl max-h-[80vh] overflow-y-auto"
          >
            <DrawerContent
              students={students}
              selectedStudentId={selectedStudentId}
              onSelectStudent={onSelectStudent}
              semanaActual={semanaActual}
              teacherFeedback={teacherFeedback}
              onFeedbackChange={onFeedbackChange}
              tempGrade={tempGrade}
              onGradeChange={onGradeChange}
              onSaveFeedback={onSaveFeedback}
              alertSaved={alertSaved}
              totalSemanas={totalSemanas}
              activeStudent={activeStudent}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Side Panel */}
      <div className="hidden lg:block bg-[#051120] border border-white/5 rounded-3xl p-5 space-y-5 text-left">
        <DrawerContent
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={onSelectStudent}
          semanaActual={semanaActual}
          teacherFeedback={teacherFeedback}
          onFeedbackChange={onFeedbackChange}
          tempGrade={tempGrade}
          onGradeChange={onGradeChange}
          onSaveFeedback={onSaveFeedback}
          alertSaved={alertSaved}
          totalSemanas={totalSemanas}
          activeStudent={activeStudent}
        />
      </div>
    </>
  );
}

function DrawerContent({
  students,
  selectedStudentId,
  onSelectStudent,
  semanaActual,
  teacherFeedback,
  onFeedbackChange,
  tempGrade,
  onGradeChange,
  onSaveFeedback,
  alertSaved,
  totalSemanas,
  activeStudent
}: {
  students: StudentSubmission[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  semanaActual: { semana: number };
  teacherFeedback: string;
  onFeedbackChange: (value: string) => void;
  tempGrade: string;
  onGradeChange: (value: string) => void;
  onSaveFeedback: () => void;
  alertSaved: boolean;
  totalSemanas: number;
  activeStudent: StudentSubmission | undefined;
}) {
  const currentWeekGrade = activeStudent?.grades[semanaActual.semana];
  const isExcellent = currentWeekGrade && currentWeekGrade >= 90;

  return (
    <div className="p-5 space-y-5 text-left">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Users size={16} className="text-white/50" />
        <h3 className="text-xs font-black font-mono uppercase tracking-wider text-white">
          Respuestas Del Alumno
        </h3>
      </div>

      {/* Student selector */}
      <div className="p-3 bg-[#030911] rounded-2xl border border-white/5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            {activeStudent?.avatar}
          </div>
          <div>
            <span className="text-white text-xs font-bold block">{activeStudent?.studentName}</span>
            <span className="text-[10px] text-white/40 font-mono">
              ID: {activeStudent?.studentId} • Progreso {activeStudent?.progress}/{totalSemanas}
            </span>
          </div>
        </div>
        <select
          value={selectedStudentId}
          onChange={(e) => onSelectStudent(e.target.value)}
          className="bg-black/60 border border-white/10 rounded-xl px-2 py-1 text-[10px] text-white focus:outline-none focus:border-indigo-500 font-mono"
        >
          {students.map((st) => (
            <option key={st.studentId} value={st.studentId} className="bg-[#040e1a]">
              {st.studentName}
            </option>
          ))}
        </select>
      </div>

      {/* Current week submission */}
      <div className={`p-4 rounded-2xl min-h-[120px] flex flex-col justify-between gap-3 transition-all duration-300 ${
        isExcellent 
          ? 'bg-emerald-950/30 border border-emerald-500/40' 
          : 'bg-black/60 border border-white/5'
      }`}>
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono text-white/30 mb-2 border-b border-white/5 pb-1">
            <span>SEMANA {semanaActual.semana}</span>
            <span className="text-[#DEFF9A] uppercase tracking-wider font-bold">ENTREGADO</span>
          </div>
          
          {/* Homework */}
          <div className="space-y-2">
            <span className="text-[9px] text-amber-400 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
              Portafolio
            </span>
            <div className="p-3 bg-[#030911] border border-white/5 rounded-xl">
              <p className="text-[11px] text-white/90 leading-relaxed font-sans break-words">
                {activeStudent?.answers[semanaActual.semana]?.homework || (
                  <span className="italic text-white/25">Sin evidencia.</span>
                )}
              </p>
            </div>
          </div>

          {/* Feedback */}
          {activeStudent?.answers[semanaActual.semana]?.feedbackTeacher && (
            <div className="mt-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <span className="text-[9px] text-indigo-400 font-mono uppercase block mb-1">Feedback:</span>
              <p className="text-[10px] text-white/80">{activeStudent.answers[semanaActual.semana].feedbackTeacher}</p>
            </div>
          )}
        </div>

        {/* Grade */}
        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <span className="text-[10px] text-white/40 font-mono">Calificación:</span>
          <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${isExcellent ? 'bg-emerald-500/20 text-[#10b981]' : 'bg-indigo-500/10 text-indigo-400'}`}>
            {currentWeekGrade ? `${currentWeekGrade} / 100` : 'Pendiente'}
          </span>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="p-5 bg-indigo-950/20 rounded-2xl border border-indigo-500/10 space-y-4">
        <span className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
          <ShieldAlert size={12} className="text-indigo-400" />
          RETROALIMENTACIÓN
        </span>

        <div className="space-y-1.5">
          <span className="text-[9.5px] text-white/40 block">Calificar (0-100):</span>
          <input 
            type="number" 
            min="0" 
            max="100"
            value={tempGrade} 
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full bg-[#111827] border border-emerald-500/20 focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none rounded-xl p-2.5 text-center text-xl font-mono text-[#10b981] font-black transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[9.5px] text-white/40 block">Comentarios:</span>
          <textarea
            rows={3}
            value={teacherFeedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Retroalimentación técnica..."
            className="w-full bg-[#111827] border border-white/5 focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none rounded-xl p-3 text-xs text-white placeholder-white/20 transition-all resize-y"
          />
        </div>

        {alertSaved && (
          <div className="text-emerald-400 text-xs font-mono font-bold animate-pulse text-center bg-emerald-900/20 py-2 border border-emerald-500/20 rounded-xl">
            ✓ Guardado
          </div>
        )}

        <button 
          type="button"
          onClick={onSaveFeedback}
          className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.98] text-black font-black uppercase text-xs tracking-widest p-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save size={14} />
          <span>Guardar Auditoría</span>
        </button>
      </div>
    </div>
  );
}
