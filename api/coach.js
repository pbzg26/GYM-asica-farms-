// ============================================================
// API PROXY — Coach IA (Vercel Serverless Function)
// Protege la API key de Anthropic del bundle del cliente
// Variables de entorno en Vercel Dashboard: ANTHROPIC_KEY
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const apiKey = process.env.ANTHROPIC_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en servidor' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Error al conectar con el coach' })
  }
}
