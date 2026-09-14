import { MCERLevel, SkillType, Exercise, SessionData } from '../../types/workbook/types';

// Extended repository of additional contextual exercises per session and skill
const EXTRA_EXERCISES_POOL: Record<string, Exercise[]> = {
  'sesion-1': [
    {
      id: 's1-dyn-1',
      sessionNumber: 1,
      level: 'A2',
      skill: 'grammar',
      prompt: 'Complete the polite request: "____ we have some extra napkins, please?"',
      options: [
        { id: 'a', text: 'A) Could', isCorrect: true },
        { id: 'b', text: 'B) Do', isCorrect: false },
        { id: 'c', text: 'C) Are', isCorrect: false },
        { id: 'd', text: 'D) Have', isCorrect: false },
      ],
      correctExplanation: 'Usamos "Could we have...?" para pedir elementos adicionales de manera cortés.',
      failureExplanation: 'La opción correcta era la A ("Could").',
    },
    {
      id: 's1-dyn-2',
      sessionNumber: 1,
      level: 'A2',
      skill: 'vocab',
      prompt: 'What do you call the sweet dish eaten at the end of a meal?',
      options: [
        { id: 'a', text: 'A) Dessert', isCorrect: true },
        { id: 'b', text: 'B) Desert (desierto)', isCorrect: false },
        { id: 'c', text: 'C) Appetizer', isCorrect: false },
        { id: 'd', text: 'D) Beverage', isCorrect: false },
      ],
      correctExplanation: '"Dessert" (con doble \'s\') es el postre.',
      failureExplanation: 'La opción correcta era la A ("Dessert"). Recuerda que "desert" con una sola \'s\' significa desierto.',
    },
    {
      id: 's1-dyn-3',
      sessionNumber: 1,
      level: 'A2',
      skill: 'listening',
      prompt: 'Escucha la pregunta del mesero: "¿Cómo desea el cliente la cocción de su carne?"',
      audioPromptText: 'How would you like your steak prepared: rare, medium, or well done?',
      options: [
        { id: 'a', text: 'A) Rare, medium, or well done', isCorrect: true },
        { id: 'b', text: 'B) Fried with cheese', isCorrect: false },
        { id: 'c', text: 'C) Cold with salad', isCorrect: false },
        { id: 'd', text: 'D) Spicy or sweet', isCorrect: false },
      ],
      correctExplanation: 'Los términos estándar de cocción en inglés son "rare" (término rojo/medio rojo), "medium" (tres cuartos/término medio), y "well done" (bien cocido).',
      failureExplanation: 'La opción correcta era la A ("Rare, medium, or well done").',
    },
    {
      id: 's1-dyn-4',
      sessionNumber: 1,
      level: 'A2',
      skill: 'speaking',
      prompt: 'Si el mesero trae el plato equivocado, ¿cuál es la forma diplomática de indicarlo?',
      options: [
        { id: 'a', text: 'A) "Excuse me, I think I ordered the grilled fish, not the beef burger."', isCorrect: true },
        { id: 'b', text: 'B) "You did a terrible job, take this out."', isCorrect: false },
        { id: 'c', text: 'C) "No eat this food never."', isCorrect: false },
        { id: 'd', text: 'D) "Why you give me wrong plate?"', isCorrect: false },
      ],
      correctExplanation: '"Excuse me, I think I ordered..." expresa la discrepancia con total respeto y claridad.',
      failureExplanation: 'La opción correcta era la A.',
    },
    {
      id: 's1-dyn-5',
      sessionNumber: 1,
      level: 'A2',
      skill: 'grammar',
      prompt: 'Identify the grammatically correct question:',
      options: [
        { id: 'a', text: 'A) "What would you recommend for dinner?"', isCorrect: true },
        { id: 'b', text: 'B) "What you recommend dinner?"', isCorrect: false },
        { id: 'c', text: 'C) "What would you to recommend?"', isCorrect: false },
        { id: 'd', text: 'D) "Recommends you what?"', isCorrect: false },
      ],
      correctExplanation: 'La estructura modal interrogativa es: Wh-word + would + subject + bare infinitive ("What would you recommend?").',
      failureExplanation: 'La opción correcta era la A ("What would you recommend for dinner?").',
    },
  ],
  'sesion-2': [
    {
      id: 's2-dyn-1',
      sessionNumber: 2,
      level: 'B1',
      skill: 'grammar',
      prompt: '"Passengers ____ not leave their baggage unattended at any time."',
      options: [
        { id: 'a', text: 'A) must', isCorrect: true },
        { id: 'b', text: 'B) may to', isCorrect: false },
        { id: 'c', text: 'C) ought', isCorrect: false },
        { id: 'd', text: 'D) can to', isCorrect: false },
      ],
      correctExplanation: '"Must not" indica una prohibición oficial de seguridad aeroportuaria.',
      failureExplanation: 'La opción correcta era la A ("must").',
    },
    {
      id: 's2-dyn-2',
      sessionNumber: 2,
      level: 'B1',
      skill: 'vocab',
      prompt: 'Which document provides authorization to enter a foreign sovereign country?',
      options: [
        { id: 'a', text: 'A) Entry Visa', isCorrect: true },
        { id: 'b', text: 'B) Boarding card', isCorrect: false },
        { id: 'c', text: 'C) Luggage tag', isCorrect: false },
        { id: 'd', text: 'D) Duty free receipt', isCorrect: false },
      ],
      correctExplanation: 'La "Visa" es la autorización legal para ingresar al país extranjero.',
      failureExplanation: 'La opción correcta era la A ("Entry Visa").',
    },
    {
      id: 's2-dyn-3',
      sessionNumber: 2,
      level: 'B1',
      skill: 'speaking',
      prompt: 'In case of a tight layover, how do you ask the flight attendant for assistance?',
      options: [
        { id: 'a', text: 'A) "Excuse me, my connecting flight departs in 30 minutes. Could I disembark first?"', isCorrect: true },
        { id: 'b', text: 'B) "Open the plane door now I run!"', isCorrect: false },
        { id: 'c', text: 'C) "My other airplane is flying."', isCorrect: false },
        { id: 'd', text: 'D) "Flight fast please."', isCorrect: false },
      ],
      correctExplanation: '"Excuse me, my connecting flight departs in 30 minutes..." es la forma adecuada.',
      failureExplanation: 'La opción correcta era la A.',
    },
  ],
  'sesion-3': [
    {
      id: 's3-dyn-1',
      sessionNumber: 3,
      level: 'B1',
      skill: 'grammar',
      prompt: '"I have been collaborating with cross-functional engineers ____ more than three years."',
      options: [
        { id: 'a', text: 'A) for', isCorrect: true },
        { id: 'b', text: 'B) since', isCorrect: false },
        { id: 'c', text: 'C) during of', isCorrect: false },
        { id: 'd', text: 'D) from', isCorrect: false },
      ],
      correctExplanation: 'Usamos "for" con periodos de tiempo ("for more than three years") y "since" con puntos de inicio específicos.',
      failureExplanation: 'La opción correcta era la A ("for").',
    },
  ],
};

