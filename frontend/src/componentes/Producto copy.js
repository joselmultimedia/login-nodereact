import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [mensajeError, setMensajeError] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nombreActualizado, setNombreActualizado] = useState('');
    const [descripcionActualizada, setDescripcionActualizada] = useState('');

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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Lista de Productos</h2>
            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.nombre}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.descripcion}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => seleccionarProducto(producto)}>
                                    Actualizar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {productoSeleccionado && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Actualizar Producto</h3>
                    <form onSubmit={manejarActualizacion}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nombreActualizado}
                                onChange={(e) => setNombreActualizado(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Descripción:</label>
                            <textarea
                                value={descripcionActualizada}
                                onChange={(e) => setDescripcionActualizada(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: '10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Producto;
