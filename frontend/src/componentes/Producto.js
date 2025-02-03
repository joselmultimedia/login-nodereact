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
    const [imagenSeleccionada, setImagenSeleccionada] = useState({});
    const [subiendoImagen, setSubiendoImagen] = useState(false);

    const correoUsuario = localStorage.getItem('correoUsuario');
    const tipoUsuario = localStorage.getItem('usertipo');

    useEffect(() => {
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

    const manejarCambioImagen = (evento, idProducto) => {
        setImagenSeleccionada((prev) => ({ ...prev, [idProducto]: evento.target.files[0] }));
    };

    const subirImagen = async (idProducto) => {
        if (!imagenSeleccionada[idProducto]) return;

        const formData = new FormData();
        formData.append('imagen', imagenSeleccionada[idProducto]);

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

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setNombreActualizado(producto.nombre);
        setDescripcionActualizada(producto.descripcion);
    };

    const manejarActualizacion = async () => {
        if (!productoSeleccionado) return;

        try {
            const respuesta = await axios.put(
                `http://localhost:5000/api/productos/${productoSeleccionado.id}`,
                {
                    nombre: nombreActualizado,
                    descripcion: descripcionActualizada
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'usertipo': tipoUsuario
                    }
                }
            );

            if (respuesta.data.exito) {
                setProductos((productos) =>
                    productos.map((p) =>
                        p.id === productoSeleccionado.id
                            ? { ...p, nombre: nombreActualizado, descripcion: descripcionActualizada }
                            : p
                    )
                );
                setMensajeConfirmacion('Producto actualizado correctamente');
                setProductoSeleccionado(null);
            } else {
                setMensajeError('Error al actualizar el producto');
            }
        } catch (error) {
            setMensajeError('Error al conectar con el servidor');
        }
    };

    const manejarEliminacion = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                const respuesta = await axios.delete(`http://localhost:5000/api/productos/${id}`, {
                    headers: { 'usertipo': tipoUsuario }
                });
                if (respuesta.data.exito) {
                    setProductos(productos.filter(p => p.id !== id));
                    setMensajeConfirmacion('Producto eliminado correctamente');
                }
            } catch (error) {
                setMensajeError("Error al eliminar producto");
            }
        }
    };

    return (
        <div className="contenedor-productos">
            <h2 className="bienvenida">Bienvenido, {correoUsuario || 'Usuario'} ({tipoUsuario || 'Sin tipo'})</h2>
            <h3 className="titulo-listado">Lista de Productos</h3>
            <input type="text" placeholder="Buscar productos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="buscador" />
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
                        {productos.filter(prod => prod.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((producto) => (
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
                                            <button className="boton-actualizar" onClick={() => seleccionarProducto(producto)}>Actualizar</button>
                                            <button className="boton-eliminar" onClick={() => manejarEliminacion(producto.id)}>Eliminar</button>
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
            {productoSeleccionado && (
                <div className="formulario-actualizar">
                    <h3>Actualizar Producto</h3>
                    <input type="text" value={nombreActualizado} onChange={(e) => setNombreActualizado(e.target.value)} placeholder="Nombre" />
                    <input type="text" value={descripcionActualizada} onChange={(e) => setDescripcionActualizada(e.target.value)} placeholder="Descripción" />
                    <button onClick={manejarActualizacion}>Guardar Cambios</button>
                    <button onClick={() => setProductoSeleccionado(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Producto;