/**
 * Generate a dynamic set of exercises based on session, selected skills, level, and count
 */
export function generateExercisesForSession(
  session: SessionData,
  selectedSkills: Record<SkillType, boolean>,
  selectedLevel: MCERLevel,
  count: number
): Exercise[] {
  // 1. Gather all candidate exercises for this session
  const basePool = [...session.exercises];
  const extraPool = EXTRA_EXERCISES_POOL[session.id] || [];
  const fullPool = [...basePool, ...extraPool];

  // 2. Filter by active skills
  const activeSkills = (Object.keys(selectedSkills) as SkillType[]).filter(
    (skill) => selectedSkills[skill]
  );

  if (activeSkills.length === 0) {
    return [];
  }

  // Filter exercises matching selected skills
  let filtered = fullPool.filter((ex) => activeSkills.includes(ex.skill));

  // Prioritize matching level if available
  const exactLevelMatch = filtered.filter((ex) => ex.level === selectedLevel);
  const otherLevels = filtered.filter((ex) => ex.level !== selectedLevel);
  filtered = [...exactLevelMatch, ...otherLevels];

  // If pool has fewer than requested count, wrap or repeat with unique IDs
  const result: Exercise[] = [];
  let poolIndex = 0;

  for (let i = 0; i < count && filtered.length > 0; i++) {
    const item = filtered[poolIndex % filtered.length];
    // If wrapping, make sure ID is distinct so attempt state tracks properly
    const uniqueId = poolIndex >= filtered.length ? `${item.id}-dup-${i}` : item.id;
    result.push({
      ...item,
      id: uniqueId,
    });
    poolIndex++;
  }

  return result;
}
