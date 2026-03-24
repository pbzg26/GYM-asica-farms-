import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registrarUsuario } from '../services/authService'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.contrasena !== form.confirmar) { setError('Las contraseñas no coinciden.'); return }
    if (form.contrasena.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setCargando(true)
    try {
      const { grupo } = await registrarUsuario({ nombre: form.nombre, correo: form.correo, contrasena: form.contrasena })
      navigate(`/?nuevo=true&grupo=${grupo}`)
    } catch (err) {
      setError(traducirError(err.code))
    }
    setCargando(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand animate-fade">
          <div className="auth-brand__logo">
            <img src="/logo.png" alt="GYM Asica" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
            <span style={{display:'none'}}>🌿</span>
          </div>
          <h1>GYM ASICA FARMS</h1>
          <p>Únete al programa de entrenamiento<br />de Asica Farms en Olmos, Perú</p>
          <div className="auth-fruits">
            <span>🥭</span><span>🥑</span><span>🍇</span><span>🍇</span>
          </div>
        </div>
      </div>

      <div className="auth-card animate-up">
        <p className="auth-card__eyebrow">Crea tu cuenta</p>
        <h2 className="auth-card__title">Únete al gym</h2>
        <p className="auth-card__sub">Tu grupo A–E se asigna automáticamente para no saturar el gym</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} placeholder="Tu nombre completo" required />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={form.correo} onChange={e => setForm(p => ({...p, correo: e.target.value}))} placeholder="tu@correo.com" required />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={form.contrasena} onChange={e => setForm(p => ({...p, contrasena: e.target.value}))} placeholder="Mín. 6 caracteres" required />
            </div>
            <div className="form-group">
              <label>Confirmar</label>
              <input type="password" value={form.confirmar} onChange={e => setForm(p => ({...p, confirmar: e.target.value}))} placeholder="Repite" required />
            </div>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <button className="btn btn--primary btn--full" type="submit" disabled={cargando} style={{marginTop:8}}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/invalid-email':        'El formato del correo no es válido.',
    'auth/weak-password':        'La contraseña es muy débil.',
  }
  return errores[code] ?? 'Error al crear la cuenta. Intenta de nuevo.'
}
