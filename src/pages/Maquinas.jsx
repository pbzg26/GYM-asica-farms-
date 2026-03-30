import { useState } from 'react'
import { useGymData } from '../hooks/useGymData'
import { useAuth } from '../context/AuthContext'
import ModalEditarMaquina from '../components/ModalEditarMaquina'

const CATEGORIAS = ['Todas', 'Maquinaria', 'Peso libre', 'Calistenia', 'Accesorios']

export default function Maquinas() {
  const { maquinas, recargarMaquinas } = useGymData()
  const { esAdmin } = useAuth()
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null)
  const [ejercicioDetalle, setEjercicioDetalle]       = useState(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [maquinaEditando, setMaquinaEditando] = useState(null) // null = cerrado, {} = nueva, {maquina} = existente

  const maquinasFiltradas = categoriaActiva === 'Todas'
    ? maquinas
    : maquinas.filter(m => m.categoria === categoriaActiva)

  async function handleActualizar() {
    await recargarMaquinas()
    // Refrescar la máquina seleccionada si aplica
    if (maquinaSeleccionada) {
      const actualizada = maquinas.find(m => m.id === maquinaSeleccionada.id)
      if (actualizada) setMaquinaSeleccionada(actualizada)
    }
  }

  // Vista: detalle de ejercicio
  if (ejercicioDetalle) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setEjercicioDetalle(null)}>
          ← Volver a {maquinaSeleccionada.nombre}
        </button>

        <div className="exercise-detail">
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <h2>{ejercicioDetalle.nombre}</h2>
            <span className={`tag tag--dificultad tag--${ejercicioDetalle.dificultad?.toLowerCase()}`}>
              {ejercicioDetalle.dificultad}
            </span>
          </div>

          <div className="exercise-detail__muscles">
            <span className="label">Músculos principales</span>
            <div className="tag-list">
              {ejercicioDetalle.musculosPrincipales?.map(m => (
                <span key={m} className="tag tag--primary">{m}</span>
              ))}
            </div>
            {ejercicioDetalle.musculosSecundarios?.length > 0 && (
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
          ← Volver al equipamiento
        </button>

        <div className="page__header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div>
            <h2 className="page__title">
              {maquinaSeleccionada.emoji} {maquinaSeleccionada.nombre}
            </h2>
            <p className="page__sub">{maquinaSeleccionada.ejercicios.length} ejercicios disponibles · {maquinaSeleccionada.categoria}</p>
          </div>
          {esAdmin && (
            <button className="btn btn--outline btn--sm" onClick={() => setMaquinaEditando(maquinaSeleccionada)}>
              ✏️ Editar máquina
            </button>
          )}
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
                  {ex.musculosPrincipales?.slice(0, 2).map(m => (
                    <span key={m} className="tag tag--sm">{m}</span>
                  ))}
                  <span className={`tag tag--sm tag--dificultad tag--${ex.dificultad?.toLowerCase()}`}>
                    {ex.dificultad}
                  </span>
                </div>
                <p className="exercise-row__sets">{ex.series}×{ex.repeticiones} · {ex.descanso} descanso</p>
              </div>
              <span className="exercise-row__arrow">›</span>
            </button>
          ))}
        </div>

        {/* Modal edición (desde detalle de máquina) */}
        {maquinaEditando && (
          <ModalEditarMaquina
            maquina={maquinaEditando}
            onCerrar={() => setMaquinaEditando(null)}
            onActualizar={handleActualizar}
          />
        )}
      </div>
    )
  }

  // Vista principal: grid de máquinas
  return (
    <div className="page">
      <div className="page__header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h2 className="page__title">Equipamiento</h2>
          <p className="page__sub">Toca una máquina para ver cómo usarla correctamente</p>
        </div>
        {esAdmin && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button
              className={`btn btn--sm ${modoEdicion ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setModoEdicion(v => !v)}
            >
              {modoEdicion ? '✅ Salir del editor' : '✏️ Modo editor'}
            </button>
            {modoEdicion && (
              <button
                className="btn btn--sm btn--outline"
                onClick={() => setMaquinaEditando({})}
              >
                + Nueva máquina
              </button>
            )}
          </div>
        )}
      </div>

      {modoEdicion && (
        <div className="editor-banner">
          ✏️ <strong>Modo editor activo</strong> — Haz clic en cualquier máquina para editarla
        </div>
      )}

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
          <div key={maq.id} className="machine-card-wrap" style={{position:'relative'}}>
            <button
              className="machine-card"
              onClick={() => modoEdicion ? setMaquinaEditando(maq) : setMaquinaSeleccionada(maq)}
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
              {modoEdicion && (
                <div className="machine-card__edit-overlay">✏️ Editar</div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Modal edición */}
      {maquinaEditando !== null && (
        <ModalEditarMaquina
          maquina={maquinaEditando?.id ? maquinaEditando : null}
          onCerrar={() => setMaquinaEditando(null)}
          onActualizar={handleActualizar}
        />
      )}
    </div>
  )
}
