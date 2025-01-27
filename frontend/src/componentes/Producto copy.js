import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Producto.css';

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [mensajeError, setMensajeError] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nombreActualizado, setNombreActualizado] = useState('');
    const [descripcionActualizada, setDescripcionActualizada] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Recuperar el correo del usuario desde localStorage
    const correoUsuario = localStorage.getItem('correoUsuario');

    useEffect(() => {
        // Función para obtener los productos desde el backend
        const obtenerProductos = async () => {
            try {
                const respuesta = await axios.get('http://localhost:5000/api/productos');
                if (respuesta.data.exito) {
                    setProductos(respuesta.data.productos);
                } else {
                    setMensajeError('Error al obtener los productos');
                }
            } catch (error) {
                setMensajeError('Error al conectar con el servidor');
            }
        };

        obtenerProductos();
    }, []);

    // Función para seleccionar un producto para actualizar
    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setNombreActualizado(producto.nombre);
        setDescripcionActualizada(producto.descripcion);
    };

    // Función para manejar la actualización de un producto
    const manejarActualizacion = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.put(`http://localhost:5000/api/productos/${productoSeleccionado.id}`, {
                nombre: nombreActualizado,
                descripcion: descripcionActualizada
            });

            if (respuesta.data.exito) {
                // Actualizar el estado de los productos
                setProductos((productos) =>
                    productos.map((prod) =>
                        prod.id === productoSeleccionado.id
                            ? { ...prod, nombre: nombreActualizado, descripcion: descripcionActualizada }
                            : prod
                    )
                );
                setProductoSeleccionado(null); // Limpiar la selección
            } else {
                setMensajeError('Error al actualizar el producto');
            }
        } catch (error) {
            setMensajeError('Error al conectar con el servidor');
        }
    };

    // Función para manejar el cambio en el campo de búsqueda
    const manejarCambioBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    // Filtrar productos según el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="contenedor-productos">
            {/* Mostrar mensaje de bienvenida con el correo del usuario */}
            <h2 className="bienvenida">Bienvenido, {correoUsuario || 'Usuario'}</h2>

            <h3 className="titulo-listado">Lista de Productos</h3>
            <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={manejarCambioBusqueda}
                className="buscador"
            />
            {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
            {productosFiltrados.length > 0 ? (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>
                                    <button className="boton-actualizar" onClick={() => seleccionarProducto(producto)}>
                                        Actualizar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron resultados</p>
            )}

            {productoSeleccionado && (
                <div className="formulario-actualizar">
                    <h3>Actualizar Producto</h3>
                    <form onSubmit={manejarActualizacion}>
                        <div className="campo">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nombreActualizado}
                                onChange={(e) => setNombreActualizado(e.target.value)}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label>Descripción:</label>
                            <textarea
                                value={descripcionActualizada}
                                onChange={(e) => setDescripcionActualizada(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="boton-guardar">Guardar Cambios</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Producto;
