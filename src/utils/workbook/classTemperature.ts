/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * classTemperature.ts
 * Utilidad para cálculo de colores de "temperatura" pedagógica del avance de clases:
 * - 0%: Sin iniciar (Gris neutro)
 * - 1% - 25%: Naranja intenso (Frío / Arranque)
 * - 26% - 50%: Ámbar / Dorado (Tibio / Medio)
 * - 51% - 74%: Lima / Amarillo-Verdoso (Cálido / Avanzando)
 * - 75% - 99%: Verde Esmeralda (Caliente / Casi listo)
 * - 100%: VERDE AQUA (#00F5D4 / #14B8A6 / #2DD4BF) (Completado con honores)
 */

export interface TemperatureInfo {
  pct: number;
  label: string;
  shortLabel: string;
  status: 'completado' | 'avanzado' | 'medio' | 'inicial' | 'sin_iniciar';
  // Clases CSS de Tailwind y códigos HEX exactos
  textHex: string;
  textColorClass: string;
  bgHex: string;
  bgTintClass: string;
  borderHex: string;
  borderTintClass: string;
  barGradient: string;
  badgeBgClass: string;
  badgeBorderClass: string;
  badgeTextClass: string;
  glowClass: string;
  isCompleted: boolean;
  tempLevel: number; // 0..5 para escalas
}

/**
 * Obtiene la información visual del avance según la escala de temperatura
 */
export function getClassTemperature(pct: number): TemperatureInfo {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));

  // 100% -> VERDE AQUA (#00F5D4 / #2DD4BF / #14B8A6)
  if (clamped >= 100) {
    return {
      pct: 100,
      label: '100% Completada',
      shortLabel: '100%',
      status: 'completado',
      textHex: '#00F5D4',
      textColorClass: 'text-[#00F5D4]',
      bgHex: 'rgba(0, 245, 212, 0.15)',
      bgTintClass: 'bg-[#00F5D4]/15',
      borderHex: 'rgba(0, 245, 212, 0.6)',
      borderTintClass: 'border-[#00F5D4]/60',
      barGradient: 'bg-gradient-to-r from-[#14B8A6] via-[#2DD4BF] to-[#00F5D4]',
      badgeBgClass: 'bg-[#00F5D4]/20',
      badgeBorderClass: 'border-[#00F5D4]/50',
      badgeTextClass: 'text-[#00F5D4]',
      glowClass: 'shadow-[0_0_18px_rgba(0,245,212,0.4)] ring-1 ring-[#00F5D4]/50',
      isCompleted: true,
      tempLevel: 5,
    };
  }

  // 75% - 99% -> Verde Esmeralda (#10B981)
  if (clamped >= 75) {
    return {
      pct: clamped,
      label: `${clamped}% Avanzado`,
      shortLabel: `${clamped}%`,
      status: 'avanzado',
      textHex: '#10B981',
      textColorClass: 'text-[#10B981]',
      bgHex: 'rgba(16, 185, 129, 0.15)',
      bgTintClass: 'bg-[#10B981]/15',
      borderHex: 'rgba(16, 185, 129, 0.4)',
      borderTintClass: 'border-[#10B981]/40',
      barGradient: 'bg-gradient-to-r from-[#34D399] to-[#10B981]',
      badgeBgClass: 'bg-[#10B981]/20',
      badgeBorderClass: 'border-[#10B981]/50',
      badgeTextClass: 'text-[#10B981]',
      glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      isCompleted: false,
      tempLevel: 4,
    };
  }

  // 50% - 74% -> Lima / Amarillo-Verdoso (#84CC16 / #A3E635)
  if (clamped >= 50) {
    return {
      pct: clamped,
      label: `${clamped}% En Progreso`,
      shortLabel: `${clamped}%`,
      status: 'medio',
      textHex: '#A3E635',
      textColorClass: 'text-[#A3E635]',
      bgHex: 'rgba(163, 230, 53, 0.15)',
      bgTintClass: 'bg-[#A3E635]/15',
      borderHex: 'rgba(163, 230, 53, 0.4)',
      borderTintClass: 'border-[#A3E635]/40',
      barGradient: 'bg-gradient-to-r from-[#FBBF24] to-[#A3E635]',
      badgeBgClass: 'bg-[#A3E635]/20',
      badgeBorderClass: 'border-[#A3E635]/50',
      badgeTextClass: 'text-[#A3E635]',
      glowClass: 'shadow-[0_0_10px_rgba(163,230,53,0.2)]',
      isCompleted: false,
      tempLevel: 3,
    };
  }

  // 25% - 49% -> Ámbar / Dorado (#F59E0B)
  if (clamped >= 25) {
    return {
      pct: clamped,
      label: `${clamped}% Iniciada`,
      shortLabel: `${clamped}%`,
      status: 'inicial',
      textHex: '#F59E0B',
      textColorClass: 'text-[#F59E0B]',
      bgHex: 'rgba(245, 158, 11, 0.15)',
      bgTintClass: 'bg-[#F59E0B]/15',
      borderHex: 'rgba(245, 158, 11, 0.4)',
      borderTintClass: 'border-[#F59E0B]/40',
      barGradient: 'bg-gradient-to-r from-[#F97316] to-[#F59E0B]',
      badgeBgClass: 'bg-[#F59E0B]/20',
      badgeBorderClass: 'border-[#F59E0B]/50',
      badgeTextClass: 'text-[#F59E0B]',
      glowClass: 'shadow-[0_0_8px_rgba(245,158,11,0.2)]',
      isCompleted: false,
      tempLevel: 2,
    };
  }

  // 1% - 24% -> Naranja intenso (#F97316)
  if (clamped > 0) {
    return {
      pct: clamped,
      label: `${clamped}% Inicio`,
      shortLabel: `${clamped}%`,
      status: 'inicial',
      textHex: '#F97316',
      textColorClass: 'text-[#F97316]',
      bgHex: 'rgba(249, 115, 22, 0.15)',
      bgTintClass: 'bg-[#F97316]/15',
      borderHex: 'rgba(249, 115, 22, 0.4)',
      borderTintClass: 'border-[#F97316]/40',
      barGradient: 'bg-[#F97316]',
      badgeBgClass: 'bg-[#F97316]/20',
      badgeBorderClass: 'border-[#F97316]/50',
      badgeTextClass: 'text-[#F97316]',
      glowClass: '',
      isCompleted: false,
      tempLevel: 1,
    };
  }

  // 0% -> Sin Iniciar (Gris neutro)
  return {
    pct: 0,
    label: '0% Sin Iniciar',
    shortLabel: '0%',
    status: 'sin_iniciar',
    textHex: '#8A95A5',
    textColorClass: 'text-[#8A95A5]',
    bgHex: 'rgba(138, 149, 165, 0.1)',
    bgTintClass: 'bg-white/5',
    borderHex: 'rgba(138, 149, 165, 0.2)',
    borderTintClass: 'border-white/10',
    barGradient: 'bg-white/10',
    badgeBgClass: 'bg-white/5',
    badgeBorderClass: 'border-white/10',
    badgeTextClass: 'text-[#8A95A5]',
    glowClass: '',
    isCompleted: false,
    tempLevel: 0,
  };
}
