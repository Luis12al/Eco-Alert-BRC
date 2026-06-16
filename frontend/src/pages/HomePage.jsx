import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, FileText, Shield, Users } from 'lucide-react';
import heroImage from '../assets/image.png';
import { StatsCards } from '../features/dashboard';
import { RecentReports } from '../features/dashboard';

const HomePage = () => {
  return (
    <div className="space-y-0">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Ciénaga de Barrancabermeja" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-gray-900/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-emerald-100 rounded-full text-sm font-semibold border border-emerald-400/30">
                <Shield className="w-4 h-4 text-emerald-400" />
                Red de Monitoreo Ambiental Ciudadano
              </div>
              
              {/* Título arreglado - más compacto y alineado */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]">
                Protege el{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Ambiente
                </span>
                {' '}de{' '}
                <span className="block mt-2">Barrancabermeja</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed max-w-xl">
                Reporta incidentes ambientales en el Río Magdalena y las ciénagas. 
                Visualiza alertas en tiempo real y contribuye a construir una ciudad más sostenible. 
                <span className="text-white font-semibold"> Juntos cuidamos el agua y el aire.</span>
              </p>
              
              {/* Botones */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/reportar" 
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-500 active:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-900/40 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Crear Reporte
                </Link>
                <Link 
                  to="/mapa" 
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/25 rounded-2xl font-bold text-base hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Ver Mapa en Vivo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Mini mapa - AHORA ES UN LINK FUNCIONAL AL MAPA REAL */}
            <div className="relative hidden lg:block">
              <Link to="/mapa" className="block relative w-full aspect-square max-w-md mx-auto group cursor-pointer">
                {/* Glow animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full opacity-60 animate-pulse" />
                
                {/* Tarjeta de preview */}
                <div className="absolute inset-4 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10 group-hover:border-emerald-400/40 transition-all duration-300">
                  <div className="h-full bg-gradient-to-br from-emerald-900/20 to-teal-900/20 relative">
                    
                    {/* Puntos de alerta decorativos (estáticos pero representativos) */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                    <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md" />
                    
                    {/* Líneas conectoras decorativas */}
                    <svg className="absolute inset-0 w-full h-full opacity-30">
                      <line x1="25%" y1="25%" x2="50%" y2="66%" stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                      <line x1="50%" y1="66%" x2="66%" y2="50%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
                    </svg>
                    
                    {/* Tooltip de alerta */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-gray-700">Alerta activa: Río Magdalena</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay al hover indicando que es clickeable */}
                <div className="absolute inset-4 rounded-3xl bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-sm bg-emerald-600/90 px-4 py-2 rounded-full transition-opacity duration-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ver mapa completo
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION (Datos reales de tu compañero) ========== */}
      <section className="relative py-16 bg-gradient-to-b from-emerald-950 via-emerald-900/5 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsCards />
        </div>
      </section>

      {/* ========== CÓMO FUNCIONA ========== */}
      <HowItWorks />

      {/* ========== REPORTES RECIENTES (Datos reales de tu compañero) ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Actividad</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">Reportes Recientes</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Últimos incidentes reportados por la comunidad de Barrancabermeja.
          </p>
        </div>
        <RecentReports />
      </section>

      {/* ========== CTA SECTION ========== */}
      <CTASection />
    </div>
  );
};

/* ========== COMPONENTES AUXILIARES ========== */

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Reporta',
      desc: 'Captura una foto, describe el incidente y comparta la ubicación exacta del problema ambiental.',
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      icon: Shield,
      title: 'Valida',
      desc: 'Nuestros moderadores y la comunidad revisan cada reporte para garantizar datos confiables.',
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      icon: MapPin,
      title: 'Actúa',
      desc: 'Visualiza alertas en el mapa, filtra por categoría y toma decisiones informadas.',
      color: 'bg-violet-500',
      bg: 'bg-violet-50',
      border: 'border-violet-200'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Proceso</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">¿Cómo funciona?</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Tres pasos simples para convertirte en guardián del medio ambiente de Barrancabermeja.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative group">
                <div className="relative bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute top-4 right-6 text-7xl font-black text-gray-100/80 select-none group-hover:text-emerald-50 transition-colors">
                    {i + 1}
                  </div>
                  
                  <div className={`relative w-16 h-16 mx-auto mb-6 ${step.bg} rounded-2xl flex items-center justify-center border-2 ${step.border} shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <Icon className={`w-8 h-8 ${step.color} text-white rounded-xl p-1.5`} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="relative text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="relative text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gray-300 to-transparent z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
    </div>
    
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
        <Users className="w-8 h-8 text-emerald-300" />
      </div>
      
      <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
        ¿Eres pescador o vives cerca de las ciénagas?
      </h2>
      <p className="text-emerald-100/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
        Tu conocimiento del territorio es invaluable. Únete a la red de monitoreo 
        ambiental ciudadano y ayuda a proteger el agua y el aire de Barrancabermeja.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          to="/register" 
          className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold text-base hover:bg-emerald-50 transition-all duration-200 shadow-xl shadow-black/20 flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          Unirme a la red
        </Link>
        <Link 
          to="/mapa" 
          className="px-8 py-4 bg-transparent text-white border-2 border-emerald-400/50 rounded-2xl font-bold text-base hover:bg-emerald-800/50 hover:border-emerald-400 transition-all duration-200"
        >
          Explorar datos abiertos
        </Link>
      </div>
    </div>
  </section>
);

export default HomePage;