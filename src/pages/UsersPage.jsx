import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../services/api';
import { MdPeople, MdAdd, MdClose, MdSearch, MdDelete } from 'react-icons/md';
import './UsersPage.css';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
        role: 'comprador',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            await deleteUser(id);
            loadUsers();
        } catch (err) {
            alert('Error al eliminar usuario');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await createUser(formData);
            setShowModal(false);
            resetForm();
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear usuario');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ cedula: '', nombre: '', apellido: '', correo: '', telefono: '', direccion: '', password: '', role: 'comprador' });
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredUsers = users.filter((u) => {
        const term = search.toLowerCase();
        return (
            (u.nombre || '').toLowerCase().includes(term) ||
            (u.apellido || '').toLowerCase().includes(term) ||
            (u.cedula || '').toLowerCase().includes(term) ||
            (u.correo || '').toLowerCase().includes(term)
        );
    });

    const getInitials = (nombre, apellido) => {
        const n = nombre ? nombre.charAt(0) : '';
        const a = apellido ? apellido.charAt(0) : '';
        return (n + a).toUpperCase() || 'U';
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>Usuarios</h1>
                    <p>Gestiona los usuarios y roles del sistema</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nuevo Usuario
                </button>
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative', maxWidth: '360px' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <MdSearch />
                </span>
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.25rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                />
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><MdPeople /></div>
                    <h3>{users.length === 0 ? 'Sin usuarios' : 'Sin resultados'}</h3>
                    <p>{users.length === 0 ? 'Agrega tu primer usuario para comenzar' : 'Intenta con otro término de búsqueda'}</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Cédula</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="user-avatar-placeholder">
                                                {getInitials(u.nombre, u.apellido)}
                                            </div>
                                            <div>
                                                <strong>{u.nombre} {u.apellido}</strong>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.cedula}</td>
                                    <td>{u.correo}</td>
                                    <td>{u.telefono}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleDelete(u.id)} style={{ color: 'var(--error-color)' }} title="Eliminar">
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nuevo Usuario</h2>
                            <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                                <MdClose />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && <div className="login-error mb-2">{error}</div>}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Cédula</label>
                                    <input name="cedula" value={formData.cedula} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Rol</label>
                                    <select name="role" value={formData.role} onChange={handleChange} required>
                                        <option value="comprador">Comprador</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>

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
                                <label>Contraseña</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Guardando...' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
