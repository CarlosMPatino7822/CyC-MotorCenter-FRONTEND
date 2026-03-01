import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, getCars, getBikes } from '../services/api';
import { MdPeople, MdDirectionsCar, MdDirectionsBike, MdTrendingUp, MdAttachMoney, MdAdd } from 'react-icons/md';
import './DashboardPage.css';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        cars: 0,
        bikes: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [usersRes, carsRes, bikesRes] = await Promise.all([
                getUsers().catch(() => ({ data: [] })),
                getCars().catch(() => ({ data: [] })),
                getBikes().catch(() => ({ data: [] })),
            ]);
            setStats({
                users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
                cars: Array.isArray(carsRes.data) ? carsRes.data.length : 0,
                bikes: Array.isArray(bikesRes.data) ? bikesRes.data.length : 0,
            });
        } catch {
            // silently fail — stats will show 0
        } finally {
            setLoading(false);
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>{greeting()}, {user?.username || 'Admin'} 👋</h1>
                <p>Aquí tienes el resumen de tu centro de gestión</p>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple">
                        <MdPeople />
                    </div>
                    <div className="stat-info">
                        <h3>Usuarios</h3>
                        <div className="stat-value">{loading ? '—' : stats.users}</div>
                        <div className="stat-change positive">En el sistema</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon teal">
                        <MdDirectionsCar />
                    </div>
                    <div className="stat-info">
                        <h3>Autos</h3>
                        <div className="stat-value">{loading ? '—' : stats.cars}</div>
                        <div className="stat-change positive">Inventario</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        <MdDirectionsBike />
                    </div>
                    <div className="stat-info">
                        <h3>Motos</h3>
                        <div className="stat-value">{loading ? '—' : stats.bikes}</div>
                        <div className="stat-change positive">Inventario</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pink">
                        <MdAttachMoney />
                    </div>
                    <div className="stat-info">
                        <h3>Rol</h3>
                        <div className="stat-value" style={{ fontSize: '1.4rem', textTransform: 'capitalize' }}>
                            {user?.role || 'Admin'}
                        </div>
                        <div className="stat-change positive">Sesión activa</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <div className="quick-action-card">
                    <h3><MdPeople /> Usuarios</h3>
                    <p>Gestiona la información de los usuarios del sistema (compradores y administradores).</p>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/users')}>
                        <MdAdd /> Ir a Usuarios
                    </button>
                </div>

                <div className="quick-action-card">
                    <h3><MdDirectionsCar /> Vehículos</h3>
                    <p>Accede al inventario de autos y motos disponibles en la agencia.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/cars')}>
                            <MdAdd /> Ver Autos
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/bikes')}>
                            <MdAdd /> Ver Motos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
