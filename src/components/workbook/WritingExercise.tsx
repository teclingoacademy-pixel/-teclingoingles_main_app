import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, VolumeX, CheckCircle2, AlertCircle, XCircle, Send } from 'lucide-react';
import { playAudio, stopAudio, isValidEnglishForTTS } from '@/services/workbook/ttsService';
import { stopSpeech } from '@/utils/workbook/audioFeedback';

export interface WritingExerciseProps {
  reactivo: any;
  onAnswer: (result: { respuesta: string; correcto: boolean; tipo?: string }) => void;
  validationState?: 'unanswered' | 'first_fail' | 'second_fail' | 'correct';
}

export const WritingExercise: React.FC<WritingExerciseProps> = ({
  reactivo,
  onAnswer,
  validationState = 'unanswered',
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Respuesta esperada en inglés para el TTS y evaluación
  const englishTarget = useMemo(() => {
    const ans = (reactivo.respuesta_correcta || '').trim();
    if (isValidEnglishForTTS(ans)) return ans;
    const trans = (reactivo.frase_traduccion || '').trim();
    if (isValidEnglishForTTS(trans)) return trans;
    return ans;
  }, [reactivo.respuesta_correcta, reactivo.frase_traduccion]);

  // Al cambiar de reactivo, reiniciar estados locales y enfocar el input
  // CRÍTICO: Sin Autoplay - NO reproducir audio automáticamente
  useEffect(() => {
    setInputText('');
    setSubmittedAnswer('');
    stopSpeech();
    stopAudio();
    setIsPlayingAudio(false);

    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      stopSpeech();
      stopAudio();
      setIsPlayingAudio(false);
    };
  }, [reactivo.reactivo_id]);

  // Manejador del botón de Audio (TTS): Lee exclusivamente la respuesta en inglés
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      stopAudio();
      setIsPlayingAudio(false);
      return;
    }

    stopSpeech();
    stopAudio();

    if (!englishTarget) {
      console.warn('TTS: No hay texto en inglés para reproducir.');
      return;
    }

    setIsPlayingAudio(true);
    playAudio(englishTarget, {
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // Manejo de envío y comprobación
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;
    if (validationState === 'correct' || validationState === 'second_fail') return;

    setSubmittedAnswer(trimmedInput);

    // Comparación tolerante: ignorar mayúsculas, minúsculas y espacios extra (.trim().toLowerCase())
    const normalizedUser = trimmedInput.toLowerCase().replace(/\s+/g, ' ');
    const normalizedCorrect = (reactivo.respuesta_correcta || '').trim().toLowerCase().replace(/\s+/g, ' ');

    const isMatch = normalizedUser === normalizedCorrect;

    onAnswer({
      respuesta: trimmedInput,
      correcto: isMatch,
      tipo: 'writing',
    });
  };

  const isResolved = validationState === 'correct' || validationState === 'second_fail';

  return (
    <div
      className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-5 text-left"
      id="writing-interactive-dictation"
    >
      {/* 1. ENUNCIADO / PROMPT EN ESPAÑOL */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-center shadow-xs">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1 font-mono">
          Enunciado en Español:
        </span>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-sans">
          {reactivo.pregunta_texto}
        </div>
        {reactivo.contexto_espanol && (
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            {reactivo.contexto_espanol}
          </p>
        )}
      </div>

      {/* 2. BOTÓN DE AUDIO TTS (PISTA DE PRONUNCIACIÓN EN INGLÉS) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 sm:p-5">
        <div className="text-center sm:text-left">
          <p className="text-xs sm:text-sm font-bold text-teal-950 flex items-center justify-center sm:justify-start gap-1.5">
            <span>🎧</span>
            <span>Pista auditiva (Pronunciación en inglés):</span>
          </p>
          <p className="text-xs text-teal-800/90 mt-0.5">
            Escucha cómo se pronuncia la palabra correcta antes de escribir.
          </p>
        </div>

        <button
          type="button"
          id="btn-writing-audio-clue"
          onClick={handleToggleAudio}
          disabled={!englishTarget}
          aria-label="Escuchar pronunciación en inglés"
          className={`px-5 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 ${
            isPlayingAudio
              ? 'bg-teal-700 text-white ring-4 ring-teal-300 animate-pulse'
              : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-5 h-5 text-white animate-bounce shrink-0" />
              <span>Reproduciendo...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 shrink-0" />
              <span>🔊 Escuchar audio</span>
            </>
          )}
        </button>
      </div>

      {/* 3. CAMPO DE TEXTO (INPUT) Y BOTÓN DE COMPROBAR */}
      <form onSubmit={handleSubmit} className="space-y-3" id="form-writing-input">
        <div>
          <label
            htmlFor="writing-text-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Escribe tu respuesta en inglés:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <input
              ref={inputRef}
              type="text"
              id="writing-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isResolved}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              placeholder="Escribe la palabra aquí..."
              className={`flex-1 px-4 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-medium border-2 transition-all outline-hidden font-sans ${
                isResolved
                  ? validationState === 'correct'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold cursor-default'
                    : 'border-slate-300 bg-slate-100 text-slate-700 cursor-default'
                  : validationState === 'first_fail'
                  ? 'border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/60 bg-amber-50/30'
                  : 'border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 bg-white'
              }`}
            />

            {!isResolved && (
              <button
                type="submit"
                id="btn-writing-submit-check"
                disabled={!inputText.trim()}
                className={`px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0 ${
                  !inputText.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : validationState === 'first_fail'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <span>{validationState === 'first_fail' ? 'Reintentar' : 'Comprobar'}</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="block text-[11px] text-slate-500 mt-1">
            Presiona <strong>Enter</strong> o haz clic en <strong>Comprobar</strong> para evaluar.
          </span>
        </div>
      </form>

      {/* 4. FEEDBACK Y EVALUACIÓN SEGÚN LOS 3 ESTADOS (CORRECTO / 1ER FALLO / 2DO FALLO) */}
      {validationState !== 'unanswered' && (
        <div className="animate-fadeIn">
          {validationState === 'correct' ? (
            /* CASO DE ÉXITO */
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-base sm:text-lg pb-2 border-b border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>¡Correcto!</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 block mb-0.5 uppercase tracking-wide">
                    Tu respuesta:
                  </span>
                  <span className="text-emerald-950 font-bold text-base font-sans">
                    "{submittedAnswer || inputText}"
                  </span>
                </div>

                {reactivo.respuesta_explicacion && (
                  <div className="bg-emerald-100/70 p-3.5 rounded-xl border border-emerald-200 text-emerald-950">
                    <span className="font-bold block mb-0.5">💡 Explicación:</span>
                    <span className="leading-relaxed">{reactivo.respuesta_explicacion}</span>
                  </div>
                )}
              </div>
            </div>
          ) : validationState === 'first_fail' ? (
            /* PRIMER FALLO -> SEGUNDA OPORTUNIDAD */
            <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 sm:p-6 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base sm:text-lg pb-2 border-b border-amber-200">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <span>Inténtalo de nuevo (2ª oportunidad)</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                {submittedAnswer && (
                  <div className="bg-white/85 p-3 rounded-xl border border-amber-200">
                    <span className="text-xs font-bold text-amber-900 block mb-0.5 uppercase tracking-wide">
                      Escribiste:
                    </span>
                    <span className="text-rose-700 font-bold text-base font-sans">
                      "{submittedAnswer}"
                    </span>
                  </div>
                )}

                <div className="bg-amber-100/80 p-3 rounded-xl text-amber-950 font-medium border border-amber-200 leading-relaxed">
                  <p>
                    Revisa la ortografía. Puedes volver a presionar <strong>🔊 Escuchar audio</strong> para oír la pronunciación y corregir tu respuesta antes de volver a comprobar.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* SEGUNDO FALLO -> SE TERMINAN OPORTUNIDADES */
            <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 sm:p-6 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-2.5 text-rose-900 font-bold text-base sm:text-lg pb-2 border-b border-rose-200">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <span>Te has equivocado 2 veces</span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                {submittedAnswer && (
                  <div className="bg-white/85 p-3 rounded-xl border border-rose-200">
                    <span className="text-xs font-bold text-rose-900 block mb-0.5 uppercase tracking-wide">
                      Tu última respuesta:
                    </span>
                    <span className="text-rose-800 font-bold text-base font-sans">
                      "{submittedAnswer}"
                    </span>
                  </div>
                )}

                <div className="bg-white/95 p-3.5 rounded-xl border border-rose-200 text-slate-800 space-y-1.5">
                  <p>
                    <strong>Respuesta correcta:</strong>{' '}
                    <span className="font-bold text-emerald-700 font-sans text-base">
                      {reactivo.respuesta_correcta}
                    </span>
                  </p>
                  {reactivo.respuesta_explicacion && (
                    <p className="text-slate-600 pt-1.5 border-t border-slate-100 leading-relaxed">
                      💡 <em>{reactivo.respuesta_explicacion}</em>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingExercise;

