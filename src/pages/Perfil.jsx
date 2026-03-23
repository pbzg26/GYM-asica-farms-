// ============================================================
// PÁGINA: Perfil — tabs: perfil | salud | graficas | historial
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  actualizarPerfil, guardarMedidas, obtenerHistorialRutinas,
  guardarRegistroSalud, obtenerRegistrosSalud, obtenerEstadisticasPerfil
} from '../services/dbService'

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const METAS = [
  { valor: 'musculo',     label: 'Ganar músculo' },
  { valor: 'bajar_peso',  label: 'Bajar de peso' },
  { valor: 'resistencia', label: 'Mejorar resistencia' },
  { valor: 'salud',       label: 'Salud general' }
]

const CONDICIONES = [
  'Diabetes tipo 1', 'Diabetes tipo 2', 'Hipertensión arterial',
  'Asma o problemas respiratorios', 'Problemas de rodillas/espalda',
  'Enfermedad cardiovascular', 'Otro'
]

const opcionesBase = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1b5e20', titleColor: '#fff', bodyColor: '#a5d6a7' }
  },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b8b6c', font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#6b8b6c', font: { size: 11 } } }
  }
}

function calcularIMC(peso, altura) {
  if (!peso || !altura) return null
  return peso / ((altura / 100) ** 2)
}

function clasificarIMC(imc, edad) {
  if (!imc) return null
  if (edad >= 60 && imc >= 25 && imc < 27) return { label: 'Normal para tu edad', color: 'var(--green-accent)' }
  if (imc < 18.5) return { label: 'Bajo peso', color: 'var(--danger)' }
  if (imc < 25)   return { label: 'Normal', color: 'var(--green-accent)' }
  if (imc < 30)   return { label: 'Sobrepeso', color: 'var(--warning)' }
  return { label: 'Obesidad', color: 'var(--danger)' }
}

function imcIndicadorLeft(imc) {
  const pct = Math.min(Math.max((imc - 15) / (40 - 15), 0), 1) * 100
  return `${pct}%`
}

function calcularGrasaNavy(cintura, cadera, cuello, altura, sexo) {
  try {
    if (sexo === 'Masculino') {
      return 495 / (1.0324 - 0.19077 * Math.log10(cintura - cuello) + 0.15456 * Math.log10(altura)) - 450
    } else {
      return 495 / (1.29579 - 0.35004 * Math.log10(cintura + cadera - cuello) + 0.22100 * Math.log10(altura)) - 450
    }
  } catch { return null }
}

function semanaISO(fecha) {
  const d = new Date(fecha)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
  const w = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d - w) / 86400000 - 3 + (w.getDay() + 6) % 7) / 7)
}

