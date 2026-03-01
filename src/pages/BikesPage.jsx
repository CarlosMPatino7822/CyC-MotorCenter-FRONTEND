import { useState, useEffect } from 'react';
import { getBikes, createBike, deleteBike } from '../services/api';
import { MdDirectionsBike, MdAdd, MdClose, MdSearch, MdDelete } from 'react-icons/md';
import './UsersPage.css'; // Reusing layout
import './CarsPage.css'; // Reusing layout

export default function BikesPage() {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        year: '',
        placa: '',
        color: '',
        precio: '',
    });
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBikes();
    }, []);

    const loadBikes = async () => {
        try {
            const res = await getBikes();
            setBikes(Array.isArray(res.data) ? res.data : []);
        } catch {
            setBikes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta moto?')) return;
        try {
            await deleteBike(id);
            loadBikes();
        } catch (err) {
            alert('Error al eliminar moto');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => data.append(key, value));
            if (photo) data.append('photo', photo);

            await createBike(data);
            setShowModal(false);
            resetForm();
            loadBikes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear moto');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ marca: '', modelo: '', year: '', placa: '', color: '', precio: '' });
        setPhoto(null);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredBikes = bikes.filter((b) => {
        const term = search.toLowerCase();
        return (
            (b.marca || '').toLowerCase().includes(term) ||
            (b.modelo || '').toLowerCase().includes(term) ||
            (b.placa || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>Motos</h1>
                    <p>Gestiona el inventario de motocicletas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nueva Moto
                </button>
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative', maxWidth: '360px' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <MdSearch />
                </span>
                <input
                    type="text"
                    placeholder="Buscar motos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.25rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                />
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : filteredBikes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><MdDirectionsBike /></div>
                    <h3>{bikes.length === 0 ? 'Sin motos' : 'Sin resultados'}</h3>
                    <p>{bikes.length === 0 ? 'Agrega tu primera moto para comenzar' : 'Intenta con otro término de búsqueda'}</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Marca / Modelo</th>
                                <th>Placa</th>
                                <th>Año</th>
                                <th>Color</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBikes.map((b) => (
                                <tr key={b.id}>
                                    <td>
                                        {b.photoUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}${b.photoUrl}`}
                                                alt={b.modelo}
                                                className="car-photo"
                                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="car-photo-placeholder">Moto</div>
                                        )}
                                    </td>
                                    <td><strong>{b.marca}</strong> <br /> {b.modelo}</td>
                                    <td><span className="badge badge-info">{b.placa}</span></td>
                                    <td>{b.year}</td>
                                    <td>{b.color}</td>
                                    <td>${Number(b.precio || 0).toLocaleString()}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleDelete(b.id)} style={{ color: 'var(--error-color)' }} title="Eliminar">
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
                            <h2>Nueva Moto</h2>
                            <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                                <MdClose />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && <div className="login-error mb-2">{error}</div>}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input name="marca" value={formData.marca} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input name="modelo" value={formData.modelo} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Año</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input name="placa" value={formData.placa} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Color</label>
                                    <input name="color" value={formData.color} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Foto</label>
                                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ padding: '0.5rem', background: 'transparent' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Guardando...' : 'Crear Moto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
