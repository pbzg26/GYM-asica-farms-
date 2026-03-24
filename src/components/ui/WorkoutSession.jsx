import { useState, useEffect, useRef } from 'react'

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

// Estima calorías quemadas (METs aproximados por tipo de ejercicio)
function estimarCalorias(tiemposPorEj, pesoUsuario = 70) {
  const MET_PROMEDIO = 5 // MET promedio gym moderado
  let totalSeg = 0
  tiemposPorEj.forEach(ej => {
    ej.series.forEach(s => { totalSeg += s.duracionSeg ?? 0 })
  })
  const horas = totalSeg / 3600
  return Math.round(MET_PROMEDIO * pesoUsuario * horas)
}

function CirculoCountdown({ segundos, total }) {
  const r = 70
  const circ = 2 * Math.PI * r
  const progreso = total > 0 ? (segundos / total) : 0
  const offset = circ * (1 - progreso)
  return (
    <svg width="180" height="180" style={{transform:'rotate(-90deg)'}}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--bd2)" strokeWidth="10"/>
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--g500)" strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:'stroke-dashoffset 1s linear'}}/>
    </svg>
  )
}

export default function WorkoutSession({ ejercicios, grupoNombre, diaNombre, onFinalizar, onSalir, pesoUsuario = 70 }) {
  const [fase,           setFase]           = useState('preparacion')
  const [ejercicioIdx,   setEjercicioIdx]   = useState(0)
  const [serieActual,    setSerieActual]     = useState(1)
  const [cronometro,     setCronometro]      = useState(0)
  const [countdown,      setCountdown]       = useState(0)
  const [countdownTotal, setCountdownTotal]  = useState(0)
  const [tiempoSesion,   setTiempoSesion]   = useState(0)
  const [tiemposPorEj,   setTiemposPorEj]   = useState([])
  const [seriesEj,       setSeriesEj]        = useState([])
  const [modalSalir,     setModalSalir]      = useState(false)
  const [sesionIniciada, setSesionIniciada]  = useState(false)
  // NUEVO: peso ingresado por serie
  const [pesoSerie,      setPesoSerie]       = useState('')

  const intervaloRef  = useRef(null)
  const countdownRef  = useRef(null)
  const sesionRef     = useRef(null)

  const ejActual    = ejercicios[ejercicioIdx] ?? {}
  const totalSeries = parseInt(String(ejActual.s ?? '3').split('x')[0]) || 3

  useEffect(() => {
    if (fase === 'en_serie') {
      intervaloRef.current = setInterval(() => setCronometro(c => c + 1), 1000)
    } else {
      clearInterval(intervaloRef.current)
    }
    return () => clearInterval(intervaloRef.current)
  }, [fase])

  useEffect(() => {
    if (fase === 'descanso') {
      countdownRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownRef.current)
            beep()
            setSerieActual(s => s + 1)
            setCronometro(0)
            setPesoSerie('')
            setFase('en_serie')
            return 0
          }
          return c - 1
        })
      }, 1000)
    } else {
      clearInterval(countdownRef.current)
    }
    return () => clearInterval(countdownRef.current)
  }, [fase])

  useEffect(() => {
    if (sesionIniciada) {
      sesionRef.current = setInterval(() => setTiempoSesion(t => t + 1), 1000)
    }
    return () => clearInterval(sesionRef.current)
  }, [sesionIniciada])

  const progreso = ((ejercicioIdx / ejercicios.length) + (serieActual - 1) / (ejercicios.length * totalSeries)) * 100

  function iniciarSerie() {
    if (!sesionIniciada) setSesionIniciada(true)
    setCronometro(0)
    setPesoSerie('')
    setFase('en_serie')
  }

  function completarSerie() {
    const duracion = cronometro
    // Guardar la serie con peso
    const nuevasSeries = [...seriesEj, { serieNum: serieActual, duracionSeg: duracion, pesoKg: pesoSerie ? parseFloat(pesoSerie) : null }]
    setSeriesEj(nuevasSeries)
    clearInterval(intervaloRef.current)

    if (serieActual >= totalSeries) {
      // Todas las series del ejercicio completadas
      const totalEj = nuevasSeries.reduce((a, s) => a + s.duracionSeg, 0)
      const nuevosPorEj = [...tiemposPorEj, { nombre: ejActual.n ?? ejActual.nombre ?? `Ejercicio ${ejercicioIdx + 1}`, series: nuevasSeries, tiempoTotalSeg: totalEj }]
      setTiemposPorEj(nuevosPorEj)
      setSeriesEj([])

      if (ejercicioIdx + 1 >= ejercicios.length) {
        setFase('rutina_completada')
      } else {
        setFase('ejercicio_completado')
      }
    } else {
      const descanso = parsearDescanso(ejActual.descanso)
      setCountdown(descanso)
      setCountdownTotal(descanso)
      setFase('descanso')
    }
  }

  function siguienteEjercicio() {
    setEjercicioIdx(i => i + 1)
    setSerieActual(1)
    setCronometro(0)
    setPesoSerie('')
    setFase('preparacion')
  }

  function guardarYSalir() {
    const calorias = estimarCalorias(tiemposPorEj, pesoUsuario)
    onFinalizar({
      tiempoTotalSeg:      tiempoSesion,
      tiempoTotalMinutos:  Math.round(tiempoSesion / 60),
      tiemposPorEjercicio: tiemposPorEj,
      caloriasEstimadas:   calorias
    })
  }

  const calorias = estimarCalorias(tiemposPorEj, pesoUsuario)

  // ── MODAL SALIR ──────────────────────────────────────────────
  if (modalSalir) {
    return (
      <div className="workout-overlay" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
        <div style={{background:'var(--surface)',borderRadius:'var(--r20)',padding:'32px 28px',maxWidth:340,width:'100%',textAlign:'center',boxShadow:'var(--sh4)'}}>
          <div style={{fontSize:48,marginBottom:14}}>⚠️</div>
          <h3 style={{fontSize:20,fontWeight:800,marginBottom:8}}>¿Salir de la rutina?</h3>
          <p style={{color:'var(--t500)',fontSize:14,marginBottom:24,lineHeight:1.6}}>Perderás el progreso de esta sesión si sales ahora.</p>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn--ghost btn--full" onClick={() => setModalSalir(false)}>Continuar</button>
            <button className="btn btn--danger btn--full" onClick={onSalir}>Sí, salir</button>
          </div>
        </div>
      </div>
    )
  }

  // ── RUTINA COMPLETADA ────────────────────────────────────────
  if (fase === 'rutina_completada') {
    return (
      <div className="workout-overlay">
        <div className="workout-body animate-fade">
          <div className="workout-summary">
            <div className="workout-summary__emoji">🏆</div>
            <h2>¡Rutina completada!</h2>
            <p style={{color:'var(--t500)',marginBottom:16}}>{grupoNombre} · {diaNombre}</p>
            <div className="workout-summary__time">{formatHH_MM_SS(tiempoSesion)}</div>
            <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:20}}>
              <span className="tag tag--primary">✓ {tiemposPorEj.length} ejercicios</span>
              <span className="calorias-badge">🔥 ~{calorias} kcal estimadas</span>
            </div>

            <table className="workout-summary-table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Series</th>
                  <th>Tiempo</th>
                  <th>Peso máx</th>
                </tr>
              </thead>
              <tbody>
                {tiemposPorEj.map((ej, i) => {
                  const pesoMax = Math.max(...ej.series.map(s => s.pesoKg ?? 0))
                  return (
                    <tr key={i}>
                      <td>{ej.nombre}</td>
                      <td>{ej.series.length}</td>
                      <td>{formatMM_SS(ej.tiempoTotalSeg)}</td>
                      <td style={{color:'var(--g600)',fontWeight:700}}>{pesoMax > 0 ? `${pesoMax} kg` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <button className="btn btn--primary btn--full btn--lg" onClick={guardarYSalir}>
              Guardar y salir
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── EJERCICIO COMPLETADO ─────────────────────────────────────
  if (fase === 'ejercicio_completado') {
    const ultimo = tiemposPorEj[tiemposPorEj.length - 1]
    return (
      <div className="workout-overlay">
        <div className="workout-body animate-fade">
          <div className="workout-phase" style={{paddingTop:40}}>
            <div style={{fontSize:64,marginBottom:14}}>✅</div>
            <p className="workout-phase__label">Ejercicio completado</p>
            <h2 className="workout-phase__name">{ultimo?.nombre}</h2>
            <div className="workout-timer workout-timer--complete">{formatMM_SS(ultimo?.tiempoTotalSeg ?? 0)}</div>

            <div className="workout-series-log">
              <h4>Detalle de series</h4>
              {ultimo?.series.map((s, i) => (
                <div key={i} className="workout-series-row">
                  <span>Serie {s.serieNum}</span>
                  <span>{s.pesoKg ? `${s.pesoKg} kg` : 'Sin peso'}</span>
                  <span>{formatMM_SS(s.duracionSeg)}</span>
                </div>
              ))}
            </div>

            <button className="btn btn--primary btn--full btn--lg" onClick={siguienteEjercicio}>
              → Siguiente: {ejercicios[ejercicioIdx + 1]?.n ?? ejercicios[ejercicioIdx + 1]?.nombre}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="workout-overlay">
      {/* Header */}
      <div className="workout-header">
        <button className="btn btn--ghost btn--sm" onClick={() => setModalSalir(true)}>← Salir</button>
        <h2>{diaNombre} · {grupoNombre}</h2>
        <span style={{fontSize:13,color:'var(--t500)',flexShrink:0}}>{ejercicioIdx + 1}/{ejercicios.length}</span>
      </div>

      {/* Barra de progreso */}
      <div className="workout-progress">
        <div className="workout-progress-fill" style={{width:`${progreso}%`}} />
      </div>

      <div className="workout-body">
        {/* ── PREPARACIÓN ── */}
        {fase === 'preparacion' && (
          <div className="workout-phase animate-fade">
            <p className="workout-phase__label">Ejercicio {ejercicioIdx + 1} de {ejercicios.length}</p>
            <h2 className="workout-phase__name">{ejActual.n ?? ejActual.nombre}</h2>
            <p className="workout-phase__series">{ejActual.s} · {totalSeries} series</p>

            {ejActual.descripcion && (
              <div className="workout-desc">{ejActual.descripcion}</div>
            )}
            {ejActual.advertencia && (
              <div className="workout-warning">⚠️ {ejActual.advertencia}</div>
            )}

            <button className="btn btn--primary btn--full btn--lg" onClick={iniciarSerie}>
              ▶ Iniciar serie 1
            </button>
          </div>
        )}

        {/* ── EN SERIE ── */}
        {fase === 'en_serie' && (
          <div className="workout-phase animate-fade">
            <p className="workout-phase__label">Serie {serieActual} de {totalSeries} · En curso</p>
            <h2 className="workout-phase__name">{ejActual.n ?? ejActual.nombre}</h2>
            <div className="workout-timer">{formatMM_SS(cronometro)}</div>

            {/* INPUT PESO */}
            <div className="serie-peso-input">
              <label>¿Cuánto peso usas?</label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                value={pesoSerie}
                onChange={e => setPesoSerie(e.target.value)}
              />
              <span>kg</span>
            </div>

            <button className="btn btn--primary btn--full btn--lg" onClick={completarSerie}>
              ✓ Serie {serieActual} completada
            </button>
          </div>
        )}

        {/* ── DESCANSO ── */}
        {fase === 'descanso' && (
          <div className="workout-phase animate-fade">
            <p className="workout-phase__label">Descansando · próxima serie en</p>
            <h2 className="workout-phase__name" style={{marginBottom:16}}>{ejActual.n ?? ejActual.nombre}</h2>
            <p style={{color:'var(--t500)',marginBottom:16,fontSize:14}}>Serie {serieActual + 1} de {totalSeries}</p>

            <div className="workout-countdown-wrap">
              <CirculoCountdown segundos={countdown} total={countdownTotal} />
              <div className="workout-countdown-num">{countdown}</div>
            </div>

            <button
              className="btn btn--ghost btn--sm"
              onClick={() => {
                clearInterval(countdownRef.current)
                setSerieActual(s => s + 1)
                setCronometro(0)
                setPesoSerie('')
                setFase('en_serie')
              }}
              style={{marginTop:16}}
            >
              Saltar descanso →
            </button>

            {/* Series anteriores */}
            {seriesEj.length > 0 && (
              <div className="workout-series-log" style={{marginTop:20}}>
                <h4>Series completadas</h4>
                {seriesEj.map((s, i) => (
                  <div key={i} className="workout-series-row">
                    <span>Serie {s.serieNum}</span>
                    <span>{s.pesoKg ? `${s.pesoKg} kg` : 'Sin peso'}</span>
                    <span>{formatMM_SS(s.duracionSeg)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
