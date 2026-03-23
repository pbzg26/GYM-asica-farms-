// ============================================================
// SERVICIO COACH IA — Mango Coach
// ● Solo usuarios autenticados pueden usarlo
// ● Filtro de tema ANTES de llamar la API (ahorra tokens)
// ● System prompt compacto (~80 tokens)
// ● max_tokens limitado a 350
// ● Fácil de cambiar la API key: solo edita VITE_ANTHROPIC_KEY en .env
// ============================================================

// ── Palabras clave permitidas ─────────────────────────────────
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
  'calorías','calorias','recuperación','recuperacion','proteína'
]

export function esPreguntaValida(mensaje) {
  const lower = mensaje.toLowerCase()
  return TEMAS_GYM.some(t => lower.includes(t))
}

// ── Construir system prompt con datos del perfil ──────────────
function buildSystemPrompt(perfil) {
  // Datos del usuario para personalizar respuestas
  const datosUsuario = perfil ? `
Usuario: ${perfil.nombre}, Grupo ${perfil.grupo}.
${perfil.peso ? `Peso: ${perfil.peso}kg.` : ''}
${perfil.altura ? `Altura: ${perfil.altura}cm.` : ''}
${perfil.meta ? `Meta: ${perfil.meta}.` : ''}` : ''

  return `Eres Mango Coach 🥭, coach del Gym Asica Farms (Olmos, Perú). SOLO responde sobre ejercicios, rutinas, técnica y nutrición deportiva. Si preguntan otra cosa, declina amablemente. Respuestas cortas (máx 3 párrafos), español, tono motivador y claro.${datosUsuario}
Equipo disponible: rack de potencia, banco ajustable, press de banca, hiperextensiones, máquina de remo, mancuernas, barra olímpica, step. También calistenia libre.`
}

// ── Llamada principal al Coach ────────────────────────────────
export async function preguntarCoach({ mensaje, perfil, historialChat = [] }) {
  // 1. Filtro de tema — sin costo si no pasa el filtro
  if (!esPreguntaValida(mensaje)) {
    return {
      ok: false,
      respuesta: '🥭 ¡Hola! Solo puedo ayudarte con dudas sobre ejercicios, rutinas y nutrición deportiva. ¿Tienes alguna pregunta sobre el gym?'
    }
  }

  // 2. Construir historial de conversación (máx últimos 6 mensajes para no acumular tokens)
  const mensajesRecientes = historialChat.slice(-6).map(m => ({
    role:    m.role,
    content: m.content
  }))

  // 3. Llamada a Claude API
  // La API key se configura en .env como VITE_ANTHROPIC_KEY
  // Para cambiar a la cuenta de Asica Farms, solo se cambia esa variable
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY
  const url = import.meta.env.DEV
    ? '/api/claude'
    : 'https://api.anthropic.com/v1/messages'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001', // Haiku: más barato, suficiente para Q&A
      max_tokens: 350,                          // Límite de respuesta
      system:     buildSystemPrompt(perfil),
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
    ok:        true,
    respuesta: data.content?.[0]?.text ?? 'No pude generar una respuesta, intenta de nuevo.'
  }
}
