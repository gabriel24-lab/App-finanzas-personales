const mongoose = require("mongoose");
const dns = require("dns");

// Fix para un bug conocido de Node en Windows: cuando el DNS del sistema
// es una dirección IPv6 link-local (ej. fe80::1, típica de routers caseros),
// el resolver interno de Node (c-ares) falla al hacer consultas SRV
// (mongodb+srv://) con "querySrv ECONNREFUSED", aunque el sistema operativo
// sí resuelva el DNS correctamente (por eso "nslookup" funciona pero Node no).
// Forzamos a Node a usar DNS públicos solo para sus propias consultas.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

/**
 * Establece la conexión con MongoDB usando Mongoose.
 * Detiene el proceso si la conexión falla, ya que la API no puede
 * operar sin base de datos.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("[DB] Falta la variable de entorno MONGO_URI");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
      // Mongoose 8 ya no requiere useNewUrlParser/useUnifiedTopology,
      // se dejan solo como referencia si se usa un driver más antiguo.
    });

    console.log(`[DB] Conectado a MongoDB -> ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[DB] Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] Conexión a MongoDB perdida");
  });
}

module.exports = connectDB;
