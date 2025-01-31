import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Producto.css';

const ProductoCliente = () => {
    const [productos, setProductos] = useState([]);
    const [mensajeError, setMensajeError] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Recuperar el correo y tipo de usuario desde localStorage
    const correoUsuario = localStorage.getItem('correoUsuario');
    const tipoUsuario = localStorage.getItem('usertipo');

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
            {/* Mostrar mensaje de bienvenida con el correo y tipo de usuario */}
            <h2 className="bienvenida">Bienvenido, {correoUsuario || 'Usuario'} ({tipoUsuario || 'Sin tipo'})</h2>

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
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron resultados</p>
            )}
        </div>
    );
};

export default ProductoCliente;
