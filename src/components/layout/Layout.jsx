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
  const { usuario, perfil, esAdmin, esSuperAdmin } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [drawer, setDrawer] = useState(false)
  const [colapsado, setColapsado] = useState(() => {
    try { return localStorage.getItem('sidebar_colapsado') === '1' } catch { return false }
  })

  // Cerrar drawer al navegar
  useEffect(() => { setDrawer(false) }, [location.pathname])

  // Bloquear scroll body en móvil con drawer abierto
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  // Persistir preferencia de sidebar colapsado
  useEffect(() => {
    try { localStorage.setItem('sidebar_colapsado', colapsado ? '1' : '0') } catch {}
    document.documentElement.style.setProperty('--sw', colapsado ? '72px' : '260px')
  }, [colapsado])

  // Inicializar variable CSS al montar
  useEffect(() => {
    document.documentElement.style.setProperty('--sw', colapsado ? '72px' : '260px')
  }, [])

  async function handleLogout() {
    await cerrarSesion()
    navigate('/')
  }

  const nc = ({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`
  const inicial = perfil?.nombre?.charAt(0)?.toUpperCase() ?? '?'
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
      <aside className={`sidebar${drawer ? ' sidebar--open' : ''}${colapsado ? ' sidebar--collapsed' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo__icon">
            <img
              src="/logo.png"
              alt="Asica Farms"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
            />
            <span style={{display:'none',alignItems:'center',justifyContent:'center',width:'100%',height:'100%',fontSize:'20px'}}>🌿</span>
          </div>
          {!colapsado && (
            <div>
              <span className="sidebar-logo__name">GYM ASICA FARMS</span>
              <span className="sidebar-logo__sub">Olmos, Perú</span>
            </div>
          )}
        </div>

        {/* Usuario — solo si no colapsado */}
        {usuario && perfil && !colapsado && (
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
          {!colapsado && <span className="sidebar-nav__label">Principal</span>}
          <NavLink to="/" className={nc} end title="Inicio">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </NavLink>
          <NavLink to="/guia" className={nc} title="Guía">
            <span className="nav-icon">💡</span>
            <span className="nav-text">Guía</span>
          </NavLink>
          <NavLink to="/maquinas" className={nc} title="Máquinas">
            <span className="nav-icon">🏋️</span>
            <span className="nav-text">Máquinas</span>
          </NavLink>
          <NavLink to="/rutinas" className={nc} title="Rutinas">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Rutinas</span>
            {!colapsado && getDiaLabel() !== 'Dom' && <span className="nav-pill">HOY</span>}
          </NavLink>
          <NavLink to="/cardio" className={nc} title="Cardio">
            <span className="nav-icon">🏃</span>
            <span className="nav-text">Cardio</span>
          </NavLink>
          <NavLink to="/reportes" className={nc} title="Reportes">
            <span className="nav-icon">📢</span>
            <span className="nav-text">Reportes</span>
          </NavLink>

          {!colapsado && <span className="sidebar-nav__label">Personal</span>}
          {colapsado && <div style={{height:8}} />}
          <NavLink to="/perfil" className={nc} title="Mi Perfil">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Mi Perfil</span>
          </NavLink>

          {usuario ? (
            <NavLink to="/coach" className={nc} title="Coach IA">
              <span className="nav-icon">🤖</span>
              <span className="nav-text">Coach IA</span>
            </NavLink>
          ) : (
            <button
              className="nav-link nav-link--muted"
              onClick={() => navigate('/login')}
              title="Coach IA"
            >
              <span className="nav-icon">🤖</span>
              <span className="nav-text">Coach IA</span>
              {!colapsado && <span className="nav-pill" style={{background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.5)'}}>Login</span>}
            </button>
          )}

          {usuario && (
            <NavLink to="/rutina-personalizada" className={nc} title="Mi Rutina">
              <span className="nav-icon">⭐</span>
              <span className="nav-text">Mi Rutina</span>
            </NavLink>
          )}

          {esAdmin && (
            <>
              {!colapsado && <span className="sidebar-nav__label">Admin</span>}
              {colapsado && <div style={{height:8}} />}
              <NavLink to="/admin" className={nc} title="Panel Admin">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Panel Admin</span>
              </NavLink>
              {esSuperAdmin && (
                <NavLink to="/dashboard" className={nc} title="Dashboard">
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Dashboard</span>
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Foot */}
        <div className="sidebar-foot">
          {usuario ? (
            <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
              <span>🚪</span>
              <span className="nav-text">Cerrar sesión</span>
            </button>
          ) : (
            <button
              className="sidebar-login-cta"
              onClick={() => navigate('/login')}
            >
              {colapsado ? '→' : 'Iniciar sesión'}
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

          {/* Toggle sidebar — solo desktop */}
          <button
            className="topbar__collapse-btn"
            onClick={() => setColapsado(v => !v)}
            aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
            title={colapsado ? 'Expandir menú' : 'Colapsar menú'}
          >
            {colapsado ? '▶' : '◀'}
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
