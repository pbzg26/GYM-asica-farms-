// ============================================================
// PÁGINA: Admin — Panel de administración completo
// Tabs: Usuarios | Máquinas | Rutinas | Guía
// ============================================================
import { useState, useEffect } from 'react'
import {
  obtenerTodosUsuarios, cambiarRolUsuario,
  guardarMaquina, guardarEjercicio, eliminarEjercicio,
  guardarMetaRutina, guardarDiaRutina,
  guardarArticuloGuia,
  migrarDatosAFirestore,
  obtenerTodasSolicitudes, responderSolicitud,
  crearAviso, obtenerTodosAvisos, desactivarAviso,
  obtenerTodosReportes, resolverReporte
} from '../services/dbService'
import { useGymData } from '../hooks/useGymData'
import { useAuth } from '../context/AuthContext'
import { MAQUINAS as MAQUINAS_BASE, RUTINAS as RUTINAS_BASE, CONTENIDO_EDUCATIVO as GUIA_BASE } from '../data/gymData'

const GRUPOS = ['A', 'B', 'C', 'D', 'E']

// ── Tab Usuarios ──────────────────────────────────────────────
function TabUsuarios() {
  const { esSuperAdmin } = useAuth()
  const [usuarios,    setUsuarios]    = useState([])
  const [cargando,    setCargando]    = useState(true)
  const [filtroGrupo, setFiltroGrupo] = useState('Todos')
  const [busqueda,    setBusqueda]    = useState('')

  useEffect(() => {
    obtenerTodosUsuarios().then(lista => {
      setUsuarios(lista)
      setCargando(false)
    })
  }, [])

  async function handleCambiarRol(uid, nuevoRol) {
    await cambiarRolUsuario(uid, nuevoRol)
    setUsuarios(prev => prev.map(u => u.uid === uid ? { ...u, rol: nuevoRol } : u))
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const pasaGrupo    = filtroGrupo === 'Todos' || u.grupo === filtroGrupo
    const pasaBusqueda = !busqueda ||
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo?.toLowerCase().includes(busqueda.toLowerCase())
    return pasaGrupo && pasaBusqueda
  })

  const statsPorGrupo = GRUPOS.map(g => ({
    grupo: g,
    total: usuarios.filter(u => u.grupo === g).length
  }))

  return (
    <>
      <div className="stats-grid stats-grid--5">
        <div className="stat-card">
          <span className="stat-card__val">{usuarios.length}</span>
          <span className="stat-card__lbl">Total</span>
        </div>
        {statsPorGrupo.map(s => (
          <div key={s.grupo} className="stat-card">
            <span className="stat-card__val">{s.total}</span>
            <span className="stat-card__lbl">Grupo {s.grupo}</span>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        <input
          type="text"
          className="admin-search"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="filter-tabs">
          {['Todos', ...GRUPOS].map(g => (
            <button
              key={g}
              className={`filter-tab ${filtroGrupo === g ? 'active' : ''}`}
              onClick={() => setFiltroGrupo(g)}
            >
              {g === 'Todos' ? 'Todos' : `Grupo ${g}`}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <p className="loading-text">Cargando usuarios...</p>
      ) : (
        <div className="admin-user-list">
          {usuariosFiltrados.length === 0 ? (
            <p className="empty-state">No se encontraron usuarios.</p>
          ) : (
            usuariosFiltrados.map(u => (
              <div key={u.uid} className="admin-user-card">
                <div className="admin-user-card__avatar">
                  {u.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div className="admin-user-card__info">
                  <strong>{u.nombre}</strong>
                  <p>{u.correo}</p>
                  <div className="tag-list">
                    <span className="tag">Grupo {u.grupo}</span>
                    {u.peso && <span className="tag">{u.peso} kg</span>}
                    {u.meta && <span className="tag">{u.meta}</span>}
                    <span className={`tag ${u.rol === 'admin' || u.rol === 'superadmin' ? 'tag--primary' : ''}`}>{u.rol}</span>
                  </div>
                </div>
                <select
                  value={u.rol ?? 'usuario'}
                  onChange={e => handleCambiarRol(u.uid, e.target.value)}
                  style={{fontSize:12,padding:'4px 8px',borderRadius:8,border:'1.5px solid var(--bd2)',background:'var(--card-bg)',color:'var(--t200)',cursor:'pointer'}}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                  {esSuperAdmin && <option value="superadmin">Super Admin</option>}
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </>
  )
}

// ── Formulario de ejercicio ───────────────────────────────────
const EJ_VACIO = {
  nombre: '', descripcion: '', advertencia: '',
  musculosPrincipales: '', musculosSecundarios: '',
  series: '', repeticiones: '', descanso: '',
  dificultad: 'Principiante', videoYoutube: '', fotos: ''
}

function FormEjercicio({ ejercicio, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(() => {
    if (!ejercicio) return EJ_VACIO
    return {
      ...ejercicio,
      musculosPrincipales: Array.isArray(ejercicio.musculosPrincipales)
        ? ejercicio.musculosPrincipales.join(', ') : (ejercicio.musculosPrincipales ?? ''),
      musculosSecundarios: Array.isArray(ejercicio.musculosSecundarios)
        ? ejercicio.musculosSecundarios.join(', ') : (ejercicio.musculosSecundarios ?? ''),
      fotos: Array.isArray(ejercicio.fotos) ? ejercicio.fotos.join('\n') : (ejercicio.fotos ?? '')
    }
  })

  function set(campo, valor) { setForm(p => ({ ...p, [campo]: valor })) }

  function handleSubmit() {
    const datos = {
      ...form,
      musculosPrincipales: form.musculosPrincipales.split(',').map(s => s.trim()).filter(Boolean),
      musculosSecundarios: form.musculosSecundarios.split(',').map(s => s.trim()).filter(Boolean),
      fotos: form.fotos.split('\n').map(s => s.trim()).filter(Boolean)
    }
    onGuardar(datos)
  }

  return (
    <div className="edit-panel">
      <p className="edit-panel__title">{ejercicio ? 'Editar ejercicio' : 'Nuevo ejercicio'}</p>
      <div className="form-group">
        <label>Nombre</label>
        <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre del ejercicio" />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Descripción técnica..." />
      </div>
      <div className="form-group">
        <label>Músculos principales (separados por coma)</label>
        <input value={form.musculosPrincipales} onChange={e => set('musculosPrincipales', e.target.value)} placeholder="Pecho, Tríceps..." />
      </div>
      <div className="form-group">
        <label>Músculos secundarios (separados por coma)</label>
        <input value={form.musculosSecundarios} onChange={e => set('musculosSecundarios', e.target.value)} placeholder="Core, Deltoides..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div className="form-group">
          <label>Series</label>
          <input value={form.series} onChange={e => set('series', e.target.value)} placeholder="4" />
        </div>
        <div className="form-group">
          <label>Repeticiones</label>
          <input value={form.repeticiones} onChange={e => set('repeticiones', e.target.value)} placeholder="10-12" />
        </div>
        <div className="form-group">
          <label>Descanso</label>
          <input value={form.descanso} onChange={e => set('descanso', e.target.value)} placeholder="90 seg" />
        </div>
      </div>
      <div className="form-group">
        <label>Dificultad</label>
        <select value={form.dificultad} onChange={e => set('dificultad', e.target.value)}>
          <option>Principiante</option>
          <option>Intermedio</option>
          <option>Avanzado</option>
        </select>
      </div>
      <div className="form-group">
        <label>Advertencia</label>
        <textarea value={form.advertencia} onChange={e => set('advertencia', e.target.value)} placeholder="Precauciones importantes..." />
      </div>
      <div className="form-group">
        <label>Link YouTube</label>
        <input type="url" value={form.videoYoutube} onChange={e => set('videoYoutube', e.target.value)} placeholder="https://youtube.com/..." />
      </div>
      <div className="form-group">
        <label>URLs de imágenes (una por línea, máx 4)</label>
        <textarea value={form.fotos} onChange={e => set('fotos', e.target.value)} placeholder="/images/ejercicio-1.jpg&#10;/images/ejercicio-2.jpg" />
      </div>
      <div className="edit-panel__actions">
        <button className="btn btn--primary btn--sm" onClick={handleSubmit} disabled={guardando || !form.nombre.trim()}>
          {guardando ? 'Guardando...' : 'Guardar ejercicio'}
        </button>
        <button className="btn btn--ghost btn--sm" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

// ── Tab Máquinas ──────────────────────────────────────────────
function TabMaquinas() {
  const { maquinas } = useGymData()
  const [maquinaActiva, setMaquinaActiva]   = useState(null)
  const [editandoMaq,   setEditandoMaq]     = useState(false)
  const [formMaq,       setFormMaq]         = useState({})
  const [ejercicioForm, setEjercicioForm]   = useState(null) // null | 'nuevo' | objeto ejercicio
  const [guardando,     setGuardando]       = useState(false)
  const [msg,           setMsg]             = useState('')

  function mostrarMsg(texto) {
    setMsg(texto)
    setTimeout(() => setMsg(''), 3000)
  }

  function abrirEditMaq(maq) {
    setFormMaq({ nombre: maq.nombre, categoria: maq.categoria, emoji: maq.emoji })
    setEditandoMaq(true)
  }

  async function guardarMaqHandler() {
    if (!maquinaActiva) return
    setGuardando(true)
    try {
      await guardarMaquina(maquinaActiva.id, formMaq)
      mostrarMsg('Máquina guardada ✓')
      setEditandoMaq(false)
    } catch (e) { mostrarMsg('Error: ' + e.message) }
    setGuardando(false)
  }

  async function guardarEjHandler(datos) {
    setGuardando(true)
    try {
      const ejId = typeof ejercicioForm === 'object' && ejercicioForm?.id ? ejercicioForm.id : null
      await guardarEjercicio(maquinaActiva.id, ejId, datos)
      mostrarMsg('Ejercicio guardado ✓')
      setEjercicioForm(null)
    } catch (e) { mostrarMsg('Error: ' + e.message) }
    setGuardando(false)
  }

  async function eliminarEjHandler(ejId) {
    if (!confirm('¿Eliminar este ejercicio?')) return
    setGuardando(true)
    try {
      await eliminarEjercicio(maquinaActiva.id, ejId)
      mostrarMsg('Ejercicio eliminado ✓')
    } catch (e) { mostrarMsg('Error: ' + e.message) }
    setGuardando(false)
  }

  // Vista: ejercicios de una máquina
  if (maquinaActiva) {
    return (
      <>
        <button className="back-btn" onClick={() => { setMaquinaActiva(null); setEjercicioForm(null); setEditandoMaq(false) }}>
          ← Volver a máquinas
        </button>
        {msg && <div className="info-box info-box--sm"><strong>{msg}</strong></div>}

        {/* Editar datos de la máquina */}
        <div className="content-card">
          <div className="content-card__header">
            <div className="content-card__info">
              <h4>{maquinaActiva.emoji} {maquinaActiva.nombre}</h4>
              <p>{maquinaActiva.categoria}</p>
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => abrirEditMaq(maquinaActiva)}>
              {editandoMaq ? 'Cancelar' : 'Editar'}
            </button>
          </div>
          {editandoMaq && (
            <div className="edit-panel" style={{ marginTop: 12 }}>
              <p className="edit-panel__title">Editar máquina</p>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Emoji</label>
                  <input value={formMaq.emoji ?? ''} onChange={e => setFormMaq(p => ({ ...p, emoji: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input value={formMaq.nombre ?? ''} onChange={e => setFormMaq(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={formMaq.categoria ?? ''} onChange={e => setFormMaq(p => ({ ...p, categoria: e.target.value }))}>
                    <option>Maquinaria</option>
                    <option>Peso libre</option>
                    <option>Calistenia</option>
                    <option>Accesorios</option>
                  </select>
                </div>
              </div>
              <div className="edit-panel__actions">
                <button className="btn btn--primary btn--sm" onClick={guardarMaqHandler} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar máquina'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de ejercicios */}
        <div className="admin-section">
          <div className="admin-section__header">
            <h3>Ejercicios ({maquinaActiva.ejercicios?.length ?? 0})</h3>
            <button className="btn btn--outline btn--sm" onClick={() => setEjercicioForm('nuevo')}>
              + Agregar
            </button>
          </div>

          {ejercicioForm === 'nuevo' && (
            <FormEjercicio
              ejercicio={null}
              onGuardar={guardarEjHandler}
              onCancelar={() => setEjercicioForm(null)}
              guardando={guardando}
            />
          )}

          <div className="admin-user-list">
            {(maquinaActiva.ejercicios ?? []).map(ej => (
              <div key={ej.id}>
                <div className="content-card">
                  <div className="content-card__header">
                    <div className="content-card__info">
                      <h4>{ej.nombre}</h4>
                      <p>{ej.series}x{ej.repeticiones} · {ej.dificultad}</p>
                    </div>
                    <div className="content-card__actions">
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setEjercicioForm(ejercicioForm?.id === ej.id ? null : ej)}
                      >
                        Editar
                      </button>
                      <button className="btn btn--danger btn--sm" onClick={() => eliminarEjHandler(ej.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
                {ejercicioForm?.id === ej.id && (
                  <FormEjercicio
                    ejercicio={ej}
                    onGuardar={guardarEjHandler}
                    onCancelar={() => setEjercicioForm(null)}
                    guardando={guardando}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Vista: lista de máquinas
  return (
    <>
      {msg && <div className="info-box info-box--sm"><strong>{msg}</strong></div>}
      <div className="admin-user-list">
        {maquinas.map(maq => (
          <div key={maq.id} className="content-card">
            <div className="content-card__header">
              <div className="content-card__info">
                <h4>{maq.emoji} {maq.nombre}</h4>
                <p>{maq.categoria} · {maq.ejercicios?.length ?? 0} ejercicios</p>
              </div>
              <button className="btn btn--outline btn--sm" onClick={() => setMaquinaActiva(maq)}>
                Gestionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Tab Rutinas ───────────────────────────────────────────────
const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function TabRutinas() {
  const { rutinas } = useGymData()
  const [grupoActivo, setGrupoActivo] = useState('A')
  const [diaEditando, setDiaEditando] = useState(null)
  const [formDia,     setFormDia]     = useState(null)
  const [guardando,   setGuardando]   = useState(false)
  const [msg,         setMsg]         = useState('')

  function mostrarMsg(texto) { setMsg(texto); setTimeout(() => setMsg(''), 3000) }

  function abrirDia(diaInfo) {
    setDiaEditando(diaInfo.dia)
    setFormDia({
      dia: diaInfo.dia,
      foco: diaInfo.foco,
      ejercicios: diaInfo.ejercicios.map(e => ({ n: e.n, s: e.s }))
    })
  }

  function setEjercicio(idx, campo, valor) {
    setFormDia(p => {
      const ejs = [...p.ejercicios]
      ejs[idx] = { ...ejs[idx], [campo]: valor }
      return { ...p, ejercicios: ejs }
    })
  }

  function agregarEjercicio() {
    setFormDia(p => ({ ...p, ejercicios: [...p.ejercicios, { n: '', s: '' }] }))
  }

  function quitarEjercicio(idx) {
    setFormDia(p => ({ ...p, ejercicios: p.ejercicios.filter((_, i) => i !== idx) }))
  }

  async function guardarDia() {
    setGuardando(true)
    try {
      const idx = DIAS_ORDEN.indexOf(formDia.dia)
      await guardarDiaRutina(grupoActivo, formDia.dia, { ...formDia, _orden: idx })
      mostrarMsg('Día guardado ✓')
      setDiaEditando(null)
    } catch (e) { mostrarMsg('Error: ' + e.message) }
    setGuardando(false)
  }

  const rutina = rutinas[grupoActivo]
  if (!rutina) return <p className="loading-text">Cargando rutinas...</p>

  return (
    <>
      {msg && <div className="info-box info-box--sm"><strong>{msg}</strong></div>}
      <div className="group-selector">
        {GRUPOS.map(g => (
          <button
            key={g}
            className={`group-btn ${grupoActivo === g ? 'active' : ''}`}
            onClick={() => { setGrupoActivo(g); setDiaEditando(null) }}
          >
            Grupo {g}
          </button>
        ))}
      </div>

      <p className="rutina-nombre">{rutina.nombre}</p>

      <div className="days-list">
        {(rutina.dias ?? []).map(diaInfo => (
          <div key={diaInfo.dia} className="day-card">
            <div className="day-card__header" onClick={() =>
              diaEditando === diaInfo.dia ? setDiaEditando(null) : abrirDia(diaInfo)
            }>
              <div>
                <span className="day-card__label">{diaInfo.dia}</span>
                <h4 className="day-card__foco">{diaInfo.foco}</h4>
              </div>
              <div className="day-card__right">
                <span className="day-card__arrow">{diaEditando === diaInfo.dia ? '▼' : '›'}</span>
              </div>
            </div>

            {diaEditando === diaInfo.dia && formDia && (
              <div className="day-card__body">
                <div className="form-group">
                  <label>Foco del día</label>
                  <input
                    value={formDia.foco}
                    onChange={e => setFormDia(p => ({ ...p, foco: e.target.value }))}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--neon)', fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: 10 }}>
                  EJERCICIOS
                </p>
                {formDia.ejercicios.map((ej, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: 8, marginBottom: 8 }}>
                    <input
                      style={{ background: 'rgba(0,255,106,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }}
                      value={ej.n} onChange={e => setEjercicio(i, 'n', e.target.value)}
                      placeholder="Nombre ejercicio"
                    />
                    <input
                      style={{ background: 'rgba(0,255,106,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }}
                      value={ej.s} onChange={e => setEjercicio(i, 's', e.target.value)}
                      placeholder="4x10"
                    />
                    <button
                      style={{ background: 'rgba(255,61,61,0.1)', border: '1px solid rgba(255,61,61,0.2)', borderRadius: 8, color: 'var(--danger)', cursor: 'pointer', fontSize: 16 }}
                      onClick={() => quitarEjercicio(i)}
                    >×</button>
                  </div>
                ))}
                <button className="btn btn--ghost btn--sm" onClick={agregarEjercicio} style={{ marginBottom: 12 }}>
                  + Agregar ejercicio
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn--primary btn--sm" onClick={guardarDia} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar día'}
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setDiaEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// ── Tab Guía educativa ────────────────────────────────────────
function TabGuia() {
  const { guia } = useGymData()
  const [articuloEditando, setArticuloEditando] = useState(null)
  const [form,             setForm]             = useState(null)
  const [guardando,        setGuardando]        = useState(false)
  const [msg,              setMsg]              = useState('')

  function mostrarMsg(texto) { setMsg(texto); setTimeout(() => setMsg(''), 3000) }

  function abrirArticulo(item) {
    setArticuloEditando(item.id)
    setForm({
      titulo:        item.titulo ?? '',
      emoji:         item.emoji ?? '',
      contenido:     item.contenido ?? '',
      regladeOro:    item.regladeOro ?? '',
      beneficios:    (item.beneficios ?? []).join('\n'),
      erroresComunes:(item.erroresComunes ?? []).join('\n'),
      pasos:         (item.pasos ?? []).join('\n'),
      tips:          (item.tips ?? []).join('\n'),
    })
  }

  async function guardarArticulo() {
    setGuardando(true)
    try {
      const datos = {
        ...form,
        beneficios:     form.beneficios.split('\n').map(s => s.trim()).filter(Boolean),
        erroresComunes: form.erroresComunes.split('\n').map(s => s.trim()).filter(Boolean),
        pasos:          form.pasos.split('\n').map(s => s.trim()).filter(Boolean),
        tips:           form.tips.split('\n').map(s => s.trim()).filter(Boolean),
      }
      await guardarArticuloGuia(articuloEditando, datos)
      mostrarMsg('Artículo guardado ✓')
      setArticuloEditando(null)
    } catch (e) { mostrarMsg('Error: ' + e.message) }
    setGuardando(false)
  }

  return (
    <>
      {msg && <div className="info-box info-box--sm"><strong>{msg}</strong></div>}
      <div className="admin-user-list">
        {guia.map(item => (
          <div key={item.id}>
            <div className="content-card">
              <div className="content-card__header">
                <div className="content-card__info">
                  <h4>{item.emoji} {item.titulo}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.contenido?.slice(0, 80)}...
                  </p>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => articuloEditando === item.id ? setArticuloEditando(null) : abrirArticulo(item)}
                >
                  {articuloEditando === item.id ? 'Cerrar' : 'Editar'}
                </button>
              </div>
            </div>
            {articuloEditando === item.id && form && (
              <div className="edit-panel">
                <p className="edit-panel__title">Editar artículo</p>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Emoji</label>
                    <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Título</label>
                    <input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contenido principal</label>
                  <textarea style={{ minHeight: 100 }} value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Regla de oro (opcional)</label>
                  <input value={form.regladeOro} onChange={e => setForm(p => ({ ...p, regladeOro: e.target.value }))} placeholder="Frase motivacional en comillas..." />
                </div>
                <div className="form-group">
                  <label>Beneficios (uno por línea)</label>
                  <textarea value={form.beneficios} onChange={e => setForm(p => ({ ...p, beneficios: e.target.value }))} placeholder="Más energía&#10;Mejor sueño&#10;..." />
                </div>
                <div className="form-group">
                  <label>Errores comunes (uno por línea)</label>
                  <textarea value={form.erroresComunes} onChange={e => setForm(p => ({ ...p, erroresComunes: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Pasos (uno por línea)</label>
                  <textarea value={form.pasos} onChange={e => setForm(p => ({ ...p, pasos: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Tips (uno por línea)</label>
                  <textarea value={form.tips} onChange={e => setForm(p => ({ ...p, tips: e.target.value }))} />
                </div>
                <div className="edit-panel__actions">
                  <button className="btn btn--primary btn--sm" onClick={guardarArticulo} disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar artículo'}
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setArticuloEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// ── Tab Solicitudes ───────────────────────────────────────────
function TabSolicitudes() {
  const [solicitudes,  setSolicitudes]  = useState([])
  const [cargando,     setCargando]     = useState(true)
  const [procesando,   setProcesando]   = useState(null) // id en proceso
  const [modalRechazo, setModalRechazo] = useState(null) // { id, nombre }
  const [motivo,       setMotivo]       = useState('')
  const [msg,          setMsg]          = useState('')

  useEffect(() => { cargar() }, [])

  async function cargar() {
    setCargando(true)
    try {
      const lista = await obtenerTodasSolicitudes()
      setSolicitudes(lista)
    } catch(e) { setMsg('Error: ' + e.message) }
    setCargando(false)
  }

  function mostrarMsg(txt) { setMsg(txt); setTimeout(() => setMsg(''), 3000) }

  async function aprobar(id) {
    setProcesando(id)
    try {
      await responderSolicitud(id, { estado: 'aprobada', comentarioAdmin: '' })
      setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: 'aprobada' } : s))
      mostrarMsg('✓ Solicitud aprobada')
    } catch(e) { mostrarMsg('Error: ' + e.message) }
    setProcesando(null)
  }

  async function rechazar() {
    if (!modalRechazo || motivo.trim().length < 20) return
    setProcesando(modalRechazo.id)
    try {
      await responderSolicitud(modalRechazo.id, { estado: 'rechazada', comentarioAdmin: motivo.trim() })
      setSolicitudes(prev => prev.map(s => s.id === modalRechazo.id ? { ...s, estado: 'rechazada', comentarioAdmin: motivo.trim() } : s))
      setModalRechazo(null); setMotivo('')
      mostrarMsg('✓ Solicitud rechazada')
    } catch(e) { mostrarMsg('Error: ' + e.message) }
    setProcesando(null)
  }

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente')

  return (
    <>
      {msg && <div className="info-box info-box--sm"><strong>{msg}</strong></div>}
      {cargando ? (
        <p className="loading-text">Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p className="empty-state">No hay solicitudes aún.</p>
      ) : (
        <div>
          {solicitudes.map(s => (
            <div key={s.id} className="solicitud-card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div className="admin-user-card__avatar" style={{ width: 36, height: 36, fontSize: 16 }}>
                  {s.nombreUsuario?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <strong style={{ fontSize: 14 }}>{s.nombreUsuario}</strong>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Grupo {s.grupo} · {s.fechaSolicitud?.toDate?.()?.toLocaleDateString('es') ?? '—'}
                  </p>
                </div>
                <span className={`solicitud-badge solicitud-badge--${s.estado}`} style={{ marginLeft: 'auto' }}>
                  {s.estado}
                </span>
              </div>
              <p style={{ fontSize: 13, marginBottom: 8 }}><strong>Justificación:</strong> {s.justificacion}</p>
              {s.condicionFisica && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <strong>Condición:</strong> {s.condicionFisica}
                </p>
              )}
              {s.comentarioAdmin && (
                <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 8 }}>
                  <strong>Motivo rechazo:</strong> {s.comentarioAdmin}
                </p>
              )}

              {/* Acordeón rutina propuesta */}
              <RutinaAcordeon rutina={s.rutinaPropuesta} />

              {/* Botones solo para pendientes */}
              {s.estado === 'pendiente' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => aprobar(s.id)}
                    disabled={procesando === s.id}
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => { setModalRechazo({ id: s.id, nombre: s.nombreUsuario }); setMotivo('') }}
                    disabled={procesando === s.id}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal rechazo */}
      {modalRechazo && (
        <div className="workout-modal-overlay">
          <div className="workout-modal">
            <h3>Rechazar solicitud</h3>
            <p style={{ marginBottom: 12 }}>Escribe el motivo para <strong>{modalRechazo.nombre}</strong></p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Motivo del rechazo (mínimo 20 caracteres)..."
              style={{ width: '100%', minHeight: 80, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: 10, color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 8 }}
            />
            <span style={{ fontSize: 11, color: motivo.length >= 20 ? 'var(--green-accent)' : 'var(--text-muted)' }}>
              {motivo.length} / 20 mínimo
            </span>
            <div className="workout-modal__actions" style={{ marginTop: 12 }}>
              <button className="btn btn--danger" onClick={rechazar} disabled={motivo.trim().length < 20 || !!procesando}>
                Confirmar rechazo
              </button>
              <button className="btn btn--ghost" onClick={() => setModalRechazo(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function RutinaAcordeon({ rutina }) {
  const [abierto, setAbierto] = useState(false)
  if (!rutina?.length) return null
  return (
    <div style={{ marginTop: 8 }}>
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => setAbierto(a => !a)}
      >
        {abierto ? 'Ocultar rutina' : 'Ver rutina propuesta'}
      </button>
      {abierto && rutina.map((d, i) => (
        <div key={i} style={{ marginTop: 8 }}>
          <strong style={{ fontSize: 13 }}>{d.dia}</strong>
          {d.ejercicios.map((ej, j) => (
            <div key={j} className="ej-row">
              <span className="ej-row__dot" />
              <span className="ej-row__name">{ej.nombre}</span>
              <span className="ej-row__sets">{ej.series}x{ej.reps}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Tab Avisos ────────────────────────────────────────────────
function TabAvisos() {
  const { usuario } = useAuth()
  const [avisos,   setAvisos]   = useState([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm]         = useState({ titulo: '', descripcion: '', tipo: 'info', fechaInicio: '', fechaFin: '' })
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg]           = useState('')

  useEffect(() => { cargar() }, [])

  async function cargar() {
    setCargando(true)
    try { setAvisos(await obtenerTodosAvisos()) } catch {}
    setCargando(false)
  }

  async function handleCrear(e) {
    e.preventDefault()
    if (!form.titulo.trim()) return
    setGuardando(true)
    try {
      await crearAviso({ ...form, creadoPor: usuario?.uid ?? '' })
      setMsg('✓ Aviso publicado')
      setForm({ titulo: '', descripcion: '', tipo: 'info', fechaInicio: '', fechaFin: '' })
      await cargar()
    } catch (err) { setMsg('Error: ' + err.message) }
    setGuardando(false)
  }

  async function handleDesactivar(id) {
    if (!confirm('¿Desactivar este aviso?')) return
    await desactivarAviso(id)
    await cargar()
  }

  const tipoIcon = { info: 'ℹ️', alerta: '⚠️', cierre: '🔒' }

  return (
    <>
      <div className="form-card" style={{marginBottom:24}}>
        <h4 style={{marginBottom:16,fontWeight:800}}>Nuevo aviso</h4>
        <form onSubmit={handleCrear} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input className="form-input" placeholder="Título del aviso *" value={form.titulo} onChange={e=>setForm(p=>({...p,titulo:e.target.value}))} required />
          <textarea className="form-input" placeholder="Descripción (opcional)" rows={3} value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))} style={{resize:'vertical'}} />
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:140}}>
              <label className="form-label">Tipo</label>
              <select className="form-input" value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))}>
                <option value="info">ℹ️ Información</option>
                <option value="alerta">⚠️ Alerta</option>
                <option value="cierre">🔒 Cierre temporal</option>
              </select>
            </div>
            <div style={{flex:1,minWidth:180}}>
              <label className="form-label">Inicio (opcional)</label>
              <input type="datetime-local" className="form-input" value={form.fechaInicio} onChange={e=>setForm(p=>({...p,fechaInicio:e.target.value}))} />
            </div>
            <div style={{flex:1,minWidth:180}}>
              <label className="form-label">Fin (opcional)</label>
              <input type="datetime-local" className="form-input" value={form.fechaFin} onChange={e=>setForm(p=>({...p,fechaFin:e.target.value}))} />
            </div>
          </div>
          {msg && <p style={{color:msg.startsWith('✓')?'var(--neon)':'var(--danger)',fontSize:13}}>{msg}</p>}
          <button className="btn btn--primary" type="submit" disabled={guardando}>{guardando?'Publicando...':'Publicar aviso'}</button>
        </form>
      </div>

      <h4 style={{marginBottom:12,fontWeight:800}}>Historial de avisos</h4>
      {cargando ? <p className="loading-text">Cargando...</p> : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {avisos.length === 0 && <p className="empty-state">Sin avisos publicados aún.</p>}
          {avisos.map(a => (
            <div key={a.id} className="admin-user-card" style={{opacity:a.activo?1:.55}}>
              <span style={{fontSize:22}}>{tipoIcon[a.tipo] ?? 'ℹ️'}</span>
              <div style={{flex:1,minWidth:0}}>
                <strong style={{fontSize:14}}>{a.titulo}</strong>
                {a.descripcion && <p style={{fontSize:12,color:'var(--t500)',margin:'2px 0 4px'}}>{a.descripcion}</p>}
                <div className="tag-list">
                  <span className="tag">{a.tipo}</span>
                  {a.activo ? <span className="tag tag--primary">Activo</span> : <span className="tag">Inactivo</span>}
                  {a.fechaFin && <span className="tag">Vence: {a.fechaFin?.toDate?.().toLocaleString('es-PE') ?? a.fechaFin}</span>}
                </div>
              </div>
              {a.activo && (
                <button className="btn btn--ghost btn--sm" onClick={() => handleDesactivar(a.id)}>Desactivar</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ── Panel principal ───────────────────────────────────────────
export default function Admin() {
  const { esSuperAdmin, refrescarPerfil } = useAuth()
  const [tabActiva,     setTabActiva]     = useState('usuarios')
  const [migrando,      setMigrando]      = useState(false)
  const [msgMigrar,     setMsgMigrar]     = useState('')
  const [nPendientes,   setNPendientes]   = useState(0)

  useEffect(() => {
    // Refrescar rol al montar — detecta cambios hechos en Firestore sin relanzar sesión
    refrescarPerfil?.()
    obtenerTodasSolicitudes()
      .then(lista => setNPendientes(lista.filter(s => s.estado === 'pendiente').length))
      .catch(() => {})
  }, [])

  const TABS = [
    { id: 'usuarios',    label: 'Usuarios' },
    { id: 'maquinas',    label: 'Máquinas' },
    { id: 'rutinas',     label: 'Rutinas' },
    { id: 'guia',        label: 'Guía' },
    { id: 'solicitudes', label: `Solicitudes${nPendientes > 0 ? ` (${nPendientes})` : ''}` },
    { id: 'avisos',      label: '📢 Avisos' },
    { id: 'reportes',    label: '🔧 Reportes' },
    ...(esSuperAdmin ? [{ id: 'editor', label: '⭐ Editor' }] : []),
  ]

  async function handleMigrar() {
    if (!confirm('¿Subir todos los datos estáticos a Firestore? Esto sobreescribirá datos existentes.')) return
    setMigrando(true)
    setMsgMigrar('Migrando datos...')
    try {
      await migrarDatosAFirestore(MAQUINAS_BASE, RUTINAS_BASE, GUIA_BASE)
      setMsgMigrar('✓ Datos migrados correctamente. Recarga la página para ver los cambios.')
    } catch (e) {
      setMsgMigrar('Error: ' + e.message)
    }
    setMigrando(false)
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Panel Admin</h2>
        <p className="page__sub">Gestión completa del Gym Asica Farms</p>
      </div>

      {/* Botón migración */}
      <div className="migrate-box">
        <div className="migrate-box__icon">⬆️</div>
        <div className="migrate-box__body">
          <h4>Inicializar datos en Firestore</h4>
          <p>Sube los datos base (máquinas, rutinas, guía) a Firestore para poder editarlos desde la app. Solo se necesita hacer una vez.</p>
          {msgMigrar && (
            <p className="migrate-box__msg" style={{ color: msgMigrar.startsWith('✓') ? 'var(--g700)' : 'var(--err)' }}>
              {msgMigrar}
            </p>
          )}
          <button className="migrate-btn" onClick={handleMigrar} disabled={migrando}>
            {migrando ? '⏳ Migrando...' : '⬆ Inicializar datos'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${tabActiva === tab.id ? 'active' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de cada tab */}
      {tabActiva === 'usuarios'    && <TabUsuarios />}
      {tabActiva === 'maquinas'    && <TabMaquinas />}
      {tabActiva === 'rutinas'     && <TabRutinas />}
      {tabActiva === 'guia'        && <TabGuia />}
      {tabActiva === 'solicitudes' && <TabSolicitudes />}
      {tabActiva === 'avisos'      && <TabAvisos />}
      {tabActiva === 'reportes'    && <TabReportesAdmin key="reportes-tab" />}
      {tabActiva === 'editor'      && esSuperAdmin && (
        <div>
          <div className="page__header">
            <h3 className="page__title" style={{fontSize:18}}>Editor de Páginas</h3>
            <p className="page__sub">Edita el contenido directamente desde cada sección de la app — sin tocar código.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="form-card">
              <h4 style={{fontWeight:800,marginBottom:8}}>🏠 Inicio</h4>
              <p style={{fontSize:13,color:'var(--t500)',lineHeight:1.5}}>Ve a <strong>Inicio</strong> → botón <strong>"✏️ Modo editor"</strong> → edita el título del hero, subtítulo y las tarjetas de acceso rápido. Guarda con <strong>💾 Guardar</strong>.</p>
            </div>
            <div className="form-card">
              <h4 style={{fontWeight:800,marginBottom:8}}>🏋️ Máquinas</h4>
              <p style={{fontSize:13,color:'var(--t500)',lineHeight:1.5}}>Ve a <strong>Máquinas</strong> → <strong>"✏️ Modo editor"</strong> → clic en cualquier máquina para editar nombre, imágenes, descripción, series, músculos y videos de YouTube.</p>
            </div>
            <div className="form-card">
              <h4 style={{fontWeight:800,marginBottom:8}}>📅 Rutinas</h4>
              <p style={{fontSize:13,color:'var(--t500)',lineHeight:1.5}}>Ve a <strong>Rutinas</strong> → <strong>"✏️ Modo editor"</strong> → selecciona un grupo y día → edita cada ejercicio con ✏️ → guarda con <strong>💾 Guardar [día]</strong>.</p>
            </div>
            <div className="form-card">
              <h4 style={{fontWeight:800,marginBottom:8}}>🏃 Cardio</h4>
              <p style={{fontSize:13,color:'var(--t500)',lineHeight:1.5}}>Ve a <strong>Cardio</strong> → <strong>"✏️ Modo editor"</strong> → edita títulos de rutas, reglas y el mensaje motivacional. Guarda con <strong>💾 Guardar cambios</strong>.</p>
            </div>
            <div className="form-card">
              <h4 style={{fontWeight:800,marginBottom:8}}>📸 URLs de imágenes</h4>
              <p style={{fontSize:13,color:'var(--t500)',lineHeight:1.5}}>Para fotos de ejercicios usa URLs de Unsplash.</p>
              <p style={{fontSize:12,color:'var(--t600)',marginTop:8,fontFamily:'monospace'}}>https://images.unsplash.com/photo-ID?w=600&q=75&auto=format</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab Reportes en Admin ─────────────────────────────────────
const ESTADO_REPORTE = {
  abierto:         { color:'#c0392b', label:'🔴 Abierto' },
  en_revision:     { color:'#92600a', label:'🟡 En revisión' },
  resuelto:        { color:'#2e7d32', label:'🟢 Resuelto' },
  requiere_compra: { color:'#1565c0', label:'🔵 Requiere compra' },
  no_procedente:   { color:'#555',    label:'⚫ No procedente' },
}

function TabReportesAdmin() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [activo, setActivo] = useState(null)
  const [res, setRes] = useState({ eraReal: null, descripcionSolucion:'', queSeNecesito:'' })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => { cargar() }, [])

  async function cargar() {
    setCargando(true)
    try { setReportes(await obtenerTodosReportes()) } catch {}
    setCargando(false)
  }

  async function cambiarEstado(reporte, nuevoEstado) {
    setGuardando(true)
    try {
      await resolverReporte(reporte.id, { estado: nuevoEstado, ...res })
      await cargar()
      setActivo(null)
      setRes({ eraReal: null, descripcionSolucion:'', queSeNecesito:'' })
    } catch (e) { alert('Error: ' + e.message) }
    setGuardando(false)
  }

  if (cargando) return <div style={{textAlign:'center',padding:'32px',color:'var(--t500)'}}>Cargando reportes...</div>

  if (activo) {
    const r = activo
    const est = ESTADO_REPORTE[r.estado]
    return (
      <div>
        <button className="back-btn" onClick={() => setActivo(null)}>← Volver</button>
        <div className="card" style={{marginTop:16}}>
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:12}}>
            <div>
              <span style={{fontSize:11,fontWeight:700,color:'var(--t500)',textTransform:'uppercase'}}>{r.categoria}</span>
              <h3 style={{fontSize:15,fontWeight:800,marginTop:4}}>{r.titulo}</h3>
              <p style={{fontSize:12,color:'var(--t500)'}}>De: {r.nombreUsuario} · {r.fechaReporte?.toDate?.()?.toLocaleDateString('es-PE')}</p>
            </div>
            <span style={{color:est?.color,fontSize:13,fontWeight:700}}>{est?.label}</span>
          </div>
          <p style={{fontSize:13.5,lineHeight:1.6,marginBottom:12}}>{r.descripcion}</p>
          {r.fotoBase64 && <img src={r.fotoBase64} alt="evidencia" style={{maxWidth:'100%',maxHeight:220,borderRadius:'var(--r12)',objectFit:'cover',marginBottom:12}} />}

          {(r.estado === 'abierto' || r.estado === 'en_revision') && (
            <div style={{borderTop:'1px solid var(--bd)',paddingTop:16,marginTop:8}}>
              <h4 style={{fontSize:14,fontWeight:800,marginBottom:12}}>Proceso de resolución</h4>
              {r.estado === 'abierto' && (
                <button className="btn btn--outline btn--sm" style={{marginBottom:16}} onClick={() => cambiarEstado(r,'en_revision')} disabled={guardando}>👁️ Marcar "En revisión"</button>
              )}
              <div style={{marginBottom:12}}>
                <p style={{fontSize:13,fontWeight:700,marginBottom:8}}>¿Era real el problema al revisarlo?</p>
                <div style={{display:'flex',gap:8}}>
                  <button className={`btn btn--sm ${res.eraReal===true?'btn--primary':'btn--outline'}`} onClick={() => setRes(p=>({...p,eraReal:true}))}>Sí, confirmado</button>
                  <button className={`btn btn--sm ${res.eraReal===false?'btn--primary':'btn--outline'}`} onClick={() => setRes(p=>({...p,eraReal:false}))}>No procedente</button>
                </div>
              </div>
              {res.eraReal === false && (
                <div className="form-group">
                  <label className="form-label">Motivo</label>
                  <input className="form-input" value={res.descripcionSolucion} onChange={e=>setRes(p=>({...p,descripcionSolucion:e.target.value}))} placeholder="No se encontró el problema..." />
                  <button className="btn btn--primary btn--sm" style={{marginTop:10}} onClick={() => cambiarEstado(r,'no_procedente')} disabled={guardando}>Cerrar como no procedente</button>
                </div>
              )}
              {res.eraReal === true && (
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="form-group">
                    <label className="form-label">¿Cómo lo solucionaste? (dejar vacío si no está resuelto)</label>
                    <textarea className="form-input" rows={2} value={res.descripcionSolucion} onChange={e=>setRes(p=>({...p,descripcionSolucion:e.target.value}))} placeholder="Se reparó el agarre..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">¿Qué se necesitó o se necesita?</label>
                    <input className="form-input" value={res.queSeNecesito} onChange={e=>setRes(p=>({...p,queSeNecesito:e.target.value}))} placeholder="Tornillos M8, técnico de mantenimiento..." />
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button className="btn btn--primary btn--sm" onClick={() => cambiarEstado(r,'resuelto')} disabled={guardando}>✅ Resuelto</button>
                    <button className="btn btn--outline btn--sm" onClick={() => cambiarEstado(r,'requiere_compra')} disabled={guardando}>🛒 Requiere compra/gestión</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const pendientes = reportes.filter(r => r.estado === 'abierto' || r.estado === 'en_revision')
  const historico  = reportes.filter(r => r.estado !== 'abierto' && r.estado !== 'en_revision')

  return (
    <div>
      {reportes.length === 0 && <p style={{color:'var(--t500)',textAlign:'center',padding:'32px 0'}}>Sin reportes todavía</p>}
      {pendientes.length > 0 && (
        <div style={{marginBottom:20}}>
          <h4 style={{fontSize:12,fontWeight:800,color:'var(--err)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10}}>Pendientes ({pendientes.length})</h4>
          {pendientes.map(r => <ReporteRow key={r.id} r={r} onClick={() => setActivo(r)} />)}
        </div>
      )}
      {historico.length > 0 && (
        <div>
          <h4 style={{fontSize:12,fontWeight:800,color:'var(--t500)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10}}>Historial ({historico.length})</h4>
          {historico.map(r => <ReporteRow key={r.id} r={r} onClick={() => setActivo(r)} />)}
        </div>
      )}
    </div>
  )
}

function ReporteRow({ r, onClick }) {
  const e = ESTADO_REPORTE[r.estado] ?? ESTADO_REPORTE.abierto
  return (
    <button className="exercise-row" style={{width:'100%',textAlign:'left',marginBottom:8}} onClick={onClick}>
      <div className="exercise-row__info" style={{flex:1}}>
        <h4 style={{fontSize:13.5}}>{r.titulo}</h4>
        <p style={{fontSize:12,color:'var(--t500)',marginTop:2}}>{r.nombreUsuario} · {r.fechaReporte?.toDate?.()?.toLocaleDateString('es-PE')}</p>
      </div>
      <span style={{color:e.color,fontSize:12,fontWeight:700,flexShrink:0,marginRight:8}}>{e.label}</span>
      <span className="exercise-row__arrow">›</span>
    </button>
  )
}
