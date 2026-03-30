// ============================================================
// PÁGINA: Mi Rutina Personalizada — creación y edición directa
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGymData } from '../hooks/useGymData'
import { guardarMiRutina, obtenerMiRutina, marcarRutinaCompletada } from '../services/dbService'
import WorkoutSession from '../components/ui/WorkoutSession'

const DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

export default function RutinaPersonalizada() {
  const { usuario, perfil } = useAuth()
  const { maquinas } = useGymData()
  const navigate = useNavigate()

  const [rutina, setRutina] = useState(null) // null = no cargado, {} = vacía, {dias:[...]} = tiene rutina
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [sesion, setSesion] = useState(null) // { dia, ejercicios }
  const [msgOk, setMsgOk] = useState('')

  // Estado del editor
  const [diasSel, setDiasSel] = useState([])
  const [ejercPorDia, setEjercPorDia] = useState({})
  const [diaActivo, setDiaActivo] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [modoLibre, setModoLibre] = useState(false)
  const [libre, setLibre] = useState({ nombre:'', series:'3', reps:'10', desc:'' })

  const catalogo = maquinas.flatMap(m => (m.ejercicios ?? []).map(e => ({ ...e, maquina: m.nombre })))
  const catalogoFiltrado = busqueda.trim()
    ? catalogo.filter(e => e.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
    : catalogo.slice(0, 8)

  useEffect(() => {
    if (!usuario) return
    cargar()
  }, [usuario])

  async function cargar() {
    setCargando(true)
    try {
      const r = await obtenerMiRutina(usuario.uid)
      setRutina(r)
    } catch {}
    setCargando(false)
  }

  function iniciarEditor(rutinaExistente) {
    if (rutinaExistente?.dias?.length) {
      const dias = rutinaExistente.dias.map(d => d.dia)
      const ejPorDia = {}
      rutinaExistente.dias.forEach(d => { ejPorDia[d.dia] = d.ejercicios })
      setDiasSel(dias)
      setEjercPorDia(ejPorDia)
      setDiaActivo(dias[0])
    } else {
      setDiasSel([])
      setEjercPorDia({})
      setDiaActivo(null)
    }
    setBusqueda('')
    setModoLibre(false)
    setEditando(true)
  }

  function toggleDia(dia) {
    setDiasSel(prev => {
      if (prev.includes(dia)) {
        const nuevo = prev.filter(d => d !== dia)
        if (diaActivo === dia) setDiaActivo(nuevo[0] ?? null)
        return nuevo
      }
      const nuevo = [...prev, dia]
      if (!diaActivo) setDiaActivo(dia)
      return nuevo
    })
  }

  function getEjs(dia) { return ejercPorDia[dia] ?? [] }
  function setEjs(dia, lista) { setEjercPorDia(prev => ({ ...prev, [dia]: lista })) }

  function agregarDelCatalogo(ej) {
    if (!diaActivo) return
    const lista = getEjs(diaActivo)
    if (lista.find(e => e.nombre === ej.nombre)) return
    setEjs(diaActivo, [...lista, { nombre: ej.nombre, series: ej.series ?? '3', reps: ej.repeticiones ?? '10', desc: ej.descripcion ?? '' }])
    setBusqueda('')
  }

  function agregarLibre() {
    if (!diaActivo || !libre.nombre.trim()) return
    setEjs(diaActivo, [...getEjs(diaActivo), { ...libre, nombre: libre.nombre.trim() }])
    setLibre({ nombre:'', series:'3', reps:'10', desc:'' })
    setModoLibre(false)
  }

  function eliminarEj(dia, idx) {
    setEjs(dia, getEjs(dia).filter((_, i) => i !== idx))
  }

  function moverEj(dia, idx, dir) {
    const lista = [...getEjs(dia)]
    const swap = idx + dir
    if (swap < 0 || swap >= lista.length) return
    ;[lista[idx], lista[swap]] = [lista[swap], lista[idx]]
    setEjs(dia, lista)
  }

  function actualizarEj(dia, idx, campo, valor) {
    const lista = [...getEjs(dia)]
    lista[idx] = { ...lista[idx], [campo]: valor }
    setEjs(dia, lista)
  }

  async function guardar() {
    if (diasSel.length === 0) { alert('Selecciona al menos un día de entrenamiento'); return }
    const sinEjs = diasSel.filter(d => getEjs(d).length === 0)
    if (sinEjs.length) { alert(`Agrega ejercicios para: ${sinEjs.join(', ')}`); return }

    setGuardando(true)
    try {
      const datos = {
        dias: diasSel.map(dia => ({ dia, ejercicios: getEjs(dia) })),
        diasSemana: diasSel.length,
        nombre: perfil?.nombre ?? 'Mi rutina',
      }
      await guardarMiRutina(usuario.uid, datos)
      setRutina(datos)
      setEditando(false)
      setMsgOk('✅ Rutina guardada correctamente')
      setTimeout(() => setMsgOk(''), 3000)
    } catch (e) {
      alert('Error al guardar: ' + e.message)
    }
    setGuardando(false)
  }

  async function handleFinalizar(tiempos) {
    if (!sesion) return
    await marcarRutinaCompletada(usuario.uid, {
      grupo: 'Personalizada',
      dia: sesion.dia,
      ejercicios: sesion.ejercicios.map(e => e.n),
      tiempoTotalMinutos: tiempos?.tiempoTotalMinutos ?? 0,
      tiemposPorEjercicio: tiempos?.tiemposPorEjercicio ?? [],
      seriesCompletadas: tiempos?.tiemposPorEjercicio?.reduce((a,e)=>a+e.series.length,0) ?? 0
    })
    setSesion(null)
    setMsgOk('🎉 ¡Sesión completada y guardada!')
    setTimeout(() => setMsgOk(''), 3500)
  }

  // ── Render: WorkoutSession ──────────────────────────────────
  if (sesion) {
    return (
      <WorkoutSession
        ejercicios={sesion.ejercicios}
        grupoNombre="Mi Rutina"
        diaNombre={sesion.dia}
        pesoUsuario={perfil?.peso ?? 70}
        onFinalizar={handleFinalizar}
        onSalir={() => setSesion(null)}
      />
    )
  }

  if (!usuario) {
    return (
      <div className="page page--center">
        <h2>Inicia sesión para acceder a tu rutina personalizada</h2>
        <button className="btn btn--primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    )
  }

  if (cargando) {
    return <div className="page page--center"><div className="spinner" /><p>Cargando tu rutina...</p></div>
  }

  // ── Render: Editor ─────────────────────────────────────────
  if (editando) {
    return (
      <div className="page">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24,flexWrap:'wrap'}}>
          <button className="back-btn" onClick={() => setEditando(false)}>← Cancelar</button>
          <h2 className="page__title" style={{marginBottom:0}}>
            {rutina?.dias?.length ? 'Editar mi rutina' : 'Crear mi rutina'}
          </h2>
        </div>

        {/* Paso 1: Días */}
        <div className="card" style={{marginBottom:20}}>
          <h3 style={{fontSize:15,fontWeight:800,marginBottom:12}}>1. Selecciona tus días de entrenamiento</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {DIAS_SEMANA.map(dia => (
              <button
                key={dia}
                className={`chip ${diasSel.includes(dia) ? 'chip--active' : ''}`}
                onClick={() => toggleDia(dia)}
              >{dia}</button>
            ))}
          </div>
          <p style={{fontSize:12,color:'var(--t500)',marginTop:10}}>Domingo = descanso obligatorio</p>
        </div>

        {/* Paso 2: Ejercicios por día */}
        {diasSel.length > 0 && (
          <div className="card" style={{marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:800,marginBottom:12}}>2. Agrega ejercicios por día</h3>

            {/* Tabs de días */}
            <div className="admin-tabs" style={{marginBottom:16}}>
              {diasSel.map(dia => (
                <button
                  key={dia}
                  className={`admin-tab ${diaActivo===dia?'active':''}`}
                  onClick={() => setDiaActivo(dia)}
                >
                  {dia}
                  {getEjs(dia).length > 0 && <span style={{marginLeft:6,background:'rgba(255,255,255,.25)',borderRadius:99,padding:'1px 6px',fontSize:11}}>{getEjs(dia).length}</span>}
                </button>
              ))}
            </div>

            {diaActivo && (
              <>
                {/* Lista de ejercicios del día */}
                {getEjs(diaActivo).length === 0 && (
                  <p style={{color:'var(--t500)',fontSize:13,marginBottom:12}}>Sin ejercicios. Agrega desde el catálogo o crea uno libre.</p>
                )}
                {getEjs(diaActivo).map((ej, i) => (
                  <div key={i} className="rutina-ej-row">
                    <div style={{flex:1,minWidth:0}}>
                      <strong style={{fontSize:13,display:'block',marginBottom:4}}>{ej.nombre}</strong>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        <div style={{display:'flex',alignItems:'center',gap:4}}>
                          <span style={{fontSize:11,color:'var(--t500)'}}>Series:</span>
                          <input
                            className="form-input"
                            style={{width:52,padding:'3px 6px',fontSize:12,textAlign:'center'}}
                            value={ej.series}
                            onChange={e => actualizarEj(diaActivo,i,'series',e.target.value)}
                          />
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:4}}>
                          <span style={{fontSize:11,color:'var(--t500)'}}>Reps:</span>
                          <input
                            className="form-input"
                            style={{width:60,padding:'3px 6px',fontSize:12,textAlign:'center'}}
                            value={ej.reps}
                            onChange={e => actualizarEj(diaActivo,i,'reps',e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:4,flexShrink:0}}>
                      <button className="btn btn--ghost btn--sm" style={{padding:'5px 8px'}} onClick={() => moverEj(diaActivo,i,-1)} title="Subir">↑</button>
                      <button className="btn btn--ghost btn--sm" style={{padding:'5px 8px'}} onClick={() => moverEj(diaActivo,i,+1)} title="Bajar">↓</button>
                      <button className="btn btn--ghost btn--sm" style={{padding:'5px 8px',color:'var(--err)'}} onClick={() => eliminarEj(diaActivo,i)}>✕</button>
                    </div>
                  </div>
                ))}

                {/* Buscador catálogo */}
                <div style={{marginTop:14,borderTop:'1px solid var(--bd)',paddingTop:14}}>
                  <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                    <button
                      className={`btn btn--sm ${!modoLibre?'btn--primary':'btn--ghost'}`}
                      onClick={() => setModoLibre(false)}
                    >📋 Del catálogo</button>
                    <button
                      className={`btn btn--sm ${modoLibre?'btn--primary':'btn--ghost'}`}
                      onClick={() => setModoLibre(true)}
                    >+ Ejercicio libre</button>
                  </div>

                  {!modoLibre ? (
                    <>
                      <input
                        className="form-input"
                        placeholder="Buscar ejercicio (ej: sentadilla, press...)"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{marginBottom:8}}
                      />
                      <div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
                        {catalogoFiltrado.map(ej => (
                          <button
                            key={ej.id ?? ej.nombre}
                            className="exercise-row"
                            style={{padding:'8px 12px'}}
                            onClick={() => agregarDelCatalogo(ej)}
                          >
                            <div style={{textAlign:'left',flex:1}}>
                              <span style={{fontSize:13,fontWeight:700}}>{ej.nombre}</span>
                              <span style={{fontSize:11,color:'var(--t500)',marginLeft:8}}>{ej.maquina}</span>
                            </div>
                            <span style={{color:'var(--g600)',fontWeight:800}}>+</span>
                          </button>
                        ))}
                        {busqueda && catalogoFiltrado.length === 0 && (
                          <p style={{fontSize:12,color:'var(--t500)',padding:'8px 0'}}>Sin resultados. Intenta con otro término.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      <input className="form-input" placeholder="Nombre del ejercicio *" value={libre.nombre} onChange={e=>setLibre(f=>({...f,nombre:e.target.value}))} />
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                        <input className="form-input" placeholder="Series (ej: 4)" value={libre.series} onChange={e=>setLibre(f=>({...f,series:e.target.value}))} />
                        <input className="form-input" placeholder="Reps (ej: 8-12)" value={libre.reps} onChange={e=>setLibre(f=>({...f,reps:e.target.value}))} />
                      </div>
                      <button className="btn btn--primary btn--sm" onClick={agregarLibre}>+ Agregar ejercicio</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Botón guardar */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button
            className="btn btn--primary"
            onClick={guardar}
            disabled={guardando || diasSel.length === 0}
          >
            {guardando ? 'Guardando...' : '💾 Guardar rutina'}
          </button>
          <button className="btn btn--ghost" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      </div>
    )
  }

  // ── Render: Vista de la rutina ─────────────────────────────
  return (
    <div className="page">
      <div className="page__header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h2 className="page__title">⭐ Mi Rutina</h2>
          <p className="page__sub">Tu programa de entrenamiento personalizado</p>
        </div>
        <button className="btn btn--outline btn--sm" onClick={() => iniciarEditor(rutina)}>
          {rutina?.dias?.length ? '✏️ Editar rutina' : '+ Crear rutina'}
        </button>
      </div>

      {msgOk && <div className="toast-ok" style={{marginBottom:16}}>{msgOk}</div>}

      {!rutina?.dias?.length ? (
        <div className="card" style={{textAlign:'center',padding:'48px 24px'}}>
          <p style={{fontSize:40,marginBottom:16}}>📋</p>
          <h3 style={{marginBottom:8}}>Aún no tienes una rutina personalizada</h3>
          <p style={{color:'var(--t500)',marginBottom:24,fontSize:14}}>
            Crea tu propio programa de entrenamiento adaptado a tus objetivos y tiempo disponible.
            Puedes modificarla cuantas veces quieras.
          </p>
          <button className="btn btn--primary" onClick={() => iniciarEditor(null)}>
            + Crear mi rutina
          </button>
        </div>
      ) : (
        <>
          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
            <span className="tag tag--primary">{rutina.dias.length} días / semana</span>
            <span style={{fontSize:12,color:'var(--t500)'}}>
              {rutina.dias.reduce((a,d)=>a+(d.ejercicios?.length??0),0)} ejercicios en total
            </span>
          </div>

          {rutina.dias.map(({ dia, ejercicios }) => (
            <div key={dia} className="card" style={{marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8}}>
                <div>
                  <h3 style={{fontSize:16,fontWeight:800}}>{dia}</h3>
                  <span style={{fontSize:12,color:'var(--t500)'}}>{ejercicios.length} ejercicios</span>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setSesion({
                    dia,
                    ejercicios: ejercicios.map(e => ({
                      n: e.nombre,
                      s: `${e.series}×${e.reps}`,
                      descanso: '60 seg',
                      descripcion: e.desc
                    }))
                  })}
                >
                  ▶ Entrenar
                </button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {ejercicios.map((ej, i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 12px',background:'var(--surface2)',borderRadius:'var(--r8)'}}>
                    <span style={{fontWeight:800,color:'var(--g600)',minWidth:22,textAlign:'center',fontSize:13}}>{i+1}</span>
                    <div style={{flex:1}}>
                      <span style={{fontSize:13.5,fontWeight:700}}>{ej.nombre}</span>
                    </div>
                    <span style={{fontSize:12,color:'var(--t500)',whiteSpace:'nowrap'}}>{ej.series}×{ej.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
