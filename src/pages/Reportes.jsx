// ============================================================
// PÁGINA: Reportes — quejas, sugerencias y problemas de equipo
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGymData } from '../hooks/useGymData'
import { crearReporte, obtenerMisReportes } from '../services/dbService'

const CATEGORIAS = [
  { id: 'equipo',          label: '🔧 Equipo dañado',          desc: 'Máquina, pesa o accesorio en mal estado' },
  { id: 'instalacion',     label: '🏗️ Instalación',            desc: 'Pisos, paredes, iluminación, baños, etc.' },
  { id: 'comportamiento',  label: '⚠️ Comportamiento',          desc: 'Situación de riesgo o conducta inapropiada' },
  { id: 'sugerencia',      label: '💡 Sugerencia de mejora',    desc: 'Idea para mejorar el gym' },
]

const ESTADO_COLORES = {
  abierto:          { bg:'#fdf2f2', color:'#c0392b', label:'🔴 Abierto' },
  en_revision:      { bg:'#fffbf0', color:'#92600a', label:'🟡 En revisión' },
  resuelto:         { bg:'#f0faf4', color:'#2e7d32', label:'🟢 Resuelto' },
  requiere_compra:  { bg:'#f0f4ff', color:'#1565c0', label:'🔵 Requiere compra' },
  no_procedente:    { bg:'#f5f5f5', color:'#555',    label:'⚫ No procedente' },
}

