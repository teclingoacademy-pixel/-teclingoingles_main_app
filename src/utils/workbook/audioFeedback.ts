// Subtle Web Audio synthesizer for immediate acoustic feedback

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Cheerful ascending major chord (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.28);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playWarning() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Gentle caution chime (amber alert)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(392, now + 0.1);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  playFirstFail() {
    this.playWarning();
  }

  playError() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Soft low muted tone for final incorrect
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  playSecondFail() {
    this.playError();
  }

  playIncorrect() {
    this.playError();
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Celebratory fanfare (C5 -> E5 -> G5 -> C6 high arpeggio)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();

// ============================================================================
// LIMPIEZA DE TEXTO PARA TTS (Text Pre-processing)
// ============================================================================

/**
 * Limpia el texto antes de enviarlo al TTS
 * Reemplaza símbolos y caracteres especiales por palabras naturales o pausas
 */
export const cleanTextForTTS = (text: string, lang: string = 'en-US'): string => {
  if (!text) return '';
  let cleaned = text;

  // 1. Eliminar paréntesis con contenido técnico (ej: (+10 pts) -> eliminar, (+10) -> eliminar)
  cleaned = cleaned.replace(/\(\+?\d+\s*pts?\)/gi, '');
  cleaned = cleaned.replace(/\(\+?\d+\s*(?:puntos|xp)?\)/gi, '');
  cleaned = cleaned.replace(/\(\+?\d+\)/g, '');
  cleaned = cleaned.replace(/\+\d+\s*(?:pts?|puntos|xp)\b/gi, '');

  // 2. Limpiar guiones bajos residuales (nunca pronunciar la palabra 'blank')
  cleaned = cleaned.replace(/_{1,}(?:\s*_{1,})*/g, ' ');

  // 3. Reemplazar otros símbolos comunes en reactivos
  cleaned = cleaned.replace(/\*\*/g, '');           // ** → (eliminar, es markdown bold)
  cleaned = cleaned.replace(/\*/g, '');             // * → (eliminar)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');    // `code` → code
  cleaned = cleaned.replace(/#{1,6}\s+/g, '');      // Encabezados #
  cleaned = cleaned.replace(/\+/g, ' plus ');       // + → "plus" (si es necesario)
  cleaned = cleaned.replace(/=/g, ' equals ');      // = → "equals"
  cleaned = cleaned.replace(/→/g, ' becomes ');     // → → "becomes"
  cleaned = cleaned.replace(/≠/g, ' is not equal to ');
  cleaned = cleaned.replace(/❌/g, ' incorrect ');  // ❌ → "incorrect"
  cleaned = cleaned.replace(/✅/g, ' correct ');    // ✅ → "correct"

  // 4. Limpiar emojis decorativos que el motor TTS leería con nombres de glifos
  cleaned = cleaned.replace(/[👉🔊💡🎬🔄⏱️🔵🟢🟠🔴⚪⚫⭐🏆🎉👏]/gu, '');

  // 5. Opciones con letras tipo "A) book" -> "A book."
  cleaned = cleaned.replace(/\b([A-D])\)\s*/gi, '$1. ');

  // 6. Si el idioma de salida es español, adaptar palabras técnicas de enlace
  if (lang.startsWith('es')) {
    cleaned = cleaned.replace(/\bplus\b/gi, 'más');
    cleaned = cleaned.replace(/\bequals\b/gi, 'es igual a');
    cleaned = cleaned.replace(/\bbecomes\b/gi, 'se convierte en');
    cleaned = cleaned.replace(/\bincorrect\b/gi, 'incorrecto');
    cleaned = cleaned.replace(/\bcorrect\b/gi, 'correcto');
  }

  // 7. Limpiar espacios múltiples
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
};

// ============================================================================
// GLOBAL AUDIO STATE & CONTROLLER (TTS & Audio playback)
// ============================================================================

export interface GlobalAudioState {
  activeId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  text?: string;
}

let currentGlobalAudioState: GlobalAudioState = {
  activeId: null,
  isPlaying: false,
  isPaused: false,
};

const audioListeners = new Set<(state: GlobalAudioState) => void>();

export const getGlobalAudioState = (): GlobalAudioState => ({ ...currentGlobalAudioState });

export const subscribeGlobalAudio = (callback: (state: GlobalAudioState) => void): (() => void) => {
  audioListeners.add(callback);
  callback({ ...currentGlobalAudioState });
  return () => {
    audioListeners.delete(callback);
  };
};

const notifyAudioListeners = () => {
  const snapshot = { ...currentGlobalAudioState };
  audioListeners.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (e) {
      console.warn('Error notifying audio listener:', e);
    }
  });
};

// ============================================================================
// TTS - VOZ FEMENINA NATURAL (Google US English / Microsoft Zira / JennyNeural)
// ============================================================================

export interface SpeakOptions {
  lang?: string; // 'es-MX', 'es-ES', 'en-US', etc.
  rate?: number;
  pitch?: number;
  id?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Detiene globalmente cualquier audio o síntesis de voz activa
 */
export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  currentGlobalAudioState = {
    activeId: null,
    isPlaying: false,
    isPaused: false,
  };
  notifyAudioListeners();
};

export const stopGlobalAudio = stopSpeech;

/**
 * Pausa la reproducción activa de TTS
 */
export const pauseGlobalAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
    } catch {}
  }
  currentGlobalAudioState = {
    ...currentGlobalAudioState,
    isPlaying: false,
    isPaused: true,
  };
  notifyAudioListeners();
};

/**
 * Reanuda la reproducción pausada de TTS
 */
