import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page page--center">
      <span style={{ fontSize: 64 }}>🥭</span>
      <h2>Página no encontrada</h2>
      <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px' }}>
        Esta ruta no existe en el gym.
      </p>
      <button className="btn btn--primary" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </div>
  )
}
