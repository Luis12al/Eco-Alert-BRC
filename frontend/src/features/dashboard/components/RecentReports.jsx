import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import ReportList from '../../reports/components/ReportList.jsx';
import { useNearbyReports } from '../../reports/hooks/useReports.js';
import { BARRANCABERMEJA_CENTER } from '../../../utils/constants.js';

const RecentReports = () => {
  const navigate = useNavigate();
  const { data: reports, isLoading } = useNearbyReports({
    lat: BARRANCABERMEJA_CENTER.lat,
    lng: BARRANCABERMEJA_CENTER.lng,
    radius: 10,
    limit: 5,
  });

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <Card.Title>Reportes Recientes</Card.Title>
        <button 
          onClick={() => navigate('/mapa')}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </button>
      </Card.Header>
      <Card.Content>
        <ReportList 
          reports={reports} 
          isLoading={isLoading}
          onReportClick={(report) => navigate(`/mapa?report=${report.id}`)}
          emptyMessage="No hay reportes recientes"
        />
      </Card.Content>
    </Card>
  );
};

export default RecentReports;