function EstadoBadge({ estado }) {
  const e = ESTADO_COLORES[estado] ?? ESTADO_COLORES.abierto
  return (
    <span style={{
      background: e.bg, color: e.color,
      border: `1px solid ${e.color}33`,
      borderRadius: 99, padding: '3px 12px',
      fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{e.label}</span>
  )
}

export default function Reportes() {
  const { usuario, perfil } = useAuth()
  const { maquinas } = useGymData()
  const navigate = useNavigate()

  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [creando, setCreando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [msgOk, setMsgOk] = useState('')

  // Form nuevo reporte
  const [categoria, setCategoria] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [equipoId, setEquipoId] = useState('')
  const [foto, setFoto] = useState(null) // base64
  const fileRef = useRef()

  useEffect(() => {
    if (!usuario) return
    cargar()
  }, [usuario])

  async function cargar() {
    setCargando(true)
    try {
      const r = await obtenerMisReportes(usuario.uid)
      setReportes(r)
    } catch {}
    setCargando(false)
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setFoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function enviar() {
    if (!categoria) { alert('Selecciona una categoría'); return }
    if (!titulo.trim()) { alert('Escribe un título para el reporte'); return }
    if (descripcion.trim().length < 15) { alert('Describe el problema con más detalle (mínimo 15 caracteres)'); return }
    setEnviando(true)
    try {
      await crearReporte(usuario.uid, {
        nombreUsuario: perfil?.nombre ?? '—',
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        equipoId: equipoId || null,
        fotoBase64: foto,
      })
      setMsgOk('✅ Reporte enviado. El equipo de administración lo revisará pronto.')
      setCreando(false)
      setCategoria(''); setTitulo(''); setDescripcion(''); setEquipoId(''); setFoto(null)
      await cargar()
    } catch (e) {
      alert('Error al enviar: ' + e.message)
    }
    setEnviando(false)
  }

  if (!usuario) {
    return (
      <div className="page page--center">
        <p style={{fontSize:40,marginBottom:12}}>📢</p>
        <h2>Inicia sesión para enviar reportes</h2>
        <button className="btn btn--primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    )
  }

  if (creando) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setCreando(false)}>← Cancelar</button>
        <div className="page__header">
          <h2 className="page__title">Nuevo reporte</h2>
          <p className="page__sub">Tu reporte será atendido por el equipo de administración</p>
        </div>

        {/* Categoría */}
        <div className="card" style={{marginBottom:16}}>
          <h4 style={{fontWeight:800,marginBottom:12,fontSize:14}}>1. ¿Qué tipo de reporte es?</h4>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {CATEGORIAS.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                style={{
                  padding:'12px 14px',borderRadius:'var(--r12)',
                  border:`2px solid ${categoria===c.id?'var(--g600)':'var(--bd)'}`,
                  background: categoria===c.id ? 'var(--g50)' : 'var(--surface)',
                  textAlign:'left',cursor:'pointer',transition:'all .14s'
                }}
              >
                <div style={{fontSize:14,fontWeight:700,color:'var(--t100)'}}>{c.label}</div>
                <div style={{fontSize:11.5,color:'var(--t500)',marginTop:3}}>{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalles */}
        <div className="card" style={{marginBottom:16}}>
          <h4 style={{fontWeight:800,marginBottom:12,fontSize:14}}>2. Describe el problema</h4>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ej: Mancuerna de 20kg tiene el agarre roto" />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción detallada *</label>
            <textarea className="form-input" rows={4} value={descripcion} onChange={e=>setDescripcion(e.target.value)} placeholder="Explica qué está mal, dónde está ubicado, si representa un riesgo, etc." />
          </div>
          {(categoria === 'equipo') && (
            <div className="form-group">
              <label className="form-label">Equipo afectado (opcional)</label>
              <select className="form-input" value={equipoId} onChange={e=>setEquipoId(e.target.value)}>
                <option value="">Seleccionar máquina...</option>
                {maquinas.map(m => <option key={m.id} value={m.id}>{m.emoji} {m.nombre}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Foto */}
        <div className="card" style={{marginBottom:20}}>
          <h4 style={{fontWeight:800,marginBottom:12,fontSize:14}}>3. Foto del problema (opcional pero recomendada)</h4>
          <p style={{fontSize:12,color:'var(--t500)',marginBottom:12}}>Una foto ayuda al admin a entender mejor el problema y agiliza la solución.</p>
          {foto ? (
            <div style={{position:'relative',display:'inline-block'}}>
              <img src={foto} alt="preview" style={{maxWidth:'100%',maxHeight:200,borderRadius:'var(--r12)',objectFit:'cover'}} />
              <button
                onClick={() => setFoto(null)}
                style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,.6)',border:'none',color:'#fff',borderRadius:99,width:28,height:28,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}
              >✕</button>
            </div>
          ) : (
            <>
              <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}} onChange={handleFoto} />
              <button className="btn btn--outline btn--sm" onClick={() => fileRef.current.click()}>
                📷 Adjuntar foto
              </button>
            </>
          )}
        </div>

        <button className="btn btn--primary btn--full" onClick={enviar} disabled={enviando}>
          {enviando ? 'Enviando...' : '📤 Enviar reporte'}
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page__header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h2 className="page__title">📢 Reportes</h2>
          <p className="page__sub">Reporta problemas de equipos, instalaciones o sugiere mejoras</p>
        </div>
        <button className="btn btn--primary btn--sm" onClick={() => setCreando(true)}>
          + Nuevo reporte
        </button>
      </div>

      {msgOk && <div className="toast-ok" style={{marginBottom:16}}>{msgOk}</div>}

      <div className="info-box info-box--sm" style={{marginBottom:20}}>
        🛡️ Si un equipo presenta un riesgo inmediato, <strong>no lo uses</strong> hasta que el admin confirme que está reparado.
      </div>

      {cargando ? (
        <div style={{textAlign:'center',padding:'32px 0',color:'var(--t500)'}}>Cargando reportes...</div>
      ) : reportes.length === 0 ? (
        <div className="card" style={{textAlign:'center',padding:'48px 24px'}}>
          <p style={{fontSize:36,marginBottom:12}}>📋</p>
          <h3 style={{marginBottom:8}}>Sin reportes todavía</h3>
          <p style={{color:'var(--t500)',fontSize:14,marginBottom:20}}>
            Si notas algún problema en el gym, repórtalo para mantener un espacio seguro para todos.
          </p>
          <button className="btn btn--primary" onClick={() => setCreando(true)}>+ Crear mi primer reporte</button>
        </div>
      ) : (
        <div>
          <h3 style={{fontSize:14,fontWeight:700,color:'var(--t400)',marginBottom:12}}>MIS REPORTES ({reportes.length})</h3>
          {reportes.map(r => (
            <div key={r.id} className="card reporte-card">
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:8}}>
                <div>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--t500)',textTransform:'uppercase',letterSpacing:.5}}>
                    {CATEGORIAS.find(c=>c.id===r.categoria)?.label ?? r.categoria}
                  </span>
                  <h4 style={{fontSize:14,fontWeight:800,marginTop:2}}>{r.titulo}</h4>
                </div>
                <EstadoBadge estado={r.estado} />
              </div>
              <p style={{fontSize:13,color:'var(--t400)',lineHeight:1.5,marginBottom:8}}>{r.descripcion}</p>
              {r.fotoBase64 && (
                <img src={r.fotoBase64} alt="evidencia" style={{maxWidth:180,maxHeight:120,borderRadius:'var(--r8)',objectFit:'cover',marginBottom:8}} />
              )}
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'var(--t500)'}}>
                  📅 {r.fechaReporte?.toDate?.()?.toLocaleDateString('es-PE') ?? 'Recientemente'}
                </span>
                {r.estado === 'resuelto' && r.descripcionSolucion && (
                  <span style={{fontSize:11,color:'var(--g600)',fontWeight:700}}>
                    ✅ {r.descripcionSolucion}
                  </span>
                )}
                {r.estado === 'requiere_compra' && r.queSeNecesito && (
                  <span style={{fontSize:11,color:'#1565c0',fontWeight:700}}>
                    🛒 Se necesita: {r.queSeNecesito}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
