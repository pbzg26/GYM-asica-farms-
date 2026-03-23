import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cerrarSesion } from '../../services/authService'

export default function Layout() {
  const { usuario, perfil, esAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  const videoRef = useRef(null)

  // Reproduce el video una sola vez cada vez que se cambia de pestaña
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [location.pathname])

  async function handleLogout() {
    await cerrarSesion()
    navigate('/')
  }

  return (
    <div className={`app-shell ${menuCollapsed ? 'is-collapsed' : ''}`}>
      {/* Global Video Background */}
      <video ref={videoRef} autoPlay muted playsInline className="video-bg global-video-bg">
        <source src="/video-bg.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay global-video-overlay"></div>

      {/* ── Header ─────────────────────────────────── */}
      <header className="header glass-panel">
        <div className="header__logo">
          <button className="menu-toggle-btn" onClick={() => setMenuCollapsed(!menuCollapsed)}>
            ☰
          </button>
          <img src="/logo.png" alt="Gym Asica Farms" className="header__logo-img" />
          <div className="header__logo-text">
            <span className="header__logo-name">GYM ASICA FARMS</span>
            <span className="header__logo-sub">Olmos, Perú</span>
          </div>
        </div>

        <div className="header__actions">
          {usuario ? (
            <div className="header__user">
              <span className="header__group-badge">
                Grupo {perfil?.grupo ?? '...'}
              </span>
              <button className="btn btn--outline btn--sm" onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <button className="btn btn--primary btn--sm" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      {/* ── Contenido principal ─────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── Nav inferior / lateral ─────────────── */}
      <nav className="bottom-nav glass-panel">
        <NavLink to="/" end     className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">🏠</span>
          <span className="bottom-nav__label">Inicio</span>
        </NavLink>
        <NavLink to="/guia"     className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">💡</span>
          <span className="bottom-nav__label">Guía</span>
        </NavLink>
        <NavLink to="/maquinas" className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">🏋️</span>
          <span className="bottom-nav__label">Máquinas</span>
        </NavLink>
        <NavLink to="/rutinas"  className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">📅</span>
          <span className="bottom-nav__label">Rutinas</span>
        </NavLink>
        <NavLink to="/perfil"   className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">👤</span>
          <span className="bottom-nav__label">Perfil</span>
        </NavLink>
        <NavLink to="/coach"    className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
          <span className="bottom-nav__icon">🤖</span>
          <span className="bottom-nav__label">Coach</span>
        </NavLink>
        {esAdmin && (
          <NavLink to="/admin"  className={({isActive}) => `bottom-nav__item${isActive?' active':''}`}>
            <span className="bottom-nav__icon">⚙️</span>
            <span className="bottom-nav__label">Admin</span>
          </NavLink>
        )}
      </nav>
    </div>
  )
}
