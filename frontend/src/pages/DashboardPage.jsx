import React from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, Leaf, MapPin, FileText, Award, Settings } from 'lucide-react';
import { StatsCards, RecentReports, ReputationBadge } from '../features/dashboard';
import { useAuthStore } from '../stores/authStore.js';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header limpio sin datos falsos */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              {/* Tipografía cambiada: font-serif para elegancia, o sans más suave */}
              <h1 className="text-3xl font-serif text-gray-900 tracking-tight">
                Bienvenido de vuelta
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Aquí puedes gestionar tu actividad ambiental
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid de acciones principales - sin números falsos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ActionCard 
            icon={MapPin}
            title="Explorar Mapa"
            desc="Visualiza alertas ambientales en tu zona"
            to="/mapa"
            color="bg-emerald-600"
            hover="hover:shadow-emerald-200"
          />
          <ActionCard 
            icon={FileText}
            title="Crear Reporte"
            desc="Documenta un incidente ambiental"
            to="/reportar"
            color="bg-teal-600"
            hover="hover:shadow-teal-200"
          />
          <ActionCard 
            icon={Award}
            title="Tu Reputación"
            desc="Verifica tu nivel de participación"
            to="#reputacion"
            color="bg-slate-700"
            hover="hover:shadow-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* StatsCards - datos reales del backend */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Estadísticas del Sistema</h2>
              </div>
              <StatsCards />
            </div>
          </div>

          {/* RecentReports - datos reales */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
                </div>
              </div>
              <RecentReports />
            </div>
          </div>

          {/* ReputationBadge - dato real del usuario */}
          <div id="reputacion" className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Tu Reputación</h2>
              </div>
              <ReputationBadge />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Tarjeta de acción sin números, solo navegación
const ActionCard = ({ icon: Icon, title, desc, to, color, hover }) => (
  <a 
    href={to}
    className={`group block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${hover} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
  >
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </a>
);

export default DashboardPage;