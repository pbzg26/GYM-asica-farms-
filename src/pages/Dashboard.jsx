// ============================================================
// PÁGINA: Dashboard — solo super admin
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerResumenUsuarios, obtenerTodosReportes, resolverReporte } from '../services/dbService'

const ESTADO_COLORES = {
  abierto:         { color:'#c0392b', label:'🔴 Abierto' },
  en_revision:     { color:'#92600a', label:'🟡 En revisión' },
  resuelto:        { color:'#2e7d32', label:'🟢 Resuelto' },
  requiere_compra: { color:'#1565c0', label:'🔵 Requiere compra' },
  no_procedente:   { color:'#555',    label:'⚫ No procedente' },
}

function StatCard({ icon, value, label, accent }) {
  return (
    <div className="dash-stat-card" style={accent ? {background:'var(--g800)',borderColor:'var(--g700)'} : {}}>
      <span style={{fontSize:28,lineHeight:1}}>{icon}</span>
      <div>
        <div className="dash-stat-card__val" style={accent ? {color:'#fff'} : {}}>{value}</div>
        <div className="dash-stat-card__lbl" style={accent ? {color:'rgba(255,255,255,.65)'} : {}}>{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { esSuperAdmin, esAdmin } = useAuth()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [tabActiva, setTabActiva] = useState('resumen')

  useEffect(() => {
    if (!esAdmin && !esSuperAdmin) return
    cargar()
  }, [esAdmin, esSuperAdmin])

  async function cargar() {
    setCargando(true)
    try {
      const [u, r] = await Promise.all([obtenerResumenUsuarios(), obtenerTodosReportes()])
      setUsuarios(u)
      setReportes(r)
    } catch (e) {
      console.error(e)
    }
    setCargando(false)
  }

  if (!esAdmin && !esSuperAdmin) {
    return (
      <div className="page page--center">
        <p style={{fontSize:36}}>🔒</p>
        <h2>Acceso restringido</h2>
        <button className="btn btn--primary" onClick={() => navigate('/')}>Ir al inicio</button>
      </div>
    )
  }

  const activos7dias = usuarios.filter(u => u.activoEstaSemana).length
  const activos30dias = usuarios.filter(u => u.rutinasUltimos30 > 0).length
  const reportesAbiertos = reportes.filter(r => r.estado === 'abierto' || r.estado === 'en_revision').length
  const totalRutinas30 = usuarios.reduce((a, u) => a + (u.rutinasUltimos30 ?? 0), 0)

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">📊 Dashboard</h2>
        <p className="page__sub">Seguimiento de actividad, salud y operaciones del gym</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{marginBottom:24}}>
        {[
          { id:'resumen', label:'📈 Resumen' },
          { id:'usuarios', label:`👥 Usuarios (${usuarios.length})` },
          { id:'reportes', label:`📢 Reportes (${reportesAbiertos} activos)` },
        ].map(t => (
          <button key={t.id} className={`admin-tab ${tabActiva===t.id?'active':''}`} onClick={() => setTabActiva(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div style={{textAlign:'center',padding:'48px 0',color:'var(--t500)'}}>Cargando datos...</div>
      ) : (
        <>
          {/* TAB RESUMEN */}
          {tabActiva === 'resumen' && (
            <div>
              <div className="dash-stats" style={{gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',display:'grid',gap:14,marginBottom:28}}>
                <StatCard icon="👥" value={usuarios.length} label="Usuarios registrados" />
                <StatCard icon="🔥" value={activos7dias} label="Activos esta semana" accent />
                <StatCard icon="📅" value={activos30dias} label="Activos este mes" />
                <StatCard icon="💪" value={totalRutinas30} label="Rutinas este mes" />
                <StatCard icon="📢" value={reportesAbiertos} label="Reportes pendientes" />
              </div>

              <div className="card">
                <h4 style={{fontWeight:800,marginBottom:16,fontSize:15}}>Actividad reciente</h4>
                {usuarios
                  .filter(u => u.ultimoEntreno)
                  .sort((a,b) => (b.ultimoEntreno ?? 0) - (a.ultimoEntreno ?? 0))
                  .slice(0, 8)
                  .map(u => (
                    <div key={u.uid} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--bd)'}}>
                      <div style={{
                        width:38,height:38,borderRadius:'50%',
                        background: u.activoEstaSemana ? 'var(--g500)' : 'var(--g200)',
                        color: u.activoEstaSemana ? '#fff' : 'var(--g700)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontWeight:800,fontSize:14,flexShrink:0,
                      }}>
                        {u.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13.5,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.nombre}</div>
                        <div style={{fontSize:11.5,color:'var(--t500)'}}>
                          {u.rutinasUltimos30} rutinas este mes
                          {u.imc && ` · IMC ${u.imc}`}
                        </div>
                      </div>
                      <div style={{fontSize:11,color:'var(--t500)',flexShrink:0,textAlign:'right'}}>
                        {u.ultimoEntreno?.toLocaleDateString?.('es-PE') ?? '—'}
                      </div>
                      {u.activoEstaSemana && (
                        <span style={{background:'var(--g100)',color:'var(--g700)',fontSize:10,fontWeight:800,padding:'2px 8px',borderRadius:99}}>ACTIVO</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB USUARIOS */}
          {tabActiva === 'usuarios' && (
            <div>
              {usuarioDetalle ? (
                <div>
                  <button className="back-btn" onClick={() => setUsuarioDetalle(null)}>← Volver a usuarios</button>
                  <div className="card" style={{marginTop:16}}>
                    <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
                      <div style={{width:56,height:56,borderRadius:'50%',background:'var(--g500)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:22,flexShrink:0}}>
                        {usuarioDetalle.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <h3 style={{fontSize:18,fontWeight:800}}>{usuarioDetalle.nombre}</h3>
                        <p style={{fontSize:13,color:'var(--t500)'}}>{usuarioDetalle.correo} · Grupo {usuarioDetalle.grupo} · {usuarioDetalle.rol}</p>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
                      {[
                        ['💪','Rutinas este mes', usuarioDetalle.rutinasUltimos30 ?? '—'],
                        ['⚖️','Peso', usuarioDetalle.peso ? `${usuarioDetalle.peso} kg` : '—'],
                        ['📏','Altura', usuarioDetalle.altura ? `${usuarioDetalle.altura} cm` : '—'],
                        ['📊','IMC', usuarioDetalle.imc ?? '—'],
                        ['📅','Último entreno', usuarioDetalle.ultimoEntreno?.toLocaleDateString?.('es-PE') ?? 'Sin registros'],
                        ['🩺','Condiciones', usuarioDetalle.condiciones?.length ? usuarioDetalle.condiciones.join(', ') : 'Ninguna'],
                      ].map(([icon, lbl, val]) => (
                        <div key={lbl} className="salud-metrica-card">
                          <span className="salud-metrica-icon">{icon}</span>
                          <span className="salud-metrica-val" style={{fontSize:16}}>{val}</span>
                          <span className="salud-metrica-lbl">{lbl}</span>
                        </div>
                      ))}
                    </div>
                    {usuarioDetalle.activoEstaSemana ? (
                      <div className="info-box" style={{marginTop:16,background:'var(--g50)',borderColor:'var(--g200)',color:'var(--g800)'}}>
                        🔥 <strong>{usuarioDetalle.nombre?.split(' ')[0]}</strong> está activo esta semana. ¡Excelente progreso!
                      </div>
                    ) : (
                      <div className="info-box" style={{marginTop:16,background:'var(--warn-bg)',borderColor:'var(--warn-bd)',color:'var(--warn)'}}>
                        💤 Sin actividad esta semana. Una motivación podría ayudar.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
                    <span style={{fontSize:13,color:'var(--t500)'}}>
                      {activos7dias} activos esta semana de {usuarios.length} totales
                    </span>
                  </div>
                  {usuarios
                    .sort((a,b) => {
                      if (a.activoEstaSemana !== b.activoEstaSemana) return a.activoEstaSemana ? -1 : 1
                      return (b.rutinasUltimos30 ?? 0) - (a.rutinasUltimos30 ?? 0)
                    })
                    .map(u => (
                      <button
                        key={u.uid}
                        className="exercise-row"
                        style={{width:'100%',textAlign:'left'}}
                        onClick={() => setUsuarioDetalle(u)}
                      >
                        <div style={{width:38,height:38,borderRadius:'50%',background:u.activoEstaSemana?'var(--g500)':'var(--g100)',color:u.activoEstaSemana?'#fff':'var(--g600)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>
                          {u.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div className="exercise-row__info" style={{flex:1}}>
                          <h4 style={{fontSize:13.5}}>{u.nombre}</h4>
                          <div className="tag-list">
                            <span className="tag tag--sm">Grupo {u.grupo}</span>
                            {u.imc && <span className="tag tag--sm">IMC {u.imc}</span>}
                            <span className={`tag tag--sm ${u.activoEstaSemana?'tag--primary':''}`}>
                              {u.activoEstaSemana ? '🔥 Activo' : `${u.rutinasUltimos30} rutinas/mes`}
                            </span>
                          </div>
                        </div>
                        <span className="exercise-row__arrow">›</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB REPORTES */}
          {tabActiva === 'reportes' && (
            <TabReportesAdmin reportes={reportes} onActualizar={cargar} />
          )}
        </>
      )}
    </div>
  )
}

function TabReportesAdmin({ reportes, onActualizar }) {
  const [reporteActivo, setReporteActivo] = useState(null)
  const [resolucion, setResolucion] = useState({ eraReal: null, descripcionSolucion:'', queSeNecesito:'' })
  const [guardando, setGuardando] = useState(false)

  async function cambiarEstado(reporte, nuevoEstado) {
    setGuardando(true)
    try {
      await resolverReporte(reporte.id, { estado: nuevoEstado, ...resolucion })
      await onActualizar()
      setReporteActivo(null)
      setResolucion({ eraReal: null, descripcionSolucion:'', queSeNecesito:'' })
    } catch (e) {
      alert('Error: ' + e.message)
    }
    setGuardando(false)
  }

  const pendientes = reportes.filter(r => r.estado === 'abierto' || r.estado === 'en_revision')
  const historico  = reportes.filter(r => r.estado !== 'abierto' && r.estado !== 'en_revision')

  if (reporteActivo) {
    const r = reporteActivo
    const estadoActual = ESTADO_COLORES[r.estado]
    return (
      <div>
        <button className="back-btn" onClick={() => setReporteActivo(null)}>← Volver a reportes</button>
        <div className="card" style={{marginTop:16}}>
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:16}}>
            <div>
              <span style={{fontSize:11,fontWeight:700,color:'var(--t500)',textTransform:'uppercase'}}>{r.categoria}</span>
              <h3 style={{fontSize:16,fontWeight:800,marginTop:4}}>{r.titulo}</h3>
              <p style={{fontSize:12,color:'var(--t500)'}}>De: {r.nombreUsuario} · {r.fechaReporte?.toDate?.()?.toLocaleDateString('es-PE')}</p>
            </div>
            <span style={{color:estadoActual?.color,fontSize:13,fontWeight:700}}>{estadoActual?.label}</span>
          </div>
          <p style={{fontSize:14,lineHeight:1.6,marginBottom:16}}>{r.descripcion}</p>
          {r.fotoBase64 && (
            <img src={r.fotoBase64} alt="evidencia" style={{maxWidth:'100%',maxHeight:250,borderRadius:'var(--r12)',objectFit:'cover',marginBottom:16}} />
          )}

          <div style={{borderTop:'1px solid var(--bd)',paddingTop:16,marginTop:8}}>
            <h4 style={{fontWeight:800,fontSize:14,marginBottom:12}}>Resolución</h4>

            {r.estado === 'abierto' && (
              <button className="btn btn--outline btn--sm" onClick={() => cambiarEstado(r, 'en_revision')} disabled={guardando}>
                👁️ Marcar como "En revisión"
              </button>
            )}

            {(r.estado === 'abierto' || r.estado === 'en_revision') && (
              <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:12}}>
                <div>
                  <p style={{fontSize:13,fontWeight:700,marginBottom:8}}>¿Era real el problema?</p>
                  <div style={{display:'flex',gap:8}}>
                    <button
                      className={`btn btn--sm ${resolucion.eraReal===true?'btn--primary':'btn--outline'}`}
                      onClick={() => setResolucion(p=>({...p,eraReal:true}))}
                    >Sí, era real</button>
                    <button
                      className={`btn btn--sm ${resolucion.eraReal===false?'btn--primary':'btn--outline'}`}
                      onClick={() => setResolucion(p=>({...p,eraReal:false}))}
                    >No procedente</button>
                  </div>
                </div>

                {resolucion.eraReal === false && (
                  <div className="form-group">
                    <label className="form-label">Motivo</label>
                    <input className="form-input" value={resolucion.descripcionSolucion} onChange={e=>setResolucion(p=>({...p,descripcionSolucion:e.target.value}))} placeholder="Ej: No se encontró el problema reportado" />
                    <button className="btn btn--primary btn--sm" style={{marginTop:10}} onClick={() => cambiarEstado(r,'no_procedente')} disabled={guardando}>Cerrar como no procedente</button>
                  </div>
                )}

                {resolucion.eraReal === true && (
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    <div className="form-group">
                      <label className="form-label">¿Lo solucionaste?</label>
                      <textarea className="form-input" rows={2} value={resolucion.descripcionSolucion} onChange={e=>setResolucion(p=>({...p,descripcionSolucion:e.target.value}))} placeholder="Ej: Se reemplazó el agarre de la mancuerna..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">¿Qué se necesitó / se necesita?</label>
                      <input className="form-input" value={resolucion.queSeNecesito} onChange={e=>setResolucion(p=>({...p,queSeNecesito:e.target.value}))} placeholder="Ej: Cinta antideslizante nueva / Técnico de mantenimiento" />
                    </div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <button className="btn btn--primary btn--sm" onClick={() => cambiarEstado(r,'resuelto')} disabled={guardando}>✅ Marcar como resuelto</button>
                      <button className="btn btn--outline btn--sm" onClick={() => cambiarEstado(r,'requiere_compra')} disabled={guardando}>🛒 Requiere compra</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {pendientes.length > 0 && (
        <div style={{marginBottom:24}}>
          <h4 style={{fontSize:13,fontWeight:700,color:'var(--err)',marginBottom:12,textTransform:'uppercase',letterSpacing:.5}}>
            🔴 Pendientes ({pendientes.length})
          </h4>
          {pendientes.map(r => (
            <ReporteRow key={r.id} r={r} onClick={() => setReporteActivo(r)} />
          ))}
        </div>
      )}
      {historico.length > 0 && (
        <div>
          <h4 style={{fontSize:13,fontWeight:700,color:'var(--t500)',marginBottom:12,textTransform:'uppercase',letterSpacing:.5}}>
            Historial ({historico.length})
          </h4>
          {historico.map(r => (
            <ReporteRow key={r.id} r={r} onClick={() => setReporteActivo(r)} />
          ))}
        </div>
      )}
      {reportes.length === 0 && (
        <div style={{textAlign:'center',padding:'48px 0',color:'var(--t500)'}}>Sin reportes aún</div>
      )}
    </div>
  )
}

function ReporteRow({ r, onClick }) {
  const e = ESTADO_COLORES[r.estado] ?? ESTADO_COLORES.abierto
  return (
    <button className="exercise-row" style={{width:'100%',textAlign:'left',marginBottom:8}} onClick={onClick}>
      <div className="exercise-row__info" style={{flex:1}}>
        <h4 style={{fontSize:13.5}}>{r.titulo}</h4>
        <p style={{fontSize:12,color:'var(--t500)',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:300}}>
          {r.nombreUsuario} · {r.fechaReporte?.toDate?.()?.toLocaleDateString('es-PE')}
        </p>
      </div>
      <span style={{color:e.color,fontSize:12,fontWeight:700,flexShrink:0}}>{e.label}</span>
      <span className="exercise-row__arrow">›</span>
    </button>
  )
}
