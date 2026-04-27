import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Map, Bus, Route, Bell, Settings, LogOut, Users as UsersIcon } from 'lucide-react';
import './DashboardLayout.css';
import { useEffect } from 'react';
import { socketService } from '../../services/socket.service';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to WebSocket when entering the dashboard
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/map', label: 'Mapa en Vivo', icon: <Map size={20} /> },
    { path: '/buses', label: 'Buses', icon: <Bus size={20} /> },
    { path: '/routes', label: 'Rutas', icon: <Route size={20} /> },
    { path: '/alerts', label: 'Alertas', icon: <Bell size={20} /> },
    { path: '/users', label: 'Usuarios', icon: <UsersIcon size={20} /> },
  ];

  if (user?.role === 'SUPERADMIN') {
    navItems.push({ path: '/settings', label: 'Ajustes', icon: <Settings size={20} /> });
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Map size={24} color="var(--color-accent)" />
          <h2>Pa<span>Go</span></h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.email.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.email.split('@')[0]}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
