import { useGymData } from '../hooks/useGymData'

export default function Guia() {
  const { guia: CONTENIDO_EDUCATIVO } = useGymData()

  return (
    <div className="page glass-panel page--covered">
      <div className="page__header guide-header">
        <div className="guide-header__text">
          <h2 className="page__title">Guía del Atleta</h2>
          <p className="page__sub">Todo lo que necesitas saber antes de empezar</p>
        </div>
        <img src="/avatars.jpeg" alt="Avatares" className="guide-avatars-img" />
      </div>

      {CONTENIDO_EDUCATIVO.map(item => (
        <article key={item.id} className="edu-card">
          <div className="edu-card__header">
            <span className="edu-card__emoji">{item.emoji}</span>
            <h3>{item.titulo}</h3>
          </div>

          <p className="edu-card__text">{item.contenido}</p>

          {item.regladeOro && (
            <blockquote className="edu-card__quote">
              {item.regladeOro}
            </blockquote>
          )}

          {item.beneficios && (
            <div className="tag-list">
              {item.beneficios.map(b => <span key={b} className="tag">{b}</span>)}
            </div>
          )}

          {item.erroresComunes && (
            <div className="tag-list">
              {item.erroresComunes.map(e => <span key={e} className="tag tag--warn">{e}</span>)}
            </div>
          )}

          {item.pasos && (
            <ol className="edu-card__steps">
              {item.pasos.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          )}

          {item.tips && (
            <ul className="edu-card__tips">
              {item.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}

          {item.reglasGym && (
            <div className="reglas-gym">
              {item.reglasGym.map((seccion, i) => (
                <details key={i} className="regla-seccion">
                  <summary className="regla-seccion__titulo">
                    <span>{seccion.icono}</span>
                    {seccion.titulo}
                  </summary>
                  <ul className="regla-seccion__lista">
                    {seccion.reglas.map((r, j) => (
                      <li key={j} className="regla-item">
                        <span className="regla-item__check">✓</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
