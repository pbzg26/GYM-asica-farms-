import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerContenidoApp, guardarContenidoApp } from '../services/dbService'

const DEFAULT_HERO = {
  titulo:   'MUEVE TU\nCUERPO HOY',
  subtitulo:'El gym de Asica Farms está listo para ti.\nEntrena, progresa y cuídate en Olmos, Perú.',
}

const DEFAULT_CARDS_GUEST = [
  { icon:'💡', titulo:'¿Por qué ejercitarse?',  desc:'Beneficios y técnica correcta',    link:'/guia'    },
  { icon:'🏋️', titulo:'Máquinas del gym',       desc:'Ejercicios con videos de YouTube', link:'/maquinas'},
  { icon:'📅', titulo:'Rutinas semanales',       desc:'5 grupos · 7 días · Sin saturar',  link:'/rutinas' },
  { icon:'🤖', titulo:'Mango Coach IA',          desc:'Inicia sesión para usarlo',        link:'/login'   },
]

export default function Inicio() {
  const navigate   = useNavigate()
  const { usuario, perfil, esAdmin } = useAuth()

  const [modoEdicion, setModoEdicion] = useState(false)
  const [guardando,   setGuardando]   = useState(false)
  const [guardado,    setGuardado]    = useState(false)

  // Contenido editable cargado de Firestore (con fallback a defaults)
  const [hero,    setHero]    = useState(DEFAULT_HERO)
  const [cardsG,  setCardsG]  = useState(DEFAULT_CARDS_GUEST)

  // Estado de edición local (copia mientras se edita)
  const [editHero,   setEditHero]   = useState(null)
  const [editCardsG, setEditCardsG] = useState(null)

  useEffect(() => {
    obtenerContenidoApp('inicio')
      .then(data => {
        if (!data) return
        if (data.hero)        setHero(data.hero)
        if (data.cardsGuest)  setCardsG(data.cardsGuest)
      })
      .catch(() => {})
  }, [])

  function activarEditor() {
    setEditHero({ ...hero })
    setEditCardsG(cardsG.map(c => ({ ...c })))
    setModoEdicion(true)
  }

  function cancelarEditor() {
    setModoEdicion(false)
    setEditHero(null)
    setEditCardsG(null)
  }

  async function guardar() {
    setGuardando(true)
    try {
      await guardarContenidoApp('inicio', {
        hero:       editHero,
        cardsGuest: editCardsG,
      })
      setHero(editHero)
      setCardsG(editCardsG)
      setModoEdicion(false)
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3500)
    } catch (e) { console.error(e) }
    setGuardando(false)
  }

  function updateCard(i, field, val) {
    setEditCardsG(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }

  // ── Vista usuario logueado ──────────────────────────────────
  if (usuario && perfil) {
    return (
      <div className="page animate-fade">
        <div className="page__header">
          <h2 className="page__title">Panel de entrenamiento</h2>
          <p className="page__sub">
            Hola, <strong>{perfil.nombre?.split(' ')[0]}</strong> — Grupo <strong>{perfil.grupo}</strong>
          </p>
        </div>

        {guardado && <div className="toast-ok">✓ Contenido guardado correctamente</div>}

        <div className="dash-stats">
          <div className="dash-stat dash-stat--accent">
            <div className="dash-stat__val">—</div>
            <div className="dash-stat__lbl">Racha días</div>
            <div className="dash-stat__sub">Ve tu perfil →</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__val" style={{color:'var(--g500)', fontFamily:'var(--font-display)'}}>
              {perfil.grupo}
            </div>
            <div className="dash-stat__lbl">Tu grupo</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__val">—</div>
            <div className="dash-stat__lbl">Rutinas mes</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__val">—</div>
            <div className="dash-stat__lbl">Min. totales</div>
          </div>
        </div>

        <div className="quick-access">
          <button className="quick-card" onClick={() => navigate('/rutinas')}>
            <span className="quick-card__icon">📅</span>
            <div>
              <h3>Comenzar rutina de hoy</h3>
              <p>Grupo {perfil.grupo} · Sigue tu plan semanal</p>
            </div>
            <span className="quick-card__arrow">›</span>
          </button>
          <button className="quick-card" onClick={() => navigate('/coach')}>
            <span className="quick-card__icon">🤖</span>
            <div>
              <h3>Mango Coach IA</h3>
              <p>Ejercicios, técnica y nutrición</p>
            </div>
            <span className="quick-card__arrow">›</span>
          </button>
          <button className="quick-card" onClick={() => navigate('/maquinas')}>
            <span className="quick-card__icon">🏋️</span>
            <div>
              <h3>Máquinas del gym</h3>
              <p>Guía de ejercicios y videos</p>
            </div>
            <span className="quick-card__arrow">›</span>
          </button>
          <button className="quick-card" onClick={() => navigate('/perfil')}>
            <span className="quick-card__icon">📊</span>
            <div>
              <h3>Mi progreso y salud</h3>
              <p>IMC, gráficas e historial</p>
            </div>
            <span className="quick-card__arrow">›</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Vista guest ──────────────────────────────────────────────
  const displayHero  = modoEdicion ? editHero   : hero
  const displayCards = modoEdicion ? editCardsG : cardsG

  return (
    <div className="page animate-fade">

      {/* Banner editor */}
      {esAdmin && modoEdicion && (
        <div className="editor-banner">
          ✏️ Modo editor activo — edita el texto directamente y pulsa <strong>Guardar</strong>
          <span style={{float:'right',display:'flex',gap:8}}>
            <button className="btn btn--primary btn--sm" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar'}
            </button>
            <button className="btn btn--ghost btn--sm" onClick={cancelarEditor}>Cancelar</button>
          </span>
        </div>
      )}

      {/* Botón activar editor (admin, fuera de modo editor) */}
      {esAdmin && !modoEdicion && (
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
          <button className="btn btn--ghost btn--sm" onClick={activarEditor}>✏️ Modo editor</button>
        </div>
      )}

      {guardado && <div className="toast-ok">✓ Contenido guardado correctamente</div>}

      <section className="hero">
        <div className="hero__fruits">
          <span className="fruit-char">🥭</span>
          <span className="fruit-char">🥑</span>
          <span className="fruit-char">🍇</span>
          <span className="fruit-char">🍇</span>
        </div>

        {modoEdicion ? (
          <>
            <textarea
              className="hero-edit-field"
              rows={2}
              value={editHero.titulo}
              onChange={e => setEditHero(h => ({ ...h, titulo: e.target.value }))}
              style={{fontSize:28,fontWeight:900,marginBottom:10}}
            />
            <textarea
              className="hero-edit-field"
              rows={3}
              value={editHero.subtitulo}
              onChange={e => setEditHero(h => ({ ...h, subtitulo: e.target.value }))}
              style={{fontSize:14,fontWeight:400}}
            />
          </>
        ) : (
          <>
            <h1 className="hero__title">
              {displayHero.titulo.split('\n').map((l, i) => (
                <span key={i}>{i > 0 ? <><br /><span>{l}</span></> : l}</span>
              ))}
            </h1>
            <p className="hero__sub">
              {displayHero.subtitulo.split('\n').map((l, i) => (
                <span key={i}>{i > 0 ? <><br />{l}</> : l}</span>
              ))}
            </p>
          </>
        )}

        {!modoEdicion && (
          <div className="hero__actions">
            <button className="btn btn--dark btn--lg" onClick={() => navigate('/registro')}>
              Crear cuenta gratis
            </button>
            <button className="btn btn--outline btn--lg" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </div>
        )}
      </section>

      <div style={{height: 1, background:'var(--bd)', margin:'8px 0 24px'}} />

      <div className="quick-access">
        {displayCards.map((card, i) => (
          modoEdicion ? (
            <div key={i} className="quick-card quick-card--editing">
              <span className="quick-card__icon">{card.icon}</span>
              <div className="quick-card__edit-fields">
                <input
                  value={card.titulo}
                  onChange={e => updateCard(i, 'titulo', e.target.value)}
                  placeholder="Título"
                />
                <input
                  value={card.desc}
                  onChange={e => updateCard(i, 'desc', e.target.value)}
                  placeholder="Descripción"
                />
              </div>
            </div>
          ) : (
            <button key={i} className="quick-card" onClick={() => navigate(card.link)}>
              <span className="quick-card__icon">{card.icon}</span>
              <div><h3>{card.titulo}</h3><p>{card.desc}</p></div>
              <span className="quick-card__arrow">›</span>
            </button>
          )
        ))}
      </div>
    </div>
  )
}
