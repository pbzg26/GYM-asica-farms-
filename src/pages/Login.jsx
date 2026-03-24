import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState('')
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
      {/* Panel izquierdo — branding */}
      <div className="auth-left">
        <div className="auth-brand animate-fade">
          <div className="auth-brand__logo">
            <img src="/logo.png" alt="GYM Asica" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
            <span style={{display:'none'}}>🌿</span>
          </div>
          <h1>GYM ASICA FARMS</h1>
          <p>Tu plataforma de entrenamiento<br />en Olmos, Perú</p>
          <div className="auth-fruits">
            <span>🥭</span><span>🥑</span><span>🍇</span><span>🍇</span>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-card animate-up">
        <p className="auth-card__eyebrow">Bienvenido de vuelta</p>
        <h2 className="auth-card__title">Inicia sesión</h2>
        <p className="auth-card__sub">Accede a tu perfil, rutinas y al Coach IA</p>

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

          {error && (
            <p className="form-error">⚠️ {error}</p>
          )}

          <button
            className="btn btn--primary btn--full"
            type="submit"
            disabled={cargando}
            style={{marginTop: 8}}
          >
            {cargando ? 'Entrando...' : 'Iniciar sesión →'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿No tienes cuenta?{' '}
          <Link to="/registro">Regístrate gratis</Link>
        </p>
        <p className="auth-card__guest">
          <Link to="/">← Explorar sin cuenta</Link>
        </p>
      </div>
    </div>
  )
}

function traducirError(code) {
  const errores = {
    'auth/user-not-found':     'No existe una cuenta con ese correo.',
    'auth/wrong-password':     'Contraseña incorrecta.',
    'auth/invalid-email':      'El formato del correo no es válido.',
    'auth/too-many-requests':  'Demasiados intentos. Espera unos minutos.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.'
  }
  return errores[code] ?? 'Error al iniciar sesión. Intenta de nuevo.'
}
