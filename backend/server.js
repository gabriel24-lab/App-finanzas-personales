require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Si Mongo falla, connectDB() ya hace process.exit(1),
  // así que si llegamos aquí es porque la conexión fue exitosa.
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

startServer();
