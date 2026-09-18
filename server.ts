import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// ==========================================
// ENDPOINTS DE LECCIONES Y CONTENIDO
// ==========================================

// 1. Obtener la lista de todas las lecciones (opcionalmente filtradas por nivel)
app.get('/api/lessons', async (req: Request, res: Response) => {
  try {
    const { level } = req.query;

    const lessons = await prisma.lesson.findMany({
      where: level ? { level: String(level).toUpperCase() } : {},
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { exercises: true }
        }
      }
    });

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Error al obtener lecciones:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 2. Obtener una lección específica con sus ejercicios activos
app.get('/api/lessons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: {
          where: { active: true },
          orderBy: { itemNumber: 'asc' }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Lección no encontrada' });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error al obtener la lección:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 3. Obtener ejercicios filtrados por lección o habilidad (GRAMMAR, READING, etc.)
app.get('/api/exercises', async (req: Request, res: Response) => {
  try {
    const { lessonId, skill } = req.query;

    const exercises = await prisma.exercise.findMany({
      where: {
        active: true,
        ...(lessonId ? { lessonId: String(lessonId) } : {}),
        ...(skill ? { skill: String(skill).toUpperCase() as any } : {})
      },
      orderBy: { itemNumber: 'asc' }
    });

    res.json({
      success: true,
      data: exercises
    });
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Teclingo ejecutándose en http://localhost:${PORT}`);
});