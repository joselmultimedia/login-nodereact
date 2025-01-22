import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Producto from './componentes/Producto';

function App() {
    const [mostrarLogin, setMostrarLogin] = useState(true); // Estado para alternar entre Login y Registro

    return (
        <Router>
            <Routes>
                {/* Ruta principal que alterna entre Login y Registro */}
                <Route 
                    path="/" 
                    element={
                        mostrarLogin ? (
                            <div>
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
                            </div>
                        ) : (
                            <div>
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
                            </div>
                        )
                    }
                />

                {/* Ruta protegida para la página de productos */}
                <Route 
                    path="/producto" 
                    element={<RutaProtegida><Producto /></RutaProtegida>} 
                />

                {/* Ruta por defecto si no existe */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

// Componente para proteger rutas
function RutaProtegida({ children }) {
    const autenticado = localStorage.getItem('autenticado');
    return autenticado ? children : <Navigate to="/" />;
}

export default App;
