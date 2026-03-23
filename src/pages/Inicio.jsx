// ============================================================
// PÁGINA: Inicio
// ============================================================
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Inicio() {
  const navigate = useNavigate()
  const { usuario, perfil } = useAuth()

  return (
    <div className="page page--inicio">
      <div className="inicio-content">
        <section className="hero">
          <h1 className="hero__title">MUEVE TU<br />CUERPO HOY</h1>
          <p className="hero__sub">El gym de Asica Farms está listo para ti.<br />Entrena, progresa y cuídate.</p>

          {usuario && perfil && (
            <div className="hero__welcome glass-panel">
              ¡Bienvenido, <strong>{perfil.nombre}</strong>!<br />Tu rutina de hoy es <strong>Grupo {perfil.grupo}</strong>.
            </div>
          )}
        </section>

        {/* Cards de acceso rápido */}
        <div className="quick-access">
          <button className="quick-card glass-card" onClick={() => navigate('/guia')}>
            <span className="quick-card__icon">💡</span>
            <div>
              <h3>¿Por qué ejercitarse?</h3>
              <p>Beneficios y técnica correcta</p>
            </div>
          </button>
          <button className="quick-card glass-card" onClick={() => navigate('/maquinas')}>
            <span className="quick-card__icon">🏋️</span>
            <div>
              <h3>Máquinas del Gym</h3>
              <p>Explora ejercicios disponibles</p>
            </div>
          </button>
          <button className="quick-card glass-card" onClick={() => navigate('/rutinas')}>
            <span className="quick-card__icon">📅</span>
            <div>
              <h3>Mi Rutina Semanal</h3>
              <p>7 días · 5 grupos · Sin saturar</p>
            </div>
          </button>
          <button className="quick-card glass-card" onClick={() => navigate(usuario ? '/coach' : '/login')}>
            <span className="quick-card__icon">🤖</span>
            <div>
              <h3>Mango Coach IA</h3>
              <p>{usuario ? 'Pregúntale lo que quieras' : 'Inicia sesión para usarlo'}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
