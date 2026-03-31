// ============================================================
// PÁGINA: Rutinas — con WorkoutSession, Domingo descanso, Sábado gym/casa, Zona Fit
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGymData } from '../hooks/useGymData'
import { marcarRutinaCompletada, guardarDiaRutina } from '../services/dbService'
import { RUTINAS_FEMENINAS } from '../data/gymData'
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

const TIPOS_FEM = [
  { key: 'maquinas',   label: 'Máquinas' },
  { key: 'hibrida',    label: 'Híbrida' },
  { key: 'calistenia', label: 'Calistenia' }
]

function getDiaActual() {
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  return dias[new Date().getDay()]
}

// ── Fila de ejercicio editable ───────────────────────────────
function EjRow({ ej, index, modoEdicion, onEdit }) {
  const [editando, setEditando] = useState(false)
  const [localN,   setLocalN]   = useState(ej.n)
  const [localS,   setLocalS]   = useState(ej.s)

  function confirmar() {
    onEdit(index, { n: localN, s: localS })
    setEditando(false)
  }

  function cancelar() {
    setLocalN(ej.n)
    setLocalS(ej.s)
    setEditando(false)
  }

  if (modoEdicion && editando) {
    return (
      <div className="ej-row ej-row--editing">
        <div className="ej-row__edit-inputs">
          <input value={localN} onChange={e => setLocalN(e.target.value)} placeholder="Ejercicio" autoFocus />
          <input value={localS} onChange={e => setLocalS(e.target.value)} placeholder="Series" />
        </div>
        <button className="ej-row__edit-btn" onClick={confirmar} title="Confirmar">✓</button>
        <button className="ej-row__edit-btn" onClick={cancelar}  title="Cancelar">✕</button>
      </div>
    )
  }

  return (
    <div className="ej-row">
      <span className="ej-row__dot" />
      <span className="ej-row__name">{ej.n}</span>
      <span className="ej-row__sets">{ej.s}</span>
      {modoEdicion && (
        <button className="ej-row__edit-btn" onClick={() => setEditando(true)} title="Editar">✏️</button>
      )}
    </div>
  )
}

