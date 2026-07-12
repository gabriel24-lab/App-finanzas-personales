# App Finanzas — Monorepo (Frontend + Backend)

Proyecto de finanzas personales separado en dos aplicaciones independientes:

```
app-finanzas-monorepo/
├── frontend/   # React + Vite + Tailwind (SPA, actualmente con localStorage)
└── backend/    # Node.js + Express + MongoDB/Mongoose (API REST)
```

Cada carpeta es un proyecto Node independiente, con su propio `package.json` y
`node_modules`. No comparten dependencias ni scripts.

## Frontend (`/frontend`)

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Hoy persiste los datos en `localStorage` del navegador (transacciones y
presupuestos). Es el siguiente paso natural conectarlo a la API del backend
en vez de `localStorage` — dime cuando quieras que lo haga y en qué endpoints
apoyarse (ya definidos en `backend/README.md`).

## Backend (`/backend`)

```bash
cd backend
npm install
cp .env.example .env   # edita MONGO_URI con tu conexión real
npm run dev             # http://localhost:4000
```

Requiere MongoDB corriendo como **Replica Set** (Atlas ya lo es por defecto;
en local hace falta `mongod --replSet rs0` + `rs.initiate()`). Ver detalle de
endpoints, reglas de negocio y ejemplos de `curl` en `backend/README.md`.

## Correr ambos en paralelo

Sin herramientas adicionales, en dos terminales separadas:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Si prefieres un solo comando (`npm run dev` desde la raíz levantando ambos a
la vez), puedo agregar un `package.json` raíz con `concurrently` — dime y lo
dejo listo.

## Próximo paso pendiente

El frontend todavía guarda todo en `localStorage`; no consume la API. Para
integrarlos falta:
1. Definir cómo el frontend obtiene el `user_id` (login simple, o un usuario
   fijo de prueba mientras no hay autenticación).
2. Reemplazar las llamadas a `localStorage` en `App.jsx` por `fetch()` contra
   `http://localhost:4000/api/transactions` y `/api/users`.
3. Conectar el selector de divisa/wallet del frontend con el filtrado por
   `wallet_id`/`currency_code` que ya expone `GET /api/transactions/:userId`.
