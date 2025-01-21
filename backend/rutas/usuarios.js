const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de conexión a la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia este usuario si es necesario
    password: '', // Cambia la contraseña si tu base de datos tiene una configurada
    database: 'loginnode'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

// Endpoint para autenticación
router.post('/login', (req, res) => {
    const { email, password } = req.body; // Datos enviados desde el cliente
    const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

    conexion.query(query, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error en la base de datos');
        } else if (results.length > 0) {
            res.status(200).json({ mensaje: 'Usuario autenticado', usuario: results[0] });
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

module.exports = router;
