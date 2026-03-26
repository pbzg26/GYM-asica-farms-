import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cerrarSesion } from '../../services/authService'
import AvisoGym from '../AvisoGym'

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
  const navigate  = useNavigate()
  const location  = useLocation()
  const [drawer, setDrawer] = useState(false)

  // Cerrar drawer al navegar
  useEffect(() => { setDrawer(false) }, [location.pathname])

  // Bloquear scroll body en móvil con drawer abierto
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

  // Foto de perfil si existe
  const fotoUrl = perfil?.fotoUrl ?? null

  return (
    <div className="shell">
      {/* Overlay oscuro — solo móvil cuando drawer abierto */}
      {drawer && (
        <div
          className="overlay"
          onClick={() => setDrawer(false)}
          style={{display:'block'}}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className={`sidebar${drawer ? ' sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo__icon">
            <img
              src="/logo.png"
              alt="Asica Farms"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
            <span style={{display:'none',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'18px'}}>🌿</span>
          </div>
          <div>
            <span className="sidebar-logo__name">GYM ASICA FARMS</span>
            <span className="sidebar-logo__sub">Olmos, Perú</span>
          </div>
        </div>

        {/* Usuario */}
        {usuario && perfil && (
          <div className="sidebar-user">
            <div className="sidebar-user__av" style={fotoUrl ? {padding:0,overflow:'hidden'} : {}}>
              {fotoUrl
                ? <img src={fotoUrl} alt={perfil.nombre} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                : inicial
              }
            </div>
            <div>
              <span className="sidebar-user__name">{perfil.nombre?.split(' ')[0]}</span>
              <span className="sidebar-user__info">
                {perfil.grupo ? `Grupo ${perfil.grupo}` : '—'}
                {esAdmin && ' · Admin'}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="sidebar-nav__label">Principal</span>
          <NavLink to="/" className={nc} end>
            <span className="nav-icon">🏠</span>Inicio
          </NavLink>
          <NavLink to="/guia" className={nc}>
            <span className="nav-icon">💡</span>Guía
          </NavLink>
          <NavLink to="/maquinas" className={nc}>
            <span className="nav-icon">🏋️</span>Máquinas
          </NavLink>
          <NavLink to="/rutinas" className={nc}>
            <span className="nav-icon">📅</span>Rutinas
            {getDiaLabel() !== 'Dom' && <span className="nav-pill">HOY</span>}
          </NavLink>
          <NavLink to="/cardio" className={nc}>
            <span className="nav-icon">🏃</span>Cardio
          </NavLink>

          <span className="sidebar-nav__label">Personal</span>
          <NavLink to="/perfil" className={nc}>
            <span className="nav-icon">👤</span>Mi Perfil
          </NavLink>

          {usuario ? (
            <NavLink to="/coach" className={nc}>
              <span className="nav-icon">🤖</span>Coach IA
            </NavLink>
          ) : (
            <button
              className="nav-link nav-link--muted"
              onClick={() => navigate('/login')}
            >
              <span className="nav-icon">🤖</span>
              Coach IA
              <span className="nav-pill" style={{background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.5)'}}>Login</span>
            </button>
          )}

          {usuario && (
            <NavLink to="/rutina-personalizada" className={nc}>
              <span className="nav-icon">⭐</span>Mi Rutina
            </NavLink>
          )}

          {esAdmin && (
            <>
              <span className="sidebar-nav__label">Admin</span>
              <NavLink to="/admin" className={nc}>
                <span className="nav-icon">⚙️</span>Panel Admin
              </NavLink>
            </>
          )}
        </nav>

        {/* Foot */}
        <div className="sidebar-foot">
          {usuario ? (
            <button className="sidebar-logout" onClick={handleLogout}>
              <span>🚪</span>Cerrar sesión
            </button>
          ) : (
            <button
              className="sidebar-login-cta"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <div className="main-wrap">
        {/* Topbar */}
        <header className="topbar">
          {/* Burger — solo móvil */}
          <button
            className="topbar__burger"
            onClick={() => setDrawer(v => !v)}
            aria-label="Abrir menú"
          >
            <span style={drawer ? {transform:'rotate(45deg) translate(5px,5px)'} : {}} />
            <span style={{opacity: drawer ? 0 : 1}} />
            <span style={drawer ? {transform:'rotate(-45deg) translate(5px,-5px)'} : {}} />
          </button>

          <span className="topbar__title">
            {getSaludo()}, {perfil?.nombre?.split(' ')[0] ?? 'Atleta'} 👋
          </span>

          <div className="topbar__right">
            {perfil?.grupo && (
              <span className="topbar__badge">
                {getDiaLabel()} · Grupo {perfil.grupo}
              </span>
            )}
            {!usuario && (
              <button
                className="btn btn--outline btn--sm"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </header>

        <main className="main-content">
          <AvisoGym />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
