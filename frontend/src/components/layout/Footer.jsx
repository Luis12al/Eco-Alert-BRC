import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Eco-Alert <span className="text-primary-600">BRC</span>
            </h3>
            <p className="text-sm text-gray-500">
              Plataforma ciudadana para el monitoreo ambiental de Barrancabermeja. 
              Juntos construimos una ciudad más sostenible.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Enlaces</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/mapa" className="text-gray-500 hover:text-primary-600">Mapa de reportes</a></li>
              <li><a href="/reportar" className="text-gray-500 hover:text-primary-600">Crear reporte</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600">Acerca de</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contacto</h4>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500" /> para Barrancabermeja
          </p>
          <p className="mt-1">© 2024 Eco-Alert BRC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;