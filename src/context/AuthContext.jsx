import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { obtenerPerfil } from '../services/dbService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null)   // Firebase user
  const [perfil,  setPerfil]    = useState(null)   // Firestore profile (nombre, grupo, peso, etc.)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUsuario(user)
      if (user) {
        // Forzar que el token esté listo en el SDK de Firestore antes de leer
        try { await user.getIdToken(true) } catch {}

        // Intentar cargar perfil — retry una vez si falla por permisos
        let p = null
        for (let intento = 0; intento < 2; intento++) {
          try {
            p = await obtenerPerfil(user.uid)
            break
          } catch (err) {
            if (intento === 0) {
              await new Promise(r => setTimeout(r, 800))
            } else {
              console.error('Error cargando perfil:', err)
            }
          }
        }
        setPerfil(p)
      } else {
        setPerfil(null)
      }
      setCargando(false)
    })
    return unsub
  }, [])

  // Refrescar perfil desde Firestore (después de editar datos)
  async function refrescarPerfil() {
    if (usuario) {
      const p = await obtenerPerfil(usuario.uid)
      setPerfil(p)
    }
  }

  const esSuperAdmin = perfil?.rol === 'superadmin'
  const esAdmin = perfil?.rol === 'admin' || esSuperAdmin

  return (
    <AuthContext.Provider value={{ usuario, perfil, cargando, esAdmin, esSuperAdmin, refrescarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
