// ============================================================
// PÁGINA: RutinaPersonalizada — wizard de 3 pasos + estados
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGymData } from '../hooks/useGymData'
import {
  enviarSolicitudRutina, obtenerMiSolicitud
} from '../services/dbService'
import WorkoutSession from '../components/ui/WorkoutSession'

const DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

export default function RutinaPersonalizada() {
  const { usuario, perfil } = useAuth()
  const { maquinas } = useGymData()
  const navigate = useNavigate()

  const [solicitud,  setSolicitud]  = useState(null)  // null = no cargado
  const [cargando,   setCargando]   = useState(true)
  const [creando,    setCreando]    = useState(false)  // mostrar formulario
  const [paso,       setPaso]       = useState(1)
  const [enviando,   setEnviando]   = useState(false)
  const [error,      setError]      = useState('')
  const [sesion,     setSesion]     = useState(null)
  const [detalle,    setDetalle]    = useState(false)

  // Datos del wizard
  const [diasSeleccionados, setDiasSeleccionados] = useState([])
  const [ejerciciosPorDia, setEjerciciosPorDia]   = useState({}) // { Lunes: [{ nombre, series, reps }] }
  const [justificacion,    setJustificacion]       = useState('')
  const [condicion,        setCondicion]           = useState('')
  const [aceptado,         setAceptado]            = useState(false)
  const [diaActivo,        setDiaActivo]           = useState(null)
  const [busqueda,         setBusqueda]            = useState('')
  const [ejercicioLibre,   setEjercicioLibre]      = useState(null) // null | { nombre, series, reps, desc }

  // Todos los ejercicios del catálogo
  const catalogo = maquinas.flatMap(m =>
    (m.ejercicios ?? []).map(e => ({ ...e, maquina: m.nombre }))
  )
  const catalogoFiltrado = busqueda.trim()
    ? catalogo.filter(e => e.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
    : []

  useEffect(() => {
    if (!usuario) return
    cargarSolicitud()
  }, [usuario])

  async function cargarSolicitud() {
    setCargando(true)
    try {
      const s = await obtenerMiSolicitud(usuario.uid)
      setSolicitud(s)
    } catch(e) { setError('Error: ' + e.message) }
    setCargando(false)
  }

  // Ejercicios de un día
  function getEjs(dia) { return ejerciciosPorDia[dia] ?? [] }
  function setEjs(dia, lista) { setEjerciciosPorDia(p => ({ ...p, [dia]: lista })) }

  function agregarDelCatalogo(ej) {
    if (!diaActivo) return
    const lista = getEjs(diaActivo)
    if (lista.find(e => e.nombre === ej.nombre)) return
    setEjs(diaActivo, [...lista, { nombre: ej.nombre, series: ej.series ?? '3', reps: ej.repeticiones ?? '10', desc: ej.descripcion ?? '' }])
  }

  function agregarLibre() {
    if (!diaActivo || !ejercicioLibre?.nombre) return
    setEjs(diaActivo, [...getEjs(diaActivo), { ...ejercicioLibre }])
    setEjercicioLibre(null)
  }

  function eliminarEj(dia, idx) {
    setEjs(dia, getEjs(dia).filter((_, i) => i !== idx))
  }

  function moverEj(dia, idx, dir) {
    const lista = [...getEjs(dia)]
    const nuevo = idx + dir
    if (nuevo < 0 || nuevo >= lista.length) return
    ;[lista[idx], lista[nuevo]] = [lista[nuevo], lista[idx]]
    setEjs(dia, lista)
  }

  function actualizarCampo(dia, idx, campo, valor) {
    const lista = [...getEjs(dia)]
    lista[idx] = { ...lista[idx], [campo]: valor }
    setEjs(dia, lista)
  }

  function toggleDia(dia) {
    setDiasSeleccionados(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  function validarPaso1() {
    return diasSeleccionados.length > 0 &&
      diasSeleccionados.every(d => getEjs(d).length > 0)
  }

  function validarPaso2() {
    return justificacion.trim().length >= 30 && aceptado
  }

  async function enviar() {
    if (!usuario || !perfil) return
    setEnviando(true)
    try {
      // Construir rutinaPropuesta
      const rutinaPropuesta = diasSeleccionados.map(dia => ({
        dia, ejercicios: getEjs(dia)
      }))
      await enviarSolicitudRutina(usuario.uid, {
        nombreUsuario: perfil.nombre,
        grupo: perfil.grupo,
        rutinaPropuesta,
        justificacion,
        condicionFisica: condicion
      })
      await cargarSolicitud()
      setCreando(false)
    } catch(e) { setError('Error al enviar: ' + e.message) }
    setEnviando(false)
  }

  // ── Sin sesión ──
  if (!usuario) {
    return (
      <div className="page page--center">
        <p>Debes <a href="/login">iniciar sesión</a> para acceder.</p>
      </div>
    )
  }

  if (sesion) {
    return (
      <WorkoutSession
        ejercicios={sesion.ejercicios.map(e => ({ n: e.nombre ?? e.n, s: `${e.series}x${e.reps}` }))}
        grupoNombre="Personalizada"
        diaNombre={sesion.dia}
        onFinalizar={() => setSesion(null)}
        onSalir={() => setSesion(null)}
      />
    )
  }

  if (cargando) return <div className="page"><p className="loading-text">Cargando...</p></div>

  // ── Vista 1: Sin solicitud y no creando ──────────────────────
  if (!solicitud && !creando) {
    return (
      <div className="page">
        <div className="page__header">
          <h2 className="page__title">Rutina personalizada</h2>
          <p className="page__sub">Diseña tu propia rutina · el admin la revisará</p>
        </div>
        <div className="profile-section" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
          <h3 style={{ marginBottom: 12 }}>Crea tu rutina personalizada</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            Elige tus días, selecciona ejercicios del catálogo o agrega los tuyos, y el administrador la revisará antes de activarla.
          </p>
          {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}
          <button className="btn btn--primary" onClick={() => setCreando(true)}>
            Crear mi rutina personalizada
          </button>
        </div>
      </div>
    )
  }

  // ── Vista 2: Formulario wizard ───────────────────────────────
  if (creando) {
    return (
      <div className="page">
        <div className="page__header">
          <button className="btn btn--ghost btn--sm" onClick={() => setCreando(false)} style={{ marginBottom: 8 }}>← Volver</button>
          <h2 className="page__title">Nueva rutina personalizada</h2>
        </div>

        {/* Pasos */}
        <div className="wizard-steps">
          {['Días y ejercicios','Justificación','Confirmar'].map((label, i) => (
            <div key={i} className={`wizard-step ${paso === i+1 ? 'active' : paso > i+1 ? 'done' : ''}`}>
              {i+1}. {label}
            </div>
          ))}
        </div>

        {/* PASO 1 */}
        {paso === 1 && (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
              Selecciona los días que entrenas y añade ejercicios a cada uno.
            </p>
            <div className="dias-pills">
              {DIAS_SEMANA.map(dia => (
                <button
                  key={dia}
                  className={`dia-pill ${diasSeleccionados.includes(dia) ? 'active' : ''}`}
                  onClick={() => toggleDia(dia)}
                >
                  {dia}
                </button>
              ))}
              <button className="dia-pill" disabled title="Día de descanso obligatorio" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                Domingo
              </button>
            </div>

            {/* Ejercicios por día */}
            {diasSeleccionados.map(dia => (
              <div key={dia} className="profile-section" style={{ marginBottom: 12 }}>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, padding: 0 }}
                  onClick={() => setDiaActivo(diaActivo === dia ? null : dia)}
                >
                  <span>{dia} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>· {getEjs(dia).length} ejercicios</span></span>
                  <span>{diaActivo === dia ? '▼' : '›'}</span>
                </button>

                {diaActivo === dia && (
                  <div style={{ marginTop: 14 }}>
                    {/* Buscador catálogo */}
                    <div className="form-group">
                      <input
                        placeholder="Buscar ejercicio del catálogo..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                      />
                    </div>
                    {catalogoFiltrado.length > 0 && (
                      <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid var(--card-border)', borderRadius: 8, marginBottom: 10 }}>
                        {catalogoFiltrado.slice(0,10).map((ej, i) => (
                          <button key={i}
                            style={{ display: 'block', width: '100%', background: 'none', border: 'none', padding: '8px 12px', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: 13, borderBottom: '1px solid var(--card-border)' }}
                            onClick={() => { agregarDelCatalogo(ej); setBusqueda('') }}
                          >
                            {ej.nombre} <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>· {ej.maquina}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Ejercicio libre */}
                    {ejercicioLibre === null ? (
                      <button className="btn btn--ghost btn--sm" onClick={() => setEjercicioLibre({ nombre: '', series: '3', reps: '10', desc: '' })} style={{ marginBottom: 10 }}>
                        + Ejercicio libre
                      </button>
                    ) : (
                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                        <div className="form-group"><label>Nombre</label><input value={ejercicioLibre.nombre} onChange={e => setEjercicioLibre(p => ({ ...p, nombre: e.target.value }))} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div className="form-group"><label>Series</label><input type="number" value={ejercicioLibre.series} onChange={e => setEjercicioLibre(p => ({ ...p, series: e.target.value }))} /></div>
                          <div className="form-group"><label>Reps</label><input value={ejercicioLibre.reps} onChange={e => setEjercicioLibre(p => ({ ...p, reps: e.target.value }))} /></div>
                        </div>
                        <div className="form-group"><label>Descripción (opcional)</label><textarea value={ejercicioLibre.desc} onChange={e => setEjercicioLibre(p => ({ ...p, desc: e.target.value }))} /></div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn--primary btn--sm" onClick={agregarLibre} disabled={!ejercicioLibre.nombre}>Agregar</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => setEjercicioLibre(null)}>Cancelar</button>
                        </div>
                      </div>
                    )}

                    {/* Lista ejercicios del día */}
                    {getEjs(dia).map((ej, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: 'var(--card-bg)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: 13 }}>{ej.nombre}</strong>
                          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                            <input type="number" value={ej.series} onChange={e => actualizarCampo(dia, idx, 'series', e.target.value)}
                              style={{ width: 48, background: 'transparent', border: '1px solid var(--card-border)', borderRadius: 6, padding: '2px 6px', color: 'var(--text-primary)', fontSize: 12 }} />
                            <span style={{ color: 'var(--text-muted)', fontSize: 12, alignSelf: 'center' }}>×</span>
                            <input value={ej.reps} onChange={e => actualizarCampo(dia, idx, 'reps', e.target.value)}
                              style={{ width: 56, background: 'transparent', border: '1px solid var(--card-border)', borderRadius: 6, padding: '2px 6px', color: 'var(--text-primary)', fontSize: 12 }} />
                          </div>
                        </div>
                        <button onClick={() => moverEj(dia, idx, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}>↑</button>
                        <button onClick={() => moverEj(dia, idx, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}>↓</button>
                        <button onClick={() => eliminarEj(dia, idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              className="btn btn--primary btn--full"
              onClick={() => setPaso(2)}
              disabled={!validarPaso1()}
              style={{ marginTop: 16 }}
            >
              Siguiente →
            </button>
            {!validarPaso1() && diasSeleccionados.length > 0 && (
              <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 8 }}>Cada día activo debe tener al menos 1 ejercicio.</p>
            )}
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>¿Por qué quieres una rutina personalizada? *</label>
              <textarea
                value={justificacion}
                onChange={e => setJustificacion(e.target.value)}
                placeholder="Mínimo 30 caracteres..."
                style={{ minHeight: 100 }}
              />
              <span style={{ fontSize: 11, color: justificacion.length >= 30 ? 'var(--green-accent)' : 'var(--text-muted)' }}>
                {justificacion.length} / 30 mínimo
              </span>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>¿Tienes alguna lesión o condición física? (opcional)</label>
              <textarea value={condicion} onChange={e => setCondicion(e.target.value)} placeholder="Ej: problema de rodilla izquierda..." />
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
              <input type="checkbox" checked={aceptado} onChange={e => setAceptado(e.target.checked)} style={{ marginTop: 2 }} />
              Entiendo que el admin debe aprobar mi rutina antes de poder usarla.
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--ghost" onClick={() => setPaso(1)}>← Atrás</button>
              <button className="btn btn--primary" onClick={() => setPaso(3)} disabled={!validarPaso2()}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Resumen de tu rutina</h3>
            {diasSeleccionados.map(dia => (
              <div key={dia} className="profile-section" style={{ marginBottom: 10 }}>
                <strong>{dia}</strong> · {getEjs(dia).length} ejercicios
                {getEjs(dia).map((ej, i) => (
                  <div key={i} className="ej-row" style={{ marginTop: 6 }}>
                    <span className="ej-row__dot" />
                    <span className="ej-row__name">{ej.nombre}</span>
                    <span className="ej-row__sets">{ej.series}x{ej.reps}</span>
                  </div>
                ))}
              </div>
            ))}
            {error && <p style={{ color: 'var(--danger)', marginBottom: 10 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn--ghost" onClick={() => setPaso(2)}>← Atrás</button>
              <button className="btn btn--primary" onClick={enviar} disabled={enviando}>
                {enviando ? 'Enviando...' : '📤 Enviar al admin para revisión'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Vista 3: Solicitud existe ────────────────────────────────
  if (solicitud) {
    const estado = solicitud.estado

    return (
      <div className="page">
        <div className="page__header">
          <h2 className="page__title">Mi rutina personalizada</h2>
        </div>

        <div className="solicitud-card">
          <span className={`solicitud-badge solicitud-badge--${estado}`}>
            {estado === 'pendiente' ? '⏳ En revisión' : estado === 'aprobada' ? '✅ Rutina aprobada' : '❌ Solicitud rechazada'}
          </span>

          {estado === 'pendiente' && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
                Tu rutina personalizada está siendo revisada por el administrador.
              </p>
              <button className="btn btn--ghost btn--sm" onClick={() => setDetalle(d => !d)}>
                {detalle ? 'Ocultar' : 'Ver mi rutina enviada'}
              </button>
            </>
          )}

          {estado === 'aprobada' && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
                Tu rutina ha sido aprobada. ¡Puedes comenzar!
              </p>
              <button className="btn btn--ghost btn--sm" onClick={() => setDetalle(d => !d)} style={{ marginBottom: 10 }}>
                {detalle ? 'Ocultar' : 'Ver rutina'}
              </button>
            </>
          )}

          {estado === 'rechazada' && (
            <>
              {solicitud.comentarioAdmin && (
                <div style={{ background: 'rgba(224,85,85,0.08)', border: '1px solid rgba(224,85,85,0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--danger)' }}>{solicitud.comentarioAdmin}</p>
                </div>
              )}
              <button className="btn btn--primary" onClick={() => { setSolicitud(null); setCreando(true); setPaso(1) }}>
                Crear nueva solicitud
              </button>
            </>
          )}

          {/* Detalle de la rutina */}
          {detalle && solicitud.rutinaPropuesta?.map((diaData, i) => (
            <div key={i} style={{ marginTop: 12 }}>
              <strong style={{ fontSize: 14 }}>{diaData.dia}</strong>
              {diaData.ejercicios.map((ej, j) => (
                <div key={j} className="ej-row">
                  <span className="ej-row__dot" />
                  <span className="ej-row__name">{ej.nombre}</span>
                  <span className="ej-row__sets">{ej.series}x{ej.reps}</span>
                </div>
              ))}
              {estado === 'aprobada' && (
                <button
                  className="btn btn--primary btn--sm"
                  style={{ marginTop: 8 }}
                  onClick={() => setSesion({ dia: diaData.dia, ejercicios: diaData.ejercicios })}
                >
                  ▶ Comenzar {diaData.dia}
                </button>
              )}
            </div>
          ))}

          {estado === 'aprobada' && (
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 16 }}
              onClick={() => { setSolicitud(null); setCreando(true); setPaso(1) }}>
              Solicitar cambios
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}
