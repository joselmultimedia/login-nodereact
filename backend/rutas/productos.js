const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        console.error('❌ Error al conectar a la base de datos:', error);
        return;
    }
    console.log('✅ Conexión a la base de datos establecida.');
});

// Verificar y crear la carpeta 'imgproducto' si no existe
const carpetaImagenes = path.join(__dirname, '../imgproducto');
if (!fs.existsSync(carpetaImagenes)) {
    fs.mkdirSync(carpetaImagenes, { recursive: true });
    console.log('📂 Carpeta imgproducto creada automáticamente.');
}

// Configuración de Multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaImagenes); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const nombreArchivo = `${Date.now()}-${file.originalname}`;
        cb(null, nombreArchivo);
    }
});

// Filtrar archivos para permitir solo imágenes JPG y PNG
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png'];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no permitido. Solo se aceptan .jpg y .png'), false);
    }
};

// Tamaño máximo permitido: 2MB
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// Middleware para verificar si el usuario es administrador
const verificarAdmin = (req, res, next) => {
    const usertipo = req.headers.usertipo; // Se debe enviar desde el frontend en cada solicitud
    if (usertipo !== 'admin') {
        return res.status(403).json({
            exito: false,
            mensaje: '🚫 No tienes permisos para realizar esta acción'
        });
    }
    next();
};

// Endpoint para obtener todos los productos
router.get('/productos', (req, res) => {
    const consulta = 'SELECT * FROM producto';

    conexion.query(consulta, (error, resultados) => {
        if (error) {
            console.error('❌ Error al obtener los productos:', error);
            return res.status(500).json({
                exito: false,
                mensaje: '❌ Error al obtener los productos'
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
router.put('/productos/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({
            exito: false,
            mensaje: '⚠️ El nombre y la descripción son obligatorios'
        });
    }

    const consulta = 'UPDATE producto SET nombre = ?, descripcion = ? WHERE id = ?';

    conexion.query(consulta, [nombre, descripcion, id], (error, resultados) => {
        if (error) {
            console.error('❌ Error al actualizar el producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: '❌ Error al actualizar el producto'
            });
        }

        if (resultados.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: '⚠️ Producto no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: '✅ Producto actualizado correctamente'
        });
    });
});

// Endpoint para eliminar un producto por su ID (solo admin)
router.delete('/productos/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;

    const consulta = 'DELETE FROM producto WHERE id = ?';

    conexion.query(consulta, [id], (error, resultados) => {
        if (error) {
            console.error('❌ Error al eliminar el producto:', error);
            return res.status(500).json({
                exito: false,
                mensaje: '❌ Error al eliminar el producto',
            });
        }

        if (resultados.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: '⚠️ Producto no encontrado',
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: '✅ Producto eliminado correctamente',
        });
    });
});

// Endpoint para subir imagen del producto (solo admin)
router.post('/productos/subir-imagen/:id', verificarAdmin, upload.single('imagen'), (req, res) => {
    const idProducto = req.params.id;

    if (!req.file) {
        return res.status(400).json({ exito: false, mensaje: '⚠️ No se subió ninguna imagen o formato no permitido' });
    }

    const rutaImagen = `/imgproducto/${req.file.filename}`;

    const query = 'UPDATE producto SET imagen = ? WHERE id = ?';
    conexion.query(query, [rutaImagen, idProducto], (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar la imagen en la base de datos:', err);
            return res.status(500).json({ exito: false, mensaje: '❌ Error al actualizar la imagen' });
        }

        return res.status(200).json({ exito: true, mensaje: '✅ Imagen subida correctamente', rutaImagen });
    });
});

module.exports = router;
