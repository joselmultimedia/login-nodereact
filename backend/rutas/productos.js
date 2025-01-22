const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia este usuario si es necesario
    password: '', // Cambia la contraseña si tu base de datos tiene una configurada
    database: 'loginnode'
});

// Conectar a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

// Endpoint para obtener todos los productos
router.get('/productos', (req, res) => {
    const consulta = 'SELECT * FROM producto';

    conexion.query(consulta, (error, resultados) => {
        if (error) {
            console.error('Error al obtener los productos:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener los productos'
            });
        }

        // Enviar los productos obtenidos al frontend
        res.status(200).json({
            exito: true,
            productos: resultados
        });
    });
});

module.exports = router;
