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

// Endpoint para actualizar un producto por su ID
router.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    // Validar que se proporcionen los campos necesarios
    if (!nombre || !descripcion) {
        return res.status(400).json({
            exito: false,
            mensaje: 'El nombre y la descripción son obligatorios'
        });
    }

    const consulta = 'UPDATE producto SET nombre = ?, descripcion = ? WHERE id = ?';

    conexion.query(consulta, [nombre, descripcion, id], (error, resultados) => {
        if (error) {
            console.error('Error al actualizar el producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar el producto'
            });
        }

        // Verificar si algún registro fue afectado
        if (resultados.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Producto actualizado correctamente'
        });
    });
});

// Endpoint para eliminar un producto por su ID
router.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    const consulta = 'DELETE FROM producto WHERE id = ?';

    conexion.query(consulta, [id], (error, resultados) => {
        if (error) {
            console.error('Error al eliminar el producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar el producto',
            });
        }

        // Verificar si se eliminó algún registro
        if (resultados.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Producto no encontrado',
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Producto eliminado correctamente',
        });
    });
});



module.exports = router;
