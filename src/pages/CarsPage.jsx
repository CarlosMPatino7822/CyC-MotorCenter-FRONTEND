import { useState, useEffect } from 'react';
import { getCars, createCar, deleteCar } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MdDirectionsCar, MdAdd, MdClose, MdSearch, MdDelete } from 'react-icons/md';
import './UsersPage.css'; // Reusing layout
import './CarsPage.css';

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        plate: '',
        color: '',
        price: '',
    });
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            const res = await getCars();
            setCars(Array.isArray(res.data) ? res.data : []);
        } catch {
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este auto?')) return;
        try {
            await deleteCar(id);
            loadCars();
        } catch (err) {
            alert('Error al eliminar auto');
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
            if (user?.id) data.append('employeeId', user.id);

            await createCar(data);
            setShowModal(false);
            resetForm();
            loadCars();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear auto');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ brand: '', model: '', year: '', plate: '', color: '', price: '' });
        setPhoto(null);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const filteredCars = cars.filter((c) => {
        const term = search.toLowerCase();
        return (
            (c.brand || '').toLowerCase().includes(term) ||
            (c.model || '').toLowerCase().includes(term) ||
            (c.plate || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>Autos</h1>
                    <p>Gestiona el inventario de automóviles</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <MdAdd /> Nuevo Auto
                </button>
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative', maxWidth: '360px' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <MdSearch />
                </span>
                <input
                    type="text"
                    placeholder="Buscar autos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.25rem', width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                />
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : filteredCars.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><MdDirectionsCar /></div>
                    <h3>{cars.length === 0 ? 'Sin autos' : 'Sin resultados'}</h3>
                    <p>{cars.length === 0 ? 'Agrega tu primer auto para comenzar' : 'Intenta con otro término de búsqueda'}</p>
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
                            {filteredCars.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        {c.photoUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}${c.photoUrl}`}
                                                alt={c.model}
                                                className="car-photo"
                                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="car-photo-placeholder">Car</div>
                                        )}
                                    </td>
                                    <td><strong>{c.brand}</strong> <br /> {c.model}</td>
                                    <td><span className="badge badge-info">{c.plate}</span></td>
                                    <td>{c.year}</td>
                                    <td>{c.color}</td>
                                    <td>${Number(c.price || 0).toLocaleString()}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleDelete(c.id)} style={{ color: 'var(--error-color)' }} title="Eliminar">
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
                            <h2>Nuevo Auto</h2>
                            <button className="btn-icon" onClick={() => { setShowModal(false); resetForm(); }}>
                                <MdClose />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && <div className="login-error mb-2">{error}</div>}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input name="brand" value={formData.brand} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input name="model" value={formData.model} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Año</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input name="plate" value={formData.plate} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Color</label>
                                    <input name="color" value={formData.color} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Foto</label>
                                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ padding: '0.5rem', background: 'transparent' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Guardando...' : 'Crear Auto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
