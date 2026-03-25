// ============================================================
// COACH IA — Mango Coach
// Llama al proxy /api/coach (Vercel Serverless Function)
// La API key de Anthropic vive en el servidor, no en el cliente
// ============================================================

const TEMAS_GYM = [
  'ejercicio','rutina','músculo','musculo','proteína','proteina',
  'sentadilla','lagartija','flexión','flexion','burpee','peso',
  'serie','repetición','repeticion','calentar','calentamiento',
  'lesión','lesion','espalda','pierna','pecho','bícep','bicep',
  'trícep','tricep','hombro','cardio','mancuerna','barra','gym',
  'gimnasio','entrenamiento','descanso','dormir','comer','dieta',
  'nutrición','nutricion','hidratación','hidratacion','agua',
  'glúteo','gluteo','abdomen','core','fuerza','masa','grasa',
  'hiperextensión','hiperextension','press','remo','rack','step',
  'calorías','calorias','recuperación','recuperacion','proteína',
  'calentamiento','estiramiento','dolor','lesión','postura',
  'dominadas','fondos','paralelas','calistenia','zona fit'
]

export function esPreguntaValida(mensaje) {
  const lower = mensaje.toLowerCase()
  return TEMAS_GYM.some(t => lower.includes(t))
}

function buildSystemPrompt(perfil) {
  const datosUsuario = perfil ? `
Usuario: ${perfil.nombre}, Grupo ${perfil.grupo}.
${perfil.peso ? `Peso: ${perfil.peso}kg.` : ''}
${perfil.altura ? `Altura: ${perfil.altura}cm.` : ''}
${perfil.meta ? `Meta: ${perfil.meta}.` : ''}` : ''

  return `Eres Mango Coach 🥭, coach del Gym Asica Farms (Olmos, Perú). SOLO responde sobre ejercicios, rutinas, técnica y nutrición deportiva. Si preguntan otra cosa, declina amablemente. Respuestas cortas (máx 3 párrafos), español, tono motivador y claro.${datosUsuario}
Equipo disponible: rack de potencia, banco ajustable, press de banca, hiperextensiones, máquina de remo, mancuernas, barra olímpica, step, barra de dominadas, paralelas. También calistenia libre.`
}

export async function preguntarCoach({ mensaje, perfil, historialChat = [] }) {
  if (!esPreguntaValida(mensaje)) {
    return {
      ok: false,
      respuesta: '🥭 ¡Hola! Solo puedo ayudarte con dudas sobre ejercicios, rutinas y nutrición deportiva. ¿Tienes alguna pregunta sobre el gym?'
    }
  }

  const mensajesRecientes = historialChat.slice(-6).map(m => ({
    role: m.role,
    content: m.content
  }))

  // Llamada al proxy del servidor (no expone la API key)
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: buildSystemPrompt(perfil),
      messages: [
        ...mensajesRecientes,
        { role: 'user', content: mensaje }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return {
    ok: true,
    respuesta: data.content?.[0]?.text ?? 'No pude generar una respuesta, intenta de nuevo.'
  }
}
