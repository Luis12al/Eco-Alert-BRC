import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveMap, MapLegend } from '../features/map';
import { ReportList, ReportDetail } from '../features/reports';
import { useNearbyReports } from '../features/reports/hooks/useReports.js';
import { useGeolocation } from '../features/map/hooks/useGeolocation.js';
import { useReportStore } from '../stores/reportStore.js';
import { BARRANCABERMEJA_CENTER } from '../utils/constants.js';

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const { location, loading: locLoading } = useGeolocation();
  const { activeFilters } = useReportStore();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const center = location || BARRANCABERMEJA_CENTER;

  const { data: reports, isLoading } = useNearbyReports({
    lat: center.lat,
    lng: center.lng,
    radius: 10,
    ...activeFilters,
  });

  const handleMarkerClick = (report) => {
    setSelectedReport(report);
    setShowDetail(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <InteractiveMap
            reports={reports || []}
            selectedReportId={selectedReport?.id}
            onMarkerClick={handleMarkerClick}
            height="70vh"
          />
          <MapLegend />
        </div>

        {/* Lista lateral */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Reportes cercanos
            {locLoading && <span className="text-sm font-normal text-gray-400 ml-2">(detectando ubicación...)</span>}
          </h2>
          <ReportList 
            reports={reports} 
            isLoading={isLoading}
            onReportClick={handleMarkerClick}
          />
        </div>
      </div>

      {/* Modal de detalle */}
      <ReportDetail
        report={selectedReport}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
};

export default MapPage;