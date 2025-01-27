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

    // Validación básica
    if (!email || !password) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Email y contraseña son obligatorios'
        });
    }

    const query = 'SELECT email, usertipo FROM usuarios WHERE email = ? AND password = ?';

    conexion.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error en la base de datos'
            });
        }

        if (results.length > 0) {
            return res.status(200).json({
                exito: true,
                mensaje: 'Usuario autenticado',
                usuario: results[0] // Incluye el email y usertipo
            });
        } else {
            return res.status(401).json({
                exito: false,
                mensaje: 'Credenciales incorrectas'
            });
        }
    });
});

// Endpoint para registrar usuarios
router.post('/registro', (req, res) => {
    const { email, password, usertipo } = req.body;

    // Validación básica
    if (!email || !password || !usertipo) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    // Consulta para insertar el usuario en la base de datos
    const query = 'INSERT INTO usuarios (email, password, usertipo) VALUES (?, ?, ?)';
    conexion.query(query, [email, password, usertipo], (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al registrar usuario'
            });
        }
        return res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado exitosamente'
        });
    });
});

module.exports = router;
