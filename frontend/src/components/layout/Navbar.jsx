import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, FileText, User, BarChart3, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useUiStore } from '../../stores/uiStore.js';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Inicio', icon: null },
    { to: '/mapa', label: 'Mapa', icon: MapPin },
    { to: '/reportar', label: 'Reportar', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Eco-Alert <span className="text-primary-600">BRC</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/perfil">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                    {user?.reputation !== undefined && (
                      <Badge variant={user.reputation >= 0 ? 'success' : 'danger'}>
                        {user.reputation > 0 ? '+' : ''}{user.reputation}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Iniciar sesión</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {sidebarOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleSidebar}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Link to="/perfil" onClick={toggleSidebar} className="block px-3 py-2 text-sm text-gray-600">
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={() => { logout(); toggleSidebar(); }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleSidebar} className="block px-3 py-2 text-sm text-gray-600">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" onClick={toggleSidebar} className="block px-3 py-2 text-sm text-primary-600 font-medium">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;