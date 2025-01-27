import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [correo, setCorreo] = useState(''); // Variable para el email del usuario
    const [contrasena, setContrasena] = useState(''); // Variable para la contraseña del usuario
    const [mensajeError, setMensajeError] = useState(''); // Mensaje de error
    const navigate = useNavigate();

    const manejarInicioSesion = async (evento) => {
        evento.preventDefault();
        try {
            console.log('Iniciando sesión con:', { email: correo, password: contrasena }); // Depuración

            // Solicitud al backend
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/login', {
                email: correo,
                password: contrasena,
            });

            console.log('Respuesta del backend:', respuesta.data); // Depuración

            if (respuesta.data.exito) {
                console.log('Autenticación exitosa, redirigiendo...'); // Depuración

                // Guardar el correo electrónico y usertipo del usuario en localStorage
                localStorage.setItem('correoUsuario', respuesta.data.usuario.email);
                localStorage.setItem('usertipo', respuesta.data.usuario.usertipo); // Nuevo campo
                localStorage.setItem('autenticado', 'true'); // Estado de autenticación

                // Verificar valores en localStorage antes de redirigir
                console.log('Valores en localStorage:', {
                    correoUsuario: localStorage.getItem('correoUsuario'),
                    usertipo: localStorage.getItem('usertipo'),
                    autenticado: localStorage.getItem('autenticado'),
                });

                // Redirigir a la página de productos
                navigate('/producto', { replace: true });

                console.log('Redirección ejecutada a /producto'); // Depuración
            } else {
                console.log('Fallo en la autenticación:', respuesta.data.mensaje); // Depuración
                setMensajeError(respuesta.data.mensaje || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Depuración
            if (error.response) {
                console.log('Error del servidor:', error.response.data); // Depuración
                setMensajeError(error.response.data.mensaje || 'Error al iniciar sesión');
            } else {
                setMensajeError('Error al conectar con el servidor');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={manejarInicioSesion}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    Iniciar Sesión
                </button>
            </form>
            {mensajeError && (
                <p style={{ marginTop: '15px', color: 'red' }}>{mensajeError}</p>
            )}
        </div>
    );
};

export default Login;