export const resumeGlobalAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch {}
  }
  currentGlobalAudioState = {
    ...currentGlobalAudioState,
    isPlaying: true,
    isPaused: false,
  };
  notifyAudioListeners();
};

export const speakText = (
  text: string, 
  options: SpeakOptions | string = 'es-MX', 
  triggerId?: string
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  // Cancel previous utterance
  window.speechSynthesis.cancel();

  const opts: SpeakOptions = typeof options === 'string' ? { lang: options } : options;
  const lang = opts.lang || 'es-MX';
  const rate = opts.rate ?? 0.9;
  const pitch = opts.pitch ?? 1;
  const audioId = triggerId || opts.id || `tts_${Date.now()}`;

  // Pre-procesamiento de limpieza de texto antes de enviarlo al TTS
  const cleanedText = cleanTextForTTS(text, lang);
  if (!cleanedText) {
    currentGlobalAudioState = { activeId: null, isPlaying: false, isPaused: false };
    notifyAudioListeners();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voices = window.speechSynthesis.getVoices();

  if (lang.startsWith('en')) {
    // Seleccionar voz femenina natural en inglés
    // Prioridad: Google US English, Microsoft Zira, JennyNeural, Jenny, Samantha, o cualquier voz femenina
    const femaleVoice = voices.find((v) => 
      v.name.includes('Google US English') || 
      v.name.includes('Microsoft Zira') ||
      v.name.includes('JennyNeural') ||
      v.name.includes('Jenny') ||
      v.name.includes('Samantha') ||
      v.name.includes('Female') ||
      (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
    ) || voices.find((v) => v.lang === 'en-US') || voices.find((v) => v.lang.startsWith('en'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
  } else {
    // Voz femenina natural en español (Google español, Microsoft Helena, Paulina, Sabina, etc.)
    const femaleEsVoice = voices.find((v) =>
      (v.lang.startsWith('es') || v.lang.includes('Spanish')) &&
      (v.name.includes('Google español') ||
       v.name.includes('Microsoft Helena') ||
       v.name.includes('Paulina') ||
       v.name.includes('Sabina') ||
       v.name.includes('Monica') ||
       v.name.toLowerCase().includes('female'))
    ) || voices.find((v) => v.lang.startsWith('es') || v.lang.includes('Spanish'));

    if (femaleEsVoice) {
      utterance.voice = femaleEsVoice;
    }
  }

  utterance.onstart = () => {
    currentGlobalAudioState = {
      activeId: audioId,
      isPlaying: true,
      isPaused: false,
      text: cleanedText,
    };
    notifyAudioListeners();
    if (opts.onStart) opts.onStart();
  };

  utterance.onend = () => {
    if (currentGlobalAudioState.activeId === audioId) {
      currentGlobalAudioState = {
        activeId: null,
        isPlaying: false,
        isPaused: false,
      };
      notifyAudioListeners();
    }
    if (opts.onEnd) opts.onEnd();
  };

  utterance.onerror = () => {
    if (currentGlobalAudioState.activeId === audioId) {
      currentGlobalAudioState = {
        activeId: null,
        isPlaying: false,
        isPaused: false,
      };
      notifyAudioListeners();
    }
    if (opts.onError) opts.onError();
  };

  utterance.onpause = () => {
    if (currentGlobalAudioState.activeId === audioId) {
      currentGlobalAudioState = {
        ...currentGlobalAudioState,
        isPlaying: false,
        isPaused: true,
      };
      notifyAudioListeners();
    }
  };

  utterance.onresume = () => {
    if (currentGlobalAudioState.activeId === audioId) {
      currentGlobalAudioState = {
        ...currentGlobalAudioState,
        isPlaying: true,
        isPaused: false,
      };
      notifyAudioListeners();
    }
  };

  // Immediate state update before speak
  currentGlobalAudioState = {
    activeId: audioId,
    isPlaying: true,
    isPaused: false,
    text: cleanedText,
  };
  notifyAudioListeners();

  window.speechSynthesis.speak(utterance);
};

/**
 * Control toggle para un botón de audio específico con ID
 */
export const toggleGlobalAudio = (
  id: string,
  text: string,
  options?: SpeakOptions
) => {
  if (currentGlobalAudioState.activeId === id) {
    if (currentGlobalAudioState.isPlaying) {
      pauseGlobalAudio();
    } else if (currentGlobalAudioState.isPaused) {
      resumeGlobalAudio();
    } else {
      speakText(text, options, id);
    }
  } else {
    speakText(text, options, id);
  }
};

/**
 * Reproduce el audio desde URL si existe y es válido,
 * o sintetiza con Edge TTS voz femenina natural en inglés.
 */
export const playAudioOrTTS = (
  audioUrl: string | undefined,
  textToSpeak: string,
  options?: SpeakOptions
) => {
  if (
    audioUrl &&
    typeof audioUrl === 'string' &&
    (audioUrl.startsWith('http://') || audioUrl.startsWith('https://') || audioUrl.startsWith('data:audio'))
  ) {
    try {
      const audio = new Audio(audioUrl);
      if (options?.onStart) audio.onplay = () => options.onStart?.();
      if (options?.onEnd) audio.onended = () => options.onEnd?.();
      audio.onerror = () => {
        speakText(textToSpeak, { lang: 'en-US', rate: 0.88, ...options });
      };
      audio.play().catch(() => {
        speakText(textToSpeak, { lang: 'en-US', rate: 0.88, ...options });
      });
      return;
    } catch {
      speakText(textToSpeak, { lang: 'en-US', rate: 0.88, ...options });
      return;
    }
  }

  speakText(textToSpeak, { lang: 'en-US', rate: 0.88, ...options });
};
