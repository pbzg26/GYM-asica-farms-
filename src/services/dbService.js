import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, writeBatch,
  query, where, orderBy, limit,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ── Perfil usuario ────────────────────────────────────────────

export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid))
  return snap.exists() ? snap.data() : null
}

export async function actualizarPerfil(uid, datos) {
  await updateDoc(doc(db, 'usuarios', uid), {
    ...datos,
    actualizadoEn: serverTimestamp()
  })
}

export async function guardarMedidas(uid, medidas) {
  await addDoc(collection(db, 'usuarios', uid, 'medidas'), {
    ...medidas,
    fecha: serverTimestamp()
  })
  await updateDoc(doc(db, 'usuarios', uid), {
    peso:   medidas.peso   ?? null,
    altura: medidas.altura ?? null,
    actualizadoEn: serverTimestamp()
  })
}

export async function obtenerHistorialMedidas(uid) {
  const q = query(
    collection(db, 'usuarios', uid, 'medidas'),
    orderBy('fecha', 'desc'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Historial de rutinas ──────────────────────────────────────

export async function marcarRutinaCompletada(uid, { grupo, dia, ejercicios, tiempoTotalMinutos, tiemposPorEjercicio, seriesCompletadas }) {
  await addDoc(collection(db, 'usuarios', uid, 'historialRutinas'), {
    grupo, dia, ejercicios,
    tiempoTotalMinutos:  tiempoTotalMinutos  ?? null,
    tiemposPorEjercicio: tiemposPorEjercicio ?? null,
    seriesCompletadas:   seriesCompletadas   ?? null,
    completadoEn: serverTimestamp()
  })
}

export async function obtenerHistorialRutinas(uid, limite = 30) {
  const q = query(
    collection(db, 'usuarios', uid, 'historialRutinas'),
    orderBy('completadoEn', 'desc'),
    limit(limite)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerRutinasSemana(uid) {
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 7)
  const q = query(
    collection(db, 'usuarios', uid, 'historialRutinas'),
    where('completadoEn', '>=', hace7dias),
    orderBy('completadoEn', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Admin: usuarios ───────────────────────────────────────────

export async function obtenerTodosUsuarios() {
  const snap = await getDocs(collection(db, 'usuarios'))
  return snap.docs.map(d => d.data())
}

export async function cambiarRolUsuario(uid, nuevoRol) {
  await updateDoc(doc(db, 'usuarios', uid), { rol: nuevoRol })
}

// ── Contenido gym: lectura (con fallback) ─────────────────────

export async function cargarMaquinasFirestore() {
  const snap = await getDocs(collection(db, 'maquinas'))
  if (snap.empty) return null
  const maquinas = []
  for (const maqDoc of snap.docs) {
    const maquina = { id: maqDoc.id, ...maqDoc.data() }
    // Cargar subcolección ejercicios
    const ejSnap = await getDocs(
      query(collection(db, 'maquinas', maqDoc.id, 'ejercicios'), orderBy('_orden', 'asc'))
    )
    maquina.ejercicios = ejSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    maquinas.push(maquina)
  }
  // Ordenar por _orden si existe
  maquinas.sort((a, b) => (a._orden ?? 99) - (b._orden ?? 99))
  return maquinas
}

export async function cargarRutinasFirestore() {
  const grupos = ['A', 'B', 'C', 'D', 'E']
  const resultado = {}
  let hayDatos = false

  for (const grupo of grupos) {
    const diasSnap = await getDocs(
      query(collection(db, 'rutinas', grupo, 'dias'), orderBy('_orden', 'asc'))
    )
    if (!diasSnap.empty) {
      hayDatos = true
      const metaSnap = await getDoc(doc(db, 'rutinas', grupo))
      const meta = metaSnap.exists() ? metaSnap.data() : {}
      resultado[grupo] = {
        nombre: meta.nombre ?? `Grupo ${grupo}`,
        color:  meta.color  ?? '#00ff6a',
        dias: diasSnap.docs.map(d => ({ ...d.data() }))
      }
    }
  }
  return hayDatos ? resultado : null
}

export async function cargarGuiaFirestore() {
  const snap = await getDocs(query(collection(db, 'contenidoEducativo'), orderBy('_orden', 'asc')))
  if (snap.empty) return null
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Contenido gym: escritura ──────────────────────────────────

// Máquinas
export async function guardarMaquina(maquinaId, datos) {
  await setDoc(doc(db, 'maquinas', maquinaId), datos, { merge: true })
}

export async function guardarEjercicio(maquinaId, ejercicioId, datos) {
  if (ejercicioId) {
    await setDoc(doc(db, 'maquinas', maquinaId, 'ejercicios', ejercicioId), datos, { merge: true })
  } else {
    await addDoc(collection(db, 'maquinas', maquinaId, 'ejercicios'), datos)
  }
}

export async function eliminarEjercicio(maquinaId, ejercicioId) {
  await deleteDoc(doc(db, 'maquinas', maquinaId, 'ejercicios', ejercicioId))
}

export async function eliminarMaquina(maquinaId) {
  // Eliminar todos los ejercicios primero
  const snap = await getDocs(collection(db, 'maquinas', maquinaId, 'ejercicios'))
  const dels = snap.docs.map(d => deleteDoc(d.ref))
  await Promise.all(dels)
  await deleteDoc(doc(db, 'maquinas', maquinaId))
}

// Rutinas
export async function guardarMetaRutina(grupo, datos) {
  await setDoc(doc(db, 'rutinas', grupo), datos, { merge: true })
}

export async function guardarDiaRutina(grupo, diaId, datos) {
  await setDoc(doc(db, 'rutinas', grupo, 'dias', diaId), datos, { merge: true })
}

// Guía educativa
export async function guardarArticuloGuia(articuloId, datos) {
  if (articuloId) {
    await setDoc(doc(db, 'contenidoEducativo', articuloId), datos, { merge: true })
  } else {
    await addDoc(collection(db, 'contenidoEducativo'), datos)
  }
}

// ── Salud: registros periódicos ───────────────────────────────

export async function guardarRegistroSalud(uid, datos) {
  await addDoc(collection(db, 'usuarios', uid, 'registrosSalud'), {
    ...datos,
    fecha: serverTimestamp()
  })
}

export async function obtenerRegistrosSalud(uid) {
  const q = query(
    collection(db, 'usuarios', uid, 'registrosSalud'),
    orderBy('fecha', 'desc'),
    limit(50)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerEstadisticasPerfil(uid) {
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

  const [histSnap, histMesSnap, saludSnap] = await Promise.all([
    getDocs(query(collection(db, 'usuarios', uid, 'historialRutinas'), orderBy('completadoEn', 'desc'), limit(100))),
    getDocs(query(collection(db, 'usuarios', uid, 'historialRutinas'), where('completadoEn', '>=', inicioMes))),
    getDocs(query(collection(db, 'usuarios', uid, 'registrosSalud'), orderBy('fecha', 'desc'), limit(1)))
  ])

  const historial = histSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  const rutinasEsteMes = histMesSnap.size
  const tiempoTotal = historial.reduce((a, h) => a + (h.tiempoTotalMinutos ?? 0), 0)

  // Racha
  let racha = 0
  const fechas = historial.map(h => h.completadoEn?.toDate?.()?.toDateString()).filter(Boolean)
  const unicas = [...new Set(fechas)]
  if (unicas.length > 0) {
    racha = 1
    const hoy = new Date().toDateString()
    if (unicas[0] !== hoy) racha = 0
    else {
      for (let i = 1; i < unicas.length; i++) {
        const diff = (new Date(unicas[i-1]) - new Date(unicas[i])) / (1000*60*60*24)
        if (diff === 1) racha++
        else break
      }
    }
  }

  const ultimoIMC = saludSnap.empty ? null : saludSnap.docs[0].data().imc

  return { rutinasEsteMes, tiempoTotal, racha, ultimoIMC }
}

// ── Sesiones de cardio ────────────────────────────────────────

export async function guardarSesionCardio(uid, datos) {
  await addDoc(collection(db, 'usuarios', uid, 'historialCardio'), {
    tipo:            datos.tipo,
    distanciaKm:     datos.distanciaKm,
    duracionMinutos: datos.duracionMinutos,
    calorias:        datos.calorias,
    ritmo:           datos.ritmo ?? null,
    vueltas:         datos.vueltas ?? null,
    fecha:           serverTimestamp()
  })
}

export async function obtenerHistorialCardio(uid, limite = 20) {
  const q = query(
    collection(db, 'usuarios', uid, 'historialCardio'),
    orderBy('fecha', 'desc'),
    limit(limite)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Rutina personal (sin aprobación) ──────────────────────────

export async function guardarMiRutina(uid, rutina) {
  await setDoc(doc(db, 'usuarios', uid, 'miRutina', 'actual'), {
    ...rutina,
    actualizadaEn: serverTimestamp()
  })
}

export async function obtenerMiRutina(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid, 'miRutina', 'actual'))
  return snap.exists() ? snap.data() : null
}

// ── Solicitudes rutina personalizada (legacy) ─────────────────

export async function enviarSolicitudRutina(uid, { nombreUsuario, grupo, rutinaPropuesta, justificacion, condicionFisica }) {
  await addDoc(collection(db, 'solicitudesRutina'), {
    uid, nombreUsuario, grupo, rutinaPropuesta, justificacion,
    condicionFisica: condicionFisica ?? '',
    estado: 'pendiente',
    fechaSolicitud: serverTimestamp(),
    fechaRevision: null,
    comentarioAdmin: null
  })
}

export async function obtenerMiSolicitud(uid) {
  const q = query(
    collection(db, 'solicitudesRutina'),
    where('uid', '==', uid),
    orderBy('fechaSolicitud', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function obtenerTodasSolicitudes() {
  const q = query(collection(db, 'solicitudesRutina'), orderBy('fechaSolicitud', 'desc'))
  const snap = await getDocs(q)
  const todas = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  // Pendientes primero
  return [
    ...todas.filter(s => s.estado === 'pendiente'),
    ...todas.filter(s => s.estado !== 'pendiente')
  ]
}

export async function responderSolicitud(solicitudId, { estado, comentarioAdmin }) {
  await updateDoc(doc(db, 'solicitudesRutina', solicitudId), {
    estado, comentarioAdmin: comentarioAdmin ?? null,
    fechaRevision: serverTimestamp()
  })
}

export async function obtenerRutinaPersonalizada(uid) {
  const q = query(
    collection(db, 'solicitudesRutina'),
    where('uid', '==', uid),
    where('estado', '==', 'aprobada'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ── Avisos del gym ────────────────────────────────────────────

export async function crearAviso(datos) {
  await addDoc(collection(db, 'avisos'), {
    titulo:      datos.titulo,
    descripcion: datos.descripcion,
    tipo:        datos.tipo ?? 'info',
    fechaInicio: datos.fechaInicio ? new Date(datos.fechaInicio) : serverTimestamp(),
    fechaFin:    datos.fechaFin    ? new Date(datos.fechaFin)    : null,
    activo:      true,
    creadoPor:   datos.creadoPor ?? '',
    creadoEn:    serverTimestamp()
  })
}

export async function obtenerAvisosActivos() {
  const ahora = new Date()
  const q = query(
    collection(db, 'avisos'),
    where('activo', '==', true),
    orderBy('creadoEn', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(a => {
      const inicio = a.fechaInicio?.toDate?.() ?? new Date(0)
      const fin    = a.fechaFin?.toDate?.()    ?? null
      return inicio <= ahora && (!fin || fin >= ahora)
    })
}

export async function obtenerTodosAvisos() {
  const q = query(collection(db, 'avisos'), orderBy('creadoEn', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function desactivarAviso(id) {
  await updateDoc(doc(db, 'avisos', id), { activo: false })
}

// ── Migración: gymData.js → Firestore ────────────────────────

export async function migrarDatosAFirestore(MAQUINAS, RUTINAS, CONTENIDO_EDUCATIVO) {
  const batch = writeBatch(db)

  // Máquinas (sin ejercicios en el batch porque van en subcolección)
  MAQUINAS.forEach((maq, idx) => {
    const { ejercicios, ...datosMaq } = maq
    const ref = doc(db, 'maquinas', maq.id)
    batch.set(ref, { ...datosMaq, _orden: idx })
  })

  // Meta de rutinas (nombre, color)
  Object.entries(RUTINAS).forEach(([grupo, rutina]) => {
    const ref = doc(db, 'rutinas', grupo)
    batch.set(ref, { nombre: rutina.nombre, color: rutina.color })
  })

  // Contenido educativo
  CONTENIDO_EDUCATIVO.forEach((item, idx) => {
    const ref = doc(db, 'contenidoEducativo', item.id)
    batch.set(ref, { ...item, _orden: idx })
  })

  await batch.commit()

  // Ejercicios de cada máquina (fuera del batch por límite 500 ops)
  for (const maq of MAQUINAS) {
    for (let i = 0; i < maq.ejercicios.length; i++) {
      const ej = maq.ejercicios[i]
      await setDoc(
        doc(db, 'maquinas', maq.id, 'ejercicios', ej.id),
        { ...ej, _orden: i }
      )
    }
  }

  // Días de rutinas
  for (const [grupo, rutina] of Object.entries(RUTINAS)) {
    for (let i = 0; i < rutina.dias.length; i++) {
      const dia = rutina.dias[i]
      await setDoc(
        doc(db, 'rutinas', grupo, 'dias', dia.dia),
        { ...dia, _orden: i }
      )
    }
  }
}

// ── Reportes / Quejas ─────────────────────────────────────────

export async function crearReporte(uid, { nombreUsuario, titulo, descripcion, categoria, equipoId, fotoBase64 }) {
  return await addDoc(collection(db, 'reportes'), {
    uid, nombreUsuario, titulo, descripcion, categoria,
    equipoId: equipoId ?? null,
    fotoBase64: fotoBase64 ?? null,
    estado: 'abierto',
    fechaReporte: serverTimestamp(),
    adminUid: null,
    eraReal: null,
    descripcionSolucion: null,
    queSeNecesito: null,
    fechaRevision: null,
  })
}

export async function obtenerMisReportes(uid) {
  const q = query(collection(db, 'reportes'), where('uid','==',uid), orderBy('fechaReporte','desc'), limit(30))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerTodosReportes() {
  const q = query(collection(db, 'reportes'), orderBy('fechaReporte','desc'), limit(100))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function resolverReporte(reporteId, resolucion) {
  await updateDoc(doc(db, 'reportes', reporteId), {
    ...resolucion,
    fechaRevision: serverTimestamp(),
  })
}

// ── Dashboard / Métricas ──────────────────────────────────────

export async function obtenerResumenUsuarios() {
  const usersSnap = await getDocs(collection(db, 'usuarios'))
  const usuarios = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

  const ahora = new Date()
  const hace7dias = new Date(ahora - 7*24*60*60*1000)
  const hace30dias = new Date(ahora - 30*24*60*60*1000)

  const resumen = await Promise.all(usuarios.map(async u => {
    const histQ = query(
      collection(db, 'usuarios', u.id, 'historialRutinas'),
      orderBy('completadoEn','desc'), limit(10)
    )
    const histSnap = await getDocs(histQ)
    const hist = histSnap.docs.map(d => ({ ...d.data() }))
    const ultimo = hist[0]?.completadoEn?.toDate?.() ?? null
    const rutinasUltimos30 = hist.filter(h => {
      const f = h.completadoEn?.toDate?.()
      return f && f > hace30dias
    }).length
    const activoEstaSemana = ultimo && ultimo > hace7dias

    const saludQ = query(collection(db,'usuarios',u.id,'registrosSalud'),orderBy('fecha','desc'),limit(1))
    const saludSnap = await getDocs(saludQ)
    const ultimaSalud = saludSnap.docs[0]?.data() ?? null

    return {
      uid: u.id,
      nombre: u.nombre ?? '—',
      correo: u.correo ?? '',
      grupo: u.grupo ?? '—',
      rol: u.rol ?? 'usuario',
      peso: u.peso ?? null,
      altura: u.altura ?? null,
      ultimoEntreno: ultimo,
      rutinasUltimos30,
      activoEstaSemana,
      imc: ultimaSalud?.imc ?? null,
      condiciones: ultimaSalud?.condiciones ?? [],
    }
  }))

  return resumen
}

