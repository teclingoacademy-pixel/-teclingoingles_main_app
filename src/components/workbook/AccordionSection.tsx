import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { stopSpeech } from '@/utils/workbook/audioFeedback';

export type AccordionColorScheme = 'blue' | 'emerald' | 'indigo' | 'amber' | 'gray';

export interface AccordionSectionProps {
  number: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
  colorScheme?: AccordionColorScheme;
}

const COLOR_STYLES: Record<AccordionColorScheme, {
  container: string;
  header: string;
  numberBadge: string;
  title: string;
  subtitle: string;
  badge: string;
  arrow: string;
  content: string;
}> = {
  blue: {
    container: 'bg-blue-50 border-2 border-blue-200 rounded-xl mb-6 shadow-xs',
    header: 'bg-blue-50 hover:bg-blue-100/75',
    numberBadge: 'w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shrink-0',
    title: 'text-blue-900 font-bold text-lg sm:text-xl',
    subtitle: 'text-sm text-blue-600',
    badge: 'bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs',
    arrow: 'text-blue-600 hover:text-blue-900',
    content: 'p-4 sm:p-6 bg-white/90 border-t-2 border-blue-200',
  },
  emerald: {
    container: 'bg-emerald-50 border-2 border-emerald-200 rounded-xl mb-6 shadow-xs',
    header: 'bg-emerald-50 hover:bg-emerald-100/75',
    numberBadge: 'w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shrink-0',
    title: 'text-emerald-900 font-bold text-lg sm:text-xl',
    subtitle: 'text-sm text-emerald-600',
    badge: 'bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs',
    arrow: 'text-emerald-600 hover:text-emerald-900',
    content: 'p-4 sm:p-6 bg-white/90 border-t-2 border-emerald-200',
  },
  indigo: {
    container: 'bg-indigo-50 border-2 border-indigo-200 rounded-xl mb-6 shadow-xs',
    header: 'bg-indigo-50 hover:bg-indigo-100/75',
    numberBadge: 'w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shrink-0',
    title: 'text-indigo-900 font-bold text-lg sm:text-xl',
    subtitle: 'text-sm text-indigo-600',
    badge: 'bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs',
    arrow: 'text-indigo-600 hover:text-indigo-900',
    content: 'p-4 sm:p-6 bg-white/90 border-t-2 border-indigo-200',
  },
  amber: {
    container: 'bg-amber-50 border-2 border-amber-200 rounded-xl mb-6 shadow-xs',
    header: 'bg-amber-50 hover:bg-amber-100/75',
    numberBadge: 'w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shrink-0',
    title: 'text-amber-900 font-bold text-lg sm:text-xl',
    subtitle: 'text-sm text-amber-700',
    badge: 'bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs',
    arrow: 'text-amber-600 hover:text-amber-900',
    content: 'p-4 sm:p-6 bg-white/90 border-t-2 border-amber-200',
  },
  gray: {
    container: 'bg-gray-50 border-2 border-gray-200 rounded-xl mb-6 shadow-xs',
    header: 'bg-gray-50 hover:bg-gray-100/75',
    numberBadge: 'w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shrink-0',
    title: 'text-gray-900 font-bold text-lg sm:text-xl',
    subtitle: 'text-sm text-gray-600',
    badge: 'bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs',
    arrow: 'text-gray-600 hover:text-gray-900',
    content: 'p-4 sm:p-6 bg-white/90 border-t-2 border-gray-200',
  },
};

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  number,
  title,
  subtitle,
  badge,
  children,
  defaultOpen = false,
  headerActions = null,
  className = '',
  colorScheme,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resolve colorScheme based on section number if not explicitly provided
  const resolvedColorScheme: AccordionColorScheme = colorScheme || (
    String(number) === '1' ? 'blue' :
    String(number) === '2' ? 'emerald' :
    String(number) === '3' ? 'indigo' :
    String(number) === '4' ? 'amber' : 'blue'
  );

  const styles = COLOR_STYLES[resolvedColorScheme] || COLOR_STYLES.blue;

  // Cleanup: ensure TTS stops if this section unmounts
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggle = () => {
    const nextState = !isOpen;
    if (!nextState) {
      // Regla estricta: si se cierra la sección o el despliegue, el TTS debe detenerse de inmediato
      stopSpeech();
    }
    setIsOpen(nextState);

    if (nextState) {
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top - 16;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }, 60);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden transition-all ${styles.container} ${className}`}
    >
      {/* Header interactivo y accesible con colores distintivos por sección */}
      <div className={`w-full flex items-center justify-between p-4 sm:p-5 ${styles.header} transition-colors select-none`}>
        {/* Toggle principal */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex-1 flex items-center space-x-3 sm:space-x-4 min-w-0 pr-2 cursor-pointer text-left focus:outline-none group"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? 'Colapsar' : 'Expandir'} ${title}`}
        >
          {/* Número de sección prominente */}
          <div className={`${styles.numberBadge} group-hover:scale-105 transition-transform`}>
            {number}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2.5 flex-wrap gap-1">
              <h2 className={`${styles.title} group-hover:opacity-90 transition-opacity truncate`}>
                {title}
              </h2>
              {badge && (
                <span className={`shrink-0 ${styles.badge}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`${styles.subtitle} mt-0.5 truncate`}>
                {subtitle}
              </p>
            )}
          </div>
        </button>

        {/* Acciones de cabecera */}
        {headerActions && isOpen && (
          <div
            className="flex items-center space-x-2 ml-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {headerActions}
          </div>
        )}

        {/* Botón con flecha */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isOpen ? 'Colapsar sección' : 'Expandir sección'}
          aria-expanded={isOpen}
          className={`shrink-0 ml-2 p-2 rounded-lg ${styles.arrow} hover:bg-black/5 transition-colors cursor-pointer`}
        >
          {isOpen ? (
            <ChevronDown className="w-5 h-5 transition-transform" />
          ) : (
            <ChevronRight className="w-5 h-5 transition-transform" />
          )}
        </button>
      </div>

      {/* Contenido colapsable */}
      {isOpen && (
        <div className={`${styles.content} animate-in fade-in-50 duration-200`}>
          {children}
        </div>
      )}
    </div>
  );
};

