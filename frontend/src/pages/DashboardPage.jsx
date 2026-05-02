import React from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { StatsCards, RecentReports, ReputationBadge } from '../features/dashboard';
import { useAuthStore } from '../stores/authStore.js';

const DashboardPage = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-primary-600" />
        Dashboard
      </h1>

      <div className="space-y-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentReports />
          </div>
          <div>
            <ReputationBadge />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;