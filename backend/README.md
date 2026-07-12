# Finanzas Backend — API Multiusuario y Multimoneda

API REST en Node.js/Express + MongoDB (Mongoose) para gestión de finanzas personales
con soporte para múltiples billeteras (wallets) por usuario, cada una en su propia moneda.

## Estructura del proyecto

```
finanzas-backend/
├── server.js                       # Punto de entrada: conecta DB y levanta el servidor
├── .env.example                     # Variables de entorno de ejemplo
└── src/
    ├── app.js                       # Configuración de Express (middlewares, rutas)
    ├── config/
    │   └── db.js                    # Conexión a MongoDB vía Mongoose
    ├── models/
    │   ├── User.js                  # Usuario + array embebido de wallets
    │   └── Transaction.js           # Transacciones (colección separada)
    ├── controllers/
    │   ├── userController.js        # Registro de usuarios y alta de wallets
    │   └── transactionController.js # Lógica de negocio de movimientos
    ├── routes/
    │   ├── userRoutes.js
    │   └── transactionRoutes.js
    ├── middleware/
    │   └── errorHandler.js          # Manejo centralizado de errores
    └── utils/
        ├── ApiError.js              # Error con código HTTP asociado
        └── asyncHandler.js          # Wrapper para controladores async
```

## Requisito importante: Replica Set

Las actualizaciones de balance usan **transacciones multi-documento de MongoDB**
(`session.withTransaction`) para garantizar que la creación de la transacción y la
actualización del balance de la wallet ocurran de forma atómica (todo o nada).

Esto **requiere que MongoDB corra como Replica Set**:
- **MongoDB Atlas**: ya es un replica set por defecto, no requiere configuración extra.
- **Local**: inicia `mongod` con `--replSet rs0` y ejecuta `rs.initiate()` una vez en el shell,
  o usa Docker con una imagen que ya lo configure (ej. `mongo:7 --replSet rs0`).

Si intentas correr esto contra una instancia standalone (sin replica set), las
llamadas a `POST /api/transactions` y `DELETE /api/transactions/:id` fallarán.

## Instalación

```bash
npm install
cp .env.example .env
# Edita .env con tu MONGO_URI real
npm run dev   # con nodemon
# o
npm start
```

## Regla de negocio central (consistencia de balances)

Cuando se registra una transacción (`POST /api/transactions`):

1. Se valida que el usuario y la wallet (`wallet_id`) existan.
2. Se valida que la moneda enviada (`currency_code`) coincida con la moneda de esa wallet
   (evita que una transacción en USD impacte una wallet en COP).
3. Se calcula el delta: `+amount` si es `income`, `-amount` si es `expense`.
4. Se actualiza `current_balance` de la wallet **dentro de la misma sesión/transacción**
   que crea el documento en la colección `transactions`.
5. Si cualquier paso falla, `withTransaction` revierte todo (no queda ni la transacción
   huérfana ni el balance desincronizado).

`DELETE /api/transactions/:id` hace el proceso inverso: revierte el efecto de la
transacción sobre el balance antes de eliminarla, también de forma atómica.

## Endpoints

### Usuarios

| Método | Ruta                    | Descripción                                  |
|--------|-------------------------|-----------------------------------------------|
| POST   | `/api/users`            | Crea un usuario (puede incluir `wallets` inicial) |
| GET    | `/api/users/:id`        | Obtiene un usuario con sus wallets            |
| POST   | `/api/users/:id/wallets`| Agrega una nueva wallet/moneda al usuario     |

**Crear usuario con dos billeteras:**
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Pérez",
    "email": "ana@example.com",
    "password": "secreto123",
    "wallets": [
      { "wallet_id": "wallet_cop", "currency_code": "COP", "currency_symbol": "$", "account_name": "Cuenta Bancaria", "current_balance": 0 },
      { "wallet_id": "wallet_usd", "currency_code": "USD", "currency_symbol": "$", "account_name": "Ahorros USD", "current_balance": 0 }
    ]
  }'
```

### Transacciones

| Método | Ruta                        | Descripción                                              |
|--------|-----------------------------|-----------------------------------------------------------|
| POST   | `/api/transactions`         | Crea una transacción y actualiza el balance de la wallet   |
| GET    | `/api/transactions/:userId` | Lista transacciones (filtros: `wallet_id`, `currency_code`, `category`, `type`, `page`, `limit`) |
| DELETE | `/api/transactions/:id`     | Elimina una transacción y revierte el balance              |

**Registrar un gasto:**
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<ID_DEL_USUARIO>",
    "wallet_id": "wallet_cop",
    "description": "Compra de supermercado",
    "amount": 154.30,
    "type": "expense",
    "category": "Comida",
    "currency_code": "COP"
  }'
```

**Filtrar por billetera activa (soporta el selector de divisa del frontend):**
```bash
curl "http://localhost:4000/api/transactions/<ID_DEL_USUARIO>?wallet_id=wallet_usd&page=1&limit=10"
```

### Categorías

Cada usuario tiene su propio set de categorías (nombre, tipo, color e ícono),
sembrado automáticamente con valores por defecto al registrarse. Las
transacciones y presupuestos siguen guardando el *nombre* de la categoría
como texto plano, así que renombrar o borrar una categoría no afecta el
histórico ya registrado.

| Método | Ruta                     | Descripción                                    |
|--------|--------------------------|-------------------------------------------------|
| GET    | `/api/categories/:userId`| Lista las categorías del usuario (las siembra si no tiene ninguna) |
| POST   | `/api/categories`        | Crea una categoría nueva                        |
| PUT    | `/api/categories/:id`    | Edita nombre, color y/o ícono (el `type` no se puede cambiar) |
| DELETE | `/api/categories/:id`    | Elimina una categoría                           |

Todas requieren `Authorization: Bearer <token>` (igual que transacciones y presupuestos).

**Crear una categoría:**
```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<ID_DEL_USUARIO>",
    "name": "Mascotas",
    "type": "expense",
    "color": "#14b8a6",
    "icon": "PawPrint"
  }'
```

## Notas de diseño / próximos pasos sugeridos

- **Autenticación**: el modelo ya hashea `password` con bcrypt (`pre('save')`) y expone
  `comparePassword()`, pero no incluí login/JWT porque no se pidió explícitamente. Si lo
  necesitas, puedo agregar `POST /api/auth/login` + middleware de verificación de JWT
  para que `user_id` salga de `req.user.id` en vez del body.
- **Fondos insuficientes**: actualmente se permite que una wallet quede en negativo
  (útil para tarjetas de crédito o cuentas con sobregiro). Si tu regla de negocio
  requiere bloquear gastos que superen el balance disponible, es un cambio de una
  línea en `transactionController.js` (lo dejé documentado en el código).
- Este backend fue **verificado con `node --check` en cada archivo y cargando la app
  de Express sin conexión a DB**; no pude ejecutar un flujo end-to-end contra un
  MongoDB real porque el entorno de esta sesión no tiene acceso de red para descargar
  el binario de `mongod`. Antes de usarlo en producción, corre las pruebas manuales de
  arriba contra tu propia instancia (local con replica set, o Atlas).
