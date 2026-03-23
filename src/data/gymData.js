// ============================================================
// DATA — Máquinas, ejercicios y rutinas del Gym Asica Farms
// AI Studio puede editar este archivo para actualizar contenido
// ============================================================

// ── Máquinas y ejercicios ─────────────────────────────────────
export const MAQUINAS = [
  {
    id: 'rack',
    nombre: 'Rack de Potencia',
    categoria: 'Maquinaria',
    emoji: '🏗️',
    // AI Studio: reemplaza imagen con foto real del rack del gym
    imagen: '/images/maquinas/rack.jpg',
    ejercicios: [
      {
        id: 'sentadilla-barra',
        nombre: 'Sentadilla con barra',
        musculosPrincipales: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
        musculosSecundarios: ['Core', 'Espalda baja'],
        dificultad: 'Intermedio',
        descripcion: 'Coloca la barra sobre tus trapecios. Pies a la anchura de los hombros. Baja controlando que las rodillas apunten hacia los pies y la espalda se mantenga neutral. Empuja el suelo para subir.',
        advertencia: 'Nunca redondees la espalda baja. Empieza con poco peso hasta dominar la técnica.',
        series: '4',
        repeticiones: '8-12',
        descanso: '90 seg',
        // AI Studio: agregar collage de 3-4 fotos mostrando la ejecución
        fotos: ['/images/ejercicios/sentadilla-1.jpg', '/images/ejercicios/sentadilla-2.jpg', '/images/ejercicios/sentadilla-3.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=sentadilla+con+barra+tecnica+correcta'
      },
      {
        id: 'press-militar',
        nombre: 'Press militar con barra',
        musculosPrincipales: ['Deltoides frontal', 'Tríceps'],
        musculosSecundarios: ['Core', 'Trapecios'],
        dificultad: 'Intermedio',
        descripcion: 'Agarra la barra a la anchura de los hombros. Empuja hacia arriba hasta extender los brazos, luego baja de forma controlada al nivel de la barbilla. Activa el core para no arquear la espalda.',
        advertencia: 'No bloquees los codos al subir completamente.',
        series: '4', repeticiones: '8-10', descanso: '90 seg',
        fotos: ['/images/ejercicios/press-militar-1.jpg', '/images/ejercicios/press-militar-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+militar+barra+tecnica'
      },
      {
        id: 'peso-muerto',
        nombre: 'Peso muerto',
        musculosPrincipales: ['Glúteos', 'Isquiotibiales', 'Espalda baja'],
        musculosSecundarios: ['Trapecios', 'Core', 'Antebrazos'],
        dificultad: 'Avanzado',
        descripcion: 'Con la barra en el suelo, agáchate manteniendo la espalda recta y neutral. Empuja el suelo hacia abajo con los pies para levantar. Es el ejercicio que más músculos trabaja simultáneamente.',
        advertencia: 'CRÍTICO: Nunca redondees la espalda. Aprende con poco peso primero.',
        series: '3', repeticiones: '5-8', descanso: '2 min',
        fotos: ['/images/ejercicios/peso-muerto-1.jpg', '/images/ejercicios/peso-muerto-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=peso+muerto+tecnica+correcta'
      }
    ]
  },
  {
    id: 'banco-inclinado',
    nombre: 'Banco Ajustable',
    categoria: 'Maquinaria',
    emoji: '🪑',
    imagen: '/images/maquinas/banco-inclinado.jpg',
    ejercicios: [
      {
        id: 'press-inclinado-mancuernas',
        nombre: 'Press inclinado con mancuernas',
        musculosPrincipales: ['Pecho superior', 'Deltoides frontal'],
        musculosSecundarios: ['Tríceps'],
        dificultad: 'Principiante',
        descripcion: 'Banco inclinado a 30-45°. Lleva las mancuernas a la altura del pecho y empuja hacia arriba. Baja despacio para mayor activación muscular.',
        advertencia: 'No arquees la espalda ni despegues los glúteos del banco.',
        series: '4', repeticiones: '10-12', descanso: '75 seg',
        fotos: ['/images/ejercicios/press-inclinado-1.jpg', '/images/ejercicios/press-inclinado-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+inclinado+mancuernas+tecnica'
      },
      {
        id: 'curl-biceps-sentado',
        nombre: 'Curl de bíceps sentado',
        musculosPrincipales: ['Bíceps'],
        musculosSecundarios: ['Braquial', 'Antebrazos'],
        dificultad: 'Principiante',
        descripcion: 'Banco a 90°. Mancuernas colgando a los lados, sube alternando cada brazo. Gira la muñeca al subir. No uses impulso del cuerpo.',
        advertencia: 'Codos fijos al costado del cuerpo durante todo el movimiento.',
        series: '3', repeticiones: '12-15', descanso: '60 seg',
        fotos: ['/images/ejercicios/curl-sentado-1.jpg', '/images/ejercicios/curl-sentado-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=curl+biceps+sentado+mancuernas'
      }
    ]
  },
  {
    id: 'press-banca',
    nombre: 'Press de Banca',
    categoria: 'Maquinaria',
    emoji: '🏋️',
    imagen: '/images/maquinas/press-banca.jpg',
    ejercicios: [
      {
        id: 'press-banca-plano',
        nombre: 'Press de banca plano',
        musculosPrincipales: ['Pecho', 'Tríceps', 'Deltoides frontal'],
        musculosSecundarios: ['Core'],
        dificultad: 'Principiante',
        descripcion: 'Recuéstate, pies firmes en el suelo. Agarra la barra un poco más ancho que los hombros. Baja al pecho tocando ligeramente y empuja hacia arriba. No rebotas la barra en el pecho.',
        advertencia: 'Siempre usa seguridad o entrena con alguien cerca.',
        series: '4', repeticiones: '8-10', descanso: '90 seg',
        fotos: ['/images/ejercicios/press-banca-1.jpg', '/images/ejercicios/press-banca-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+banca+tecnica+correcta'
      },
      {
        id: 'press-banca-cerrado',
        nombre: 'Press de banca cerrado (tríceps)',
        musculosPrincipales: ['Tríceps', 'Pecho medio'],
        musculosSecundarios: ['Deltoides frontal'],
        dificultad: 'Principiante',
        descripcion: 'Igual que el press normal pero con agarre estrecho (manos a la anchura de los hombros). Mantén los codos cerca del cuerpo.',
        advertencia: 'Agarre muy cerrado puede sobrecargar las muñecas.',
        series: '3', repeticiones: '10-12', descanso: '75 seg',
        fotos: ['/images/ejercicios/press-cerrado-1.jpg', '/images/ejercicios/press-cerrado-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+banca+cerrado+triceps'
      }
    ]
  },
  {
    id: 'hiperextensiones',
    nombre: 'Banco Hiperextensiones',
    categoria: 'Maquinaria',
    emoji: '🔴',
    imagen: '/images/maquinas/hiperextensiones.jpg',
    ejercicios: [
      {
        id: 'hiperextension',
        nombre: 'Hiperextensión de espalda',
        musculosPrincipales: ['Espalda baja', 'Glúteos'],
        musculosSecundarios: ['Isquiotibiales'],
        dificultad: 'Principiante',
        descripcion: 'Caderas en el soporte, pies sujetos. Baja el tronco controladamente y sube hasta quedar recto. No hiperextiendas más allá de la posición neutral.',
        advertencia: 'Ideal para prevenir lesiones de espalda baja. Movimiento lento y controlado.',
        series: '3', repeticiones: '15-20', descanso: '60 seg',
        fotos: ['/images/ejercicios/hiper-1.jpg', '/images/ejercicios/hiper-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=hiperextension+espalda+baja+tecnica'
      }
    ]
  },
  {
    id: 'maquina-remo',
    nombre: 'Máquina de Remo',
    categoria: 'Maquinaria',
    emoji: '⚙️',
    imagen: '/images/maquinas/remo.jpg',
    ejercicios: [
      {
        id: 'remo-maquina',
        nombre: 'Remo con carga lateral',
        musculosPrincipales: ['Dorsal ancho', 'Romboides'],
        musculosSecundarios: ['Bíceps', 'Trapecios'],
        dificultad: 'Principiante',
        descripcion: 'Agarra los mangos con pronación. Tira hacia el abdomen apretando los omóplatos al final del movimiento. La espalda permanece recta.',
        advertencia: 'No uses el impulso de la espalda para iniciar el movimiento.',
        series: '4', repeticiones: '10-12', descanso: '75 seg',
        fotos: ['/images/ejercicios/remo-1.jpg', '/images/ejercicios/remo-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=remo+maquina+espalda+tecnica'
      }
    ]
  },
  {
    id: 'mancuernas',
    nombre: 'Mancuernas',
    categoria: 'Peso libre',
    emoji: '💪',
    imagen: '/images/maquinas/mancuernas.jpg',
    ejercicios: [
      {
        id: 'curl-alternado',
        nombre: 'Curl alternado de bíceps',
        musculosPrincipales: ['Bíceps'],
        musculosSecundarios: ['Braquial'],
        dificultad: 'Principiante',
        descripcion: 'Parado, alterna la subida de cada brazo. Gira la muñeca al subir. No balancea el cuerpo.',
        advertencia: 'Si balanceas el torso, el peso es demasiado alto.',
        series: '3', repeticiones: '12 c/brazo', descanso: '60 seg',
        fotos: ['/images/ejercicios/curl-alt-1.jpg', '/images/ejercicios/curl-alt-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=curl+biceps+alternado+mancuernas'
      },
      {
        id: 'press-hombros-mancuernas',
        nombre: 'Press de hombros con mancuernas',
        musculosPrincipales: ['Deltoides', 'Tríceps'],
        musculosSecundarios: ['Trapecios'],
        dificultad: 'Principiante',
        descripcion: 'Sentado o de pie, lleva las mancuernas a la altura de los hombros y empuja hacia arriba. Más seguro que la barra para el manguito rotador.',
        advertencia: 'Activa el core para no arquear la zona lumbar.',
        series: '4', repeticiones: '10-12', descanso: '75 seg',
        fotos: ['/images/ejercicios/press-hombros-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+hombros+mancuernas+tecnica'
      },
      {
        id: 'elevaciones-laterales',
        nombre: 'Elevaciones laterales',
        musculosPrincipales: ['Deltoides medio'],
        musculosSecundarios: [],
        dificultad: 'Principiante',
        descripcion: 'De pie, mancuernas a los lados. Eleva los brazos hasta la altura de los hombros con los codos ligeramente doblados. Baja despacio.',
        advertencia: 'Usa poco peso. Subir los hombros al elevar es un error común.',
        series: '4', repeticiones: '12-15', descanso: '60 seg',
        fotos: ['/images/ejercicios/elevaciones-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=elevaciones+laterales+hombros+tecnica'
      },
      {
        id: 'zancadas-mancuernas',
        nombre: 'Zancadas con mancuernas',
        musculosPrincipales: ['Cuádriceps', 'Glúteos'],
        musculosSecundarios: ['Isquiotibiales', 'Core'],
        dificultad: 'Principiante',
        descripcion: 'Una mancuerna en cada mano. Paso largo hacia adelante, baja la rodilla trasera casi al suelo. Sube y alterna.',
        advertencia: 'La rodilla delantera no debe sobrepasar la punta del pie.',
        series: '3', repeticiones: '10 c/pierna', descanso: '75 seg',
        fotos: ['/images/ejercicios/zancadas-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=zancadas+mancuernas+tecnica+correcta'
      }
    ]
  },
  {
    id: 'barra-olimpica',
    nombre: 'Barra Olímpica',
    categoria: 'Peso libre',
    emoji: '⚡',
    imagen: '/images/maquinas/barra.jpg',
    ejercicios: [
      {
        id: 'remo-barra',
        nombre: 'Remo con barra inclinado',
        musculosPrincipales: ['Dorsal ancho', 'Romboides'],
        musculosSecundarios: ['Bíceps', 'Trapecios'],
        dificultad: 'Intermedio',
        descripcion: 'Inclínate a 45°, rodillas ligeramente dobladas. Tira de la barra hacia el ombligo apretando la espalda al final.',
        advertencia: 'Mantén la espalda neutral en toda la ejecución.',
        series: '4', repeticiones: '8-10', descanso: '90 seg',
        fotos: ['/images/ejercicios/remo-barra-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=remo+barra+inclinado+espalda'
      }
    ]
  },
  // ── Calistenia ──────────────────────────────────────────────
  {
    id: 'sentadillas-cali',
    nombre: 'Sentadillas',
    categoria: 'Calistenia',
    emoji: '🦵',
    imagen: '/images/ejercicios/sentadilla-libre.jpg',
    ejercicios: [
      {
        id: 'sentadilla-libre',
        nombre: 'Sentadilla libre',
        musculosPrincipales: ['Cuádriceps', 'Glúteos'],
        musculosSecundarios: ['Core', 'Isquiotibiales'],
        dificultad: 'Principiante',
        descripcion: 'Pies a la anchura de los hombros. Baja como si fueras a sentarte, pecho arriba. Muslos paralelos al suelo.',
        advertencia: 'Rodillas en dirección de los pies, nunca hacia adentro.',
        series: '4', repeticiones: '20-25', descanso: '60 seg',
        fotos: ['/images/ejercicios/sentadilla-libre-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=sentadilla+libre+calistenia+tecnica'
      },
      {
        id: 'sentadilla-salto',
        nombre: 'Sentadilla con salto',
        musculosPrincipales: ['Cuádriceps', 'Glúteos'],
        musculosSecundarios: ['Core', 'Pantorrillas'],
        dificultad: 'Intermedio',
        descripcion: 'Sentadilla normal pero al subir explota en un salto. Aterriza suavemente con rodillas dobladas.',
        advertencia: 'Aterriza siempre en punta de pies primero para proteger las rodillas.',
        series: '4', repeticiones: '12-15', descanso: '75 seg',
        fotos: ['/images/ejercicios/squat-jump-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=sentadilla+salto+tecnica'
      }
    ]
  },
  {
    id: 'lagartijas',
    nombre: 'Lagartijas',
    categoria: 'Calistenia',
    emoji: '🐊',
    imagen: '/images/ejercicios/lagartija.jpg',
    ejercicios: [
      {
        id: 'lagartija-estandar',
        nombre: 'Lagartija estándar',
        musculosPrincipales: ['Pecho', 'Tríceps', 'Deltoides frontal'],
        musculosSecundarios: ['Core'],
        dificultad: 'Principiante',
        descripcion: 'Manos a la anchura de los hombros, cuerpo recto. Baja hasta casi tocar el suelo con el pecho, sube extendiendo los brazos.',
        advertencia: 'No dejes caer las caderas ni subas el trasero. Cuerpo recto como tabla.',
        series: '4', repeticiones: 'Máximo', descanso: '75 seg',
        fotos: ['/images/ejercicios/lagartija-1.jpg', '/images/ejercicios/lagartija-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=lagartijas+tecnica+correcta+principiantes'
      },
      {
        id: 'lagartija-diamante',
        nombre: 'Lagartija diamante (tríceps)',
        musculosPrincipales: ['Tríceps', 'Pecho interno'],
        musculosSecundarios: ['Deltoides frontal'],
        dificultad: 'Intermedio',
        descripcion: 'Junta las manos formando un diamante bajo el centro del pecho. Baja controlado.',
        advertencia: 'Puede tensar las muñecas — detente si sientes dolor.',
        series: '3', repeticiones: '10-15', descanso: '75 seg',
        fotos: ['/images/ejercicios/lagartija-diamante-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=lagartija+diamante+triceps'
      }
    ]
  },
  {
    id: 'burpees',
    nombre: 'Burpees',
    categoria: 'Calistenia',
    emoji: '🔥',
    imagen: '/images/ejercicios/burpee.jpg',
    ejercicios: [
      {
        id: 'burpee-completo',
        nombre: 'Burpee completo',
        musculosPrincipales: ['Cuerpo completo', 'Cardio'],
        musculosSecundarios: ['Core', 'Hombros', 'Piernas'],
        dificultad: 'Avanzado',
        descripcion: 'Desde de pie: agáchate, pon las manos, lanza los pies atrás, haz una lagartija, regresa los pies, salta con brazos arriba. Un movimiento continuo.',
        advertencia: 'Aterriza suavemente en cada salto. Hidratarse bien antes de hacerlos.',
        series: '4', repeticiones: '10-12', descanso: '90 seg',
        fotos: ['/images/ejercicios/burpee-1.jpg', '/images/ejercicios/burpee-2.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=burpee+completo+como+hacer+tecnica'
      }
    ]
  },
  {
    id: 'step',
    nombre: 'Step / Plataforma',
    categoria: 'Accesorios',
    emoji: '⬛',
    imagen: '/images/maquinas/step.jpg',
    ejercicios: [
      {
        id: 'step-up-rodilla',
        nombre: 'Step-up con elevación de rodilla',
        musculosPrincipales: ['Cuádriceps', 'Glúteos'],
        musculosSecundarios: ['Core', 'Equilibrio'],
        dificultad: 'Principiante',
        descripcion: 'Sube al step con el pie derecho, al llegar arriba lleva la rodilla izquierda al pecho. Baja controlado. Añade mancuernas para mayor dificultad.',
        advertencia: 'Paso firme en el step antes de elevar la rodilla.',
        series: '3', repeticiones: '12 c/pierna', descanso: '60 seg',
        fotos: ['/images/ejercicios/stepup-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=step+up+elevacion+rodilla+tecnica'
      },
      {
        id: 'fondos-step',
        nombre: 'Fondos de tríceps en step',
        musculosPrincipales: ['Tríceps'],
        musculosSecundarios: ['Pecho bajo', 'Deltoides'],
        dificultad: 'Principiante',
        descripcion: 'De espaldas al step, manos en el borde. Baja flexionando los codos hasta 90° y sube.',
        advertencia: 'No bajes más de 90° para proteger los hombros.',
        series: '3', repeticiones: '15', descanso: '60 seg',
        fotos: ['/images/ejercicios/fondos-1.jpg'],
        videoYoutube: 'https://www.youtube.com/results?search_query=fondos+triceps+step+tecnica'
      }
    ]
  }
]

// ── Rutinas A–E ───────────────────────────────────────────────
export const RUTINAS = {
  A: {
    nombre: 'Grupo A — Fuerza y Pecho',
    color: '#5aad65',
    dias: [
      { dia: 'Lunes',    foco: 'Pecho + Tríceps',       ejercicios: [{n:'Press de banca plano',s:'4x10'},{n:'Lagartija diamante',s:'3x15'},{n:'Press inclinado mancuernas',s:'3x12'},{n:'Fondos de tríceps step',s:'3x15'}] },
      { dia: 'Martes',   foco: 'Espalda + Bíceps',       ejercicios: [{n:'Remo con máquina',s:'4x12'},{n:'Remo con barra inclinado',s:'3x10'},{n:'Curl alternado bíceps',s:'3x12'},{n:'Curl barra corta',s:'3x12'}] },
      { dia: 'Miércoles',foco: 'Descanso activo / Core', ejercicios: [{n:'Plancha abdominal',s:'3x45seg'},{n:'Burpee modificado',s:'3x15'},{n:'Step-up con rodilla',s:'3x12'}] },
      { dia: 'Jueves',   foco: 'Piernas',                ejercicios: [{n:'Sentadilla con barra',s:'4x10'},{n:'Zancadas con mancuernas',s:'3x10'},{n:'Hiperextensión',s:'3x15'},{n:'Sentadilla sumo',s:'3x15'}] },
      { dia: 'Viernes',  foco: 'Hombros + Core',         ejercicios: [{n:'Press militar barra',s:'4x10'},{n:'Elevaciones laterales',s:'4x12'},{n:'Burpee completo',s:'4x10'},{n:'Lagartija ancha',s:'3x12'}] },
      { dia: 'Sábado',   foco: 'Circuito completo',      ejercicios: [{n:'Burpees',s:'4x10'},{n:'Sentadilla con salto',s:'4x12'},{n:'Lagartija estándar',s:'4x15'},{n:'Step-up con rodilla',s:'3x12'}] },
      { dia: 'Domingo',  foco: 'Descanso total',         ejercicios: [{n:'Descanso y recuperación',s:'Obligatorio'},{n:'Hidratación extra',s:'Día libre'}] }
    ]
  },
  B: {
    nombre: 'Grupo B — Piernas y Cardio',
    color: '#e8a135',
    dias: [
      { dia: 'Lunes',    foco: 'Piernas',                ejercicios: [{n:'Sentadilla libre',s:'4x20'},{n:'Zancadas',s:'3x12'},{n:'Sentadilla sumo',s:'3x15'},{n:'Saltos al step',s:'3x10'}] },
      { dia: 'Martes',   foco: 'Pecho + Hombros',        ejercicios: [{n:'Press de banca',s:'4x10'},{n:'Lagartija estándar',s:'4xmáx'},{n:'Press de hombros',s:'4x12'},{n:'Elevaciones laterales',s:'3x15'}] },
      { dia: 'Miércoles',foco: 'Espalda + Core',         ejercicios: [{n:'Remo con máquina',s:'4x12'},{n:'Remo con barra',s:'3x10'},{n:'Hiperextensión',s:'3x15'},{n:'Plancha',s:'3x45seg'}] },
      { dia: 'Jueves',   foco: 'Bíceps + Tríceps',       ejercicios: [{n:'Curl alternado',s:'4x12'},{n:'Curl con barra',s:'3x12'},{n:'Press banca cerrado',s:'3x12'},{n:'Fondos en step',s:'3x15'}] },
      { dia: 'Viernes',  foco: 'Cardio + Calistenia',    ejercicios: [{n:'Burpee completo',s:'4x10'},{n:'Lagartija diamante',s:'4x12'},{n:'Sentadilla con salto',s:'4x12'}] },
      { dia: 'Sábado',   foco: 'Fuerza general',         ejercicios: [{n:'Peso muerto',s:'3x8'},{n:'Press militar',s:'3x10'},{n:'Zancadas',s:'3x10'},{n:'Burpee modificado',s:'3x15'}] },
      { dia: 'Domingo',  foco: 'Descanso total',         ejercicios: [{n:'Descanso y recuperación',s:'Día libre'}] }
    ]
  },
  C: {
    nombre: 'Grupo C — Espalda y Potencia',
    color: '#4a90d9',
    dias: [
      { dia: 'Lunes',    foco: 'Espalda + Bíceps',  ejercicios: [{n:'Peso muerto',s:'3x6'},{n:'Remo con barra',s:'4x10'},{n:'Remo máquina',s:'3x12'},{n:'Curl con barra',s:'3x12'}] },
      { dia: 'Martes',   foco: 'Pecho + Tríceps',   ejercicios: [{n:'Lagartija estándar',s:'4xmáx'},{n:'Press inclinado',s:'4x12'},{n:'Press banca cerrado',s:'3x12'},{n:'Fondos step',s:'3x15'}] },
      { dia: 'Miércoles',foco: 'Piernas + Glúteos', ejercicios: [{n:'Sentadilla barra',s:'4x10'},{n:'Hiperextensión',s:'4x15'},{n:'Sentadilla sumo',s:'3x15'},{n:'Step-up rodilla',s:'3x12'}] },
      { dia: 'Jueves',   foco: 'Hombros + Core',    ejercicios: [{n:'Press militar barra',s:'4x10'},{n:'Elevaciones laterales',s:'4x12'},{n:'Burpee completo',s:'3x10'},{n:'Plancha',s:'3x60seg'}] },
      { dia: 'Viernes',  foco: 'Cardio intenso',    ejercicios: [{n:'Burpees',s:'5x12'},{n:'Sentadilla con salto',s:'4x15'},{n:'Saltos al step',s:'4x12'}] },
      { dia: 'Sábado',   foco: 'Fuerza máxima',     ejercicios: [{n:'Sentadilla con barra',s:'5x8'},{n:'Press banca',s:'5x8'},{n:'Peso muerto',s:'3x5'}] },
      { dia: 'Domingo',  foco: 'Descanso total',    ejercicios: [{n:'Descanso obligatorio',s:'Recuperación'}] }
    ]
  },
  D: {
    nombre: 'Grupo D — Cuerpo Completo',
    color: '#c25c9a',
    dias: [
      { dia: 'Lunes',    foco: 'Fuerza global',          ejercicios: [{n:'Sentadilla barra',s:'4x8'},{n:'Press banca',s:'4x8'},{n:'Peso muerto',s:'3x5'},{n:'Press militar',s:'3x8'}] },
      { dia: 'Martes',   foco: 'Calistenia intensa',     ejercicios: [{n:'Lagartija estándar',s:'5xmáx'},{n:'Lagartija diamante',s:'4x12'},{n:'Burpee completo',s:'4x10'},{n:'Sentadilla libre',s:'4x25'}] },
      { dia: 'Miércoles',foco: 'Espalda + Piernas',      ejercicios: [{n:'Remo con barra',s:'4x10'},{n:'Hiperextensión',s:'4x15'},{n:'Zancadas',s:'3x12'},{n:'Sentadilla sumo',s:'3x15'}] },
      { dia: 'Jueves',   foco: 'Hombros + Brazos',       ejercicios: [{n:'Press de hombros',s:'4x12'},{n:'Elevaciones laterales',s:'4x15'},{n:'Curl bíceps alternado',s:'3x12'},{n:'Fondos tríceps',s:'3x15'}] },
      { dia: 'Viernes',  foco: 'HIIT + Core',            ejercicios: [{n:'Burpees',s:'4x15'},{n:'Sentadilla con salto',s:'4x15'},{n:'Step ups',s:'3x12'},{n:'Plancha',s:'3x60seg'}] },
      { dia: 'Sábado',   foco: 'Sesión activa ligera',   ejercicios: [{n:'Caminata o trote suave',s:'20 min'},{n:'Estiramiento completo',s:'15 min'}] },
      { dia: 'Domingo',  foco: 'Descanso total',         ejercicios: [{n:'Descanso',s:'Día libre'}] }
    ]
  },
  E: {
    nombre: 'Grupo E — Resistencia y Core',
    color: '#d4692e',
    dias: [
      { dia: 'Lunes',    foco: 'Piernas + Glúteos',  ejercicios: [{n:'Sentadilla sumo',s:'4x15'},{n:'Zancadas mancuernas',s:'3x12'},{n:'Hiperextensión',s:'4x15'},{n:'Saltos al step',s:'3x12'}] },
      { dia: 'Martes',   foco: 'Hombros + Pecho',    ejercicios: [{n:'Press inclinado',s:'4x12'},{n:'Lagartija ancha',s:'4xmáx'},{n:'Press militar',s:'4x10'},{n:'Elevaciones laterales',s:'3x15'}] },
      { dia: 'Miércoles',foco: 'Espalda + Bíceps',   ejercicios: [{n:'Remo máquina',s:'4x12'},{n:'Remo barra',s:'3x10'},{n:'Curl bíceps',s:'4x12'},{n:'Peso muerto',s:'3x6'}] },
      { dia: 'Jueves',   foco: 'Calistenia total',   ejercicios: [{n:'Burpee completo',s:'5x10'},{n:'Lagartija estándar',s:'4xmáx'},{n:'Sentadilla libre',s:'4x20'},{n:'Fondos step',s:'3x15'}] },
      { dia: 'Viernes',  foco: 'Tríceps + Core',     ejercicios: [{n:'Press banca cerrado',s:'4x12'},{n:'Fondos tríceps',s:'3x15'},{n:'Lagartija diamante',s:'3x12'},{n:'Plancha',s:'4x45seg'}] },
      { dia: 'Sábado',   foco: 'Potencia + Cardio',  ejercicios: [{n:'Sentadilla con salto',s:'4x15'},{n:'Burpee modificado',s:'4x15'},{n:'Step-up con rodilla',s:'3x12'},{n:'Press banca',s:'3x10'}] },
      { dia: 'Domingo',  foco: 'Descanso total',     ejercicios: [{n:'Descanso',s:'Día libre'}] }
    ]
  }
}

// ── Contenido educativo ───────────────────────────────────────
export const CONTENIDO_EDUCATIVO = [
  {
    id: 'por-que-ejercitar',
    titulo: '¿Por qué hacer ejercicio?',
    emoji: '🥭',
    // AI Studio: agregar imagen motivacional aquí
    imagen: '/images/educacion/porque-ejercitar.jpg',
    contenido: 'El ejercicio regular es una de las mejores inversiones en tu salud. Mejora la fuerza, el sueño, la mente, el corazón y los huesos. Los trabajadores que se ejercitan regularmente tienen menos lesiones en el campo y más energía durante la jornada.',
    beneficios: ['Más fuerza y energía', 'Mejor sueño', 'Mente más clara', 'Corazón más sano', 'Huesos más fuertes', 'Menos estrés']
  },
  {
    id: 'tecnica-correcta',
    titulo: 'La técnica lo es todo',
    emoji: '🥑',
    imagen: '/images/educacion/tecnica.jpg',
    contenido: 'Un ejercicio mal hecho puede hacerte más daño que bien. Con el tiempo, una mala postura acumula lesiones en rodillas, espalda y hombros que pueden ser permanentes.',
    regladeOro: 'Menos peso con buena técnica siempre supera a más peso con mala forma.',
    erroresComunes: ['Doblar la espalda al levantar', 'No calentar antes', 'Retener la respiración', 'Ignorar el dolor', 'Saltar días de descanso']
  },
  {
    id: 'calentamiento',
    titulo: 'El calentamiento es obligatorio',
    emoji: '🍇',
    imagen: '/images/educacion/calentamiento.jpg',
    contenido: 'Dedica siempre 5-10 minutos a activar tu cuerpo antes de levantar peso. Movilidad de hombros, caderas, tobillos y una caminata suave son suficientes.',
    pasos: ['Trote suave 3 minutos', 'Movilidad de hombros', 'Rotación de caderas', 'Movilidad de tobillos', 'Sentadillas sin peso x10']
  },
  {
    id: 'hidratacion',
    titulo: 'Hidratación y recuperación',
    emoji: '💧',
    imagen: '/images/educacion/hidratacion.jpg',
    contenido: 'Toma agua antes, durante y después. Tu cuerpo crece y se repara mientras duermes, no mientras entrenas. Respetar el descanso es parte del entrenamiento.',
    tips: ['Toma agua cada 15-20 min durante el entrenamiento', '7-9 horas de sueño para recuperarte', 'Come proteína dentro de 30 min post-entreno']
  }
]
