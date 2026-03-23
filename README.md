# GYM Asica Farms 🥭🥑🍇

App web para el gimnasio interno de Asica Farms, Olmos, Perú.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Auth | Firebase Authentication |
| Base de datos | Firestore (Firebase) |
| Hosting | Firebase Hosting |
| Coach IA | Claude API (Haiku — optimizado) |
| Estilo | CSS propio (listo para rediseño con AI Studio) |

---

## Estructura de carpetas

```
gym-asica-farms/
├── public/
│   ├── manifest.json        # PWA config (celulares)
│   └── images/              # ← AI Studio agrega imágenes aquí
│       ├── maquinas/        # Fotos de cada máquina del gym
│       └── ejercicios/      # Collages de cada ejercicio
├── src/
│   ├── context/
│   │   └── AuthContext.jsx  # Estado global de auth
│   ├── data/
│   │   └── gymData.js       # Máquinas, ejercicios y rutinas A-E
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── Guia.jsx
│   │   ├── Maquinas.jsx
│   │   ├── Rutinas.jsx
│   │   ├── Perfil.jsx
│   │   ├── Coach.jsx        # Chatbot (solo usuarios logueados)
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Admin.jsx        # Panel de administración
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── firebase.js      # Inicialización Firebase
│   │   ├── authService.js   # Login, registro, logout
│   │   ├── dbService.js     # Firestore: perfil, rutinas, medidas
│   │   └── coachService.js  # Claude API con filtro de tema
│   ├── components/
│   │   └── layout/
│   │       └── Layout.jsx   # Header + nav inferior + outlet
│   ├── styles/
│   │   └── global.css       # Todos los estilos (con comentarios para AI Studio)
│   ├── App.jsx              # Router principal
│   └── main.jsx             # Entry point
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Setup paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto nuevo: `gym-asica-farms`
3. Activa **Authentication** → Sign-in method → **Email/Password**
4. Activa **Firestore Database** → Modo producción
5. Ve a ⚙️ Configuración del proyecto → Tus apps → Agrega una app web
6. Copia los valores de configuración

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Abre `.env` y pega los valores de Firebase y tu API key de Anthropic.

### 4. Reglas de Firestore
En Firebase Console → Firestore → Reglas, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo el propio usuario o admins
    match /usuarios/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
      
      // Subcolecciones del usuario
      match /{subcol}/{docId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
    // Solo admins pueden leer todos los usuarios
    match /usuarios/{uid} {
      allow read: if get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }
  }
}
```

### 5. Correr en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

### 6. Build para producción
```bash
npm run build
```

---

## Cómo cambiar la cuenta de Claude API

Cuando quieras transferir el proyecto a Asica Farms o cambiar la cuenta:

1. Obtén una nueva API key en [console.anthropic.com](https://console.anthropic.com)
2. Abre `.env`
3. Cambia el valor de `VITE_ANTHROPIC_KEY`
4. Rebuild: `npm run build`

El modelo usado es **Claude Haiku** — el más económico y suficiente para Q&A de gym.
Estimado: ~$1–2 USD/mes con 30 usuarios activos.

---

## Hacer a alguien administrador

1. El usuario se registra normalmente
2. En Firebase Console → Firestore → `usuarios` → busca al usuario
3. Cambia el campo `rol` de `"usuario"` a `"admin"`
4. O usa el panel `/admin` si ya tienes un admin activo

---

## Notas para AI Studio

Todos los puntos de rediseño están marcados con comentarios `/* AI Studio: */` en:
- `src/styles/global.css` — tokens de color, fuentes, fondos
- `src/components/layout/Layout.jsx` — header y nav inferior
- `src/pages/Inicio.jsx` — hero, personajes frutas
- `src/data/gymData.js` — rutas de imágenes para cada máquina y ejercicio
- `public/images/` — carpeta donde van todas las fotos reales

Los personajes de frutas están como emojis. AI Studio puede reemplazarlos con ilustraciones SVG en `src/components/ui/FruitChars.jsx`.
