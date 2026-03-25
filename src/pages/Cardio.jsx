// ============================================================
// PÁGINA: Cardio — Rutas al aire libre en Asica Farms
// Ruta 1: Oficinas ↔ Garita (1.2km x2 = 2.4km, plano)
// Ruta 2: Cancha de fútbol (200m/vuelta) con calculadora de calorías
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { guardarSesionCardio } from '../services/dbService'

// MET y velocidad por ritmo
const MET = { caminando: 3.5, trotando: 7.0, corriendo: 10.0 }
const VEL_KMH = { caminando: 5, trotando: 8, corriendo: 12 }

const RITMO_LABELS = {
  caminando: 'Caminando',
  trotando:  'Trotando',
  corriendo: 'Corriendo'
}

function calcularCardio(vueltas, ritmo, pesoKg) {
  const distanciaKm  = +(vueltas * 0.2).toFixed(2)
  const tiempoHoras  = distanciaKm / VEL_KMH[ritmo]
  const calorias     = Math.round(MET[ritmo] * (pesoKg || 70) * tiempoHoras)
  const tiempoMinutos = Math.round(tiempoHoras * 60)
  return { distanciaKm, tiempoMinutos, calorias }
}

// ── Modal registro ruta garita ─────────────────────────────────
function ModalGarita({ pesoRef, onGuardar, onCancelar, guardando }) {
  const [minutos, setMinutos] = useState('')
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-box__title">Registrar caminata Garita</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Ruta: Oficinas ↔ Garita — 2.4 km total
        </p>
        <div className="form-group">
          <label>¿Cuántos minutos tardaste?</label>
          <input
            type="number"
            min="1"
            placeholder="30"
            value={minutos}
            onChange={e => setMinutos(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-box__actions">
          <button
            className="btn btn--primary"
            onClick={() => onGuardar(parseInt(minutos) || 30)}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar en mi perfil'}
          </button>
          <button className="btn btn--ghost" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default function Cardio() {
  const { usuario, perfil } = useAuth()
  const navigate = useNavigate()

  // Calculadora cancha
  const [vueltas,      setVueltas]      = useState(5)
  const [ritmo,        setRitmo]        = useState('caminando')
  const [guardando,    setGuardando]    = useState(false)
  const [guardado,     setGuardado]     = useState(null)
  const [modalGarita,  setModalGarita]  = useState(false)

  const peso = parseFloat(perfil?.peso) || 70
  const calculo = calcularCardio(vueltas, ritmo, peso)

  async function guardarCancha() {
    if (!usuario) { navigate('/login'); return }
    setGuardando(true)
    try {
      await guardarSesionCardio(usuario.uid, {
        tipo:            'cancha',
        distanciaKm:     calculo.distanciaKm,
        duracionMinutos: calculo.tiempoMinutos,
        calorias:        calculo.calorias,
        ritmo,
        vueltas
      })
      setGuardado('cancha')
      setTimeout(() => setGuardado(null), 4000)
    } catch (e) { console.error(e) }
    setGuardando(false)
  }

  async function guardarGarita(minutos) {
    if (!usuario) { navigate('/login'); return }
    setGuardando(true)
    try {
      const tiempoHoras  = minutos / 60
      const calorias     = Math.round(MET['caminando'] * peso * tiempoHoras)
      await guardarSesionCardio(usuario.uid, {
        tipo:            'garita',
        distanciaKm:     2.4,
        duracionMinutos: minutos,
        calorias,
        ritmo:           'caminando'
      })
      setModalGarita(false)
      setGuardado('garita')
      setTimeout(() => setGuardado(null), 4000)
    } catch (e) { console.error(e) }
    setGuardando(false)
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Cardio al Aire Libre 🏃</h2>
        <p className="page__sub">Dos rutas disponibles en Asica Farms</p>
      </div>

      {/* ── RUTA 1: GARITA ──────────────────────────────────── */}
      <div className="cardio-ruta-card">
        <div className="cardio-ruta-card__header">
          <div className="cardio-ruta-card__icon">🚶</div>
          <div>
            <h3 className="cardio-ruta-card__title">Ruta 1 — Oficinas → Garita</h3>
            <div className="cardio-ruta-card__meta">
              <span className="cardio-meta-pill">📍 2.4 km total</span>
              <span className="cardio-meta-pill">🏔️ Terreno plano</span>
              <span className="cardio-meta-pill">↔️ 1.2 km ida · 1.2 km vuelta</span>
            </div>
          </div>
        </div>

        {/* Reglas */}
        <div className="cardio-reglas">
          <p className="cardio-reglas__titulo">📋 Reglas importantes</p>
          <ul className="cardio-reglas__lista">
            <li>✅ Solo por el camino principal — no desviarse hacia el cultivo</li>
            <li>✅ Hacer la caminata solo en horario autorizado</li>
            <li>⚠️ Si hay poca luz: llevar linterna o celular con linterna encendida (obligatorio)</li>
            <li>🎧 Si usas audífonos: solo uno y con volumen bajo — estar siempre atento al entorno</li>
          </ul>
        </div>

        {/* Mensaje motivacional */}
        <div className="cardio-motivacion">
          <p className="cardio-motivacion__texto">
            💚 <strong>Una idea:</strong> intenta hacer esta caminata sin música ni celular.
            Desconéctate del ruido digital y conecta con la naturaleza, el viento y el silencio del campo.
            Caminar sin audífonos es una de las formas más poderosas de despejar la mente y recargar energía.
            <em>El camino también cura.</em>
          </p>
        </div>

        {guardado === 'garita' && (
          <div className="cardio-guardado">✓ ¡Caminata registrada en tu perfil!</div>
        )}

        <button
          className="btn btn--primary btn--full"
          onClick={() => usuario ? setModalGarita(true) : navigate('/login')}
          style={{ marginTop: 12 }}
        >
          ✓ Registrar caminata
        </button>
        {!usuario && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
            Inicia sesión para guardar en tu perfil
          </p>
        )}
      </div>

      {/* ── RUTA 2: CANCHA ──────────────────────────────────── */}
      <div className="cardio-ruta-card">
        <div className="cardio-ruta-card__header">
          <div className="cardio-ruta-card__icon">⚽</div>
          <div>
            <h3 className="cardio-ruta-card__title">Ruta 2 — Cancha de Fútbol</h3>
            <div className="cardio-ruta-card__meta">
              <span className="cardio-meta-pill">📍 200 m por vuelta</span>
              <span className="cardio-meta-pill">🔄 Perimetral</span>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="cardio-calculadora">
          <p className="cardio-calculadora__titulo">🔢 Calculadora de calorías</p>

          <div className="cardio-calc-row">
            <label>Número de vueltas</label>
            <div className="cardio-stepper">
              <button onClick={() => setVueltas(v => Math.max(1, v - 1))} className="cardio-stepper__btn">−</button>
              <span className="cardio-stepper__val">{vueltas}</span>
              <button onClick={() => setVueltas(v => Math.min(50, v + 1))} className="cardio-stepper__btn">+</button>
            </div>
          </div>

          <div className="cardio-calc-row">
            <label>Ritmo</label>
            <div className="cardio-ritmo-selector">
              {Object.keys(MET).map(r => (
                <button
                  key={r}
                  className={`cardio-ritmo-btn ${ritmo === r ? 'active' : ''}`}
                  onClick={() => setRitmo(r)}
                >
                  {r === 'caminando' ? '🚶' : r === 'trotando' ? '🏃' : '⚡'} {RITMO_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Resultados */}
          <div className="cardio-resultados">
            <div className="cardio-resultado-item">
              <span className="cardio-resultado-item__val">{calculo.distanciaKm}</span>
              <span className="cardio-resultado-item__lbl">km recorridos</span>
            </div>
            <div className="cardio-resultado-item">
              <span className="cardio-resultado-item__val">{calculo.tiempoMinutos}</span>
              <span className="cardio-resultado-item__lbl">minutos est.</span>
            </div>
            <div className="cardio-resultado-item cardio-resultado-item--calorias">
              <span className="cardio-resultado-item__val">~{calculo.calorias}</span>
              <span className="cardio-resultado-item__lbl">kcal quemadas</span>
            </div>
          </div>

          {perfil?.peso && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              Calculado para {peso} kg · Estimación aproximada según fórmula MET
            </p>
          )}
          {!perfil?.peso && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              Calculado con peso referencia 70 kg · <a href="/perfil" style={{color:'var(--neon)'}}>Actualiza tu peso</a> para mayor precisión
            </p>
          )}
        </div>

        {guardado === 'cancha' && (
          <div className="cardio-guardado">✓ ¡Sesión de cardio guardada en tu perfil!</div>
        )}

        <button
          className="btn btn--primary btn--full"
          onClick={guardarCancha}
          disabled={guardando}
          style={{ marginTop: 12 }}
        >
          {guardando ? 'Guardando...' : '💾 Guardar en mi perfil'}
        </button>
        {!usuario && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
            Inicia sesión para guardar en tu perfil
          </p>
        )}
      </div>

      {/* Modal garita */}
      {modalGarita && (
        <ModalGarita
          pesoRef={peso}
          onGuardar={guardarGarita}
          onCancelar={() => setModalGarita(false)}
          guardando={guardando}
        />
      )}
    </div>
  )
}
