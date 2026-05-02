import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Filter } from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { ReportList, ReportDetail } from '../features/reports';
import { useQuery } from 'react-query';
import api from '../api/axiosConfig.js';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import { REPORT_CATEGORIES, ALERT_LEVELS } from '../utils/constants.js';

const ReportsHistoryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    alertLevel: '',
    status: '',
  });

  const { data: reports, isLoading } = useQuery(
    ['userReports', user?.id, filters],
    () => api.get('/users/reports', { params: filters }).then(res => res.data.data),
    {
      enabled: isAuthenticated,
    }
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Inicia sesión para ver tu historial
        </h2>
        <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <History className="h-6 w-6 text-primary-600" />
          Mis Reportes
        </h1>
        <Button onClick={() => navigate('/reportar')} size="sm">
          Nuevo reporte
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtrar</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            placeholder="Todas las categorías"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            options={REPORT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
          />
          <Select
            placeholder="Todos los niveles"
            value={filters.alertLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, alertLevel: e.target.value }))}
            options={ALERT_LEVELS.map(l => ({ value: l.value, label: l.label }))}
          />
          <Select
            placeholder="Todos los estados"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'pending', label: '⏳ Pendiente' },
              { value: 'approved', label: '✅ Aprobado' },
              { value: 'rejected', label: '❌ Rechazado' },
            ]}
          />
        </div>
      </div>

      <ReportList
        reports={reports}
        isLoading={isLoading}
        onReportClick={(report) => {
          setSelectedReport(report);
          setShowDetail(true);
        }}
        emptyMessage="No has creado reportes aún"
      />

      <ReportDetail
        report={selectedReport}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
};

export default ReportsHistoryPage;