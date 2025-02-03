const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Verificar si la carpeta imgproducto existe, si no, mostrar advertencia
const carpetaImagenes = path.join(__dirname, "imgproducto");
if (!fs.existsSync(carpetaImagenes)) {
  console.warn("⚠️ La carpeta 'imgproducto' no existe. Créala en 'backend/imgproducto'");
}

// Configurar Express para servir archivos estáticos desde la carpeta "imgproducto"
app.use('/imgproducto', express.static(carpetaImagenes));
console.log("📂 Servidor estático configurado para /imgproducto");

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const rutasUsuarios = require("./rutas/usuarios");
app.use("/api/usuarios", rutasUsuarios);

const productosRutas = require("./rutas/productos");
app.use("/api", productosRutas);
