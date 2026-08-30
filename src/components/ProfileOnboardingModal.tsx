/**
 * ProfileOnboardingModal — Modal que obliga al usuario a completar su perfil
 * antes de usar la app. Muestra un aviso centralizado con los pasos pendientes.
 *
 * Lógica:
 *  - Si el perfil está incompleto → se muestra el modal
 *  - El checkbox "No volver a mostrar" solo suprime para la sesión actual (localStorage temporal)
 *  - Si el usuario cierra el modal sin completar, se volverá a mostrar al recargar
 *  - Solo desaparece cuando el perfil está realmente completo
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, User, ArrowRight, X, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
  role: string;
  profileData: Record<string, unknown>;
}

/**
 * Determina si el perfil está completo según el rol.
 * Campos obligatorios para ALUMNO: name, studentId, career, shift, semestre, moduloTec
 * Campos obligatorios para DOCENTE: name, employeeId, degree
 * Campos obligatorios para DIRECTOR: name, institutionName
 */
function isProfileComplete(role: string, data: Record<string, unknown>): boolean {
  if (role === 'ALUMNO') {
    return Boolean(
      data.name && String(data.name).trim() &&
      data.studentId && String(data.studentId).trim() &&
      data.career && String(data.career).trim() &&
      data.shift && String(data.shift).trim() &&
      data.semestre && String(data.semestre).trim() &&
      data.moduloTec && String(data.moduloTec).trim()
    );
  }
  if (role === 'DOCENTE') {
    return Boolean(
      data.name && String(data.name).trim() &&
      data.employeeId && String(data.employeeId).trim() &&
      data.degree && String(data.degree).trim()
    );
  }
  if (role === 'DIRECTOR') {
    return Boolean(
      data.name && String(data.name).trim() &&
      data.institutionName && String(data.institutionName).trim()
    );
  }
  return true;
}

/**
 * Retorna los campos que faltan para el rol indicado.
 */
function getMissingFields(role: string, data: Record<string, unknown>): string[] {
  const missing: string[] = [];
  if (role === 'ALUMNO') {
    if (!data.name || !String(data.name).trim()) missing.push('Nombre completo');
    if (!data.studentId || !String(data.studentId).trim()) missing.push('Número de control');
    if (!data.career || !String(data.career).trim()) missing.push('Carrera');
    if (!data.shift || !String(data.shift).trim()) missing.push('Turno');
    if (!data.semestre || !String(data.semestre).trim()) missing.push('Semestre');
    if (!data.moduloTec || !String(data.moduloTec).trim()) missing.push('Módulo TEC');
  } else if (role === 'DOCENTE') {
    if (!data.name || !String(data.name).trim()) missing.push('Nombre completo');
    if (!data.employeeId || !String(data.employeeId).trim()) missing.push('ID Empleado');
    if (!data.degree || !String(data.degree).trim()) missing.push('Grado académico');
  } else if (role === 'DIRECTOR') {
    if (!data.name || !String(data.name).trim()) missing.push('Nombre completo');
    if (!data.institutionName || !String(data.institutionName).trim()) missing.push('Nombre institución');
  }
  return missing;
}

const STORAGE_KEY_PREFIX = 'teclingo_onboarding_suppress_';

export function ProfileOnboardingModal({
  isOpen,
  onClose,
  onCompleteProfile,
  role,
  profileData,
}: ProfileOnboardingModalProps) {
  const [suppressSession, setSuppressSession] = useState(false);
  const storageKey = `${STORAGE_KEY_PREFIX}${role}`;

  // Si el perfil ya está completo, no mostrar nada
  const complete = isProfileComplete(role, profileData);
  const missingFields = getMissingFields(role, profileData);

  // Si el perfil está completo, limpiar el flag de supresión
  useEffect(() => {
    if (complete) {
      localStorage.removeItem(storageKey);
    }
  }, [complete, storageKey]);

  // Cargar estado de supresión del localStorage al montar
  useEffect(() => {
    const suppressed = localStorage.getItem(storageKey) === 'true';
    setSuppressSession(suppressed);
  }, [storageKey]);

  const handleSuppressChange = useCallback(() => {
    const newValue = !suppressSession;
    setSuppressSession(newValue);
    if (newValue) {
      localStorage.setItem(storageKey, 'true');
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [suppressSession, storageKey]);

  const handleGoToProfile = useCallback(() => {
    onCompleteProfile();
  }, [onCompleteProfile]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // No mostrar si el perfil está completo, o si se suprimió para esta sesión,
  // o si el modal no está abierto
  const shouldShow = isOpen && !complete && !suppressSession;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0a0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#38BDF8]/10 to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <X size={16} className="text-white/40" />
            </button>

            <div className="relative p-8 pt-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-[#F59E0B]" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-white text-xl font-black text-center uppercase tracking-tight mb-2">
                Primer Paso Requerido
              </h2>
              <p className="text-white/40 text-xs text-center font-bold mb-6">
                Completa tu perfil para desbloquear todas las funciones
              </p>

              {/* Steps info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#38BDF8] text-xs font-black">1</span>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-black mb-1">Completar Formulario de Perfil</h3>
                    <p className="text-white/30 text-[10px] font-bold leading-relaxed">
                      Tu ID Card institucional se genera con los datos de este formulario.
                      Los grupos y other datos se vinculan aquí.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#22D3EE] text-xs font-black">2</span>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-black mb-1">ADN Digital</h3>
                    <p className="text-white/30 text-[10px] font-bold leading-relaxed">
                      Personaliza el contenido de tu experiencia de aprendizaje.
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing fields */}
              {missingFields.length > 0 && (
                <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={12} className="text-[#F59E0B]" />
                    <span className="text-[#F59E0B] text-[10px] font-black uppercase tracking-widest">
                      Campos pendientes ({missingFields.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingFields.map(field => (
                      <span
                        key={field}
                        className="text-[9px] font-bold text-[#F59E0B]/60 bg-[#F59E0B]/5 border border-[#F59E0B]/10 px-2 py-1 rounded"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkbox "No volver a mostrar" */}
              <label className="flex items-center gap-3 cursor-pointer mb-6 group">
                <div
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    suppressSession
                      ? 'bg-[#38BDF8] border-[#38BDF8]'
                      : 'bg-white/5 border-white/20 group-hover:border-white/40'
                  }`}
                  onClick={handleSuppressChange}
                >
                  {suppressSession && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest select-none">
                  No volver a mostrar esta sesión
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Ahora no
                </button>
                <button
                  onClick={handleGoToProfile}
                  className="flex-1 py-3.5 bg-[#38BDF8] rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(56,189,248,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <User size={14} />
                  Completar Perfil
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Footer note */}
              <p className="text-white/15 text-[8px] text-center font-bold uppercase tracking-widest mt-4">
                Este paso es obligatorio antes de usar la plataforma
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { isProfileComplete, getMissingFields };
