import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  actualizarPerfil, guardarMedidas, obtenerHistorialRutinas,
  guardarRegistroSalud, obtenerRegistrosSalud, obtenerEstadisticasPerfil,
  obtenerHistorialCardio
} from '../services/dbService'
// storage imports removed
// updateProfile import removed
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

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
  'Diabetes tipo 1','Diabetes tipo 2','Hipertensión arterial',
  'Asma o problemas respiratorios','Problemas de rodillas/espalda',
  'Enfermedad cardiovascular','Otro'
]

const opcionesBase = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor:'#1b5e20', titleColor:'#fff', bodyColor:'#a5d6a7' }
  },
  scales: {
    x: { grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#638764', font:{ size:11 } } },
    y: { grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ color:'#638764', font:{ size:11 } } }
  }
}

function calcularIMC(peso, altura) {
  if (!peso || !altura) return null
  return peso / ((altura/100) ** 2)
}
function clasificarIMC(imc, edad=30) {
  if (!imc) return null
  if (edad >= 60 && imc >= 25 && imc < 27) return { label:'Normal para tu edad', color:'#43a047', bg:'#e8f5e9' }
  if (imc < 18.5) return { label:'Bajo peso',  color:'#e53935', bg:'#fdf2f2' }
  if (imc < 25)   return { label:'Normal',      color:'#2e7d32', bg:'#e8f5e9' }
  if (imc < 30)   return { label:'Sobrepeso',   color:'#f57f17', bg:'#fffbf0' }
  return              { label:'Obesidad',    color:'#e53935', bg:'#fdf2f2' }
}
function imcLeft(imc) {
  return `${Math.min(Math.max((imc - 15) / 25, 0), 1) * 100}%`
}
function semanaISO(fecha) {
  const d = new Date(fecha); d.setHours(0,0,0,0)
  d.setDate(d.getDate() + 3 - (d.getDay()+6)%7)
  const w = new Date(d.getFullYear(),0,4)
  return 1 + Math.round(((d-w)/86400000 - 3 + (w.getDay()+6)%7) / 7)
}

// ── GRÁFICA VACÍA ────────────────────────────────────────────
function GraficaVacia({ titulo, desc, hint }) {
  return (
    <div className="grafica-card">
      <p className="grafica-card__titulo">{titulo}</p>
      <p className="grafica-card__desc">{desc}</p>
      <div className="grafica-card__empty">
        <div className="grafica-card__empty-icon">📊</div>
        <p>Sin datos aún</p>
        <p className="grafica-card__empty-hint">{hint}</p>
      </div>
    </div>
  )
}

