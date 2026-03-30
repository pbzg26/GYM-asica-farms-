import { useState } from 'react'
import { guardarMaquina, guardarEjercicio, eliminarEjercicio, eliminarMaquina } from '../services/dbService'

const MUSCULOS_LISTA = [
  'Pecho','Pecho superior','Pecho inferior',
  'Espalda','Dorsal','Trapecio','Romboides',
  'Hombros','Deltoides frontal','Deltoides lateral','Deltoides posterior',
  'Bíceps','Tríceps','Antebrazos',
  'Cuádriceps','Isquiotibiales','Glúteos','Aductores','Abductores',
  'Gemelos','Sóleo',
  'Core','Abdominales','Oblicuos','Espalda baja'
]

const DIFICULTADES = ['Principiante','Intermedio','Avanzado']
const CATEGORIAS_LISTA = ['Maquinaria','Peso libre','Calistenia','Accesorios']

function FormEjercicio({ ejercicio, maquinaId, onGuardado, onCancelar }) {
  const [form, setForm] = useState({
    nombre: ejercicio?.nombre ?? '',
    descripcion: ejercicio?.descripcion ?? '',
    advertencia: ejercicio?.advertencia ?? '',
    series: ejercicio?.series ?? '3',
    repeticiones: ejercicio?.repeticiones ?? '10-12',
    descanso: ejercicio?.descanso ?? '60 seg',
    dificultad: ejercicio?.dificultad ?? 'Principiante',
    videoYoutube: ejercicio?.videoYoutube ?? '',
    fotosTexto: ejercicio?.fotos?.join('\n') ?? '',
    musculosPrincipales: ejercicio?.musculosPrincipales ?? [],
    musculosSecundarios: ejercicio?.musculosSecundarios ?? [],
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function toggleMusculo(lista, musculo) {
    const key = lista === 'principales' ? 'musculosPrincipales' : 'musculosSecundarios'
    setForm(f => ({
      ...f,
      [key]: f[key].includes(musculo)
        ? f[key].filter(m => m !== musculo)
        : [...f[key], musculo]
    }))
  }

  async function handleGuardar() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setGuardando(true); setError('')
    try {
      const datos = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        advertencia: form.advertencia.trim(),
        series: form.series.trim(),
        repeticiones: form.repeticiones.trim(),
        descanso: form.descanso.trim(),
        dificultad: form.dificultad,
        videoYoutube: form.videoYoutube.trim(),
        fotos: form.fotosTexto.split('\n').map(u => u.trim()).filter(Boolean),
        musculosPrincipales: form.musculosPrincipales,
        musculosSecundarios: form.musculosSecundarios,
      }
      await guardarEjercicio(maquinaId, ejercicio?.id ?? null, datos)
      onGuardado()
    } catch (e) {
      setError('Error al guardar: ' + e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="modal-editor__form">
      <h4 style={{marginBottom:16,color:'var(--t100)'}}>
        {ejercicio ? `Editar: ${ejercicio.nombre}` : 'Nuevo ejercicio'}
      </h4>

      <div className="form-group">
        <label className="form-label">Nombre *</label>
        <input className="form-input" value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Sentadilla con barra" />
      </div>
      <div className="form-group">
        <label className="form-label">Descripción (técnica)</label>
        <textarea className="form-input" rows={3} value={form.descripcion} onChange={e => setForm(f=>({...f,descripcion:e.target.value}))} placeholder="Cómo ejecutar el ejercicio correctamente..." />
      </div>
      <div className="form-group">
        <label className="form-label">Advertencia / precaución</label>
        <input className="form-input" value={form.advertencia} onChange={e => setForm(f=>({...f,advertencia:e.target.value}))} placeholder="Ej: No redondees la espalda..." />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        <div className="form-group">
          <label className="form-label">Series</label>
          <input className="form-input" value={form.series} onChange={e => setForm(f=>({...f,series:e.target.value}))} placeholder="4" />
        </div>
        <div className="form-group">
          <label className="form-label">Repeticiones</label>
          <input className="form-input" value={form.repeticiones} onChange={e => setForm(f=>({...f,repeticiones:e.target.value}))} placeholder="8-12" />
        </div>
        <div className="form-group">
          <label className="form-label">Descanso</label>
          <input className="form-input" value={form.descanso} onChange={e => setForm(f=>({...f,descanso:e.target.value}))} placeholder="90 seg" />
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <div className="form-group">
          <label className="form-label">Dificultad</label>
          <select className="form-input" value={form.dificultad} onChange={e => setForm(f=>({...f,dificultad:e.target.value}))}>
            {DIFICULTADES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Link YouTube</label>
          <input className="form-input" value={form.videoYoutube} onChange={e => setForm(f=>({...f,videoYoutube:e.target.value}))} placeholder="https://youtube.com/watch?v=..." />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Fotos (URLs — una por línea)</label>
        <textarea className="form-input" rows={3} value={form.fotosTexto} onChange={e => setForm(f=>({...f,fotosTexto:e.target.value}))} placeholder={"https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."} />
      </div>

      <div className="form-group">
        <label className="form-label">Músculos principales</label>
        <div className="muscle-chips">
          {MUSCULOS_LISTA.map(m => (
            <button key={m} type="button"
              className={`chip ${form.musculosPrincipales.includes(m) ? 'chip--active' : ''}`}
              onClick={() => toggleMusculo('principales', m)}>{m}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Músculos secundarios</label>
        <div className="muscle-chips">
          {MUSCULOS_LISTA.map(m => (
            <button key={m} type="button"
              className={`chip ${form.musculosSecundarios.includes(m) ? 'chip--active chip--sec' : ''}`}
              onClick={() => toggleMusculo('secundarios', m)}>{m}</button>
          ))}
        </div>
      </div>

      {error && <p style={{color:'var(--err)',fontSize:13,margin:'8px 0'}}>{error}</p>}

      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button className="btn btn--primary btn--sm" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : '✅ Guardar ejercicio'}
        </button>
        <button className="btn btn--ghost btn--sm" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default function ModalEditarMaquina({ maquina, onCerrar, onActualizar }) {
  const [vistaActiva, setVistaActiva] = useState('info') // 'info' | 'ejercicios' | 'nuevo-ejercicio' | form-ejercicio
  const [ejercicioEditando, setEjercicioEditando] = useState(null)
  const [formMaquina, setFormMaquina] = useState({
    nombre: maquina?.nombre ?? '',
    categoria: maquina?.categoria ?? 'Maquinaria',
    emoji: maquina?.emoji ?? '🏋️',
    imagen: maquina?.imagen ?? '',
  })
  const [guardandoMaquina, setGuardandoMaquina] = useState(false)
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null)
  const [msgOk, setMsgOk] = useState('')
  const esNueva = !maquina?.id

  async function handleGuardarMaquina() {
    if (!formMaquina.nombre.trim()) return
    setGuardandoMaquina(true)
    try {
      const id = maquina?.id ?? formMaquina.nombre.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
      await guardarMaquina(id, {
        nombre: formMaquina.nombre.trim(),
        categoria: formMaquina.categoria,
        emoji: formMaquina.emoji.trim() || '🏋️',
        imagen: formMaquina.imagen.trim(),
      })
      setMsgOk('✅ Máquina guardada')
      setTimeout(() => setMsgOk(''), 2500)
      await onActualizar()
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setGuardandoMaquina(false)
    }
  }

  async function handleEliminarEjercicio(ej) {
    setConfirmandoEliminar(null)
    try {
      await eliminarEjercicio(maquina.id, ej.id)
      setMsgOk('🗑️ Ejercicio eliminado')
      setTimeout(() => setMsgOk(''), 2000)
      await onActualizar()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  async function handleEliminarMaquina() {
    if (!window.confirm(`¿Eliminar la máquina "${maquina.nombre}" y todos sus ejercicios?`)) return
    try {
      await eliminarMaquina(maquina.id)
      await onActualizar()
      onCerrar()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onCerrar() }}>
      <div className="modal-editor">
        {/* Header */}
        <div className="modal-editor__header">
          <h3>{esNueva ? 'Nueva máquina' : `Editar: ${maquina.nombre}`}</h3>
          <button className="modal-editor__close" onClick={onCerrar}>✕</button>
        </div>

        {/* Tabs */}
        {!esNueva && (
          <div className="modal-editor__tabs">
            <button className={`modal-editor__tab ${vistaActiva==='info'?'active':''}`} onClick={()=>setVistaActiva('info')}>Info</button>
            <button className={`modal-editor__tab ${vistaActiva==='ejercicios'?'active':''}`} onClick={()=>setVistaActiva('ejercicios')}>Ejercicios ({maquina.ejercicios?.length ?? 0})</button>
            <button className={`modal-editor__tab ${vistaActiva==='nuevo-ejercicio'?'active':''}`} onClick={()=>setVistaActiva('nuevo-ejercicio')}>+ Nuevo ejercicio</button>
          </div>
        )}

        {/* Body */}
        <div className="modal-editor__body">
          {msgOk && <div className="toast-ok">{msgOk}</div>}

          {/* Vista: info de la máquina */}
          {(vistaActiva === 'info' || esNueva) && (
            <div>
              <div className="form-group">
                <label className="form-label">Nombre de la máquina *</label>
                <input className="form-input" value={formMaquina.nombre} onChange={e=>setFormMaquina(f=>({...f,nombre:e.target.value}))} placeholder="Ej: Rack de Potencia" />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-input" value={formMaquina.categoria} onChange={e=>setFormMaquina(f=>({...f,categoria:e.target.value}))}>
                    {CATEGORIAS_LISTA.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input className="form-input" value={formMaquina.emoji} onChange={e=>setFormMaquina(f=>({...f,emoji:e.target.value}))} placeholder="🏋️" maxLength={4} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL imagen de portada</label>
                <input className="form-input" value={formMaquina.imagen} onChange={e=>setFormMaquina(f=>({...f,imagen:e.target.value}))} placeholder="https://images.unsplash.com/photo-..." />
                {formMaquina.imagen && (
                  <img src={formMaquina.imagen} alt="preview" style={{marginTop:8,height:80,borderRadius:8,objectFit:'cover'}} onError={e=>e.target.style.display='none'} />
                )}
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}>
                <button className="btn btn--primary btn--sm" onClick={handleGuardarMaquina} disabled={guardandoMaquina}>
                  {guardandoMaquina ? 'Guardando...' : '✅ Guardar máquina'}
                </button>
                {!esNueva && (
                  <button className="btn btn--sm" style={{background:'var(--err)',color:'#fff'}} onClick={handleEliminarMaquina}>
                    🗑️ Eliminar máquina
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Vista: lista de ejercicios */}
          {vistaActiva === 'ejercicios' && !esNueva && (
            <div>
              {maquina.ejercicios?.length === 0 && (
                <p style={{color:'var(--t500)',textAlign:'center',padding:'24px 0'}}>Sin ejercicios aún. Agrega uno en la pestaña "+ Nuevo ejercicio".</p>
              )}
              {maquina.ejercicios?.map(ej => (
                <div key={ej.id} className="modal-ejercicio-row">
                  {ejercicioEditando?.id === ej.id ? (
                    <FormEjercicio
                      ejercicio={ej}
                      maquinaId={maquina.id}
                      onGuardado={async () => { setEjercicioEditando(null); setMsgOk('✅ Guardado'); setTimeout(()=>setMsgOk(''),2000); await onActualizar() }}
                      onCancelar={() => setEjercicioEditando(null)}
                    />
                  ) : (
                    <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'space-between',flexWrap:'wrap'}}>
                      <div>
                        <strong style={{fontSize:14}}>{ej.nombre}</strong>
                        <span style={{marginLeft:8,fontSize:12,color:'var(--t500)'}}>{ej.series}×{ej.repeticiones} · {ej.dificultad}</span>
                      </div>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn--ghost btn--sm" onClick={() => setEjercicioEditando(ej)}>✏️ Editar</button>
                        {confirmandoEliminar?.id === ej.id ? (
                          <>
                            <button className="btn btn--sm" style={{background:'var(--err)',color:'#fff'}} onClick={() => handleEliminarEjercicio(ej)}>Confirmar</button>
                            <button className="btn btn--ghost btn--sm" onClick={() => setConfirmandoEliminar(null)}>Cancelar</button>
                          </>
                        ) : (
                          <button className="btn btn--ghost btn--sm" style={{color:'var(--err)'}} onClick={() => setConfirmandoEliminar(ej)}>🗑️</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vista: nuevo ejercicio */}
          {vistaActiva === 'nuevo-ejercicio' && !esNueva && (
            <FormEjercicio
              ejercicio={null}
              maquinaId={maquina.id}
              onGuardado={async () => { setVistaActiva('ejercicios'); setMsgOk('✅ Ejercicio agregado'); setTimeout(()=>setMsgOk(''),2000); await onActualizar() }}
              onCancelar={() => setVistaActiva('ejercicios')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
