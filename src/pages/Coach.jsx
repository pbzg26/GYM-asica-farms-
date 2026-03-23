import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { preguntarCoach } from '../services/coachService'

const PREGUNTAS_RAPIDAS = [
  '¿Cuántas series debo hacer por ejercicio?',
  '¿Qué comer antes de entrenar?',
  '¿Cómo hago sentadillas correctamente?',
  'Tengo dolor de espalda, ¿puedo entrenar?',
  '¿Cuánta proteína necesito al día?',
  '¿Cada cuántos días puedo entrenar piernas?'
]

export default function Coach() {
  const { perfil } = useAuth()
  const [mensajes,  setMensajes]  = useState([
    {
      role:    'assistant',
      content: `¡Hola${perfil?.nombre ? `, ${perfil.nombre}` : ''}! Soy Mango Coach 🥭, tu entrenador personal del Gym Asica Farms.\n\n${perfil?.grupo ? `Veo que eres del **Grupo ${perfil.grupo}**${perfil.meta ? ` y tu meta es ${perfil.meta}` : ''}. ` : ''}Puedes preguntarme sobre ejercicios, técnica, rutinas o nutrición. ¡Estoy para ayudarte!`
    }
  ])
  const [input,     setInput]     = useState('')
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  async function enviarMensaje(texto) {
    const msg = texto ?? input.trim()
    if (!msg || cargando) return
    setInput('')
    setError(null)

    // Agregar mensaje del usuario
    const nuevosMensajes = [...mensajes, { role: 'user', content: msg }]
    setMensajes(nuevosMensajes)
    setCargando(true)

    try {
      const { ok, respuesta } = await preguntarCoach({
        mensaje:      msg,
        perfil,                         // Perfil completo para personalizar respuesta
        historialChat: nuevosMensajes   // Últimos mensajes (el servicio toma solo 6)
      })

      setMensajes(prev => [...prev, { role: 'assistant', content: respuesta }])

      if (!ok) setError('Pregunta fuera del tema del gym')
    } catch (err) {
      setMensajes(prev => [...prev, {
        role:    'assistant',
        content: '⚠️ Hubo un problema al conectar con el coach. Verifica tu conexión e intenta de nuevo.'
      }])
    }

    setCargando(false)
  }

  return (
    <div className="page page--coach">
      {/* Header del coach */}
      {/* AI Studio: personalidad visual de Mango Coach */}
      <div className="coach-header">
        <div className="coach-header__avatar">🥭</div>
        <div>
          <h2>Mango Coach</h2>
          <p className="coach-header__status">
            <span className="status-dot status-dot--online" />
            En línea · Coach IA del Gym Asica Farms
          </p>
        </div>
      </div>

      {/* Preguntas rápidas (solo si no hay muchos mensajes aún) */}
      {mensajes.length <= 1 && (
        <div className="quick-questions">
          {PREGUNTAS_RAPIDAS.map(q => (
            <button key={q} className="quick-q" onClick={() => enviarMensaje(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Mensajes */}
      <div className="chat-messages">
        {mensajes.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.role}`}>
            <p dangerouslySetInnerHTML={{
              __html: m.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>')
            }} />
          </div>
        ))}

        {cargando && (
          <div className="chat-msg chat-msg--assistant">
            <div className="typing-indicator">
              <span/><span/><span/>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input
          className="chat-input-bar__input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
          placeholder="Pregúntale a Mango Coach..."
          disabled={cargando}
        />
        <button
          className="chat-input-bar__send"
          onClick={() => enviarMensaje()}
          disabled={cargando || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
