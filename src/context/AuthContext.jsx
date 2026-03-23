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
        const p = await obtenerPerfil(user.uid)
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

  const esAdmin = perfil?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, perfil, cargando, esAdmin, refrescarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
