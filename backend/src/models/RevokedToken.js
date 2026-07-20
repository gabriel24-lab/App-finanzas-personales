const mongoose = require("mongoose");

/**
 * RevokedToken — lista negra de JWTs invalidados.
 *
 * Cuando el usuario cierra sesión, el `jti` (JWT ID) del token activo se
 * guarda aquí. El middleware `protect` rechaza cualquier token cuyo `jti`
 * aparezca en esta colección, haciendo el logout real en el servidor.
 *
 * El campo `expiresAt` coincide con la expiración original del JWT: MongoDB
 * borra el documento automáticamente en ese instante mediante el TTL index,
 * así la colección nunca crece de forma indefinida.
 */
const RevokedTokenSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Fecha de expiración original del JWT (para el TTL index de MongoDB).
  expiresAt: {
    type: Date,
    required: true,
  },
});

// MongoDB elimina automáticamente el documento cuando `expiresAt` llega a su
// fecha (con una granularidad de ~60 s según la configuración del servidor).
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RevokedToken", RevokedTokenSchema);
