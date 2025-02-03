const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar Express para servir archivos estáticos desde la carpeta "backend/imgproducto"
app.use('/imgproducto', express.static('backend/imgproducto'));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const rutasUsuarios = require('./rutas/usuarios');
app.use('/api/usuarios', rutasUsuarios);

const productosRutas = require('./rutas/productos');
app.use('/api', productosRutas);
