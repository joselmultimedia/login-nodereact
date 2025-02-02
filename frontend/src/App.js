import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Producto from './componentes/Producto';
import ProductoCliente from './componentes/ProductoCliente'; // Importamos la nueva página para clientes

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

                {/* Ruta protegida para la página de productos (Admin) */}
                <Route 
                    path="/producto" 
                    element={<RutaProtegida tipoRequerido="admin"><Producto /></RutaProtegida>} 
                />

                {/* Ruta protegida para la página de productos (Cliente) */}
                <Route 
                    path="/producto-cliente" 
                    element={<RutaProtegida tipoRequerido="cliente"><ProductoCliente /></RutaProtegida>} 
                />

                {/* Ruta por defecto si no existe */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

// Componente para proteger rutas y validar el tipo de usuario
function RutaProtegida({ children, tipoRequerido }) {
    const autenticado = localStorage.getItem('autenticado') === 'true';
    const tipoUsuario = localStorage.getItem('usertipo');

    // Si el usuario no está autenticado, lo redirigimos al login
    if (!autenticado) {
        return <Navigate to="/" />;
    }

    // Si el usuario autenticado no tiene el tipo requerido, lo redirigimos al login
    if (tipoRequerido && tipoUsuario !== tipoRequerido) {
        return <Navigate to="/" />;
    }

    return children;
}

export default App;
