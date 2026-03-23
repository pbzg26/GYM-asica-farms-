import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cerrarSesion } from '../../services/authService'

function getSaludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function getDiaLabel() {
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  return dias[new Date().getDay()]
}

export default function Layout() {
  const { usuario, perfil, esAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawer, setDrawer] = useState(false)

  useEffect(() => { setDrawer(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  async function handleLogout() {
    await cerrarSesion()
    navigate('/')
  }

  const nc = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`
  const inicial = perfil?.nombre?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className="shell">
      {/* Overlay móvil */}
      {drawer && <div className="overlay" onClick={() => setDrawer(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar${drawer ? ' sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo__icon">
            <img src="/logo.png" alt="Logo" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
            <span style={{display:'none',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'20px'}}>🌿</span>
          </div>
          <div>
            <span className="sidebar-logo__name">GYM ASICA</span>
            <span className="sidebar-logo__sub">Olmos, Perú</span>
          </div>
        </div>

        {usuario && perfil && (
          <div className="sidebar-user">
            <div className="sidebar-user__av">{inicial}</div>
            <div>
              <span className="sidebar-user__name">{perfil.nombre?.split(' ')[0]}</span>
              <span className="sidebar-user__info">
                {perfil.grupo ? `Grupo ${perfil.grupo}` : '—'}
                {esAdmin && ' · Admin'}
              </span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <span className="sidebar-nav__label">Principal</span>
          <NavLink to="/" className={nc} end><span className="nav-icon">🏠</span>Inicio</NavLink>
          <NavLink to="/guia" className={nc}><span className="nav-icon">💡</span>Guía</NavLink>
          <NavLink to="/maquinas" className={nc}><span className="nav-icon">🏋️</span>Máquinas</NavLink>
          <NavLink to="/rutinas" className={nc}>
            <span className="nav-icon">📅</span>Rutinas
            {getDiaLabel() !== 'Dom' && <span className="nav-pill">HOY</span>}
          </NavLink>

          <span className="sidebar-nav__label">Personal</span>
          <NavLink to="/perfil" className={nc}><span className="nav-icon">👤</span>Mi Perfil</NavLink>
          {usuario
            ? <NavLink to="/coach" className={nc}><span className="nav-icon">🤖</span>Coach IA</NavLink>
            : <button className="nav-link nav-link--muted" onClick={() => navigate('/login')}>
                <span className="nav-icon">🤖</span>Coach IA
                <span className="nav-pill nav-pill--muted">Login</span>
              </button>
          }
          {usuario && (
            <NavLink to="/rutina-personalizada" className={nc}>
              <span className="nav-icon">⭐</span>Mi Rutina
            </NavLink>
          )}

          {esAdmin && <>
            <span className="sidebar-nav__label">Admin</span>
            <NavLink to="/admin" className={nc}><span className="nav-icon">⚙️</span>Panel Admin</NavLink>
          </>}
        </nav>

        <div className="sidebar-foot">
          {usuario
            ? <button className="sidebar-logout" onClick={handleLogout}>
                <span>🚪</span>Cerrar sesión
              </button>
            : <button className="btn btn--primary btn--full" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
          }
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-wrap">
        <header className="topbar">
          <button className="topbar__burger" onClick={() => setDrawer(v => !v)} aria-label="Menú">
            <span /><span /><span />
          </button>
          <span className="topbar__title">
            {getSaludo()}, {perfil?.nombre?.split(' ')[0] ?? 'Atleta'} 👋
          </span>
          <div className="topbar__right">
            {perfil?.grupo && (
              <span className="topbar__badge">{getDiaLabel()} · Grupo {perfil.grupo}</span>
            )}
            {!usuario && (
              <button className="btn btn--outline btn--sm" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
            )}
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
