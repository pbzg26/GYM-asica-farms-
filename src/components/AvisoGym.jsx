// ============================================================
// COMPONENTE: AvisoGym
// Muestra avisos activos del gym como banner colapsable.
// Al cerrar, queda como burbuja flotante arrastrable.
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { obtenerAvisosActivos } from '../services/dbService'

const TIPO_ICON  = { info: 'ℹ️', alerta: '⚠️', cierre: '🔒' }
const TIPO_COLOR = {
  info:   { bg: 'rgba(33,150,243,.12)', border: 'rgba(33,150,243,.35)', icon: '#1976d2' },
  alerta: { bg: 'rgba(255,152,0,.12)',  border: 'rgba(255,152,0,.4)',   icon: '#e65100' },
  cierre: { bg: 'rgba(244,67,54,.1)',   border: 'rgba(244,67,54,.3)',   icon: '#c62828' },
}

function useCountdown(fechaFin) {
  const [resta, setResta] = useState('')
  useEffect(() => {
    if (!fechaFin) return
    const tick = () => {
      const diff = new Date(fechaFin) - Date.now()
      if (diff <= 0) { setResta('Cerrado'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setResta(`${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [fechaFin])
  return resta
}

// Burbuja flotante arrastrable
function BurbujaFlotante({ aviso, onReabrir }) {
  const ref    = useRef(null)
  const drag   = useRef({ active: false, ox: 0, oy: 0 })
  const [pos, setPos] = useState({ right: 20, bottom: 80 })

  function onMouseDown(e) {
    drag.current = {
      active: true,
      ox: e.clientX + pos.right - window.innerWidth,
      oy: e.clientY + pos.bottom - window.innerHeight,
    }
    e.preventDefault()
  }
  function onMouseMove(e) {
    if (!drag.current.active) return
    const right  = Math.max(0, window.innerWidth  - e.clientX - drag.current.ox)
    const bottom = Math.max(0, window.innerHeight - e.clientY - drag.current.oy)
    setPos({ right, bottom })
  }
  function onMouseUp() { drag.current.active = false }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  })

  // Soporte touch
  function onTouchStart(e) {
    const t = e.touches[0]
    drag.current = {
      active: true,
      ox: t.clientX + pos.right - window.innerWidth,
      oy: t.clientY + pos.bottom - window.innerHeight,
    }
  }
  function onTouchMove(e) {
    if (!drag.current.active) return
    const t = e.touches[0]
    const right  = Math.max(0, window.innerWidth  - t.clientX - drag.current.ox)
    const bottom = Math.max(0, window.innerHeight - t.clientY - drag.current.oy)
    setPos({ right, bottom })
  }
  function onTouchEnd() { drag.current.active = false }

  const colores = TIPO_COLOR[aviso.tipo] ?? TIPO_COLOR.info

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onReabrir}
      title="Toca para ver el aviso"
      style={{
        position: 'fixed',
        right: pos.right,
        bottom: pos.bottom,
        zIndex: 9999,
        width: 48, height: 48,
        borderRadius: '50%',
        background: colores.bg,
        border: `2px solid ${colores.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
        cursor: 'grab',
        boxShadow: '0 4px 16px rgba(0,0,0,.2)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        backdropFilter: 'blur(8px)',
        transition: 'box-shadow .15s',
      }}
    >
      {TIPO_ICON[aviso.tipo] ?? 'ℹ️'}
    </div>
  )
}

export default function AvisoGym() {
  const [avisos,    setAvisos]   = useState([])
  const [cerrados,  setCerrados] = useState([])
  const [burbuja,   setBurbuja]  = useState([])

  useEffect(() => {
    obtenerAvisosActivos()
      .then(lista => setAvisos(lista))
      .catch(() => {})

    // Leer dismissed de sessionStorage
    try {
      const guardado = JSON.parse(sessionStorage.getItem('avisos_burbuja') ?? '[]')
      setBurbuja(guardado)
      const cerr = JSON.parse(sessionStorage.getItem('avisos_cerrados') ?? '[]')
      setCerrados(cerr)
    } catch {}
  }, [])

  function cerrarAviso(id) {
    const nuevoCerrados = [...cerrados, id]
    const nuevaBurbuja  = [...burbuja,  id]
    setCerrados(nuevoCerrados)
    setBurbuja(nuevaBurbuja)
    sessionStorage.setItem('avisos_cerrados', JSON.stringify(nuevoCerrados))
    sessionStorage.setItem('avisos_burbuja',  JSON.stringify(nuevaBurbuja))
  }

  function reabrirAviso(id) {
    const nuevaCerrados = cerrados.filter(x => x !== id)
    const nuevaBurbuja  = burbuja.filter(x  => x !== id)
    setCerrados(nuevaCerrados)
    setBurbuja(nuevaBurbuja)
    sessionStorage.setItem('avisos_cerrados', JSON.stringify(nuevaCerrados))
    sessionStorage.setItem('avisos_burbuja',  JSON.stringify(nuevaBurbuja))
  }

  if (avisos.length === 0) return null

  return (
    <>
      {/* Banners activos */}
      {avisos
        .filter(a => !cerrados.includes(a.id))
        .map(a => <BannerAviso key={a.id} aviso={a} onCerrar={() => cerrarAviso(a.id)} />)
      }
      {/* Burbujas flotantes */}
      {avisos
        .filter(a => burbuja.includes(a.id))
        .map(a => <BurbujaFlotante key={a.id + '-b'} aviso={a} onReabrir={() => reabrirAviso(a.id)} />)
      }
    </>
  )
}

function BannerAviso({ aviso, onCerrar }) {
  const fechaFin  = aviso.fechaFin?.toDate?.() ?? (aviso.fechaFin ? new Date(aviso.fechaFin) : null)
  const countdown = useCountdown(fechaFin)
  const colores   = TIPO_COLOR[aviso.tipo] ?? TIPO_COLOR.info

  return (
    <div style={{
      background: colores.bg,
      border: `1px solid ${colores.border}`,
      borderRadius: 12,
      padding: '12px 16px',
      marginBottom: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      animation: 'fadeIn .3s ease',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
        {TIPO_ICON[aviso.tipo] ?? 'ℹ️'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--t100)' }}>
          {aviso.titulo}
        </strong>
        {aviso.descripcion && (
          <p style={{ fontSize: 13, color: 'var(--t400)', margin: '3px 0 0', lineHeight: 1.4 }}>
            {aviso.descripcion}
          </p>
        )}
        {aviso.tipo === 'cierre' && fechaFin && countdown && (
          <p style={{ fontSize: 12, fontWeight: 700, color: colores.icon, marginTop: 4 }}>
            ⏱ Tiempo restante: {countdown}
          </p>
        )}
      </div>
      <button
        onClick={onCerrar}
        aria-label="Cerrar aviso"
        style={{
          background: 'none', border: 'none',
          fontSize: 18, cursor: 'pointer',
          color: 'var(--t500)', lineHeight: 1,
          padding: '0 4px', flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}
