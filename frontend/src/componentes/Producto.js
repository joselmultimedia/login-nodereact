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
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
    const [subiendoImagen, setSubiendoImagen] = useState(false);

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

    // Función para manejar la subida de imagen
    const manejarCambioImagen = (evento, idProducto) => {
        setImagenSeleccionada({ archivo: evento.target.files[0], id: idProducto });
    };

    const subirImagen = async (idProducto) => {
        if (!imagenSeleccionada || imagenSeleccionada.id !== idProducto) return;

        const formData = new FormData();
        formData.append('imagen', imagenSeleccionada.archivo);

        setSubiendoImagen(true);
        try {
            const respuesta = await axios.post(`http://localhost:5000/api/productos/subir-imagen/${idProducto}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', usertipo: tipoUsuario }
            });

            if (respuesta.data.exito) {
                setMensajeConfirmacion('Imagen subida correctamente');
                setTimeout(() => setMensajeConfirmacion(null), 3000);
                setProductos((productos) =>
                    productos.map((prod) =>
                        prod.id === idProducto ? { ...prod, imagen: respuesta.data.rutaImagen } : prod
                    )
                );
            } else {
                setMensajeError('Error al subir la imagen');
            }
        } catch (error) {
            setMensajeError('Error al conectar con el servidor');
        }
        setSubiendoImagen(false);
    };

    return (
        <div className="contenedor-productos">
            <h2 className="bienvenida">Bienvenido, {correoUsuario || 'Usuario'} ({tipoUsuario || 'Sin tipo'})</h2>

            <h3 className="titulo-listado">Lista de Productos</h3>
            <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="buscador"
            />
            {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
            {mensajeConfirmacion && <p className="mensaje-confirmacion">{mensajeConfirmacion}</p>}
            {productos.length > 0 ? (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.descripcion}</td>
                                <td>
                                    {producto.imagen ? (
                                        <img src={`http://localhost:5000${producto.imagen}`} alt="Producto" className="imagen-producto" />
                                    ) : (
                                        <span>Sin imagen</span>
                                    )}
                                </td>
                                <td>
                                    {tipoUsuario === 'admin' && (
                                        <>
                                            <button className="boton-actualizar">Actualizar</button>
                                            <button className="boton-eliminar">Eliminar</button>
                                            <br />
                                            <input type="file" accept="image/png, image/jpeg" onChange={(e) => manejarCambioImagen(e, producto.id)} />
                                            <button onClick={() => subirImagen(producto.id)} disabled={subiendoImagen}>
                                                {subiendoImagen ? 'Subiendo...' : 'Subir Imagen'}
                                            </button>
                                        </>
                                    )}
                                </td>
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

export default Producto;
