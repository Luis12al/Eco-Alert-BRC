import React from 'react';
import { Loader2 } from 'lucide-react';
import ReportCard from './ReportCard.jsx';

const ReportList = ({ reports, isLoading, onReportClick, emptyMessage = 'No hay reportes' }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard 
          key={report.id} 
          report={report} 
          onClick={onReportClick}
        />
      ))}
    </div>
  );
};

export default ReportList;