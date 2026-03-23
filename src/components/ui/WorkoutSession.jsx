// ============================================================
// COMPONENTE: WorkoutSession
// Modo "Comenzar rutina" con temporizador por serie y descanso
// ============================================================
import { useState, useEffect, useRef } from 'react'

// Parsear campo descanso: "60 seg" → 60, "2 min" → 120
function parsearDescanso(str) {
  if (!str) return 75
  const s = String(str).toLowerCase().trim()
  const minMatch = s.match(/(\d+)\s*min/)
  if (minMatch) return parseInt(minMatch[1]) * 60
  const segMatch = s.match(/(\d+)/)
  if (segMatch) return parseInt(segMatch[1])
  return 75
}

function formatMM_SS(seg) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function formatHH_MM_SS(seg) {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  const s = seg % 60
  if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
  return formatMM_SS(seg)
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 880; gain.gain.value = 0.3
    osc.start()
    setTimeout(() => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      setTimeout(() => osc.stop(), 500)
    }, 100)
  } catch(_) {}
}

// Círculo SVG para countdown
function CirculoContdown({ segundos, total }) {
  const r = 70
  const circ = 2 * Math.PI * r
  const progreso = total > 0 ? (segundos / total) : 0
  const offset = circ * (1 - progreso)
  return (
    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--green-100, #e8f5e9)" strokeWidth="10" />
      <circle
        cx="90" cy="90" r={r} fill="none"
        stroke="var(--green-600, #43a047)" strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}

export default function WorkoutSession({ ejercicios, grupoNombre, diaNombre, onFinalizar, onSalir }) {
  const [fase,            setFase]            = useState('preparacion')
  const [ejercicioIdx,    setEjercicioIdx]    = useState(0)
  const [serieActual,     setSerieActual]     = useState(1)
  const [cronometro,      setCronometro]      = useState(0)  // sube
  const [countdown,       setCountdown]       = useState(0)  // baja
  const [countdownTotal,  setCountdownTotal]  = useState(0)
  const [tiempoSesion,    setTiempoSesion]    = useState(0)  // total sesión
  const [tiemposPorEj,    setTiemposPorEj]    = useState([]) // acumulado
  const [seriesEj,        setSeriesEj]        = useState([]) // series del ej actual
  const [modalSalir,      setModalSalir]      = useState(false)
  const [sesionIniciada,  setSesionIniciada]  = useState(false)

  const intervaloRef    = useRef(null)
  const contdownRef     = useRef(null)
  const sesionRef       = useRef(null)

  const ejActual = ejercicios[ejercicioIdx] ?? {}
  const totalSeries = parseInt(String(ejActual.s ?? '3').split('x')[0]) || 3

  // Cronómetro de serie (sube)
  useEffect(() => {
    if (fase === 'en_serie') {
      intervaloRef.current = setInterval(() => setCronometro(c => c + 1), 1000)
    } else {
      clearInterval(intervaloRef.current)
    }
    return () => clearInterval(intervaloRef.current)
  }, [fase])

  // Countdown de descanso (baja)
  useEffect(() => {
    if (fase === 'descanso') {
      contdownRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(contdownRef.current)
            beep()
            // Avanzar a siguiente serie
            setSerieActual(s => s + 1)
            setCronometro(0)
            setFase('en_serie')
            return 0
          }
          return c - 1
        })
      }, 1000)
    } else {
      clearInterval(contdownRef.current)
    }
    return () => clearInterval(contdownRef.current)
  }, [fase])

  // Cronómetro total de sesión (sube siempre desde primera serie)
  useEffect(() => {
    if (sesionIniciada && fase !== 'preparacion' && fase !== 'rutina_completada') {
      sesionRef.current = setInterval(() => setTiempoSesion(t => t + 1), 1000)
    } else {
      clearInterval(sesionRef.current)
    }
    return () => clearInterval(sesionRef.current)
  }, [sesionIniciada, fase])

  function iniciarSerie() {
    if (!sesionIniciada) setSesionIniciada(true)
    setCronometro(0)
    setFase('en_serie')
  }

  function completarSerie() {
    const tiempoSerie = cronometro
    const nuevasSeries = [...seriesEj, { duracionSeg: tiempoSerie }]
    setSeriesEj(nuevasSeries)

    if (serieActual >= totalSeries) {
      // Última serie del ejercicio
      const tiempoTotalEj = nuevasSeries.reduce((a, s) => a + s.duracionSeg, 0)
      setTiemposPorEj(prev => [
        ...prev,
        {
          nombre: ejActual.n ?? ejActual.nombre,
          series: nuevasSeries,
          tiempoTotalSeg: tiempoTotalEj
        }
      ])
      setFase('ejercicio_completado')
    } else {
      // Más series → descanso
      const secs = parsearDescanso(ejActual.descanso)
      setCountdown(secs)
      setCountdownTotal(secs)
      setFase('descanso')
    }
  }

  function saltarDescanso() {
    clearInterval(contdownRef.current)
    setSerieActual(s => s + 1)
    setCronometro(0)
    setFase('en_serie')
  }

  function siguienteEjercicio() {
    setEjercicioIdx(i => i + 1)
    setSerieActual(1)
    setSeriesEj([])
    setCronometro(0)
    setFase('preparacion')
  }

  function verResumenFinal() {
    clearInterval(sesionRef.current)
    setFase('rutina_completada')
  }

  function guardarYSalir() {
    const tiempoTotalMinutos = Math.round(tiempoSesion / 60)
    onFinalizar({ tiempoTotalSeg: tiempoSesion, tiempoTotalMinutos, tiemposPorEjercicio: tiemposPorEj })
  }

  // ── PANTALLA: preparacion ────────────────────────────────────
  if (fase === 'preparacion') {
    const ejNum = ejercicioIdx + 1
    const ejTotal = ejercicios.length
    return (
      <div className="workout-session">
        <div className="workout-session__topbar">
          <button className="btn btn--ghost btn--sm" onClick={() => setModalSalir(true)}>← Salir</button>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{diaNombre} · {grupoNombre}</span>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{formatMM_SS(tiempoSesion)}</span>
        </div>

        <div className="workout-fase workout-fase--prep">
          <p className="workout-ej-counter">Ejercicio {ejNum} de {ejTotal}</p>
          <h2 className="workout-ej-nombre">{ejActual.n ?? ejActual.nombre}</h2>
          <p className="workout-ej-sub">{ejActual.s} · {totalSeries} series</p>
          {ejActual.descripcion && (
            <p className="workout-ej-desc">{ejActual.descripcion}</p>
          )}
          {ejActual.advertencia && (
            <div className="workout-advertencia">
              ⚠️ {ejActual.advertencia}
            </div>
          )}
          <button className="btn btn--primary btn--xl" onClick={iniciarSerie}>
            ▶ Iniciar serie 1
          </button>
        </div>

        {modalSalir && <ModalSalir onContinuar={() => setModalSalir(false)} onSalir={onSalir} />}
      </div>
    )
  }

  // ── PANTALLA: en_serie ───────────────────────────────────────
  if (fase === 'en_serie') {
    return (
      <div className="workout-session">
        <div className="workout-session__topbar">
          <button className="btn btn--ghost btn--sm" onClick={() => setModalSalir(true)}>← Salir</button>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{diaNombre}</span>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Total: {formatMM_SS(tiempoSesion)}</span>
        </div>
        <div className="workout-fase workout-fase--serie">
          <div className="workout-cronometro">{formatMM_SS(cronometro)}</div>
          <p className="workout-serie-label">Serie {serieActual} de {totalSeries} · en curso</p>
          <p className="workout-ej-nombre">{ejActual.n ?? ejActual.nombre}</p>
          <button className="btn btn--success btn--xl" onClick={completarSerie}>
            ✓ Serie completada
          </button>
        </div>
        {modalSalir && <ModalSalir onContinuar={() => setModalSalir(false)} onSalir={onSalir} />}
      </div>
    )
  }

  // ── PANTALLA: descanso ───────────────────────────────────────
  if (fase === 'descanso') {
    return (
      <div className="workout-session">
        <div className="workout-session__topbar">
          <button className="btn btn--ghost btn--sm" onClick={() => setModalSalir(true)}>← Salir</button>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{diaNombre}</span>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Total: {formatMM_SS(tiempoSesion)}</span>
        </div>
        <div className="workout-fase workout-fase--descanso">
          <p className="workout-descanso-label">Descansa · próxima serie en {countdown}s</p>
          <div className="workout-countdown-wrap">
            <CirculoContdown segundos={countdown} total={countdownTotal} />
            <div className="workout-countdown-num">{countdown}</div>
          </div>
          <p className="workout-ej-nombre">{ejActual.n ?? ejActual.nombre}</p>
          <p className="workout-serie-label">Serie {serieActual + 1} de {totalSeries}</p>
          <button className="btn btn--ghost btn--sm" onClick={saltarDescanso}>Saltar descanso</button>
        </div>
        {modalSalir && <ModalSalir onContinuar={() => setModalSalir(false)} onSalir={onSalir} />}
      </div>
    )
  }

  // ── PANTALLA: ejercicio_completado ───────────────────────────
  if (fase === 'ejercicio_completado') {
    const ejData = tiemposPorEj[tiemposPorEj.length - 1]
    const hayMas = ejercicioIdx < ejercicios.length - 1
    return (
      <div className="workout-session">
        <div className="workout-session__topbar">
          <button className="btn btn--ghost btn--sm" onClick={() => setModalSalir(true)}>← Salir</button>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{diaNombre}</span>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Total: {formatMM_SS(tiempoSesion)}</span>
        </div>
        <div className="workout-fase workout-fase--completado">
          <div className="workout-check-icon">✓</div>
          <h3 className="workout-ej-nombre">{ejData?.nombre}</h3>
          <p className="workout-ej-sub">Tiempo: {formatMM_SS(ejData?.tiempoTotalSeg ?? 0)}</p>
          {ejData?.series && (
            <table className="workout-series-tabla">
              <thead><tr><th>Serie</th><th>Tiempo</th></tr></thead>
              <tbody>
                {ejData.series.map((s, i) => (
                  <tr key={i}><td>Serie {i + 1}</td><td>{formatMM_SS(s.duracionSeg)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          {hayMas ? (
            <button className="btn btn--primary btn--xl" onClick={siguienteEjercicio}>
              → Siguiente ejercicio
            </button>
          ) : (
            <button className="btn btn--success btn--xl" onClick={verResumenFinal}>
              🏆 Ver resumen final
            </button>
          )}
        </div>
        {modalSalir && <ModalSalir onContinuar={() => setModalSalir(false)} onSalir={onSalir} />}
      </div>
    )
  }

  // ── PANTALLA: rutina_completada ──────────────────────────────
  if (fase === 'rutina_completada') {
    return (
      <div className="workout-session">
        <div className="workout-fase workout-fase--final">
          <div className="workout-flotando">
            <span>🥭</span><span>🥑</span><span>🍇</span>
          </div>
          <h2 className="workout-final-titulo">¡Rutina completada!</h2>
          <p className="workout-final-tiempo">{formatHH_MM_SS(tiempoSesion)}</p>
          <table className="workout-series-tabla">
            <thead>
              <tr><th>Ejercicio</th><th>Series</th><th>Tiempo</th></tr>
            </thead>
            <tbody>
              {tiemposPorEj.map((t, i) => (
                <tr key={i}>
                  <td>{t.nombre}</td>
                  <td>{t.series.length}</td>
                  <td>{formatMM_SS(t.tiempoTotalSeg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn--primary btn--xl" onClick={guardarYSalir}>
            Guardar y salir
          </button>
        </div>
      </div>
    )
  }

  return null
}

function ModalSalir({ onContinuar, onSalir }) {
  return (
    <div className="workout-modal-overlay">
      <div className="workout-modal">
        <h3>¿Seguro que quieres salir?</h3>
        <p>Perderás el progreso de esta sesión.</p>
        <div className="workout-modal__actions">
          <button className="btn btn--primary" onClick={onContinuar}>Continuar entrenando</button>
          <button className="btn btn--danger" onClick={onSalir}>Sí, salir</button>
        </div>
      </div>
    </div>
  )
}
