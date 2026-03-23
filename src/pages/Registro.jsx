import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registrarUsuario } from '../services/authService'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' })
  const [error,    setError]    = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setCargando(true)
    try {
      const { grupo } = await registrarUsuario({
        nombre:     form.nombre,
        correo:     form.correo,
        contrasena: form.contrasena
      })
      // Redirigir a perfil con mensaje de bienvenida
      navigate(`/?nuevo=true&grupo=${grupo}`)
    } catch (err) {
      setError(traducirError(err.code))
    }
    setCargando(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__fruits">
          <span>🥭</span><span>🥑</span><span>🍇</span><span>🍇</span>
        </div>

        <h1 className="auth-card__title">ÚNETE AL GYM</h1>
        <p className="auth-card__sub">Crea tu cuenta y empieza a llevar tu progreso</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm(p => ({...p, nombre: e.target.value}))}
              placeholder="Tu nombre"
              required
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={form.confirmar}
              onChange={e => setForm(p => ({...p, confirmar: e.target.value}))}
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="info-box info-box--sm">
            🎯 Se te asignará automáticamente un grupo (A–E) para que tu rutina no choque con la de otros compañeros.
          </div>

          <button className="btn btn--primary btn--full" type="submit" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/invalid-email':        'El formato del correo no es válido.',
    'auth/weak-password':        'La contraseña es muy débil.',
  }
  return errores[code] ?? 'Error al crear la cuenta. Intenta de nuevo.'
}
