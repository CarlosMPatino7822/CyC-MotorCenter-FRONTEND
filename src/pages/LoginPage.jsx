import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdLock, MdDirectionsBike } from 'react-icons/md';
import './LoginPage.css';

export default function LoginPage() {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(cedula, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <MdDirectionsBike />
                    </div>
                    <h1>CyC MotorCenter</h1>
                    <p>Inicia sesión para continuar</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="login-input-group">
                        <span className="input-icon"><MdPerson /></span>
                        <input
                            id="cedula"
                            type="text"
                            placeholder="Cédula"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="login-input-group">
                        <span className="input-icon"><MdLock /></span>
                        <input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <span className="btn-loading" /> : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}
