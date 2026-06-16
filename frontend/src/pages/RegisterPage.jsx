import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, AlertCircle, 
  User, MapPin, CheckCircle 
} from 'lucide-react';
import { RegisterForm, GoogleButton } from '../features/auth';

const RegisterPage = () => {
  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Únete a la red</h2>
          <p className="text-emerald-200 leading-relaxed mb-8">
            Forma parte de la Red de Monitoreo Ambiental Ciudadano. 
            Tu conocimiento del territorio es invaluable para proteger 
            el Río Magdalena y las ciénagas de Barrancabermeja.
          </p>
          
          <div className="space-y-3">
            {[
              'Reporta incidentes ambientales en tiempo real',
              'Visualiza datos en el mapa interactivo',
              'Recibe alertas sobre la calidad del agua y aire',
              'Contribuye al Open Data ambiental'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm text-emerald-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Logo móvil */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="text-gray-500 mt-2">Únete a Eco-Alert BRC</p>
          </div>

          {/* ========== AQUÍ VA EL FORMULARIO ========== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <RegisterForm />
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            {/* Botón de Google con tu estilo */}
            <button 
              onClick={handleGoogleRegister}
              className="w-full py-3.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            {' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;