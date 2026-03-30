import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'

// Pages
import Inicio      from './pages/Inicio'
import Guia        from './pages/Guia'
import Maquinas    from './pages/Maquinas'
import Rutinas     from './pages/Rutinas'
import Perfil      from './pages/Perfil'
import Coach       from './pages/Coach'
import Login       from './pages/Login'
import Registro    from './pages/Registro'
import Admin               from './pages/Admin'
import RutinaPersonalizada from './pages/RutinaPersonalizada'
import Cardio              from './pages/Cardio'
import Reportes            from './pages/Reportes'
import Dashboard           from './pages/Dashboard'
import NotFound            from './pages/NotFound'

// Ruta protegida — solo usuarios logueados
function RutaPrivada({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div className="loading">Cargando...</div>
  return usuario ? children : <Navigate to="/login" replace />
}

// Ruta de admin
function RutaAdmin({ children }) {
  const { esAdmin, cargando } = useAuth()
  if (cargando) return <div className="loading">Cargando...</div>
  return esAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas con layout completo */}
      <Route element={<Layout />}>
        <Route path="/"          element={<Inicio />} />
        <Route path="/guia"      element={<Guia />} />
        <Route path="/maquinas"  element={<Maquinas />} />
        <Route path="/rutinas"   element={<Rutinas />} />
        <Route path="/perfil"    element={<Perfil />} />
        <Route path="/cardio"    element={<Cardio />} />
        <Route path="/reportes"  element={<Reportes />} />

        {/* Coach solo para usuarios logueados */}
        <Route path="/coach" element={
          <RutaPrivada><Coach /></RutaPrivada>
        } />

        {/* Rutina personalizada */}
        <Route path="/rutina-personalizada" element={
          <RutaPrivada><RutinaPersonalizada /></RutaPrivada>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <RutaAdmin><Admin /></RutaAdmin>
        } />

        {/* Dashboard super admin */}
        <Route path="/dashboard" element={
          <RutaAdmin><Dashboard /></RutaAdmin>
        } />
      </Route>

      {/* Auth sin layout */}
      <Route path="/login"    element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="*"         element={<NotFound />} />
    </Routes>
  )
}
