import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUser, updateUser } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const userId = user?.id || user?.userId || user?.sub;
        if (userId) {
            loadUserData(userId);
        } else {
            console.warn("User ID not found in token payload:", user);
            setLoading(false);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        try {
            const response = await getUser(userId);
            const userData = response.data;
            setFormData({
                nombre: userData.nombre || '',
                apellido: userData.apellido || '',
                correo: userData.correo || '',
                telefono: userData.telefono || '',
                direccion: userData.direccion || '',
                password: '', // do not populate password
            });
        } catch (error) {
            console.error("Error loading user data", error);
            setErrorMessage('Error al cargar los datos del usuario.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        const userId = user?.id || user?.userId || user?.sub;
        if (!userId) {
            setErrorMessage('Error: no se pudo identificar el ID del usuario actual.');
            setSubmitting(false);
            return;
        }

        try {
            // Prepare data to send (remove empty password if not changing)
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            await updateUser(userId, dataToSend);
            setSuccessMessage('Perfil actualizado correctamente.');
            setFormData(prev => ({ ...prev, password: '' })); // clear password field

        } catch (error) {
            console.error("Error updating profile", error);
            setErrorMessage(error.response?.data?.message || 'Error al actualizar el perfil.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="page-header">
                <div>
                    <h1>Mi Perfil</h1>
                    <p>Gestiona tu información personal</p>
                </div>
            </div>

            <div className="profile-container">
                <form className="profile-form" onSubmit={handleSubmit}>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Apellido</label>
                            <input name="apellido" value={formData.apellido} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input name="telefono" value={formData.telefono} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Dirección</label>
                        <input name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Nueva Contraseña (opcional)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Dejar en blanco para mantener la actual"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
