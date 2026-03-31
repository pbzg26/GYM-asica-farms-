import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

// Grupos disponibles para rotación automática A-E
const GRUPOS = ['A', 'B', 'C', 'D', 'E']

// Asigna grupo automáticamente según cantidad de usuarios existentes
async function asignarGrupo() {
  const snap = await getDocs(collection(db, 'usuarios'))
  return GRUPOS[snap.size % GRUPOS.length]
}

// ── Registro ─────────────────────────────────────────────────
export async function registrarUsuario({ nombre, correo, contrasena }) {
  const cred = await createUserWithEmailAndPassword(auth, correo, contrasena)
  await updateProfile(cred.user, { displayName: nombre })

  const grupo = await asignarGrupo()

  // Crear documento del usuario en Firestore
  await setDoc(doc(db, 'usuarios', cred.user.uid), {
    uid:          cred.user.uid,
    nombre,
    correo,
    grupo,                    // A, B, C, D o E — asignado automáticamente
    rol:          'usuario',  // 'usuario' | 'admin'
    peso:         null,
    altura:       null,
    meta:         null,       // 'musculo' | 'bajar_peso' | 'resistencia' | 'salud'
    activo:       true,
    creadoEn:     serverTimestamp(),
    ultimaConexion: serverTimestamp()
  })

  return { user: cred.user, grupo }
}

// ── Login ─────────────────────────────────────────────────────
export async function iniciarSesion({ correo, contrasena }) {
  const cred = await signInWithEmailAndPassword(auth, correo, contrasena)
  // Actualizar última conexión — fire-and-forget, no bloqueamos el login
  setDoc(
    doc(db, 'usuarios', cred.user.uid),
    { ultimaConexion: serverTimestamp() },
    { merge: true }
  ).catch(() => {})
  return cred.user
}

// ── Logout ────────────────────────────────────────────────────
export async function cerrarSesion() {
  await signOut(auth)
}

// ── Obtener perfil completo ───────────────────────────────────
export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid))
  return snap.exists() ? snap.data() : null
}
