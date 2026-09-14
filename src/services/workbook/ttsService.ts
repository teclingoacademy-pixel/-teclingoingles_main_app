/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * src/services/ttsService.ts
 * Servicio centralizado de TTS con voz femenina natural en inglés
 */

export interface PlayAudioOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: unknown) => void;
}

// Timer de soporte para textos largos (evita el bug de 15s de Chromium)
let longSpeechKeepAlive: NodeJS.Timeout | null = null;
let pendingAutoplay: { text: string; options?: PlayAudioOptions | (() => void) } | null = null;
let hasUserInteracted = false;

const clearSpeechKeepAlive = () => {
  if (longSpeechKeepAlive) {
    clearInterval(longSpeechKeepAlive);
    longSpeechKeepAlive = null;
  }
};

/**
 * Desbloquea el motor de audio y ejecuta cualquier reproducción pendiente
 * tan pronto como el usuario interactúa con la pantalla (clic o toque).
 */
export const unlockAndPlayPendingAudio = (): void => {
  hasUserInteracted = true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }
  if (pendingAutoplay) {
    const item = pendingAutoplay;
    pendingAutoplay = null;
    playAudio(item.text, item.options);
  }
};

// Escuchador global en ventana para capturar la primera interacción del usuario tras recargar
if (typeof window !== 'undefined') {
  const onInteraction = () => {
    unlockAndPlayPendingAudio();
  };
  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, onInteraction, { capture: true, passive: true });
  });
}

// Detener cualquier audio que esté sonando
export const stopAudio = (): void => {
  pendingAutoplay = null;
  clearSpeechKeepAlive();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      console.warn('Error cancelando síntesis de voz:', e);
    }
  }
};

/**
 * Verifica si un texto es primariamente una instrucción o frase en español.
 * Evita que el TTS con voz en inglés intente pronunciar frases en español.
 */
export const isSpanishInstruction = (text: string): boolean => {
  if (!text) return false;
  const lower = text.toLowerCase();

  // Patrones específicos de instrucciones y encabezados en español
  const spanishMarkers = [
    'el plural de',
    'el singular de',
    'el pronombre para',
    'escribe en inglés',
    'escribe la oración',
    'escribe el pronombre',
    'traduce:',
    'ordena las',
    'selecciona la',
    'cuál es',
    'cuál de',
    'qué significa',
    'según el texto',
    'en la oración',
    'de acuerdo a',
    'la regla general',
    'recuerda:',
    'completa la',
  ];

  for (const marker of spanishMarkers) {
    if (lower.includes(marker)) return true;
  }

  // Si contiene signos de interrogación/exclamación de apertura en español
  if (text.includes('¿') || text.includes('¡')) return true;

  // Si contiene acentos en español frecuentes
  if (/[áéíóúÁÉÍÓÚñÑ]/.test(text)) {
    return true;
  }

  // Detección de conectores comunes en español
  const spanishWords = /\b(el|la|los|las|un|una|unos|unas|es|son|de|del|en|para|por|con|escribe|traduce|palabra|oración|significado|plural|singular|libro|estudiante|profesora|papá|mamá|nosotros|ellos|ella|él)\b/gi;
  const spanishMatches = lower.match(spanishWords);
  if (spanishMatches && spanishMatches.length >= 2) {
    return true;
  }

  return false;
};

/**
 * Valida si el texto es apto para reproducirse con pronunciación en inglés.
 */
export const isValidEnglishForTTS = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  // Debe contener al menos una letra del alfabeto inglés
  if (!/[a-zA-Z]/.test(trimmed)) return false;

  // No debe ser una instrucción en español
  if (isSpanishInstruction(trimmed)) return false;

  return true;
};

/**
 * Función TTS centralizada para reproducir texto en inglés con voz femenina natural
 * @param text Texto a pronunciar
 * @param options Opciones adicionales o callback de finalización
 */
export const playAudio = (
  text: string,
  options?: PlayAudioOptions | (() => void)
): void => {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Validar que el texto no sea una instrucción en español
  if (isSpanishInstruction(text)) {
    console.warn('TTS: El texto parece ser una instrucción en español, no se reproduce en inglés:', text);
    return;
  }

  // Validar que el texto contenga al menos una letra del alfabeto inglés
  if (!/[a-zA-Z]/.test(text)) {
    console.warn('TTS: El texto no contiene caracteres en inglés, no se reproduce');
    return;
  }

  // Detener cualquier audio que esté sonando
  window.speechSynthesis.cancel();

  // Limpiar texto para evitar pronunciar etiquetas, corchetes o guiones bajos
  const cleanText = text
    .replace(/\[\.\.\.\]/g, '')
    .replace(/_{1,}(?:\s*_{1,})*/g, '')
    .replace(/\/[^/]+\//g, '')
    .replace(/["""'']/g, '')
    .trim();

  if (!cleanText) return;

  const opts: PlayAudioOptions =
    typeof options === 'function' ? { onEnd: options } : options || {};

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = opts.lang || 'en-US';
  utterance.rate = opts.rate ?? 0.9; // Ligeramente más lento para mejor comprensión
  utterance.pitch = opts.pitch ?? 1.1; // Tono ligeramente más alto (voz femenina)

  // Seleccionar voz femenina si está disponible
  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const femaleVoice = voices.find(
      (v) =>
        v.name.includes('Google US English') ||
        v.name.includes('Microsoft Zira') ||
        v.name.includes('Samantha') ||
        v.name.includes('Jenny') ||
        v.name.includes('Victoria') ||
        v.name.includes('Karen') ||
        (v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
        (v.lang.startsWith('en') && v.name.toLowerCase().includes('natural'))
    ) || voices.find((v) => v.lang === 'en-US') || voices.find((v) => v.lang.startsWith('en'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
  };

  selectVoice();

  if (opts.onStart) {
    utterance.onstart = () => opts.onStart?.();
  }

  utterance.onend = () => {
    clearSpeechKeepAlive();
    opts.onEnd?.();
  };

  utterance.onerror = (e) => {
    clearSpeechKeepAlive();
    const errCode = (e as any)?.error;
    // Si el navegador bloqueó la reproducción automática por falta de gesto del usuario
    if (errCode === 'not-allowed') {
      console.warn('TTS: Reproducción automática bloqueada por política del navegador. Encolado para la primera interacción.');
      pendingAutoplay = { text: cleanText, options: opts };
      return;
    }
    // Si se canceló explícitamente, no emitir error crítico
    if (errCode === 'canceled' || errCode === 'interrupted') {
      return;
    }
    opts.onError?.(e);
  };

  try {
    clearSpeechKeepAlive();
    // Reanudar síntesis si está pausada
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Keep alive para navegadores Chromium en textos largos
    longSpeechKeepAlive = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (!window.speechSynthesis.speaking) {
          clearSpeechKeepAlive();
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    clearSpeechKeepAlive();
    console.warn('Error al ejecutar speak:', err);
    pendingAutoplay = { text: cleanText, options: opts };
  }
};

// Precargar voces al iniciar
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  } catch {}
}

export default {
  playAudio,
  stopAudio,
};

