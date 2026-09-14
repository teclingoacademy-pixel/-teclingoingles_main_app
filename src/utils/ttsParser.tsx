/**
 * TTS Parser Utility
 * Parses text from Google Sheets and converts to visual badges
 * - "" (comillas) → TTS badges (blue for male, pink for female)
 * - **text** → Bold text
 */

import React from 'react';
import { Volume2 } from 'lucide-react';

interface TTSTextProps {
  text: string;
  speaker?: 'M' | 'F';
}

interface ParsedSegment {
  type: 'text' | 'tts' | 'bold';
  content: string;
  speaker?: 'M' | 'F';
}

/**
 * Parses text and splits into segments for rendering
 * - Detects "" (comillas inglesas) for TTS badges
 * - Detects **text** for bold
 */
export function parseTTSText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  
  // Regex pattern to match:
  // - "" (comillas inglesas) for TTS
  // - **text** for bold
  const pattern = /([""][^""]*[""]|[""][^""]*[""]|\*\*[^*]+\*\*)/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }
    
    const matched = match[0];
    
    // Check if it's a TTS badge (comillas inglesas)
    if ((matched.startsWith('"') && matched.endsWith('"')) || 
        (matched.startsWith('"') && matched.endsWith('"'))) {
      segments.push({
        type: 'tts',
        content: matched.slice(1, -1) // Remove quotes
      });
    }
    // Check if it's bold (**text**)
    else if (matched.startsWith('**') && matched.endsWith('**')) {
      segments.push({
        type: 'bold',
        content: matched.slice(2, -2) // Remove **
      });
    }
    
    lastIndex = match.index + matched.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }
  
  return segments;
}

/**
 * React component to render TTS-enabled text
 * Displays TTS badges (blue for male, pink for female)
 */
export function TTSText({ text, speaker = 'M' }: TTSTextProps) {
  const segments = parseTTSText(text);
  
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {segments.map((segment, index) => {
        if (segment.type === 'tts') {
          // TTS Badge - Blue for male, Pink for female
          const isMale = speaker === 'M';
          return (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isMale 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              }`}
            >
              <Volume2 size={12} />
              {segment.content}
            </span>
          );
        }
        
        if (segment.type === 'bold') {
          return (
            <strong key={index} className="font-bold text-white">
              {segment.content}
            </strong>
          );
        }
        
        // Regular text
        return <span key={index}>{segment.content}</span>;
      })}
    </span>
  );
}

/**
 * Groups exercises by Skill column
 */
export function groupExercisesBySkill(exercises: any[]): Record<string, any[]> {
  return exercises.reduce((acc, ex) => {
    const skill = ex.Skill || 'General';
    if (!acc[skill]) acc[skill] = [];
    acc[skill].push(ex);
    return acc;
  }, {} as Record<string, any[]>);
}

/**
 * Filters exercises by LESSON_ID
 */
export function filterExercisesByLesson(exercises: any[], lessonId: string): any[] {
  return exercises.filter(ex => ex.LESSON_ID === lessonId);
}

/**
 * Gets unique skills from exercises
 */
export function getUniqueSkills(exercises: any[]): string[] {
  const skills = new Set(exercises.map(ex => ex.Skill || 'General'));
  return Array.from(skills);
}

/**
 * Calculates total points for a group of exercises
 */
export function calculateTotalPoints(exercises: any[]): number {
  return exercises.reduce((total, ex) => total + (ex.Points || 0), 0);
}

/**
 * Example usage:
 * 
 * const exercisesDB = [
 *   { LESSON_ID: "N1-C01", Skill: "Grammar", Prompt_ES: "Completa con el pronombre correcto", Prompt_EN: "Complete with the correct pronoun: \"She\" is a student", Answer: "She", Points: 10 },
 *   { LESSON_ID: "N1-C01", Skill: "Vocabulary", Prompt_ES: "Escribe 3 colores en inglés", Prompt_EN: "Write 3 colors in English", Answer: "red, blue, green", Points: 15 },
 * ];
 * 
 * // Filter by lesson
 * const lessonExercises = filterExercisesByLesson(exercisesDB, "N1-C01");
 * // Result: 2 exercises
 * 
 * // Group by skill
 * const grouped = groupExercisesBySkill(lessonExercises);
 * // Result: { Grammar: [...], Vocabulary: [...] }
 * 
 * // In JSX:
 * <TTSText text='Complete with: "She" is a student' speaker="F" />
 * // Renders: Complete with: [🔊 She] is a student (pink badge)
 */
