import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/login', {
                email,
                password,
            });
    
            console.log('Respuesta del backend:', respuesta.data); // Depuración
    
            if (respuesta.data.mensaje === "Usuario autenticado") {
                // Guardar indicador de autenticación en localStorage
                localStorage.setItem('autenticado', 'true');
    
                // Redirigir a la página de productos
                setMensaje('');
                navigate('/producto', { replace: true });
            } else {
                setMensaje(respuesta.data.mensaje || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Depuración
            if (error.response) {
                setMensaje(error.response.data.mensaje || 'Error al iniciar sesión');
            } else {
                setMensaje('Error al conectar con el servidor');
            }
        }
    };
    

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={manejarLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
            {mensaje && (
                <p style={{ marginTop: '15px', color: mensaje === 'Usuario autenticado' ? 'green' : 'red' }}>{mensaje}</p>
            )}
        </div>
    );
};

export default Login;
