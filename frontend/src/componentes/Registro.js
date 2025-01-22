import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const manejarRegistro = async (e) => {
        e.preventDefault(); // Evitar que el formulario recargue la página
        try {
            const respuesta = await axios.post('http://localhost:5000/api/usuarios/registro', {
                email,
                password,
            });
            setMensaje(respuesta.data); // Mensaje enviado por el backend
        } catch (error) {
            if (error.response) {
                setMensaje(error.response.data); // Mensaje de error del backend
            } else {
                setMensaje('Error al conectar con el servidor');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Registro de Usuario</h2>
            <form onSubmit={manejarRegistro}>
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
                    Registrar
                </button>
            </form>
            {mensaje && (
                <p style={{ marginTop: '15px', color: mensaje === 'Usuario registrado exitosamente' ? 'green' : 'red' }}>{mensaje}</p>
            )}
        </div>
    );
};

export default Registro;
