import React from 'react';
import { FileText, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import { useReportStats } from '../../reports/hooks/useReports.js';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card>
    <Card.Content className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </Card.Content>
  </Card>
);

const StatsCards = () => {
  const { data: stats, isLoading } = useReportStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}><Card.Content className="h-24 animate-pulse bg-gray-100" /></Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Reportes',
      value: stats?.total_reports || 0,
      icon: FileText,
      color: 'bg-blue-500',
      subtitle: 'Desde el lanzamiento',
    },
    {
      title: 'Alertas Rojas',
      value: stats?.red_alerts || 0,
      icon: AlertOctagon,
      color: 'bg-red-500',
      subtitle: 'Requieren atención urgente',
    },
    {
      title: 'Alertas Amarillas',
      value: stats?.yellow_alerts || 0,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      subtitle: 'Sospechosas',
    },
    {
      title: 'Últimas 24h',
      value: stats?.last_24h || 0,
      icon: Clock,
      color: 'bg-green-500',
      subtitle: 'Nuevos reportes',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;