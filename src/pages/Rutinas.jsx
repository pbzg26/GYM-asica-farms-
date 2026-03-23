// ============================================================
// PÁGINA: Rutinas — con WorkoutSession, Domingo descanso, Sábado gym/casa
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGymData } from '../hooks/useGymData'
import { marcarRutinaCompletada } from '../services/dbService'
import WorkoutSession from '../components/ui/WorkoutSession'

const FRASES_DESCANSO = [
  'El descanso no es rendirse, es prepararse para ganar mañana.',
  'Los campeones también descansan. Hoy recargas energía.',
  'Tu cuerpo trabaja aunque tú descanses. Confía en el proceso.',
  'Un día de recuperación vale más que un día de lesión.',
  'Mañana vuelves más fuerte. Hoy mereces el descanso.',
  'El músculo crece en el descanso, no en el entrenamiento.',
  'Descansa bien, entrena mejor. Así funciona el progreso.'
]

const RUTINA_CASA = [
  { n: 'Sentadillas',          s: '4x20',          descanso: '60 seg' },
  { n: 'Lagartijas estándar',  s: '4x15',          descanso: '60 seg' },
  { n: 'Zancadas alternadas',  s: '3x12 c/pierna', descanso: '60 seg' },
  { n: 'Plancha abdominal',    s: '3x45seg',        descanso: '45 seg' },
  { n: 'Burpees',              s: '3x10',           descanso: '90 seg' },
  { n: 'Sentadilla con salto', s: '3x12',           descanso: '60 seg' },
  { n: 'Lagartija diamante',   s: '3x12',           descanso: '60 seg' },
  { n: 'Zancadas con salto',   s: '3x10 c/pierna',  descanso: '60 seg' }
]

function getDiaActual() {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  return dias[new Date().getDay()]
}

