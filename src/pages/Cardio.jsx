// ============================================================
// PÁGINA: Cardio — Rutas al aire libre en Asica Farms
// Ruta 1: Oficinas ↔ Garita (1.2km x2 = 2.4km, plano)
// Ruta 2: Cancha de fútbol (200m/vuelta) con calculadora de calorías
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { guardarSesionCardio, obtenerContenidoApp, guardarContenidoApp } from '../services/dbService'

// MET y velocidad por ritmo
const MET = { caminando: 3.5, trotando: 7.0, corriendo: 10.0 }
const VEL_KMH = { caminando: 5, trotando: 8, corriendo: 12 }

const RITMO_LABELS = {
  caminando: 'Caminando',
  trotando:  'Trotando',
  corriendo: 'Corriendo'
}

const DEFAULT_CONTENIDO = {
  ruta1: {
    titulo:     'Ruta 1 — Oficinas → Garita',
    distancia:  '2.4 km total',
    terreno:    'Terreno plano',
    idaVuelta:  '1.2 km ida · 1.2 km vuelta',
    reglas: [
      'Solo por el camino principal — no desviarse hacia el cultivo',
      'Hacer la caminata solo en horario autorizado',
      'Si hay poca luz: llevar linterna o celular con linterna encendida (obligatorio)',
      'Si usas audífonos: solo uno y con volumen bajo — estar siempre atento al entorno',
    ],
    motivacion: 'Una idea: intenta hacer esta caminata sin música ni celular. Desconéctate del ruido digital y conecta con la naturaleza, el viento y el silencio del campo. Caminar sin audífonos es una de las formas más poderosas de despejar la mente y recargar energía. El camino también cura.',
  },
  ruta2: {
    titulo:    'Ruta 2 — Cancha de Fútbol',
    distancia: '200 m por vuelta',
    tipo:      'Perimetral',
  }
}

function calcularCardio(vueltas, ritmo, pesoKg) {
  const distanciaKm  = +(vueltas * 0.2).toFixed(2)
  const tiempoHoras  = distanciaKm / VEL_KMH[ritmo]
  const calorias     = Math.round(MET[ritmo] * (pesoKg || 70) * tiempoHoras)
  const tiempoMinutos = Math.round(tiempoHoras * 60)
  return { distanciaKm, tiempoMinutos, calorias }
}

