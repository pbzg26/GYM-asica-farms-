import { useState } from 'react'
import { useGymData } from '../hooks/useGymData'

// Categorías para filtrar
const CATEGORIAS = ['Todas', 'Maquinaria', 'Peso libre', 'Calistenia', 'Accesorios']

export default function Maquinas() {
  const { maquinas } = useGymData()
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null)
  const [ejercicioDetalle, setEjercicioDetalle]       = useState(null)

  const maquinasFiltradas = categoriaActiva === 'Todas'
    ? maquinas
    : maquinas.filter(m => m.categoria === categoriaActiva)

  // Vista: detalle de ejercicio
  if (ejercicioDetalle) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setEjercicioDetalle(null)}>
          ← Volver a {maquinaSeleccionada.nombre}
        </button>

        <div className="exercise-detail">
          <h2>{ejercicioDetalle.nombre}</h2>

          <div className="exercise-detail__muscles">
            <span className="label">Músculos principales</span>
            <div className="tag-list">
              {ejercicioDetalle.musculosPrincipales.map(m => (
                <span key={m} className="tag tag--primary">{m}</span>
              ))}
            </div>
            {ejercicioDetalle.musculosSecundarios.length > 0 && (
              <div className="tag-list">
                {ejercicioDetalle.musculosSecundarios.map(m => (
                  <span key={m} className="tag">{m}</span>
                ))}
              </div>
            )}
          </div>

          {/* Fotos del ejercicio */}
          {ejercicioDetalle.fotos?.length > 0 && (
            <div className="exercise-detail__photos">
              {ejercicioDetalle.fotos.map((foto, i) => (
                <img
                  key={i}
                  src={foto}
                  alt={`${ejercicioDetalle.nombre} — foto ${i + 1}`}
                  className="exercise-detail__photo"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ))}
            </div>
          )}

          <div className="exercise-detail__info">
            <div className="info-pill">
              <span className="info-pill__label">Series</span>
              <span className="info-pill__val">{ejercicioDetalle.series}</span>
            </div>
            <div className="info-pill">
              <span className="info-pill__label">Reps</span>
              <span className="info-pill__val">{ejercicioDetalle.repeticiones}</span>
            </div>
            <div className="info-pill">
              <span className="info-pill__label">Descanso</span>
              <span className="info-pill__val">{ejercicioDetalle.descanso}</span>
            </div>
            <div className="info-pill">
              <span className="info-pill__label">Nivel</span>
              <span className="info-pill__val">{ejercicioDetalle.dificultad}</span>
            </div>
          </div>

          <p className="exercise-detail__desc">{ejercicioDetalle.descripcion}</p>

          {ejercicioDetalle.advertencia && (
            <div className="exercise-detail__warning">
              ⚠️ {ejercicioDetalle.advertencia}
            </div>
          )}

          {ejercicioDetalle.videoYoutube && (
            <a
              href={ejercicioDetalle.videoYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--youtube"
            >
              ▶ Ver técnica correcta en YouTube
            </a>
          )}
        </div>
      </div>
    )
  }

  // Vista: ejercicios de una máquina
  if (maquinaSeleccionada) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setMaquinaSeleccionada(null)}>
          ← Volver al equipo
        </button>

        <div className="page__header">
          <h2 className="page__title">
            {maquinaSeleccionada.emoji} {maquinaSeleccionada.nombre}
          </h2>
          <p className="page__sub">{maquinaSeleccionada.ejercicios.length} ejercicios disponibles</p>
        </div>

        {/* Imagen de la máquina */}
        {maquinaSeleccionada.imagen && (
          <div className="machine-image-wrap">
            <img
              src={maquinaSeleccionada.imagen}
              alt={maquinaSeleccionada.nombre}
              className="machine-image"
              onError={e => { e.target.parentElement.style.display = 'none' }}
            />
          </div>
        )}

        <div className="exercises-list">
          {maquinaSeleccionada.ejercicios.map(ex => (
            <button
              key={ex.id}
              className="exercise-row"
              onClick={() => setEjercicioDetalle(ex)}
            >
              <div className="exercise-row__info">
                <h4>{ex.nombre}</h4>
                <div className="tag-list">
                  {ex.musculosPrincipales.slice(0, 2).map(m => (
                    <span key={m} className="tag tag--sm">{m}</span>
                  ))}
                  <span className={`tag tag--sm tag--dificultad tag--${ex.dificultad.toLowerCase()}`}>
                    {ex.dificultad}
                  </span>
                </div>
                <p className="exercise-row__sets">{ex.series}x{ex.repeticiones} · {ex.descanso} descanso</p>
              </div>
              <span className="exercise-row__arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Vista principal: grid de máquinas
  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Equipamiento</h2>
        <p className="page__sub">Toca una máquina o ejercicio para ver cómo usarla</p>
      </div>

      {/* Filtro por categoría */}
      <div className="filter-tabs">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            className={`filter-tab ${categoriaActiva === cat ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de máquinas */}
      <div className="machines-grid">
        {maquinasFiltradas.map(maq => (
          <button
            key={maq.id}
            className="machine-card"
            onClick={() => setMaquinaSeleccionada(maq)}
          >
            {maq.imagen ? (
              <div className="machine-card__img-wrap">
                <img
                  src={maq.imagen}
                  alt={maq.nombre}
                  className="machine-card__img"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <span className="machine-card__icon machine-card__icon--fallback" style={{display:'none'}}>{maq.emoji}</span>
              </div>
            ) : (
              <span className="machine-card__icon">{maq.emoji}</span>
            )}
            <h4 className="machine-card__name">{maq.nombre}</h4>
            <p className="machine-card__cat">{maq.categoria}</p>
            <p className="machine-card__count">{maq.ejercicios.length} ejercicios</p>
          </button>
        ))}
      </div>
    </div>
  )
}
