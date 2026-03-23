// ============================================================
// HOOK: useGymData
// Carga datos desde Firestore si existen, fallback a gymData.js
// ============================================================
import { useState, useEffect } from 'react'
import { cargarMaquinasFirestore, cargarRutinasFirestore, cargarGuiaFirestore } from '../services/dbService'
import { MAQUINAS, RUTINAS, CONTENIDO_EDUCATIVO } from '../data/gymData'

export function useGymData() {
  const [maquinas,  setMaquinas]  = useState(MAQUINAS)
  const [rutinas,   setRutinas]   = useState(RUTINAS)
  const [guia,      setGuia]      = useState(CONTENIDO_EDUCATIVO)
  const [cargando,  setCargando]  = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [m, r, g] = await Promise.all([
          cargarMaquinasFirestore(),
          cargarRutinasFirestore(),
          cargarGuiaFirestore()
        ])
        if (m && m.length > 0) setMaquinas(m)
        if (r && Object.keys(r).length > 0) setRutinas(r)
        if (g && g.length > 0) setGuia(g)
      } catch (err) {
        // Firestore no disponible o vacío — usar datos estáticos
        console.warn('useGymData: usando datos estáticos', err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return { maquinas, rutinas, guia, cargando }
}
