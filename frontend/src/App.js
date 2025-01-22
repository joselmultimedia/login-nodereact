import React, { useState } from 'react';
import Login from './componentes/Login';
import Registro from './componentes/Registro';

function App() {
    const [mostrarLogin, setMostrarLogin] = useState(true); // Estado para alternar entre Login y Registro

    return (
        <div>
            {mostrarLogin ? (
                <>
                    <Login />
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>
                        ¿No tienes una cuenta?{' '}
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                            onClick={() => setMostrarLogin(false)}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <Registro />
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                            onClick={() => setMostrarLogin(true)}
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}

export default App;