export default function Rutinas() {
  const { usuario, perfil } = useAuth()
  const { rutinas: RUTINAS } = useGymData()
  const navigate = useNavigate()

  const grupoInicial  = perfil?.grupo ?? 'A'
  const [grupoActivo, setGrupoActivo] = useState(grupoInicial)
  const [diaAbierto,  setDiaAbierto]  = useState(getDiaActual())
  const [marcando,    setMarcando]    = useState(false)
  const [completados, setCompletados] = useState({})
  const [modoSabado,  setModoSabado]  = useState(null) // null | 'gym' | 'casa'
  const [sesionActiva,setSesionActiva]= useState(null)

  const rutina = RUTINAS[grupoActivo]
  const diaHoy = getDiaActual()
  const fraseDia = FRASES_DESCANSO[Math.floor(Math.random() * FRASES_DESCANSO.length)]

  async function marcar(diaKey, ejercicios, tiemposExtra = {}) {
    if (!usuario) return
    setMarcando(true)
    try {
      await marcarRutinaCompletada(usuario.uid, {
        grupo: grupoActivo, dia: diaKey,
        ejercicios: ejercicios.map(e => e.n ?? e),
        ...tiemposExtra
      })
      setCompletados(prev => ({ ...prev, [diaKey]: true }))
    } catch (err) { console.error(err) }
    setMarcando(false)
  }

  function iniciarSesion(diaKey, ejercicios) {
    setSesionActiva({ diaKey, ejercicios, grupoNombre: `Grupo ${grupoActivo}` })
  }

  async function handleFinalizar(tiempos) {
    const { diaKey, ejercicios } = sesionActiva
    setSesionActiva(null)
    await marcar(diaKey, ejercicios, {
      tiempoTotalMinutos:  tiempos.tiempoTotalMinutos,
      tiemposPorEjercicio: tiempos.tiemposPorEjercicio,
      seriesCompletadas:   tiempos.tiemposPorEjercicio?.reduce((a, e) => a + e.series.length, 0) ?? 0
    })
  }

  // Sesión activa → pantalla completa
  if (sesionActiva) {
    return (
      <WorkoutSession
        ejercicios={sesionActiva.ejercicios}
        grupoNombre={sesionActiva.grupoNombre}
        diaNombre={sesionActiva.diaKey}
        onFinalizar={handleFinalizar}
        onSalir={() => setSesionActiva(null)}
      />
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Rutinas Semanales</h2>
        <p className="page__sub">5 grupos diferentes · 7 días · Sin saturar el gym</p>
      </div>

      <div className="info-box">
        <strong>¿Cómo funciona?</strong>
        <p>Cada trabajador tiene un grupo (A–E). Así cuando 5 personas estén en el gym al mismo tiempo, nunca hacen los mismos ejercicios y no se satura ninguna máquina.</p>
        {perfil && <p className="info-box__group">Tu grupo: <strong>Grupo {perfil.grupo}</strong></p>}
      </div>

      {/* Selector de grupo */}
      <div className="group-selector">
        {Object.keys(RUTINAS).map(g => (
          <button
            key={g}
            className={`group-btn ${grupoActivo === g ? 'active' : ''} ${perfil?.grupo === g ? 'is-mine' : ''}`}
            onClick={() => setGrupoActivo(g)}
          >
            Grupo {g}
            {perfil?.grupo === g && <span className="group-btn__mine">Mi grupo</span>}
          </button>
        ))}
      </div>

      {/* Botón rutina personalizada */}
      {usuario && (
        <div style={{ marginBottom: 12 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/rutina-personalizada')}>
            ⭐ Mi rutina personalizada
          </button>
        </div>
      )}

      <h3 className="rutina-nombre">{rutina?.nombre}</h3>

      {/* Acordeón de días */}
      <div className="days-list">
        {rutina?.dias?.map((diaInfo) => {
          const esHoy       = diaInfo.dia === diaHoy && grupoActivo === grupoInicial
          const estaAbierto = diaAbierto === diaInfo.dia
          const yaHecho     = completados[diaInfo.dia]
          const esDomingo   = diaInfo.dia === 'Domingo'
          const esSabado    = diaInfo.dia === 'Sábado'

          return (
            <div
              key={diaInfo.dia}
              className={`day-card ${esHoy ? 'day-card--today' : ''} ${yaHecho ? 'day-card--done' : ''}`}
            >
              <button
                className="day-card__header"
                onClick={() => setDiaAbierto(estaAbierto ? null : diaInfo.dia)}
              >
                <div>
                  <span className="day-card__label">{diaInfo.dia} {esHoy && '· HOY'}</span>
                  <h4 className="day-card__foco">{diaInfo.foco}</h4>
                </div>
                <div className="day-card__right">
                  {yaHecho && <span className="day-card__check">✓</span>}
                  <span className="day-card__arrow">{estaAbierto ? '▼' : '›'}</span>
                </div>
              </button>

              {estaAbierto && (
                <div className="day-card__body">

                  {/* ── Domingo descanso ── */}
                  {esDomingo ? (
                    <div className="descanso-card">
                      <div className="descanso-card__emoji">😴</div>
                      <h3 className="descanso-card__titulo">Día de descanso</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        El descanso es parte del entrenamiento. Tus músculos se reparan y crecen mientras descansas. ¡Nos vemos mañana!
                      </p>
                      <p className="descanso-card__frase">"{fraseDia}"</p>
                    </div>

                  ) : esSabado && esHoy && modoSabado === null ? (
                    /* ── Sábado: elegir gym o casa ── */
                    <div className="sabado-selector">
                      <p className="sabado-selector__titulo">¿Dónde entrenas hoy?</p>
                      <div className="sabado-cards">
                        <div className="sabado-card" onClick={() => setModoSabado('gym')}>
                          <span className="sabado-card__emoji">🏋️</span>
                          <span>Estoy en el gym</span>
                        </div>
                        <div className="sabado-card" onClick={() => setModoSabado('casa')}>
                          <span className="sabado-card__emoji">🏠</span>
                          <span>Estoy en casa</span>
                        </div>
                      </div>
                    </div>

                  ) : esSabado && esHoy && modoSabado === 'casa' ? (
                    /* ── Sábado en casa ── */
                    <>
                      <button className="btn btn--ghost btn--sm" onClick={() => setModoSabado(null)} style={{ marginBottom: 12 }}>
                        ← Cambiar opción
                      </button>
                      {RUTINA_CASA.map((ej, i) => (
                        <div key={i} className="ej-row">
                          <span className="ej-row__dot" />
                          <span className="ej-row__name">{ej.n}</span>
                          <span className="ej-row__sets">{ej.s}</span>
                        </div>
                      ))}
                      {usuario && !yaHecho && (
                        <button className="btn btn--primary btn--full" style={{ marginTop: 12 }}
                          onClick={() => iniciarSesion(diaInfo.dia, RUTINA_CASA)}>
                          ▶ Comenzar rutina
                        </button>
                      )}
                    </>

                  ) : (
                    /* ── Día normal (o sábado gym) ── */
                    <>
                      {esSabado && esHoy && modoSabado === 'gym' && (
                        <button className="btn btn--ghost btn--sm" onClick={() => setModoSabado(null)} style={{ marginBottom: 12 }}>
                          ← Cambiar opción
                        </button>
                      )}
                      {diaInfo.ejercicios.map((ej, i) => (
                        <div key={i} className="ej-row">
                          <span className="ej-row__dot" />
                          <span className="ej-row__name">{ej.n}</span>
                          <span className="ej-row__sets">{ej.s}</span>
                        </div>
                      ))}

                      {usuario && !yaHecho && diaInfo.ejercicios?.length > 0 && (
                        <button
                          className="btn btn--primary btn--full"
                          style={{ marginTop: 12 }}
                          onClick={() => iniciarSesion(diaInfo.dia, diaInfo.ejercicios)}
                          disabled={marcando}
                        >
                          ▶ Comenzar rutina
                        </button>
                      )}

                      {yaHecho && (
                        <p style={{ color: 'var(--green-accent)', fontSize: 14, marginTop: 10 }}>
                          ✓ Completado hoy
                        </p>
                      )}

                      {!usuario && (
                        <p className="day-card__login-hint">
                          <a href="/login">Inicia sesión</a> para guardar tu progreso
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
