import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, Shield, Users } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { StatsCards } from '../features/dashboard';
import { RecentReports } from '../features/dashboard';

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Monitorea el Ambiente de{' '}
            <span className="text-yellow-300">Barrancabermeja</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Reporta incidentes ambientales, visualiza alertas en tiempo real y 
            contribuye a construir una ciudad más sostenible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reportar">
              <Button size="lg" className="gap-2 bg-white text-primary-700 hover:bg-primary-50">
                <FileText className="h-5 w-5" />
                Crear Reporte
              </Button>
            </Link>
            <Link to="/mapa">
              <Button variant="outline" size="lg" className="gap-2 border-white text-white hover:bg-white/10">
                <MapPin className="h-5 w-5" />
                Ver Mapa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <StatsCards />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={FileText}
            title="Reporta"
            description="Captura una foto, describe el incidente y comparte tu ubicación en segundos."
            color="bg-blue-500"
          />
          <FeatureCard 
            icon={Shield}
            title="Valida"
            description="Nuestros moderadores revisan cada reporte para garantizar la calidad de la información."
            color="bg-green-500"
          />
          <FeatureCard 
            icon={Users}
            title="Actúa"
            description="Visualiza alertas en el mapa, filtra por categoría y mantente informado."
            color="bg-purple-500"
          />
        </div>
      </section>

      {/* Recent Reports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <RecentReports />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="text-center p-6">
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default HomePage;