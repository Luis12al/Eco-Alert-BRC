import React from 'react';
import { Navigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { ReportForm } from '../features/reports';
import { useAuthStore } from '../stores/authStore.js';

const ReportPage = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/reportar' }} replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-600" />
          Nuevo Reporte Ambiental
        </h1>
        <p className="text-gray-500 mt-1">
          Describe el incidente que observaste. Tu reporte ayudará a mantener informada a la comunidad.
        </p>
      </div>

      <ReportForm />
    </div>
  );
};

export default ReportPage;