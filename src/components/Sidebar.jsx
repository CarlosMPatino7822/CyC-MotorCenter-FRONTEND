import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdDashboard, MdPeople, MdDirectionsCar, MdLogout, MdDirectionsBike, MdPerson } from 'react-icons/md';
import './Sidebar.css';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <MdDirectionsBike />
                </div>
                <div>
                    <h1>CyC Motor</h1>
                    <span>Centro de Gestión</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <span className="sidebar-section-title">Principal</span>

                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-link-icon"><MdDashboard /></span>
                    Dashboard
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-link-icon"><MdPerson /></span>
                    Mi Perfil
                </NavLink>

                <span className="sidebar-section-title">Gestión</span>

                <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-link-icon"><MdPeople /></span>
                    Usuarios
                </NavLink>

                <NavLink to="/cars" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-link-icon"><MdDirectionsCar /></span>
                    Autos
                </NavLink>

                <NavLink to="/bikes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-link-icon"><MdDirectionsBike /></span>
                    Motos
                </NavLink>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {getInitials(user?.username)}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.username || 'Usuario'}</div>
                        <div className="sidebar-user-role">{user?.role || 'admin'}</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    <MdLogout />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
