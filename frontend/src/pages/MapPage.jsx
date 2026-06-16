import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { 
  Filter, Layers, AlertTriangle, Droplets, Wind, 
  Clock, Navigation, X, ChevronRight 
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useNearbyReports } from '../features/reports/hooks/useReports.js';
import { useGeolocation } from '../features/map/hooks/useGeolocation.js';
import { useReportStore } from '../stores/reportStore.js';
import { BARRANCABERMEJA_CENTER } from '../utils/constants.js';
import 'leaflet/dist/leaflet.css';

// Configuración de estados (colores Tailwind estándar)
const statusConfig = {
  rojo: { 
    color: '#dc2626', 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    label: 'Alerta', 
    icon: AlertTriangle 
  },
  amarillo: { 
    color: '#f59e0b', 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    label: 'Sospechoso', 
    icon: AlertTriangle 
  },
  verde: { 
    color: '#16a34a', 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    label: 'Normal', 
    icon: Droplets 
  }
};

const typeConfig = {
  agua: { icon: Droplets, label: 'Agua' },
  aire: { icon: Wind, label: 'Aire' },
  suelo: { icon: Layers, label: 'Suelo' }
};

const filterToAlertLevel = {
  todos: null,
  alerta: 'rojo',
  sospechoso: 'amarillo',
  normal: 'verde',
};

// Centrar mapa en Barrancabermeja
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [map, center]);
  return null;
};

const FilterChip = ({ label, active, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      active 
        ? `${colorClass} shadow-md text-white` 
        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const { location, loading: locLoading } = useGeolocation();
  const { activeFilters, setActiveFilters } = useReportStore();
  const [selectedReport, setSelectedReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');

  const center = location || BARRANCABERMEJA_CENTER;

  // ===== DATOS REALES DEL BACKEND =====
  const { data: reports, isLoading } = useNearbyReports({
    lat: center.lat,
    lng: center.lng,
    radius: 10,
    ...activeFilters,
  });

  // Filtrar por estado si no es 'todos'
  const filteredReports = activeFilter === 'todos' 
  ? (reports || [])
  : (reports || []).filter(r => r.alert_level === filterToAlertLevel[activeFilter]);

  const handleMarkerClick = (report) => {
    setSelectedReport(report);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    // Si es móvil, podrías querer cerrar sidebar o mostrar modal
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* ========== SIDEBAR: Reportes cercanos ========== */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white/95 backdrop-blur-sm border-r border-gray-200/80 overflow-hidden flex flex-col shadow-lg`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900">Reportes cercanos</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-pulse text-amber-500' : 'text-emerald-500'}`} />
            {locLoading ? 'Detectando ubicación...' : `${filteredReports.length} reportes en zona`}
          </p>
        </div>
        
        {/* Lista de reportes */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            // Skeleton loading
            [1, 2, 3].map(i => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Droplets className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay reportes en esta zona</p>
            </div>
          ) : (
            filteredReports.map(report => {
              const config = statusConfig[report.alert_level] || statusConfig.normal;
              const StatusIcon = config.icon;
              return (
                <div 
                  key={report.id} 
                  onClick={() => handleReportClick(report)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedReport?.id === report.id 
                      ? 'border-emerald-400 bg-emerald-50 shadow-md' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{report.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{report.description}</p>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.timeAgo || 'Hace poco'}
                    </span>
                    {report.author && (
                      <span className="truncate max-w-[100px]">{report.author}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ========== MAPA ========== */}
      <div className="flex-1 flex flex-col relative">
        {/* Header flotante con filtros */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-2 pointer-events-auto flex items-center gap-1.5 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <FilterChip 
              label="Todos" 
              active={activeFilter === 'todos'} 
              onClick={() => setActiveFilter('todos')}
              colorClass="bg-gray-800"
            />
            <FilterChip 
              label="Alertas" 
              active={activeFilter === 'alerta'} 
              onClick={() => setActiveFilter('alerta')}
              colorClass="bg-red-500"
            />
            <FilterChip 
              label="Sospechosos" 
              active={activeFilter === 'sospechoso'} 
              onClick={() => setActiveFilter('sospechoso')}
              colorClass="bg-amber-500"
            />
            <FilterChip 
              label="Seguros" 
              active={activeFilter === 'normal'} 
              onClick={() => setActiveFilter('normal')}
              colorClass="bg-emerald-500"
            />
          </div>
          
          {/* Toggle sidebar */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 p-3 hover:bg-white transition-colors pointer-events-auto"
          >
            <Layers className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mapa Leaflet */}
        <div className="flex-1 relative">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
          >
            <MapController center={center} />
            
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {/* Marcadores reales del backend */}
            {filteredReports.map(report => {
              const config = statusConfig[report.alert_level] || statusConfig.normal;
              return (
                <CircleMarker
                  key={report.id}
                  center={[report.location?.lat || report.lat, report.location?.lng || report.lng]}
                  radius={report.alert_level === 'alerta' ? 16 : 12}
                  pathOptions={{
                    fillColor: config.color,
                    color: '#fff',
                    weight: 3,
                    fillOpacity: 0.9
                  }}
                  eventHandlers={{
                    click: () => handleMarkerClick(report)
                  }}
                >
                  <Popup>
                    <div className="min-w-[260px] p-2 font-sans">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2">{report.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2">
                        <span>{report.author || 'Anónimo'}</span>
                        <span>{report.timeAgo || 'Reciente'}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Leyenda flotante */}
        <div className="absolute bottom-6 left-6 z-[400] bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Leyenda</h4>
          <div className="space-y-2">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-gray-700 font-medium">{config.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-500 shadow-sm animate-pulse" />
              <span className="text-sm text-gray-700 font-medium">Tu ubicación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;