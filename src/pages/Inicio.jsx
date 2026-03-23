import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Inicio() {
  const navigate = useNavigate()
  const { usuario, perfil } = useAuth()

  return (
    <div className="page">
      {usuario && perfil ? (
        // Dashboard para usuario logueado
        <div className="animate-fade">
          <div className="page__header">
            <h2 className="page__title">Panel de entrenamiento</h2>
            <p className="page__sub">Aquí está tu resumen de hoy, {perfil.nombre?.split(' ')[0]}</p>
          </div>

          <div className="dash-stats">
            <div className="dash-stat dash-stat--accent">
              <div className="dash-stat__val">—</div>
              <div className="dash-stat__lbl">Racha días</div>
              <div className="dash-stat__sub">Ve al perfil →</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat__val" style={{color:'var(--g700)'}}>
                {perfil.grupo ?? '—'}
              </div>
              <div className="dash-stat__lbl">Tu grupo</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat__val">—</div>
              <div className="dash-stat__lbl">Rutinas mes</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat__val">—</div>
              <div className="dash-stat__lbl">Tiempo total</div>
            </div>
          </div>

          <div className="quick-access">
            <button className="quick-card" onClick={() => navigate('/rutinas')}>
              <span className="quick-card__icon">📅</span>
              <div>
                <h3>Comenzar rutina de hoy</h3>
                <p>Grupo {perfil.grupo} · Sigue tu plan semanal</p>
              </div>
            </button>
            <button className="quick-card" onClick={() => navigate('/coach')}>
              <span className="quick-card__icon">🤖</span>
              <div>
                <h3>Mango Coach IA</h3>
                <p>Pregunta sobre ejercicios o nutrición</p>
              </div>
            </button>
            <button className="quick-card" onClick={() => navigate('/maquinas')}>
              <span className="quick-card__icon">🏋️</span>
              <div>
                <h3>Máquinas del gym</h3>
                <p>Ejercicios, técnica y videos</p>
              </div>
            </button>
            <button className="quick-card" onClick={() => navigate('/perfil')}>
              <span className="quick-card__icon">📊</span>
              <div>
                <h3>Mi progreso y salud</h3>
                <p>IMC, gráficas y historial</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Hero para visitante
        <div className="animate-fade">
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
              Entrena, progresa y cuídate.
            </p>
            <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
              <button className="btn btn--primary btn--lg" onClick={() => navigate('/registro')}>
                Crear cuenta gratis
              </button>
              <button className="btn btn--outline btn--lg" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
            </div>
          </section>

          <div className="quick-access">
            <button className="quick-card" onClick={() => navigate('/guia')}>
              <span className="quick-card__icon">💡</span>
              <div><h3>¿Por qué ejercitarse?</h3><p>Beneficios y técnica correcta</p></div>
            </button>
            <button className="quick-card" onClick={() => navigate('/maquinas')}>
              <span className="quick-card__icon">🏋️</span>
              <div><h3>Máquinas del gym</h3><p>Explora ejercicios disponibles</p></div>
            </button>
            <button className="quick-card" onClick={() => navigate('/rutinas')}>
              <span className="quick-card__icon">📅</span>
              <div><h3>Rutinas semanales</h3><p>7 días · 5 grupos · Sin saturar</p></div>
            </button>
            <button className="quick-card" onClick={() => navigate('/login')}>
              <span className="quick-card__icon">🤖</span>
              <div><h3>Mango Coach IA</h3><p>Inicia sesión para usarlo</p></div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
