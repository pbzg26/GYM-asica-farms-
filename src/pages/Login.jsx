import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [form,     setForm]     = useState({ correo: '', contrasena: '' })
  const [error,    setError]    = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await iniciarSesion({ correo: form.correo, contrasena: form.contrasena })
      navigate('/')
    } catch (err) {
      setError(traducirError(err.code))
    }
    setCargando(false)
  }

  return (
    <div className="auth-page">
      {/* AI Studio: fondo con imagen del gym o personajes frutas */}
      <div className="auth-card">
        <div className="auth-card__fruits">
          <span>🥭</span><span>🥑</span><span>🍇</span><span>🍇</span>
        </div>

        <h1 className="auth-card__title">BIENVENIDO</h1>
        <p className="auth-card__sub">Inicia sesión para acceder a tu perfil y al Coach IA</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={form.correo}
              onChange={e => setForm(p => ({...p, correo: e.target.value}))}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.contrasena}
              onChange={e => setForm(p => ({...p, contrasena: e.target.value}))}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn--primary btn--full" type="submit" disabled={cargando}>
            {cargando ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p className="auth-card__guest">
          <Link to="/">Continuar sin registrarme</Link>
        </p>
      </div>
    </div>
  )
}

function traducirError(code) {
  const errores = {
    'auth/user-not-found':   'No existe una cuenta con ese correo.',
    'auth/wrong-password':   'Contraseña incorrecta.',
    'auth/invalid-email':    'El formato del correo no es válido.',
    'auth/too-many-requests':'Demasiados intentos. Espera unos minutos.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.'
  }
  return errores[code] ?? 'Error al iniciar sesión. Intenta de nuevo.'
}
