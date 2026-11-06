import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Gemini AI API route
app.post('/api/system-advice', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'API Key de Gemini no configurada.',
        advice: 'Sistema activo en modo local: Enfócate en completar tus misiones diarias de alto valor para ganar más experiencia.'
      });
    }

    const { stats, focusHoursThisWeek, topCategory, userQuery } = req.body;

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Actúa como el SISTEMA DE PRODUCTIVIDAD (estilo anime Solo Leveling / Sistema de Cazadores).
Tu objetivo es dar una directiva táctica breve, épica, motivadora y extremadamente útil en español al usuario (Cazador).

Datos del Cazador:
- Horas de enfoque esta semana: ${focusHoursThisWeek || 0} horas
- Categoría principal: ${topCategory || 'Trabajo y Estudio'}
- Estadísticas: Fuerza Focus (${stats?.focus || 10}), Inteligencia (${stats?.learning || 10}), Ejecución (${stats?.execution || 10})
- Pregunta del Cazador: ${userQuery || '¿En qué debo invertir mi tiempo de alto valor hoy para subir de nivel?'}

Proporciona una respuesta concisa de máximo 3 párrafos cortos con tono del Sistema (ej: "[AVISO DEL SISTEMA]: Cazador..."), aconsejando cómo organizar sus temporizadores diarios y tiempo de alto valor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const advice = response.text || 'El Sistema ha registrado tu solicitud. Mantén la concentración en tus actividades de alto valor.';

    return res.json({ advice });
  } catch (error: any) {
    console.error('Error generating AI advice:', error);
    return res.status(500).json({
      error: 'Error en la conexión con el Sistema.',
      advice: 'El Sistema detecta interferencia. Mantén tu disciplina y completa tus temporizadores de alto valor.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Servidor de Chronos System iniciado en puerto ${PORT}`);
  });
}

startServer();
