import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Inicio() {
  const navigate = useNavigate()
  const { usuario, perfil } = useAuth()

  if (usuario && perfil) {
    return (
      <div className="page animate-fade">
        <div className="page__header">
          <h2 className="page__title">Panel de entrenamiento</h2>
          <p className="page__sub">
            Hola, <strong>{perfil.nombre?.split(' ')[0]}</strong> — Grupo <strong>{perfil.grupo}</strong>
          </p>
        </div>

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

  return (
    <div className="page animate-fade">
      <section className="hero">
        <div className="hero__fruits">
          <span className="fruit-char">🥭</span>
          <span className="fruit-char">🥑</span>
          <span className="fruit-char">🍇</span>
          <span className="fruit-char">🍇</span>
        </div>
        <h1 className="hero__title">
          MUEVE TU<br /><span>CUERPO HOY</span>
        </h1>
        <p className="hero__sub">
          El gym de Asica Farms está listo para ti.<br />
          Entrena, progresa y cuídate en Olmos, Perú.
        </p>
        <div className="hero__actions">
          <button className="btn btn--dark btn--lg" onClick={() => navigate('/registro')}>
            Crear cuenta gratis
          </button>
          <button className="btn btn--outline btn--lg" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </section>

      <div style={{height: 1, background:'var(--bd)', margin:'8px 0 24px'}} />

      <div className="quick-access">
        <button className="quick-card" onClick={() => navigate('/guia')}>
          <span className="quick-card__icon">💡</span>
          <div><h3>¿Por qué ejercitarse?</h3><p>Beneficios y técnica correcta</p></div>
          <span className="quick-card__arrow">›</span>
        </button>
        <button className="quick-card" onClick={() => navigate('/maquinas')}>
          <span className="quick-card__icon">🏋️</span>
          <div><h3>Máquinas del gym</h3><p>Ejercicios con videos de YouTube</p></div>
          <span className="quick-card__arrow">›</span>
        </button>
        <button className="quick-card" onClick={() => navigate('/rutinas')}>
          <span className="quick-card__icon">📅</span>
          <div><h3>Rutinas semanales</h3><p>5 grupos · 7 días · Sin saturar</p></div>
          <span className="quick-card__arrow">›</span>
        </button>
        <button className="quick-card" onClick={() => navigate('/login')}>
          <span className="quick-card__icon">🤖</span>
          <div><h3>Mango Coach IA</h3><p>Inicia sesión para usarlo</p></div>
          <span className="quick-card__arrow">›</span>
        </button>
      </div>
    </div>
  )
}