// ── Modal registro ruta garita ─────────────────────────────────
function ModalGarita({ pesoRef, onGuardar, onCancelar, guardando }) {
  const [minutos, setMinutos] = useState('')
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-box__title">Registrar caminata Garita</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Ruta: Oficinas ↔ Garita — 2.4 km total
        </p>
        <div className="form-group">
          <label>¿Cuántos minutos tardaste?</label>
          <input
            type="number"
            min="1"
            placeholder="30"
            value={minutos}
            onChange={e => setMinutos(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-box__actions">
          <button
            className="btn btn--primary"
            onClick={() => onGuardar(parseInt(minutos) || 30)}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar en mi perfil'}
          </button>
          <button className="btn btn--ghost" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ── Campo editable inline ─────────────────────────────────────
function EditField({ label, value, onChange, multiline }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p className="cardio-edit-label">{label}</p>
      {multiline ? (
        <textarea
          className="cardio-edit-input"
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className="cardio-edit-input"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export default function Cardio() {
  const { usuario, perfil, esAdmin } = useAuth()
  const navigate = useNavigate()

  // Calculadora cancha
  const [vueltas,      setVueltas]      = useState(5)
  const [ritmo,        setRitmo]        = useState('caminando')
  const [guardando,    setGuardando]    = useState(false)
  const [guardado,     setGuardado]     = useState(null)
  const [modalGarita,  setModalGarita]  = useState(false)

  // Editor CMS
  const [modoEdicion,  setModoEdicion]  = useState(false)
  const [contenido,    setContenido]    = useState(DEFAULT_CONTENIDO)
  const [editData,     setEditData]     = useState(null)
  const [guardandoCMS, setGuardandoCMS] = useState(false)
  const [guardadoCMS,  setGuardadoCMS]  = useState(false)

  useEffect(() => {
    obtenerContenidoApp('cardio')
      .then(data => {
        if (data) setContenido({ ...DEFAULT_CONTENIDO, ...data })
      })
      .catch(() => {})
  }, [])

  function activarEditor() {
    setEditData(JSON.parse(JSON.stringify(contenido))) // deep copy
    setModoEdicion(true)
  }

  function cancelarEditor() {
    setModoEdicion(false)
    setEditData(null)
  }

  async function guardarCMS() {
    setGuardandoCMS(true)
    try {
      await guardarContenidoApp('cardio', editData)
      setContenido(editData)
      setModoEdicion(false)
      setGuardadoCMS(true)
      setTimeout(() => setGuardadoCMS(false), 3500)
    } catch (e) { console.error(e) }
    setGuardandoCMS(false)
  }

  function updateRuta(ruta, field, val) {
    setEditData(prev => ({
      ...prev,
      [ruta]: { ...prev[ruta], [field]: val }
    }))
  }

  function updateRegla(i, val) {
    setEditData(prev => {
      const nuevas = [...prev.ruta1.reglas]
      nuevas[i] = val
      return { ...prev, ruta1: { ...prev.ruta1, reglas: nuevas } }
    })
  }

  function addRegla() {
    setEditData(prev => ({
      ...prev,
      ruta1: { ...prev.ruta1, reglas: [...prev.ruta1.reglas, 'Nueva regla'] }
    }))
  }

  function removeRegla(i) {
    setEditData(prev => {
      const nuevas = prev.ruta1.reglas.filter((_, idx) => idx !== i)
      return { ...prev, ruta1: { ...prev.ruta1, reglas: nuevas } }
    })
  }

  const peso = parseFloat(perfil?.peso) || 70
  const calculo = calcularCardio(vueltas, ritmo, peso)

  async function guardarCancha() {
    if (!usuario) { navigate('/login'); return }
    setGuardando(true)
    try {
      await guardarSesionCardio(usuario.uid, {
        tipo:            'cancha',
        distanciaKm:     calculo.distanciaKm,
        duracionMinutos: calculo.tiempoMinutos,
        calorias:        calculo.calorias,
        ritmo,
        vueltas
      })
      setGuardado('cancha')
      setTimeout(() => setGuardado(null), 4000)
    } catch (e) { console.error(e) }
    setGuardando(false)
  }

  async function guardarGarita(minutos) {
    if (!usuario) { navigate('/login'); return }
    setGuardando(true)
    try {
      const tiempoHoras  = minutos / 60
      const calorias     = Math.round(MET['caminando'] * peso * tiempoHoras)
      await guardarSesionCardio(usuario.uid, {
        tipo:            'garita',
        distanciaKm:     2.4,
        duracionMinutos: minutos,
        calorias,
        ritmo:           'caminando'
      })
      setModalGarita(false)
      setGuardado('garita')
      setTimeout(() => setGuardado(null), 4000)
    } catch (e) { console.error(e) }
    setGuardando(false)
  }

  const c  = contenido  // datos activos (guardados)
  const ed = editData   // datos en edición

  return (
    <div className="page">
      <div className="page__header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h2 className="page__title">Cardio al Aire Libre 🏃</h2>
          <p className="page__sub">Dos rutas disponibles en Asica Farms</p>
        </div>
        {esAdmin && (
          <button
            className={`btn btn--sm ${modoEdicion ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => modoEdicion ? cancelarEditor() : activarEditor()}
          >
            {modoEdicion ? '✕ Cancelar' : '✏️ Modo editor'}
          </button>
        )}
      </div>

      {modoEdicion && (
        <div className="editor-banner">
          ✏️ Modo editor activo — edita el contenido y pulsa <strong>Guardar cambios</strong>
          <span style={{float:'right'}}>
            <button className="btn btn--primary btn--sm" onClick={guardarCMS} disabled={guardandoCMS}>
              {guardandoCMS ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
          </span>
        </div>
      )}

      {guardadoCMS && <div className="toast-ok">✓ Contenido guardado correctamente</div>}

      {/* ── RUTA 1: GARITA ──────────────────────────────────── */}
      <div className="cardio-ruta-card">
        <div className="cardio-ruta-card__header">
          <div className="cardio-ruta-card__icon">🚶</div>
          <div style={{flex:1}}>
            {modoEdicion ? (
              <input
                className="cardio-edit-input"
                value={ed.ruta1.titulo}
                onChange={e => updateRuta('ruta1', 'titulo', e.target.value)}
              />
            ) : (
              <h3 className="cardio-ruta-card__title">{c.ruta1.titulo}</h3>
            )}
            <div className="cardio-ruta-card__meta">
              {modoEdicion ? (
                <>
                  <input className="cardio-edit-input" style={{width:'auto',display:'inline'}}
                    value={ed.ruta1.distancia} onChange={e => updateRuta('ruta1','distancia',e.target.value)} />
                  <input className="cardio-edit-input" style={{width:'auto',display:'inline'}}
                    value={ed.ruta1.terreno} onChange={e => updateRuta('ruta1','terreno',e.target.value)} />
                  <input className="cardio-edit-input" style={{width:'auto',display:'inline'}}
                    value={ed.ruta1.idaVuelta} onChange={e => updateRuta('ruta1','idaVuelta',e.target.value)} />
                </>
              ) : (
                <>
                  <span className="cardio-meta-pill">📍 {c.ruta1.distancia}</span>
                  <span className="cardio-meta-pill">🏔️ {c.ruta1.terreno}</span>
                  <span className="cardio-meta-pill">↔️ {c.ruta1.idaVuelta}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reglas */}
        <div className="cardio-reglas">
          <p className="cardio-reglas__titulo">📋 Reglas importantes</p>
          {modoEdicion ? (
            <div>
              {ed.ruta1.reglas.map((r, i) => (
                <div key={i} style={{display:'flex',gap:6,marginBottom:6}}>
                  <input
                    className="cardio-edit-input"
                    style={{flex:1,marginBottom:0}}
                    value={r}
                    onChange={e => updateRegla(i, e.target.value)}
                  />
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => removeRegla(i)}
                    style={{flexShrink:0}}
                  >✕</button>
                </div>
              ))}
              <button className="btn btn--ghost btn--sm" onClick={addRegla} style={{marginTop:4}}>
                + Agregar regla
              </button>
            </div>
          ) : (
            <ul className="cardio-reglas__lista">
              {c.ruta1.reglas.map((r, i) => (
                <li key={i}>{i < 2 ? '✅' : i === 2 ? '⚠️' : '🎧'} {r}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Mensaje motivacional */}
        <div className="cardio-motivacion">
          {modoEdicion ? (
            <>
              <p className="cardio-edit-label">Mensaje motivacional</p>
              <textarea
                className="cardio-edit-input"
                rows={4}
                value={ed.ruta1.motivacion}
                onChange={e => updateRuta('ruta1', 'motivacion', e.target.value)}
              />
            </>
          ) : (
            <p className="cardio-motivacion__texto">
              💚 <strong>Una idea:</strong> {c.ruta1.motivacion}
            </p>
          )}
        </div>

        {!modoEdicion && guardado === 'garita' && (
          <div className="cardio-guardado">✓ ¡Caminata registrada en tu perfil!</div>
        )}

        {!modoEdicion && (
          <>
            <button
              className="btn btn--primary btn--full"
              onClick={() => usuario ? setModalGarita(true) : navigate('/login')}
              style={{ marginTop: 12 }}
            >
              ✓ Registrar caminata
            </button>
            {!usuario && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
                Inicia sesión para guardar en tu perfil
              </p>
            )}
          </>
        )}
      </div>

      {/* ── RUTA 2: CANCHA ──────────────────────────────────── */}
      <div className="cardio-ruta-card">
        <div className="cardio-ruta-card__header">
          <div className="cardio-ruta-card__icon">⚽</div>
          <div style={{flex:1}}>
            {modoEdicion ? (
              <input
                className="cardio-edit-input"
                value={ed.ruta2.titulo}
                onChange={e => updateRuta('ruta2', 'titulo', e.target.value)}
              />
            ) : (
              <h3 className="cardio-ruta-card__title">{c.ruta2.titulo}</h3>
            )}
            <div className="cardio-ruta-card__meta">
              {modoEdicion ? (
                <>
                  <input className="cardio-edit-input" style={{width:'auto',display:'inline'}}
                    value={ed.ruta2.distancia} onChange={e => updateRuta('ruta2','distancia',e.target.value)} />
                  <input className="cardio-edit-input" style={{width:'auto',display:'inline'}}
                    value={ed.ruta2.tipo} onChange={e => updateRuta('ruta2','tipo',e.target.value)} />
                </>
              ) : (
                <>
                  <span className="cardio-meta-pill">📍 {c.ruta2.distancia}</span>
                  <span className="cardio-meta-pill">🔄 {c.ruta2.tipo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Calculadora (solo visible fuera del modo editor) */}
        {!modoEdicion && (
          <>
            <div className="cardio-calculadora">
              <p className="cardio-calculadora__titulo">🔢 Calculadora de calorías</p>

              <div className="cardio-calc-row">
                <label>Número de vueltas</label>
                <div className="cardio-stepper">
                  <button onClick={() => setVueltas(v => Math.max(1, v - 1))} className="cardio-stepper__btn">−</button>
                  <span className="cardio-stepper__val">{vueltas}</span>
                  <button onClick={() => setVueltas(v => Math.min(50, v + 1))} className="cardio-stepper__btn">+</button>
                </div>
              </div>

              <div className="cardio-calc-row">
                <label>Ritmo</label>
                <div className="cardio-ritmo-selector">
                  {Object.keys(MET).map(r => (
                    <button
                      key={r}
                      className={`cardio-ritmo-btn ${ritmo === r ? 'active' : ''}`}
                      onClick={() => setRitmo(r)}
                    >
                      {r === 'caminando' ? '🚶' : r === 'trotando' ? '🏃' : '⚡'} {RITMO_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cardio-resultados">
                <div className="cardio-resultado-item">
                  <span className="cardio-resultado-item__val">{calculo.distanciaKm}</span>
                  <span className="cardio-resultado-item__lbl">km recorridos</span>
                </div>
                <div className="cardio-resultado-item">
                  <span className="cardio-resultado-item__val">{calculo.tiempoMinutos}</span>
                  <span className="cardio-resultado-item__lbl">minutos est.</span>
                </div>
                <div className="cardio-resultado-item cardio-resultado-item--calorias">
                  <span className="cardio-resultado-item__val">~{calculo.calorias}</span>
                  <span className="cardio-resultado-item__lbl">kcal quemadas</span>
                </div>
              </div>

              {perfil?.peso && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                  Calculado para {peso} kg · Estimación aproximada según fórmula MET
                </p>
              )}
              {!perfil?.peso && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                  Calculado con peso referencia 70 kg · <a href="/perfil" style={{color:'var(--neon)'}}>Actualiza tu peso</a> para mayor precisión
                </p>
              )}
            </div>

            {guardado === 'cancha' && (
              <div className="cardio-guardado">✓ ¡Sesión de cardio guardada en tu perfil!</div>
            )}

            <button
              className="btn btn--primary btn--full"
              onClick={guardarCancha}
              disabled={guardando}
              style={{ marginTop: 12 }}
            >
              {guardando ? 'Guardando...' : '💾 Guardar en mi perfil'}
            </button>
            {!usuario && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
                Inicia sesión para guardar en tu perfil
              </p>
            )}
          </>
        )}
      </div>

      {/* Modal garita */}
      {modalGarita && (
        <ModalGarita
          pesoRef={peso}
          onGuardar={guardarGarita}
          onCancelar={() => setModalGarita(false)}
          guardando={guardando}
        />
      )}
    </div>
  )
}