// ── TAB PERFIL ────────────────────────────────────────────────
function TabPerfil({ perfil, stats, historial, editando, setEditando, form, setForm, handleGuardar, guardando, onFotoChange }) {
  const imc     = calcularIMC(parseFloat(form.peso), parseFloat(form.altura))
  const imcInfo = imc ? clasificarIMC(imc) : null
  const fotoUrl = perfil?.fotoUrl ?? null
  const inicial = perfil?.nombre?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <>
      <div className="profile-header">
        {/* Foto de perfil con upload */}
        <label className="avatar-upload" title="Cambiar foto">
          {fotoUrl
            ? <img src={fotoUrl} alt={perfil?.nombre} className="profile-avatar-img" />
            : <div className="profile-avatar-placeholder">{inicial}</div>
          }
          <div className="avatar-upload__overlay">📷</div>
          <input type="file" accept="image/*" onChange={onFotoChange} style={{display:'none'}} />
        </label>
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

      {/* Stats */}
      <div className="stats-grid stats-grid--4">
        <div className="stat-card stat-card--accent">
          <span className="stat-card__val">{stats?.racha ?? 0}</span>
          <span className="stat-card__lbl">Racha 🔥</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.rutinasEsteMes ?? 0}</span>
          <span className="stat-card__lbl">Rutinas mes</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.ultimoIMC ? stats.ultimoIMC.toFixed(1) : '—'}</span>
          <span className="stat-card__lbl">IMC actual</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{stats?.tiempoTotal ?? 0}<span style={{fontSize:14}}>m</span></span>
          <span className="stat-card__lbl">Min. totales</span>
        </div>
      </div>

      {/* Barra IMC */}
      {imc && imcInfo && (
        <div className="card card--flat" style={{marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
            <span className="imc-valor-badge" style={{color:imcInfo.color,borderColor:imcInfo.color,background:imcInfo.bg}}>
              📏 IMC {imc.toFixed(1)} — {imcInfo.label}
            </span>
          </div>
          <div className="imc-bar-wrap">
            <div className="imc-bar-track">
              <div className="imc-bar-indicator" style={{left:imcLeft(imc)}} />
            </div>
            <div className="imc-bar-labels">
              <span style={{color:'#e53935'}}>Bajo peso</span>
              <span style={{color:'#2e7d32'}}>Normal</span>
              <span style={{color:'#f57f17'}}>Sobrepeso</span>
              <span style={{color:'#e53935'}}>Obesidad</span>
            </div>
          </div>
        </div>
      )}

      {/* Mis datos */}
      <div className="profile-section">
        <div className="profile-section__header">
          <h3>Mis datos</h3>
          <button className="btn btn--ghost btn--sm" onClick={() => setEditando(!editando)}>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editando ? (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input type="number" value={form.peso} onChange={e=>setForm(p=>({...p,peso:e.target.value}))} placeholder="72"/>
              </div>
              <div className="form-group">
                <label>Altura (cm)</label>
                <input type="number" value={form.altura} onChange={e=>setForm(p=>({...p,altura:e.target.value}))} placeholder="174"/>
              </div>
            </div>
            <div className="form-group">
              <label>Mi meta</label>
              <select value={form.meta} onChange={e=>setForm(p=>({...p,meta:e.target.value}))}>
                <option value="">Seleccionar meta</option>
                {METAS.map(m=><option key={m.valor} value={m.valor}>{m.label}</option>)}
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
            <div className="profile-data__row"><span>Meta</span><strong>{METAS.find(m=>m.valor===perfil?.meta)?.label ?? 'No definida'}</strong></div>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="profile-section">
        <h3>Historial reciente</h3>
        {historial.length === 0 ? (
          <p className="empty-state">Aún no has completado ninguna rutina. ¡Empieza hoy!</p>
        ) : (
          <div className="history-list">
            {historial.slice(0,5).map(h=>(
              <div key={h.id} className="history-item">
                <div className="history-item__info">
                  <strong>{h.dia}</strong> · Grupo {h.grupo}
                  <p>
                    {h.ejercicios?.length ?? 0} ejercicios
                    {h.tiempoTotalMinutos ? ` · ${h.tiempoTotalMinutos} min` : ''}
                    {h.caloriasEstimadas ? ` · ~${h.caloriasEstimadas} kcal` : ''}
                  </p>
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

// ── TAB SALUD ─────────────────────────────────────────────────
function TabSalud({ perfil, onGuardado }) {
  const { usuario } = useAuth()
  const [edad,setEdad]=useState('')
  const [sexo,setSexo]=useState('Masculino')
  const [peso,setPeso]=useState(String(perfil?.peso??''))
  const [altura,setAltura]=useState(String(perfil?.altura??''))
  const [condiciones,setCondiciones]=useState([])
  const [condOtro,setCondOtro]=useState('')
  const [glucosa,setGlucosa]=useState('')
  const [presionSis,setPresionSis]=useState('')
  const [presionDia,setPresionDia]=useState('')
  const [inhalador,setInhalador]=useState('')
  const [cintura,setCintura]=useState('')
  const [cadera,setCadera]=useState('')
  const [cuello,setCuello]=useState('')
  const [brazo,setBrazo]=useState('')
  const [muslo,setMuslo]=useState('')
  const [grasaMedida,setGrasaMedida]=useState('')
  const [masaMuscular,setMasaMuscular]=useState('')
  const [fc,setFc]=useState('')
  const [presS2,setPresS2]=useState('')
  const [presD2,setPresD2]=useState('')
  const [guardando,setGuardando]=useState(false)
  const [mediciasOpen,setMediciasOpen]=useState(false)

  const imc = calcularIMC(parseFloat(peso),parseFloat(altura))
  const imcInfo = imc ? clasificarIMC(imc,parseInt(edad)||30) : null

  const tieneDiabetes = condiciones.includes('Diabetes tipo 1')||condiciones.includes('Diabetes tipo 2')
  const tieneHiper    = condiciones.includes('Hipertensión arterial')
  const tieneAsma     = condiciones.includes('Asma o problemas respiratorios')

  function toggleCond(c) {
    setCondiciones(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c])
  }

  let grasaNavy = null
  if (cintura && cuello && altura && sexo) {
    try {
      const c=parseFloat(cintura),n=parseFloat(cuello),h=parseFloat(altura),ca=parseFloat(cadera||'0')
      if (sexo==='Masculino' && c>n)
        grasaNavy = 495/(1.0324-0.19077*Math.log10(c-n)+0.15456*Math.log10(h))-450
      else if (sexo==='Femenino' && ca>0 && c+ca>n)
        grasaNavy = 495/(1.29579-0.35004*Math.log10(c+ca-n)+0.22100*Math.log10(h))-450
    } catch {}
  }

  async function guardar() {
    if (!usuario) return
    setGuardando(true)
    try {
      const datos = {
        peso:parseFloat(peso)||null, altura:parseFloat(altura)||null,
        edad:parseInt(edad)||null, sexo,
        imc:imc?Math.round(imc*10)/10:null,
        condiciones, condOtro,
        glucosa:glucosa?parseFloat(glucosa):null,
        presionSistolica: tieneHiper?parseFloat(presionSis)||null:parseFloat(presS2)||null,
        presionDiastolica: tieneHiper?parseFloat(presionDia)||null:parseFloat(presD2)||null,
        inhalador: tieneAsma?inhalador:null,
        cintura:parseFloat(cintura)||null, cadera:parseFloat(cadera)||null,
        cuello:parseFloat(cuello)||null, brazo:parseFloat(brazo)||null,
        muslo:parseFloat(muslo)||null,
        grasaCorporalMedida:parseFloat(grasaMedida)||null,
        grasaCorporalCalculada:grasaNavy?Math.round(grasaNavy*10)/10:null,
        masaMuscular:parseFloat(masaMuscular)||null,
        frecuenciaCardiacaReposo:parseFloat(fc)||null
      }
      await guardarRegistroSalud(usuario.uid, datos)
      if (datos.peso || datos.altura) {
        await actualizarPerfil(usuario.uid, { peso:datos.peso, altura:datos.altura })
      }
      onGuardado?.()
    } catch(e){ console.error(e) }
    setGuardando(false)
  }

  return (
    <div>
      <div className="info-box info-box--sm">
        Cada vez que guardas se crea un registro nuevo para ver tu evolución histórica.
      </div>

      <div className="card">
        <h4 style={{fontWeight:800,marginBottom:14,fontSize:15}}>Datos básicos</h4>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="form-group"><label>Edad</label><input type="number" value={edad} onChange={e=>setEdad(e.target.value)} placeholder="25"/></div>
          <div className="form-group"><label>Sexo</label><select value={sexo} onChange={e=>setSexo(e.target.value)}><option>Masculino</option><option>Femenino</option></select></div>
          <div className="form-group"><label>Peso (kg)</label><input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="72"/></div>
          <div className="form-group"><label>Altura (cm)</label><input type="number" value={altura} onChange={e=>setAltura(e.target.value)} placeholder="174"/></div>
        </div>

        {imc && imcInfo && (
          <div style={{marginTop:8}}>
            <span className="imc-valor-badge" style={{color:imcInfo.color,borderColor:imcInfo.color,background:imcInfo.bg}}>
              IMC {imc.toFixed(1)} — {imcInfo.label}
            </span>
            <div className="imc-bar-wrap">
              <div className="imc-bar-track"><div className="imc-bar-indicator" style={{left:imcLeft(imc)}}/></div>
              <div className="imc-bar-labels">
                <span style={{color:'#e53935'}}>Bajo</span>
                <span style={{color:'#2e7d32'}}>Normal</span>
                <span style={{color:'#f57f17'}}>Sobrepeso</span>
                <span style={{color:'#e53935'}}>Obesidad</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h4 style={{fontWeight:800,marginBottom:14,fontSize:15}}>Condiciones de salud</h4>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {CONDICIONES.map(c=>(
            <label key={c} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,padding:'8px 10px',borderRadius:8,border:`1px solid ${condiciones.includes(c)?'var(--g400)':'var(--bd)'}`,background:condiciones.includes(c)?'var(--g50)':'transparent',transition:'all .14s'}}>
              <input type="checkbox" checked={condiciones.includes(c)} onChange={()=>toggleCond(c)} style={{accentColor:'var(--g600)'}}/>
              {c}
            </label>
          ))}
        </div>
        {condiciones.includes('Otro') && (
          <div className="form-group" style={{marginTop:12}}>
            <label>Especifica</label>
            <input value={condOtro} onChange={e=>setCondOtro(e.target.value)} placeholder="Describe tu condición"/>
          </div>
        )}
        {tieneDiabetes && <div className="form-group" style={{marginTop:12}}><label>Glucosa en sangre (mg/dL)</label><input type="number" value={glucosa} onChange={e=>setGlucosa(e.target.value)} placeholder="100"/></div>}
        {tieneHiper && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
            <div className="form-group"><label>Presión sistólica (mmHg)</label><input type="number" value={presionSis} onChange={e=>setPresionSis(e.target.value)} placeholder="120"/></div>
            <div className="form-group"><label>Presión diastólica (mmHg)</label><input type="number" value={presionDia} onChange={e=>setPresionDia(e.target.value)} placeholder="80"/></div>
          </div>
        )}
        {tieneAsma && <div className="form-group" style={{marginTop:12}}><label>¿Tienes inhalador en el gym?</label><select value={inhalador} onChange={e=>setInhalador(e.target.value)}><option value="">Seleccionar</option><option value="si">Sí</option><option value="no">No</option></select></div>}
      </div>

      <div className="card">
        <button style={{width:'100%',background:'transparent',border:'none',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',padding:0,fontSize:15,fontWeight:800,color:'var(--t100)'}}
          onClick={()=>setMediciasOpen(v=>!v)}>
          📏 Medidas corporales · con ayuda médica
          <span>{mediciasOpen?'▲':'▼'}</span>
        </button>
        {mediciasOpen && (
          <div style={{marginTop:16}}>
            <div className="info-box info-box--sm">La doctora de tópico puede tomarte estas medidas para un control más completo.</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[['Cintura (cm)',cintura,setCintura],['Cadera (cm)',cadera,setCadera],['Cuello (cm)',cuello,setCuello],['Brazo derecho (cm)',brazo,setBrazo],['Muslo (cm)',muslo,setMuslo],['% Grasa medido',grasaMedida,setGrasaMedida],['Masa muscular (kg)',masaMuscular,setMasaMuscular],['FC en reposo (ppm)',fc,setFc]].map(([lbl,val,set])=>(
                <div className="form-group" key={lbl}><label>{lbl}</label><input type="number" value={val} onChange={e=>set(e.target.value)} placeholder="0"/></div>
              ))}
            </div>
            {!tieneHiper && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="form-group"><label>Presión sistólica (mmHg)</label><input type="number" value={presS2} onChange={e=>setPresS2(e.target.value)} placeholder="120"/></div>
                <div className="form-group"><label>Presión diastólica (mmHg)</label><input type="number" value={presD2} onChange={e=>setPresD2(e.target.value)} placeholder="80"/></div>
              </div>
            )}
            {grasaNavy!==null && (
              <div className="info-box"><strong>% Grasa calculado (Fórmula Navy):</strong> {grasaNavy.toFixed(1)}%</div>
            )}
          </div>
        )}
      </div>

      <div className="form-hint" style={{marginBottom:12}}>Nota: FC y presión arterial no es necesario medirlas diariamente.</div>
      <button className="btn btn--primary btn--full" onClick={guardar} disabled={guardando}>
        {guardando ? 'Guardando...' : '✓ Guardar registro de salud'}
      </button>
    </div>
  )
}

// ── TAB GRÁFICAS ──────────────────────────────────────────────
function TabGraficas({ registrosSalud, historialRutinas }) {
  const sinSalud    = registrosSalud.length < 2
  const sinRutinas  = historialRutinas.length === 0

  const ordenados = sinSalud ? [] : [...registrosSalud].reverse()
  const labels    = ordenados.map(r => r.fecha?.toDate?.()?.toLocaleDateString('es',{day:'2-digit',month:'short'}) ?? '')

  const dataPeso = sinSalud ? null : {
    labels,
    datasets:[{data:ordenados.map(r=>r.peso),borderColor:'#2e7d32',backgroundColor:'rgba(46,125,50,.08)',fill:true,tension:.4,pointBackgroundColor:'#1b5e20'}]
  }
  const dataIMC = sinSalud ? null : {
    labels,
    datasets:[{data:ordenados.map(r=>r.imc),borderColor:'#2e7d32',backgroundColor:'rgba(46,125,50,.06)',fill:true,tension:.4,
      pointBackgroundColor:ordenados.map(r=>{const v=r.imc;if(!v)return'#888';if(v<18.5||v>=30)return'#e53935';if(v<25)return'#43a047';return'#ffa000'})}]
  }

  // Rutinas por semana (siempre mostrar las últimas 8)
  const semanas = {}
  historialRutinas.forEach(h=>{
    const d=h.completadoEn?.toDate?.();if(!d)return
    const key=`${d.getFullYear()}-S${semanaISO(d)}`
    semanas[key]=(semanas[key]??0)+1
  })
  const semKeys = Array.from({length:8},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-7*(7-i));
    return `${d.getFullYear()}-S${semanaISO(d)}`
  })
  const dataRutinas = {
    labels: semKeys.map((_,i)=>`Sem ${i+1}`),
    datasets:[{data:semKeys.map(k=>semanas[k]??0),backgroundColor:'#43a047',borderRadius:6,maxBarThickness:40}]
  }

  // Heatmap 90 días
  const hoy=new Date();hoy.setHours(0,0,0,0)
  const inicio90=new Date(hoy);inicio90.setDate(hoy.getDate()-89)
  const diasConRutina=new Set(historialRutinas.map(h=>h.completadoEn?.toDate?.()?.toDateString()).filter(Boolean))
  const celdas=[]
  const ds=(inicio90.getDay()+6)%7
  for(let i=0;i<ds;i++)celdas.push('vacio')
  for(let i=0;i<90;i++){
    const d=new Date(inicio90);d.setDate(inicio90.getDate()+i)
    celdas.push(d.getDay()===0?'domingo':diasConRutina.has(d.toDateString())?'activo':'normal')
  }

  const conTiempo=historialRutinas.filter(h=>h.tiempoTotalMinutos)
  const dataTiempo = conTiempo.length>=2 ? {
    labels:conTiempo.slice(-10).map(h=>h.completadoEn?.toDate?.()?.toLocaleDateString('es',{day:'2-digit',month:'short'})),
    datasets:[{data:conTiempo.slice(-10).map(h=>h.tiempoTotalMinutos),borderColor:'#1565c0',backgroundColor:'rgba(21,101,192,.06)',fill:true,tension:.4}]
  } : null

  return (
    <div>
      {/* Peso */}
      {dataPeso
        ? <div className="grafica-card"><p className="grafica-card__titulo">Peso en el tiempo</p><p className="grafica-card__desc">Evolución en kg</p><Line data={dataPeso} options={opcionesBase}/></div>
        : <GraficaVacia titulo="Peso en el tiempo" desc="Evolución en kg" hint="Registra tu peso en la pestaña Salud"/>
      }

      {/* IMC */}
      {dataIMC
        ? <div className="grafica-card"><p className="grafica-card__titulo">IMC en el tiempo</p><p className="grafica-card__desc">Índice de masa corporal histórico</p><Line data={dataIMC} options={opcionesBase}/></div>
        : <GraficaVacia titulo="IMC en el tiempo" desc="Índice de masa corporal histórico" hint="Registra peso y altura en Salud"/>
      }

      {/* Rutinas por semana — siempre visible */}
      <div className="grafica-card">
        <p className="grafica-card__titulo">Rutinas por semana</p>
        <p className="grafica-card__desc">Últimas 8 semanas de actividad</p>
        <Bar data={dataRutinas} options={{...opcionesBase,scales:{...opcionesBase.scales,y:{...opcionesBase.scales.y,min:0,max:7,ticks:{...opcionesBase.scales.y.ticks,stepSize:1}}}}}/>
      </div>

      {/* Mapa de calor */}
      <div className="grafica-card">
        <p className="grafica-card__titulo">Mapa de actividad · 90 días</p>
        <p className="grafica-card__desc">🟢 = rutina completada ese día</p>
        <div className="heatmap-wrap">
          <div className="heatmap-dias-labels">
            {['L','M','X','J','V','S','D'].map(d=><span key={d}>{d}</span>)}
          </div>
          <div className="heatmap-grid">
            {celdas.map((c,i)=>(
              <div key={i} className={`heatmap-cell${c==='activo'?' heatmap-cell--activo':c==='domingo'?' heatmap-cell--domingo':''}`}/>
            ))}
          </div>
        </div>
      </div>

      {/* Tiempo por rutina */}
      {dataTiempo
        ? <div className="grafica-card"><p className="grafica-card__titulo">Tiempo por rutina</p><p className="grafica-card__desc">Minutos por sesión</p><Line data={dataTiempo} options={opcionesBase}/></div>
        : <GraficaVacia titulo="Tiempo por rutina" desc="Minutos por sesión" hint="Completa rutinas con el cronómetro activo"/>
      }
    </div>
  )
}



// ── TAB HISTORIAL ─────────────────────────────────────────────
const TIPO_LABELS = { garita: 'Ruta Garita (2.4km)', cancha: 'Cancha de fútbol' }
const RITMO_LABELS = { caminando: '🚶 Caminando', trotando: '🏃 Trotando', corriendo: '⚡ Corriendo' }

function TabHistorial({ historial, historialCardio }) {
  const [mes,setMes]=useState('')
  const meses=[...new Set(historial.map(h=>{const d=h.completadoEn?.toDate?.();return d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`:null}).filter(Boolean))]
  const filtrado=mes?historial.filter(h=>{const d=h.completadoEn?.toDate?.();return d&&`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`===mes}):historial.slice(0,50)
  return (
    <div>
      {meses.length>0&&(
        <div style={{marginBottom:16}}>
          <select className="admin-search" style={{marginBottom:0}} value={mes} onChange={e=>setMes(e.target.value)}>
            <option value="">Todos los meses</option>
            {meses.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}
      {filtrado.length===0
        ?<p className="empty-state">No hay rutinas registradas.</p>
        :<div className="history-list">
          {filtrado.map(h=>(
            <div key={h.id} className="history-item">
              <div className="history-item__info">
                <strong>{h.dia}</strong> · Grupo {h.grupo}
                <p>
                  {h.ejercicios?.length??0} ejercicios
                  {h.tiempoTotalMinutos?` · ${h.tiempoTotalMinutos} min`:''}
                  {h.caloriasEstimadas?` · ~${h.caloriasEstimadas} kcal`:''}
                </p>
              </div>
              <span className="history-item__date">{h.completadoEn?.toDate?.()?.toLocaleDateString('es')??''}</span>
            </div>
          ))}
        </div>
      }

      {/* Historial cardio */}
      <div className="profile-section" style={{marginTop:24}}>
        <h3>🏃 Historial Cardio</h3>
        {historialCardio.length===0
          ? <p className="empty-state">No hay sesiones de cardio registradas aún. <a href="/cardio" style={{color:'var(--neon)'}}>Ir a Cardio</a></p>
          : <div className="history-list">
              {historialCardio.map(c=>(
                <div key={c.id} className="history-item">
                  <div className="history-item__info">
                    <strong>{TIPO_LABELS[c.tipo] ?? c.tipo}</strong>
                    <p>
                      {c.distanciaKm} km
                      {c.duracionMinutos?` · ${c.duracionMinutos} min`:''}
                      {c.calorias?` · ~${c.calorias} kcal`:''}
                      {c.ritmo?` · ${RITMO_LABELS[c.ritmo]??c.ritmo}`:''}
                    </p>
                  </div>
                  <span className="history-item__date">{c.fecha?.toDate?.()?.toLocaleDateString('es')??''}</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

// ── PÁGINA PRINCIPAL ──────────────────────────────────────────
export default function Perfil() {
  const { usuario, perfil, refrescarPerfil } = useAuth()
  const navigate = useNavigate()
  const [tab,           setTab]        = useState('perfil')
  const [historial,     setHistorial]  = useState([])
  const [histCardio,    setHistCardio] = useState([])
  const [registros,     setRegistros]  = useState([])
  const [stats,         setStats]      = useState(null)
  const [editando,   setEditando]   = useState(false)
  const [guardando,  setGuardando]  = useState(false)
  const [subiendoFoto,setSubiendoFoto]=useState(false)
  const [form,setForm]=useState({peso:'',altura:'',meta:''})

  useEffect(()=>{
    if(!usuario)return
    obtenerHistorialRutinas(usuario.uid,50).then(setHistorial)
    obtenerHistorialCardio(usuario.uid,30).then(setHistCardio)
    obtenerRegistrosSalud(usuario.uid).then(setRegistros)
    obtenerEstadisticasPerfil(usuario.uid).then(setStats)
  },[usuario])

  useEffect(()=>{
    if(perfil){
      setForm({peso:perfil.peso??'',altura:perfil.altura??'',meta:perfil.meta??''})
    }
  },[perfil])

  if(!usuario){
    return (
      <div className="page page--center">
        <div className="locked-state">
          <span className="locked-state__icon">🥭</span>
          <h2>¡Únete al gym digital!</h2>
          <p>Crea tu cuenta para guardar rutinas, registrar progreso y ver tus gráficas de salud.</p>
          <button className="btn btn--primary btn--lg" onClick={()=>navigate('/registro')}>Crear cuenta</button>
          <button className="btn btn--ghost" onClick={()=>navigate('/login')}>Ya tengo cuenta</button>
        </div>
      </div>
    )
  }

  async function handleGuardar(){
    setGuardando(true)
    try{
      await actualizarPerfil(usuario.uid,{
        peso:parseFloat(form.peso)||null,
        altura:parseFloat(form.altura)||null,
        meta:form.meta||null
      })
      await refrescarPerfil()
      setEditando(false)
    }catch(e){console.error(e)}
    setGuardando(false)
  }

  async function handleFotoChange(e){
    const file=e.target.files?.[0]
    if(!file||!usuario)return
    // Usar Firestore para guardar URL de foto (sin Firebase Storage por simplicidad)
    // Convertir a base64 y guardar en Firestore
    setSubiendoFoto(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const base64 = ev.target.result
        await updateDoc(doc(db,'usuarios',usuario.uid),{fotoUrl:base64})
        await refrescarPerfil()
        setSubiendoFoto(false)
      }
      reader.readAsDataURL(file)
    }catch(e){console.error(e);setSubiendoFoto(false)}
  }

  const TABS=[
    {key:'perfil',  label:'Perfil'},
    {key:'salud',   label:'Salud'},
    {key:'graficas',label:'Gráficas'},
    {key:'historial',label:'Historial'},
  ]

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Mi Perfil</h2>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(t=>(
          <button
            key={t.key}
            className={`profile-tab${tab===t.key?' active':''}`}
            onClick={()=>setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab==='perfil'   && <TabPerfil perfil={perfil} stats={stats} historial={historial} editando={editando} setEditando={setEditando} form={form} setForm={setForm} handleGuardar={handleGuardar} guardando={guardando} onFotoChange={handleFotoChange}/>}
      {tab==='salud'    && <TabSalud perfil={perfil} onGuardado={()=>{obtenerRegistrosSalud(usuario.uid).then(setRegistros);obtenerEstadisticasPerfil(usuario.uid).then(setStats)}}/>}
      {tab==='graficas' && <TabGraficas registrosSalud={registros} historialRutinas={historial}/>}
      {tab==='historial'&& <TabHistorial historial={historial} historialCardio={histCardio}/>}

      {subiendoFoto && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,color:'#fff',fontSize:16,fontWeight:700}}>Subiendo foto...</div>}
    </div>
  )
}