// ── Acordeón de días compartido ────────────────────────────────
function ListaDias({
  dias, diaHoy, grupoLabel, usuario, marcando, completados,
  onIniciar, onMarcar,
  modoEdicion, esAdmin, grupoActivo
}) {
  const [diaAbierto,  setDiaAbierto]  = useState(diaHoy)
  const [modoSabado,  setModoSabado]  = useState(null)
  const [localDias,   setLocalDias]   = useState(() => dias.map(d => ({ ...d, ejercicios: [...(d.ejercicios || [])] })))
  const [guardando,   setGuardando]   = useState(null) // día que se está guardando
  const [guardadoOk,  setGuardadoOk]  = useState(null)
  const fraseDia = FRASES_DESCANSO[Math.floor(Math.random() * FRASES_DESCANSO.length)]

  function editEjercicio(diaKey, ejIndex, datos) {
    setLocalDias(prev => prev.map(d => {
      if (d.dia !== diaKey) return d
      const nuevosEjs = d.ejercicios.map((e, i) => i === ejIndex ? { ...e, ...datos } : e)
      return { ...d, ejercicios: nuevosEjs }
    }))
  }

  async function guardarDia(diaInfo) {
    setGuardando(diaInfo.dia)
    try {
      await guardarDiaRutina(grupoActivo, diaInfo.dia, { ...diaInfo })
      setGuardadoOk(diaInfo.dia)
      setTimeout(() => setGuardadoOk(null), 3000)
    } catch (e) { console.error(e) }
    setGuardando(null)
  }

  return (
    <div className="days-list">
      {localDias.map((diaInfo) => {
        const esHoy       = diaInfo.dia === diaHoy
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
                        onClick={() => onIniciar(diaInfo.dia, RUTINA_CASA, grupoLabel)}>
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
                      <EjRow
                        key={i}
                        ej={ej}
                        index={i}
                        modoEdicion={modoEdicion}
                        onEdit={(idx, datos) => editEjercicio(diaInfo.dia, idx, datos)}
                      />
                    ))}

                    {/* Botón guardar día (solo editor) */}
                    {modoEdicion && esAdmin && diaInfo.ejercicios?.length > 0 && (
                      <div className="ej-save-group">
                        {guardadoOk === diaInfo.dia && (
                          <div className="toast-ok" style={{marginBottom:8}}>✓ Guardado correctamente</div>
                        )}
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => guardarDia(diaInfo)}
                          disabled={guardando === diaInfo.dia}
                        >
                          {guardando === diaInfo.dia ? '⏳ Guardando...' : '💾 Guardar ' + diaInfo.dia}
                        </button>
                      </div>
                    )}

                    {!modoEdicion && usuario && !yaHecho && diaInfo.ejercicios?.length > 0 && (
                      <button
                        className="btn btn--primary btn--full"
                        style={{ marginTop: 12 }}
                        onClick={() => onIniciar(diaInfo.dia, diaInfo.ejercicios, grupoLabel)}
                        disabled={marcando}
                      >
                        ▶ Comenzar rutina
                      </button>
                    )}

                    {!modoEdicion && yaHecho && (
                      <p style={{ color: 'var(--green-accent)', fontSize: 14, marginTop: 10 }}>
                        ✓ Completado hoy
                      </p>
                    )}

                    {!modoEdicion && !usuario && (
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
  )
}

// ── Página principal ──────────────────────────────────────────
export default function Rutinas() {
  const { usuario, perfil, esAdmin } = useAuth()
  const { rutinas: RUTINAS } = useGymData()
  const navigate = useNavigate()

  const grupoInicial  = perfil?.grupo ?? 'A'
  const [grupoActivo, setGrupoActivo] = useState(grupoInicial)
  const [marcando,    setMarcando]    = useState(false)
  const [completados, setCompletados] = useState({})
  const [sesionActiva,setSesionActiva]= useState(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  // Zona Fit
  const [modoZonaFit,  setModoZonaFit]  = useState(false)
  const [tipoFem,      setTipoFem]      = useState('maquinas')

  const diaHoy = getDiaActual()

  async function marcar(diaKey, ejercicios, grupoLabel, tiemposExtra = {}) {
    if (!usuario) return
    setMarcando(true)
    try {
      await marcarRutinaCompletada(usuario.uid, {
        grupo: grupoLabel, dia: diaKey,
        ejercicios: ejercicios.map(e => e.n ?? e),
        ...tiemposExtra
      })
      setCompletados(prev => ({ ...prev, [diaKey]: true }))
    } catch (err) { console.error(err) }
    setMarcando(false)
  }

  function iniciarSesion(diaKey, ejercicios, grupoLabel) {
    setSesionActiva({ diaKey, ejercicios, grupoNombre: grupoLabel })
  }

  async function handleFinalizar(tiempos) {
    const { diaKey, ejercicios, grupoNombre } = sesionActiva
    setSesionActiva(null)
    await marcar(diaKey, ejercicios, grupoNombre, {
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

  const rutinaFem = RUTINAS_FEMENINAS[tipoFem]

  return (
    <div className="page">
      <div className="page__header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h2 className="page__title">Rutinas Semanales</h2>
          <p className="page__sub">5 grupos diferentes · 7 días · Sin saturar el gym</p>
        </div>
        {esAdmin && (
          <button
            className={`btn btn--sm ${modoEdicion ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setModoEdicion(m => !m)}
          >
            {modoEdicion ? '✓ Salir del editor' : '✏️ Modo editor'}
          </button>
        )}
      </div>

      {modoEdicion && (
        <div className="editor-banner">
          ✏️ Modo editor activo — abre un día, edita ejercicios con ✏️ y guarda cada día con 💾
        </div>
      )}

      {/* Toggle Zona Fit */}
      <div className="zona-fit-toggle">
        <button
          className={`zona-fit-btn ${!modoZonaFit ? 'active' : ''}`}
          onClick={() => setModoZonaFit(false)}
        >
          💪 General (A–E)
        </button>
        <button
          className={`zona-fit-btn ${modoZonaFit ? 'active' : ''}`}
          onClick={() => setModoZonaFit(true)}
        >
          🌸 Zona Fit
        </button>
      </div>

      {/* ── MODO ZONA FIT ── */}
      {modoZonaFit ? (
        <>
          <div className="info-box info-box--fem">
            <strong>🌸 Zona Fit</strong>
            <p>Rutinas diseñadas específicamente para mujeres. Enfocadas en glúteos, piernas y tonificación total. Elige el tipo de rutina según el equipo que tienes disponible.</p>
          </div>

          {/* Selector tipo de rutina */}
          <div className="group-selector">
            {TIPOS_FEM.map(t => (
              <button
                key={t.key}
                className={`group-btn ${tipoFem === t.key ? 'active' : ''}`}
                onClick={() => setTipoFem(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="rutina-fem-header">
            <h3 className="rutina-nombre">{rutinaFem?.nombre}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{rutinaFem?.descripcion}</p>
          </div>

          <ListaDias
            dias={rutinaFem?.dias ?? []}
            diaHoy={diaHoy}
            grupoLabel={`zonafit-${tipoFem}`}
            usuario={usuario}
            marcando={marcando}
            completados={completados}
            onIniciar={iniciarSesion}
            onMarcar={marcar}
            modoEdicion={modoEdicion}
            esAdmin={esAdmin}
            grupoActivo={`zonafit-${tipoFem}`}
          />
        </>

      ) : (
        /* ── MODO GENERAL ── */
        <>
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
          {usuario && !modoEdicion && (
            <div style={{ marginBottom: 12 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => navigate('/rutina-personalizada')}>
                ⭐ Mi rutina personalizada
              </button>
            </div>
          )}

          <h3 className="rutina-nombre">{RUTINAS[grupoActivo]?.nombre}</h3>

          <ListaDias
            key={grupoActivo}
            dias={RUTINAS[grupoActivo]?.dias ?? []}
            diaHoy={diaHoy}
            grupoLabel={`Grupo ${grupoActivo}`}
            usuario={usuario}
            marcando={marcando}
            completados={completados}
            onIniciar={iniciarSesion}
            onMarcar={marcar}
            modoEdicion={modoEdicion}
            esAdmin={esAdmin}
            grupoActivo={grupoActivo}
          />
        </>
      )}
    </div>
  )
}
