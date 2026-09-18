import { PrismaClient, Skill } from '@prisma/client';
import xlsx from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const filePath = path.join(__dirname, '../Tecligo_db_conocimiento_contenido_a1-b2_datasheet.xlsx');
  
  console.log(`📖 Leyendo archivo desde: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(`📊 Procesando ${sheetData.length} reactivos...`);

  for (const row of sheetData) {
    const lessonId = row.clase_id || 'A1_C01';
    const level = lessonId.split('_')[0] || 'A1';

    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {},
      create: {
        id: lessonId,
        level: level,
        title: `Clase ${lessonId}`,
        order: 1,
      },
    });

    const skillMap: Record<string, Skill> = {
      grammar: Skill.GRAMMAR,
      reading: Skill.READING,
      listening: Skill.LISTENING,
      speaking: Skill.SPEAKING,
      vocabulary: Skill.VOCABULARY,
    };

    const skillEnum = skillMap[row.habilidad?.toLowerCase()] || Skill.GRAMMAR;

    // Sanitización de opciones JSON
    let options: any = [];
    let optionsTranslation: any = [];

    if (row.opciones_json) {
      try {
        options = typeof row.opciones_json === 'string' ? JSON.parse(row.opciones_json) : row.opciones_json;
      } catch (e) {
        options = [String(row.opciones_json)];
      }
    }

    if (row.opciones_traduccion_json) {
      try {
        optionsTranslation = typeof row.opciones_traduccion_json === 'string' 
          ? JSON.parse(row.opciones_traduccion_json) 
          : row.opciones_traduccion_json;
      } catch (e) {
        optionsTranslation = [String(row.opciones_traduccion_json)];
      }
    }

    // Validar que audioUrl sea String o null (si viene un número por desfase de columnas, lo asigna null)
    let audioUrlValue: string | null = null;
    if (row.audio_url && typeof row.audio_url === 'string' && !/^\d+$/.test(row.audio_url.trim())) {
      audioUrlValue = row.audio_url.trim();
    }

    await prisma.exercise.upsert({
      where: { id: row.reactivo_id },
      update: {},
      create: {
        id: row.reactivo_id,
        lessonId: lessonId,
        skill: skillEnum,
        itemNumber: parseInt(row.numero_reactivo) || 1,
        questionType: row.tipo_pregunta || 'multiple_choice',
        spanishContext: row.contexto_espanol ? String(row.contexto_espanol) : null,
        instruction: row.instruccion ? String(row.instruccion) : null,
        questionText: String(row.pregunta_texto || ''),
        translationSentence: row.frase_traduccion ? String(row.frase_traduccion) : null,
        optionsJson: options,
        optionsTranslation: optionsTranslation,
        correctAnswer: String(row.respuesta_correcta || ''),
        explanation: row.respuesta_explicacion ? String(row.respuesta_explicacion) : null,
        vocabularyHint: row.pista_vocabulario ? String(row.pista_vocabulario) : null,
        audioUrl: audioUrlValue,
        points: parseInt(row.puntos) || 10,
        timeLimitSec: parseInt(row.tiempo_limite_seg) || 30,
        difficulty: parseInt(row.dificultad) || 1,
        active: row.activo === true || row.activo === 'TRUE' || row.activo === 'true',
      },
    });
  }

  console.log('✅ Ingesta de datos completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error cargando los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });