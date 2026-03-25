// ============================================================
// DATA — Máquinas, ejercicios y rutinas del Gym Asica Farms
// Fotos: Unsplash CDN (gratuitas, sin API key)
// Formato: https://images.unsplash.com/photo-{ID}?w=600&q=75&auto=format
// ============================================================

// ── Máquinas y ejercicios ─────────────────────────────────────
export const MAQUINAS = [
  {
    id: 'rack',
    nombre: 'Rack de Potencia',
    categoria: 'Maquinaria',
    emoji: '🏗️',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=75&auto=format',
    ejercicios: [
      {
        id: 'sentadilla-barra',
        nombre: 'Sentadilla con barra',
        musculosPrincipales: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
        musculosSecundarios: ['Core', 'Espalda baja'],
        dificultad: 'Intermedio',
        descripcion: 'Coloca la barra sobre tus trapecios. Pies a la anchura de los hombros. Baja controlando que las rodillas apunten hacia los pies y la espalda se mantenga neutral. Empuja el suelo para subir.',
        advertencia: 'Nunca redondees la espalda baja. Empieza con poco peso hasta dominar la técnica.',
        series: '4', repeticiones: '8-12', descanso: '90 seg',
        fotos: [
          'https://images.unsplash.com/photo-1566351681893-d27d80e4b232?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=peso+muerto+tecnica+correcta'
      }
    ]
  },
  {
    id: 'banco-inclinado',
    nombre: 'Banco Ajustable',
    categoria: 'Maquinaria',
    emoji: '🪑',
    imagen: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=curl+biceps+sentado+mancuernas'
      }
    ]
  },
  {
    id: 'press-banca',
    nombre: 'Press de Banca',
    categoria: 'Maquinaria',
    emoji: '🏋️',
    imagen: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=press+banca+cerrado+triceps'
      }
    ]
  },
  {
    id: 'hiperextensiones',
    nombre: 'Banco Hiperextensiones',
    categoria: 'Maquinaria',
    emoji: '🔴',
    imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=hiperextension+espalda+baja+tecnica'
      }
    ]
  },
  {
    id: 'maquina-remo',
    nombre: 'Máquina de Remo',
    categoria: 'Maquinaria',
    emoji: '⚙️',
    imagen: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=remo+maquina+espalda+tecnica'
      }
    ]
  },
  {
    id: 'mancuernas',
    nombre: 'Mancuernas',
    categoria: 'Peso libre',
    emoji: '💪',
    imagen: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=zancadas+mancuernas+tecnica+correcta'
      }
    ]
  },
  {
    id: 'barra-olimpica',
    nombre: 'Barra Olímpica',
    categoria: 'Peso libre',
    emoji: '⚡',
    imagen: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=remo+barra+inclinado+espalda'
      }
    ]
  },
  // ── Calistenia libre ─────────────────────────────────────────
  {
    id: 'sentadillas-cali',
    nombre: 'Sentadillas',
    categoria: 'Calistenia',
    emoji: '🦵',
    imagen: 'https://images.unsplash.com/photo-1566351681893-d27d80e4b232?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1566351681893-d27d80e4b232?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=sentadilla+salto+tecnica'
      }
    ]
  },
  {
    id: 'lagartijas',
    nombre: 'Lagartijas',
    categoria: 'Calistenia',
    emoji: '🐊',
    imagen: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=lagartija+diamante+triceps'
      }
    ]
  },
  {
    id: 'burpees',
    nombre: 'Burpees',
    categoria: 'Calistenia',
    emoji: '🔥',
    imagen: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=burpee+completo+como+hacer+tecnica'
      }
    ]
  },
  // ── Calistenia con equipo: Barra + Paralelas ─────────────────
  {
    id: 'barra-paralelas',
    nombre: 'Barra de Dominadas + Paralelas',
    categoria: 'Calistenia',
    emoji: '🔝',
    imagen: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&q=75&auto=format',
    ejercicios: [
      {
        id: 'dominadas-pronadas',
        nombre: 'Dominadas (Pull-ups)',
        musculosPrincipales: ['Dorsal ancho', 'Bíceps'],
        musculosSecundarios: ['Romboides', 'Trapecios medio', 'Core'],
        dificultad: 'Avanzado',
        descripcion: 'Agárrate a la barra con agarre prono (palmas hacia adelante) a la anchura de los hombros. Cuelga con los brazos extendidos y sube hasta que la barbilla supere la barra. Baja de forma controlada.',
        advertencia: 'Si no puedes hacer ninguna, empieza con el ejercicio de jalón al frente o usa una banda de resistencia.',
        series: '3-4', repeticiones: 'Máximo posible', descanso: '2 min',
        fotos: [
          'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=dominadas+pull+ups+tecnica+correcta'
      },
      {
        id: 'chin-ups',
        nombre: 'Chin-ups (Dominadas supinas)',
        musculosPrincipales: ['Bíceps', 'Dorsal ancho'],
        musculosSecundarios: ['Braquial', 'Core'],
        dificultad: 'Intermedio',
        descripcion: 'Agárrate con agarre supino (palmas hacia ti) a la anchura de los hombros. Sube llevando el pecho hacia la barra. El giro de las palmas activa más el bíceps que las dominadas pronadas.',
        advertencia: 'Evita balancearte — el movimiento debe ser controlado de arriba hacia abajo.',
        series: '3', repeticiones: '5-10', descanso: '90 seg',
        fotos: [
          'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=chin+ups+dominadas+supinas+biceps'
      },
      {
        id: 'fondos-paralelas',
        nombre: 'Fondos en paralelas (Dips)',
        musculosPrincipales: ['Pecho inferior', 'Tríceps'],
        musculosSecundarios: ['Deltoides frontal', 'Core'],
        dificultad: 'Intermedio',
        descripcion: 'Apoya las manos en las paralelas, cuerpo recto. Baja doblando los codos hasta 90° con el tronco ligeramente inclinado hacia adelante. Empuja hacia arriba. Para más pecho: inclínate más. Para más tríceps: mantente más recto.',
        advertencia: 'No bajes más de 90° — puede sobrecargar los hombros. Detente si sientes dolor.',
        series: '3-4', repeticiones: '8-15', descanso: '90 seg',
        fotos: [
          'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=75&auto=format',
          'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=fondos+paralelas+dips+tecnica+correcta'
      },
      {
        id: 'elevaciones-rodillas-barra',
        nombre: 'Elevaciones de rodillas colgado',
        musculosPrincipales: ['Core', 'Abdomen'],
        musculosSecundarios: ['Flexores de cadera', 'Antebrazos'],
        dificultad: 'Principiante',
        descripcion: 'Cuelga de la barra con agarre cómodo. Sube las rodillas hacia el pecho contrayendo el abdomen. Baja controlado sin balancearte.',
        advertencia: 'No uses impulso del torso. Si sientes las muñecas débiles, fortalécelas primero con otros ejercicios.',
        series: '3', repeticiones: '10-15', descanso: '60 seg',
        fotos: [
          'https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=elevaciones+rodillas+barra+colgado+core'
      },
      {
        id: 'hollow-body',
        nombre: 'Hollow body hold',
        musculosPrincipales: ['Core', 'Abdomen'],
        musculosSecundarios: ['Flexores de cadera'],
        dificultad: 'Intermedio',
        descripcion: 'Recostado, eleva piernas y hombros del suelo manteniendo la espalda baja pegada. Mantén la posición. Es la base del movimiento en todos los ejercicios de calistenia avanzada.',
        advertencia: 'Si la espalda baja se despega del suelo, sube un poco más las piernas.',
        series: '3', repeticiones: '20-30 seg', descanso: '60 seg',
        fotos: [
          'https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=hollow+body+hold+calistenia+core'
      },
      {
        id: 'fondos-triceps-paralelas',
        nombre: 'Fondos de tríceps en paralelas',
        musculosPrincipales: ['Tríceps'],
        musculosSecundarios: ['Pecho bajo', 'Deltoides'],
        dificultad: 'Principiante',
        descripcion: 'Tronco recto, codos apuntando hacia atrás. Baja y sube enfocándote en los tríceps. A diferencia de los fondos para pecho, mantén el cuerpo vertical.',
        advertencia: 'No bajes más de 90° en los codos.',
        series: '3', repeticiones: '12-20', descanso: '60 seg',
        fotos: [
          'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=75&auto=format'
        ],
        videoYoutube: 'https://www.youtube.com/results?search_query=fondos+triceps+paralelas+tecnica'
      }
    ]
  },
  {
    id: 'step',
    nombre: 'Step / Plataforma',
    categoria: 'Accesorios',
    emoji: '⬛',
    imagen: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=600&q=75&auto=format',
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
        fotos: [
          'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=600&q=75&auto=format'
        ],
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
        fotos: [
          'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=75&auto=format'
        ],
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

// ── Zona Fit — Rutinas específicas para mujeres ───────────────
export const RUTINAS_FEMENINAS = {
  maquinas: {
    nombre: 'Rutina Máquinas — Glúteos & Piernas',
    color: '#e91e8c',
    descripcion: 'Enfocada en glúteos, cuádriceps y tonificación. Usa principalmente el rack, banco y mancuernas.',
    dias: [
      {
        dia: 'Lunes',
        foco: 'Glúteos + Piernas',
        ejercicios: [
          {n:'Hip Thrust con barra',      s:'4x12'},
          {n:'Sentadilla búlgara',        s:'3x10 c/pierna'},
          {n:'Peso muerto rumano',        s:'4x10'},
          {n:'Hiperextensión de espalda', s:'3x15'},
          {n:'Elevación de talones',      s:'3x20'}
        ]
      },
      {
        dia: 'Martes',
        foco: 'Descanso activo',
        ejercicios: [
          {n:'Estiramiento completo',     s:'15 min'},
          {n:'Caminata suave',            s:'20 min'}
        ]
      },
      {
        dia: 'Miércoles',
        foco: 'Tren superior + Core',
        ejercicios: [
          {n:'Press de hombros mancuernas', s:'3x12'},
          {n:'Elevaciones laterales',       s:'3x15'},
          {n:'Remo con máquina',            s:'4x12'},
          {n:'Plancha abdominal',           s:'3x40seg'},
          {n:'Lagartija rodillas',          s:'3x12'}
        ]
      },
      {
        dia: 'Jueves',
        foco: 'Descanso activo',
        ejercicios: [
          {n:'Estiramiento completo',     s:'15 min'},
          {n:'Caminata moderada',         s:'20 min'}
        ]
      },
      {
        dia: 'Viernes',
        foco: 'Piernas completas',
        ejercicios: [
          {n:'Sentadilla sumo con mancuerna', s:'4x15'},
          {n:'Zancada reversa',               s:'3x12 c/pierna'},
          {n:'Glute bridge con peso',          s:'4x15'},
          {n:'Step-up con rodilla',           s:'3x12'},
          {n:'Sentadilla isométrica',         s:'3x30seg'}
        ]
      },
      {
        dia: 'Sábado',
        foco: 'Circuito activo',
        ejercicios: [
          {n:'Sentadilla libre',          s:'4x20'},
          {n:'Lagartija estándar',        s:'3x10'},
          {n:'Step-up con rodilla',       s:'3x12'},
          {n:'Plancha lateral',           s:'3x30seg c/lado'}
        ]
      },
      {
        dia: 'Domingo',
        foco: 'Descanso total',
        ejercicios: [
          {n:'Descanso y recuperación',   s:'Obligatorio'}
        ]
      }
    ]
  },
  hibrida: {
    nombre: 'Rutina Híbrida — Máquinas + Calistenia',
    color: '#9c27b0',
    descripcion: 'Combina máquinas del gym con calistenia. Ideal para quienes quieren variedad y fuerza funcional.',
    dias: [
      {
        dia: 'Lunes',
        foco: 'Piernas (máquinas)',
        ejercicios: [
          {n:'Hip Thrust con barra',      s:'4x12'},
          {n:'Sentadilla búlgara',        s:'3x10 c/pierna'},
          {n:'Peso muerto rumano',        s:'3x12'},
          {n:'Elevación de talones',      s:'3x20'}
        ]
      },
      {
        dia: 'Martes',
        foco: 'Tren superior (calistenia)',
        ejercicios: [
          {n:'Lagartija estándar',        s:'4x máximo'},
          {n:'Fondos de tríceps step',    s:'3x15'},
          {n:'Plancha abdominal',         s:'3x45seg'},
          {n:'Elevaciones rodillas barra',s:'3x12'}
        ]
      },
      {
        dia: 'Miércoles',
        foco: 'Descanso activo',
        ejercicios: [
          {n:'Caminata moderada',         s:'25 min'},
          {n:'Estiramiento',              s:'10 min'}
        ]
      },
      {
        dia: 'Jueves',
        foco: 'Piernas (calistenia)',
        ejercicios: [
          {n:'Sentadilla con salto',      s:'4x15'},
          {n:'Zancada reversa',           s:'3x12 c/pierna'},
          {n:'Glute bridge sin peso',     s:'4x20'},
          {n:'Step-up con rodilla',       s:'3x12'}
        ]
      },
      {
        dia: 'Viernes',
        foco: 'Tren superior (máquinas)',
        ejercicios: [
          {n:'Remo con máquina',          s:'4x12'},
          {n:'Press de hombros',          s:'3x12'},
          {n:'Curl bíceps sentado',       s:'3x15'},
          {n:'Hiperextensión',            s:'3x15'}
        ]
      },
      {
        dia: 'Sábado',
        foco: 'Circuito HIIT',
        ejercicios: [
          {n:'Burpees modificados',       s:'4x10'},
          {n:'Sentadilla libre',          s:'4x20'},
          {n:'Lagartija rodillas',        s:'3x12'},
          {n:'Plancha',                   s:'3x40seg'}
        ]
      },
      {
        dia: 'Domingo',
        foco: 'Descanso total',
        ejercicios: [
          {n:'Descanso y recuperación',   s:'Obligatorio'}
        ]
      }
    ]
  },
  calistenia: {
    nombre: 'Rutina Solo Calistenia',
    color: '#00897b',
    descripcion: 'Sin máquinas ni pesas. Puedes hacerla en el gym o en casa. Enfocada en glúteos, core y tonificación total.',
    dias: [
      {
        dia: 'Lunes',
        foco: 'Glúteos + Piernas',
        ejercicios: [
          {n:'Sentadilla sumo',           s:'4x20'},
          {n:'Glute bridge',              s:'4x20'},
          {n:'Sentadilla búlgara',        s:'3x12 c/pierna'},
          {n:'Elevación de rodilla de pie',s:'3x15 c/pierna'},
          {n:'Zancada lateral',           s:'3x10 c/lado'}
        ]
      },
      {
        dia: 'Martes',
        foco: 'Tren superior',
        ejercicios: [
          {n:'Lagartija estándar',        s:'4x máximo'},
          {n:'Lagartija diamante',        s:'3x10'},
          {n:'Plancha abdominal',         s:'3x45seg'},
          {n:'Plancha lateral',           s:'3x30seg c/lado'}
        ]
      },
      {
        dia: 'Miércoles',
        foco: 'Descanso activo',
        ejercicios: [
          {n:'Caminata o trote ligero',   s:'25 min'},
          {n:'Estiramiento completo',     s:'10 min'}
        ]
      },
      {
        dia: 'Jueves',
        foco: 'Core + Cardio',
        ejercicios: [
          {n:'Burpees modificados',       s:'4x10'},
          {n:'Sentadilla con salto',      s:'4x15'},
          {n:'Mountain climbers',         s:'3x30seg'},
          {n:'Plancha con toque hombro',  s:'3x12 c/lado'}
        ]
      },
      {
        dia: 'Viernes',
        foco: 'Glúteos completo',
        ejercicios: [
          {n:'Hip thrust en suelo',       s:'4x25'},
          {n:'Patada trasera (Kickback)', s:'4x15 c/pierna'},
          {n:'Sentadilla libre',          s:'4x20'},
          {n:'Abducción lateral de pie',  s:'3x20 c/lado'}
        ]
      },
      {
        dia: 'Sábado',
        foco: 'Circuito completo',
        ejercicios: [
          {n:'Burpees',                   s:'3x10'},
          {n:'Sentadilla sumo',           s:'3x20'},
          {n:'Lagartija estándar',        s:'3x12'},
          {n:'Glute bridge',              s:'3x20'},
          {n:'Plancha',                   s:'3x40seg'}
        ]
      },
      {
        dia: 'Domingo',
        foco: 'Descanso total',
        ejercicios: [
          {n:'Descanso y recuperación',   s:'Obligatorio'}
        ]
      }
    ]
  }
}

// ── Contenido educativo ───────────────────────────────────────
export const CONTENIDO_EDUCATIVO = [
  {
    id: 'por-que-ejercitar',
    titulo: '¿Por qué hacer ejercicio?',
    emoji: '🥭',
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
