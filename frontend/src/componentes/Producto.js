import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [mensajeError, setMensajeError] = useState('');

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
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.nombre}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Producto;
