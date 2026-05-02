import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProfileCard } from '../features/auth';
import { ReputationBadge } from '../features/dashboard';
import { useAuthStore } from '../stores/authStore.js';

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard />
        <ReputationBadge />
      </div>

      {/* Aquí se pueden agregar más secciones: historial de reportes, configuración, etc. */}
    </div>
  );
};

export default ProfilePage;