// ── TAB Perfil ────────────────────────────────────────────────
function TabPerfil({ perfil, stats, historial, editando, setEditando, form, setForm, handleGuardar, guardando }) {
  const imc    = calcularIMC(parseFloat(form.peso), parseFloat(form.altura))
  const imcInfo = imc ? clasificarIMC(imc) : null

  return (
    <>
      <div className="profile-header">
        <div className="profile-header__avatar">
          {perfil?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h2 className="profile-header__name">{perfil?.nombre}</h2>
          <p className="profile-header__group">Grupo <strong>{perfil?.grupo}</strong> · {perfil?.correo}</p>
          {perfil?.meta && (
            <span className="tag tag--primary">
              {METAS.find(m => m.valor === perfil.meta)?.label ?? perfil.meta}
            </span>
          )}
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="stat-card stat-card--accent">
          <span className="stat-card__val">{stats?.racha ?? 0}</span>
          <span className="stat-card__lbl">Racha de días 🔥</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.rutinasEsteMes ?? 0}</span>
          <span className="stat-card__lbl">Rutinas este mes</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.ultimoIMC ? stats.ultimoIMC.toFixed(1) : '—'}</span>
          <span className="stat-card__lbl">IMC actual</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.tiempoTotal ?? 0}m</span>
          <span className="stat-card__lbl">Minutos entrenados</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section__header">
          <h3>Mis datos</h3>
          <button className="btn btn--ghost btn--sm" onClick={() => setEditando(!editando)}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editando ? (
          <div className="profile-form">
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.nombre ?? ''} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Peso (kg)</label>
              <input type="number" value={form.peso} onChange={e => setForm(p => ({ ...p, peso: e.target.value }))} placeholder="72" />
            </div>
            <div className="form-group">
              <label>Altura (cm)</label>
              <input type="number" value={form.altura} onChange={e => setForm(p => ({ ...p, altura: e.target.value }))} placeholder="174" />
            </div>
            <div className="form-group">
              <label>Mi meta</label>
              <select value={form.meta} onChange={e => setForm(p => ({ ...p, meta: e.target.value }))}>
                <option value="">Seleccionar meta</option>
                {METAS.map(m => <option key={m.valor} value={m.valor}>{m.label}</option>)}
              </select>
            </div>
            <button className="btn btn--primary" onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        ) : (
          <div className="profile-data">
            <div className="profile-data__row"><span>Peso</span><strong>{perfil?.peso ? `${perfil.peso} kg` : 'No registrado'}</strong></div>
            <div className="profile-data__row"><span>Altura</span><strong>{perfil?.altura ? `${perfil.altura} cm` : 'No registrado'}</strong></div>
            <div className="profile-data__row"><span>Grupo</span><strong>Grupo {perfil?.grupo}</strong></div>
            <div className="profile-data__row"><span>Meta</span><strong>{METAS.find(m => m.valor === perfil?.meta)?.label ?? 'No definida'}</strong></div>
            {imc && <div className="profile-data__row"><span>IMC</span><strong style={{ color: imcInfo?.color }}>{imc.toFixed(1)} — {imcInfo?.label}</strong></div>}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Historial reciente</h3>
        {historial.length === 0 ? (
          <p className="empty-state">Aún no has completado ninguna rutina. ¡Empieza hoy!</p>
        ) : (
          <div className="history-list">
            {historial.slice(0, 5).map(h => (
              <div key={h.id} className="history-item">
                <div className="history-item__info">
                  <strong>{h.dia}</strong> · Grupo {h.grupo}
                  <p>{h.ejercicios?.length ?? 0} ejercicios{h.tiempoTotalMinutos ? ` · ${h.tiempoTotalMinutos} min` : ''}</p>
                </div>
                <span className="history-item__date">
                  {h.completadoEn?.toDate?.()?.toLocaleDateString('es') ?? ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── TAB Salud ─────────────────────────────────────────────────
function TabSalud({ perfil, onGuardado }) {
  const { usuario } = useAuth()
  const [edad,        setEdad]        = useState('')
  const [sexo,        setSexo]        = useState('Masculino')
  const [peso,        setPeso]        = useState(String(perfil?.peso ?? ''))
  const [altura,      setAltura]      = useState(String(perfil?.altura ?? ''))
  const [condiciones, setCondiciones] = useState([])
  const [condOtro,    setCondOtro]    = useState('')
  const [glucosa,     setGlucosa]     = useState('')
  const [presSis,     setPresSis]     = useState('')
  const [presDias,    setPresDias]    = useState('')
  const [inhalador,   setInhalador]   = useState('')
  const [medidas,     setMedidas]     = useState({
    cintura: '', cadera: '', cuello: '', brazoDer: '', muslo: '',
    grasaMedida: '', masaMuscular: '', fcReposo: '', presSisExtra: '', presDiasExtra: ''
  })
  const [acordeon,  setAcordeon]  = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [msg,       setMsg]       = useState('')

  const tieneHipertension = condiciones.includes('Hipertensión arterial')
  const tieneDiabetes     = condiciones.includes('Diabetes tipo 1') || condiciones.includes('Diabetes tipo 2')
  const tieneAsma         = condiciones.includes('Asma o problemas respiratorios')

  const imc    = calcularIMC(parseFloat(peso), parseFloat(altura))
  const imcInfo = imc ? clasificarIMC(imc, parseInt(edad)) : null

  const grasaCalculada = (medidas.cintura && medidas.cuello && altura)
    ? calcularGrasaNavy(parseFloat(medidas.cintura), parseFloat(medidas.cadera), parseFloat(medidas.cuello), parseFloat(altura), sexo)
    : null

  function toggleCond(c) {
    setCondiciones(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }
  function setM(k, v) { setMedidas(p => ({ ...p, [k]: v })) }

  async function guardar() {
    if (!usuario) return
    setGuardando(true)
    try {
      const datos = {
        peso: parseFloat(peso) || null, altura: parseFloat(altura) || null,
        edad: parseInt(edad) || null, sexo,
        imc: imc ? parseFloat(imc.toFixed(2)) : null,
        condiciones, condOtro,
        glucosa: tieneDiabetes ? (parseFloat(glucosa) || null) : null,
        presionSistolica: tieneHipertension ? (parseFloat(presSis) || null) : (parseFloat(medidas.presSisExtra) || null),
        presionDiastolica: tieneHipertension ? (parseFloat(presDias) || null) : (parseFloat(medidas.presDiasExtra) || null),
        inhalador: tieneAsma ? inhalador : null,
        cinturaCm: parseFloat(medidas.cintura) || null, caderaCm: parseFloat(medidas.cadera) || null,
        cuelloCm: parseFloat(medidas.cuello) || null, brazoDerCm: parseFloat(medidas.brazoDer) || null,
        muslosCm: parseFloat(medidas.muslo) || null,
        grasaCorporalCalculada: grasaCalculada ? parseFloat(grasaCalculada.toFixed(1)) : null,
        grasaCorporalMedida: parseFloat(medidas.grasaMedida) || null,
        masaMuscularKg: parseFloat(medidas.masaMuscular) || null,
        frecuenciaCardiacaReposo: parseFloat(medidas.fcReposo) || null,
      }
      await guardarRegistroSalud(usuario.uid, datos)
      setMsg('✓ Registro de salud guardado correctamente')
      onGuardado?.()
    } catch(e) { setMsg('Error: ' + e.message) }
    setGuardando(false)
    setTimeout(() => setMsg(''), 4000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="profile-section">
        <h3>Datos básicos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div className="form-group"><label>Edad</label><input type="number" value={edad} onChange={e => setEdad(e.target.value)} placeholder="25" /></div>
          <div className="form-group"><label>Sexo</label>
            <select value={sexo} onChange={e => setSexo(e.target.value)}>
              <option>Masculino</option><option>Femenino</option>
            </select>
          </div>
          <div className="form-group"><label>Peso (kg)</label><input type="number" value={peso} onChange={e => setPeso(e.target.value)} placeholder="72" /></div>
          <div className="form-group"><label>Altura (cm)</label><input type="number" value={altura} onChange={e => setAltura(e.target.value)} placeholder="174" /></div>
        </div>
        {imc && (
          <div className="imc-wrap" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="imc-num" style={{ color: imcInfo?.color }}>{imc.toFixed(1)}</span>
              <span className="imc-clasif" style={{ color: imcInfo?.color }}>{imcInfo?.label}</span>
            </div>
            <div className="imc-barra-wrap">
              <div className="imc-barra" />
              <div className="imc-indicador" style={{ left: imcIndicadorLeft(imc) }} />
            </div>
            <div className="imc-labels">
              <span>Bajo</span><span>Normal</span><span>Sobrepeso</span><span>Obesidad</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Condiciones de salud</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {CONDICIONES.map(c => (
            <label key={c} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={condiciones.includes(c)} onChange={() => toggleCond(c)} />
              {c}
            </label>
          ))}
        </div>
        {condiciones.includes('Otro') && (
          <div className="form-group" style={{ marginTop: 10 }}><label>Especificar</label>
            <input value={condOtro} onChange={e => setCondOtro(e.target.value)} />
          </div>
        )}
        {tieneDiabetes && (
          <div className="form-group" style={{ marginTop: 10 }}><label>Glucosa en sangre (mg/dL)</label>
            <input type="number" value={glucosa} onChange={e => setGlucosa(e.target.value)} />
          </div>
        )}
        {tieneHipertension && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div className="form-group"><label>Presión sistólica (mmHg)</label><input type="number" value={presSis} onChange={e => setPresSis(e.target.value)} /></div>
            <div className="form-group"><label>Presión diastólica (mmHg)</label><input type="number" value={presDias} onChange={e => setPresDias(e.target.value)} /></div>
          </div>
        )}
        {tieneAsma && (
          <div className="form-group" style={{ marginTop: 10 }}><label>¿Tienes inhalador en el gym?</label>
            <select value={inhalador} onChange={e => setInhalador(e.target.value)}>
              <option value="">Seleccionar</option><option>Sí</option><option>No</option>
            </select>
          </div>
        )}
      </div>

      <div className="profile-section">
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, padding: 0 }}
          onClick={() => setAcordeon(a => !a)}
        >
          <span>📏 Medidas completas · con ayuda médica</span>
          <span>{acordeon ? '▼' : '›'}</span>
        </button>
        {acordeon && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <div className="form-group"><label>Cintura (cm)</label><input type="number" value={medidas.cintura} onChange={e => setM('cintura', e.target.value)} /></div>
            <div className="form-group"><label>Cadera (cm)</label><input type="number" value={medidas.cadera} onChange={e => setM('cadera', e.target.value)} /></div>
            <div className="form-group"><label>Cuello (cm)</label><input type="number" value={medidas.cuello} onChange={e => setM('cuello', e.target.value)} /></div>
            <div className="form-group"><label>Brazo der. (cm)</label><input type="number" value={medidas.brazoDer} onChange={e => setM('brazoDer', e.target.value)} /></div>
            <div className="form-group"><label>Muslo (cm)</label><input type="number" value={medidas.muslo} onChange={e => setM('muslo', e.target.value)} /></div>
            <div className="form-group"><label>% Grasa medido</label><input type="number" value={medidas.grasaMedida} onChange={e => setM('grasaMedida', e.target.value)} /></div>
            <div className="form-group"><label>Masa muscular (kg)</label><input type="number" value={medidas.masaMuscular} onChange={e => setM('masaMuscular', e.target.value)} /></div>
            <div className="form-group">
              <label>FC reposo (ppm) <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>No medir diario</span></label>
              <input type="number" value={medidas.fcReposo} onChange={e => setM('fcReposo', e.target.value)} />
            </div>
            {!tieneHipertension && <>
              <div className="form-group"><label>Presión sistólica</label><input type="number" value={medidas.presSisExtra} onChange={e => setM('presSisExtra', e.target.value)} /></div>
              <div className="form-group"><label>Presión diastólica</label><input type="number" value={medidas.presDiasExtra} onChange={e => setM('presDiasExtra', e.target.value)} /></div>
            </>}
            {grasaCalculada !== null && (
              <div style={{ gridColumn: '1/-1' }}>
                <p style={{ fontSize: 13, color: 'var(--green-accent)' }}>
                  % Grasa (Fórmula Navy): <strong>{grasaCalculada.toFixed(1)}%</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {msg && <p style={{ color: msg.startsWith('✓') ? 'var(--green-accent)' : 'var(--danger)', fontSize: 14 }}>{msg}</p>}
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cada vez que guardas se crea un registro nuevo para ver tu evolución.</p>
      <button className="btn btn--primary" onClick={guardar} disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar registro de salud'}
      </button>
    </div>
  )
}

// ── TAB Gráficas ──────────────────────────────────────────────
function TabGraficas({ registrosSalud, historialRutinas }) {
  if (registrosSalud.length < 2) {
    return (
      <div className="empty-state" style={{ padding: '40px 0' }}>
        Aún no hay suficientes datos. Registra tu salud regularmente para ver tu progreso aquí.
      </div>
    )
  }

  const ordenados = [...registrosSalud].reverse()
  const labels = ordenados.map(r => {
    const d = r.fecha?.toDate?.() ?? new Date()
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' })
  })

  const dataPeso = {
    labels,
    datasets: [{ data: ordenados.map(r => r.peso), borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#1b5e20' }]
  }

  const dataIMC = {
    labels,
    datasets: [{
      data: ordenados.map(r => r.imc), borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.06)', fill: true, tension: 0.4,
      pointBackgroundColor: ordenados.map(r => {
        const v = r.imc; if (!v) return '#888'
        if (v < 18.5 || v >= 30) return '#e53935'
        if (v < 25) return '#43a047'
        return '#ffa000'
      })
    }]
  }

  const conGrasa = ordenados.filter(r => r.grasaCorporalCalculada || r.grasaCorporalMedida)
  const dataGrasa = conGrasa.length >= 2 ? {
    labels: conGrasa.map(r => r.fecha?.toDate?.()?.toLocaleDateString('es', { day: '2-digit', month: 'short' })),
    datasets: [{ data: conGrasa.map(r => r.grasaCorporalCalculada ?? r.grasaCorporalMedida), borderColor: '#f57f17', backgroundColor: 'rgba(245,127,23,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#f57f17' }]
  } : null

  const rutinasPorSemana = {}
  historialRutinas.forEach(h => {
    const d = h.completadoEn?.toDate?.(); if (!d) return
    const key = `${d.getFullYear()}-S${semanaISO(d)}`
    rutinasPorSemana[key] = (rutinasPorSemana[key] ?? 0) + 1
  })
  const semKeys = Object.keys(rutinasPorSemana).sort().slice(-8)
  const dataRutinas = {
    labels: semKeys.map((_, i) => `Sem ${i + 1}`),
    datasets: [{ data: semKeys.map(k => rutinasPorSemana[k]), backgroundColor: '#43a047', borderRadius: 6 }]
  }

  // Mapa de calor 90 días
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const inicioMapa = new Date(hoy); inicioMapa.setDate(hoy.getDate() - 89)
  const diasConRutina = new Set(historialRutinas.map(h => h.completadoEn?.toDate?.()?.toDateString()).filter(Boolean))
  const celdas = []
  const primerDia = new Date(inicioMapa)
  const diaSem = (primerDia.getDay() + 6) % 7
  for (let i = 0; i < diaSem; i++) celdas.push('vacio')
  for (let i = 0; i < 90; i++) {
    const d = new Date(inicioMapa); d.setDate(inicioMapa.getDate() + i)
    celdas.push(d.getDay() === 0 ? 'domingo' : diasConRutina.has(d.toDateString()) ? 'activo' : 'normal')
  }

  const conTiempo = historialRutinas.filter(h => h.tiempoTotalMinutos)
  let dataTiempo = null, tendenciaTiempo = null
  if (conTiempo.length >= 2) {
    const slice = conTiempo.slice(-10)
    const vals = slice.map(h => h.tiempoTotalMinutos)
    const prom = vals.reduce((a, v) => a + v, 0) / vals.length
    tendenciaTiempo = vals[vals.length - 1] < vals[0] ? 'baja' : 'sube'
    dataTiempo = {
      labels: slice.map(h => h.completadoEn?.toDate?.()?.toLocaleDateString('es', { day: '2-digit', month: 'short' })),
      datasets: [
        { data: vals, borderColor: '#1565c0', backgroundColor: 'rgba(21,101,192,0.06)', fill: true, tension: 0.4 },
        { data: vals.map(() => prom), borderColor: '#90caf9', borderDash: [5,5], pointRadius: 0, borderWidth: 1 }
      ]
    }
  }

  const conFC = ordenados.filter(r => r.frecuenciaCardiacaReposo)
  const dataFC = conFC.length >= 2 ? {
    labels: conFC.map(r => r.fecha?.toDate?.()?.toLocaleDateString('es', { day: '2-digit', month: 'short' })),
    datasets: [{ data: conFC.map(r => r.frecuenciaCardiacaReposo), borderColor: '#c62828', backgroundColor: 'rgba(198,40,40,0.06)', fill: true, tension: 0.4 }]
  } : null

  const conPresion = ordenados.filter(r => r.presionSistolica && r.presionDiastolica)
  const dataPresion = conPresion.length >= 2 ? {
    labels: conPresion.map(r => r.fecha?.toDate?.()?.toLocaleDateString('es', { day: '2-digit', month: 'short' })),
    datasets: [
      { label: 'Sistólica', data: conPresion.map(r => r.presionSistolica), borderColor: '#e53935', tension: 0.4 },
      { label: 'Diastólica', data: conPresion.map(r => r.presionDiastolica), borderColor: '#ef9a9a', tension: 0.4 },
      { label: 'Ref 120', data: conPresion.map(() => 120), borderColor: 'rgba(229,57,53,0.3)', borderDash: [5,5], pointRadius: 0, borderWidth: 1 },
      { label: 'Ref 80', data: conPresion.map(() => 80), borderColor: 'rgba(239,154,154,0.3)', borderDash: [5,5], pointRadius: 0, borderWidth: 1 }
    ]
  } : null

  const opPresion = { ...opcionesBase, plugins: { ...opcionesBase.plugins, legend: { display: true, labels: { color: '#6b8b6c', font: { size: 11 } } } } }

  return (
    <div>
      <div className="grafica-card">
        <p className="grafica-card__titulo">Peso en el tiempo</p>
        <p className="grafica-card__desc">Evolución de tu peso corporal en kg</p>
        <Line data={dataPeso} options={opcionesBase} />
      </div>
      <div className="grafica-card">
        <p className="grafica-card__titulo">IMC en el tiempo</p>
        <p className="grafica-card__desc">Índice de masa corporal histórico</p>
        <Line data={dataIMC} options={opcionesBase} />
      </div>
      {dataGrasa && (
        <div className="grafica-card">
          <p className="grafica-card__titulo">% Grasa corporal</p>
          <p className="grafica-card__desc">Porcentaje de grasa registrado</p>
          <Line data={dataGrasa} options={opcionesBase} />
        </div>
      )}
      <div className="grafica-card">
        <p className="grafica-card__titulo">Rutinas por semana</p>
        <p className="grafica-card__desc">Últimas 8 semanas de actividad</p>
        <Bar data={dataRutinas} options={opcionesBase} />
      </div>
      <div className="grafica-card">
        <p className="grafica-card__titulo">Mapa de actividad · 90 días</p>
        <p className="grafica-card__desc">Verde = rutina completada ese día</p>
        <div className="heatmap-wrap">
          <div className="heatmap-dias-labels">
            {['L','M','X','J','V','S','D'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="heatmap-grid">
            {celdas.map((c, i) => (
              <div key={i} className={`heatmap-cell${c === 'activo' ? ' heatmap-cell--activo' : c === 'domingo' ? ' heatmap-cell--domingo' : ''}`} />
            ))}
          </div>
        </div>
      </div>
      {dataTiempo && (
        <div className="grafica-card">
          <p className="grafica-card__titulo">Tiempo por rutina</p>
          <p className="grafica-card__desc">Minutos por sesión · línea punteada = promedio</p>
          <Line data={dataTiempo} options={opcionesBase} />
          <span className={`grafica-trend ${tendenciaTiempo === 'baja' ? 'grafica-trend--green' : 'grafica-trend--yellow'}`}>
            {tendenciaTiempo === 'baja' ? '↓ Mejorando velocidad' : 'Sigue adelante'}
          </span>
        </div>
      )}
      {dataFC && (
        <div className="grafica-card">
          <p className="grafica-card__titulo">Frecuencia cardíaca en reposo</p>
          <p className="grafica-card__desc">ppm — No es necesario medirla diario</p>
          <Line data={dataFC} options={opcionesBase} />
        </div>
      )}
      {dataPresion && (
        <div className="grafica-card">
          <p className="grafica-card__titulo">Presión arterial</p>
          <p className="grafica-card__desc">Sistólica y diastólica en mmHg</p>
          <Line data={dataPresion} options={opPresion} />
        </div>
      )}
    </div>
  )
}

// ── TAB Historial ─────────────────────────────────────────────
function TabHistorial({ historial }) {
  const meses = [...new Set(
    historial.map(h => {
      const d = h.completadoEn?.toDate?.(); if (!d) return null
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`
    }).filter(Boolean)
  )].sort().reverse()

  const [mes, setMes] = useState(meses[0] ?? '')

  const filtrado = mes
    ? historial.filter(h => {
        const d = h.completadoEn?.toDate?.(); if (!d) return false
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}` === mes
      })
    : historial.slice(0, 50)

  return (
    <div>
      {meses.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <select value={mes} onChange={e => setMes(e.target.value)}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13 }}>
            <option value="">Todos</option>
            {meses.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}
      {filtrado.length === 0 ? (
        <p className="empty-state">No hay rutinas registradas.</p>
      ) : (
        <div className="history-list">
          {filtrado.map(h => (
            <div key={h.id} className="history-item">
              <div className="history-item__info">
                <strong>{h.dia}</strong> · Grupo {h.grupo}
                <p>{h.ejercicios?.length ?? 0} ejercicios{h.tiempoTotalMinutos ? ` · ${h.tiempoTotalMinutos} min` : ''}{h.seriesCompletadas ? ` · ${h.seriesCompletadas} series` : ''}</p>
              </div>
              <span className="history-item__date">{h.completadoEn?.toDate?.()?.toLocaleDateString('es') ?? ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function Perfil() {
  const { usuario, perfil, refrescarPerfil } = useAuth()
  const navigate = useNavigate()

  const [tabActiva,      setTabActiva]      = useState('perfil')
  const [historial,      setHistorial]      = useState([])
  const [registrosSalud, setRegistrosSalud] = useState([])
  const [stats,          setStats]          = useState(null)
  const [editando,       setEditando]       = useState(false)
  const [guardando,      setGuardando]      = useState(false)
  const [cargando,       setCargando]       = useState(true)
  const [error,          setError]          = useState('')
  const [form, setForm] = useState({ nombre: '', peso: '', altura: '', meta: '' })

  useEffect(() => {
    if (!usuario) return
    setForm({ nombre: perfil?.nombre ?? '', peso: perfil?.peso ?? '', altura: perfil?.altura ?? '', meta: perfil?.meta ?? '' })
    cargarDatos()
  }, [usuario])

  async function cargarDatos() {
    setCargando(true)
    try {
      const [h, r, s] = await Promise.all([
        obtenerHistorialRutinas(usuario.uid, 50),
        obtenerRegistrosSalud(usuario.uid),
        obtenerEstadisticasPerfil(usuario.uid)
      ])
      setHistorial(h); setRegistrosSalud(r); setStats(s)
    } catch(e) { setError('Error cargando datos: ' + e.message) }
    setCargando(false)
  }

  async function handleGuardar() {
    setGuardando(true)
    try {
      await guardarMedidas(usuario.uid, { peso: parseFloat(form.peso) || null, altura: parseFloat(form.altura) || null })
      await actualizarPerfil(usuario.uid, { nombre: form.nombre, meta: form.meta, peso: parseFloat(form.peso) || null, altura: parseFloat(form.altura) || null })
      await refrescarPerfil()
      setEditando(false)
    } catch(e) { console.error(e) }
    setGuardando(false)
  }

  if (!usuario) {
    return (
      <div className="page page--center">
        <div className="locked-state">
          <span className="locked-state__icon">🥭</span>
          <h2>¡Únete al gym digital!</h2>
          <p>Crea tu cuenta para guardar tus rutinas, registrar tu progreso y ver tu racha.</p>
          <button className="btn btn--primary" onClick={() => navigate('/registro')}>Crear cuenta</button>
          <button className="btn btn--ghost" onClick={() => navigate('/login')}>Ya tengo cuenta</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}
      <div className="perfil-tabs">
        {[
          { id: 'perfil', label: 'Perfil' }, { id: 'salud', label: 'Salud' },
          { id: 'graficas', label: 'Gráficas' }, { id: 'historial', label: 'Historial' }
        ].map(t => (
          <button key={t.id} className={`perfil-tab ${tabActiva === t.id ? 'active' : ''}`} onClick={() => setTabActiva(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {cargando ? <p className="loading-text">Cargando...</p> : (
        <>
          {tabActiva === 'perfil'    && <TabPerfil perfil={perfil} stats={stats} historial={historial} editando={editando} setEditando={setEditando} form={form} setForm={setForm} handleGuardar={handleGuardar} guardando={guardando} />}
          {tabActiva === 'salud'     && <TabSalud perfil={perfil} onGuardado={cargarDatos} />}
          {tabActiva === 'graficas'  && <TabGraficas registrosSalud={registrosSalud} historialRutinas={historial} />}
          {tabActiva === 'historial' && <TabHistorial historial={historial} />}
        </>
      )}
    </div>
  )
}
