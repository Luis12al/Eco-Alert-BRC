import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-yellow-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-500 mb-8">Página no encontrada</p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="h-5 w-5" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;