import { Link, useLocation } from 'react-router-dom';
import { MapPin, FileText, Home, BarChart3, Shield, Menu, X, Droplets, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore.js';

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore(); // ← Usa isAuthenticated de tu store
  
  const navLinks = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/mapa', label: 'Mapa', icon: MapPin },
    { path: '/reportar', label: 'Reportar', icon: FileText },
    // Solo muestra Dashboard si está autenticado
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard', icon: BarChart3 }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">
                Eco-Alert <span className="text-emerald-600">BRC</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight">
                Monitoreo Ambiental
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name || 'Usuario'}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 active:bg-emerald-900 transition-all shadow-md shadow-emerald-700/20">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-gray-700">{user?.name || 'Usuario'}</span>
                </Link>
                <button 
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl">
                  Iniciar sesión
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full py-3 bg-emerald-700 text-white font-semibold text-center rounded-xl">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Eco-Alert BRC</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Red de Monitoreo Ambiental Ciudadano de Barrancabermeja. 
            Datos abiertos para la comunidad.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Plataforma</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/mapa" className="hover:text-emerald-400 transition-colors">Mapa de reportes</Link></li>
            <li><Link to="/reportar" className="hover:text-emerald-400 transition-colors">Crear reporte</Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Iniciar sesión</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Comunidad</h4>
          <ul className="space-y-3 text-sm">
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Pescadores</span></li>
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Ambientalistas</span></li>
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Open Data</span></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Confianza</h4>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Datos verificados</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 Eco-Alert BRC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;