import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Leaf, Camera, MapPin, AlertCircle } from 'lucide-react';
import { ReportForm } from '../features/reports';
import { useAuthStore } from '../stores/authStore.js';

const NATURE_IMAGES = [
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=1920&q=80',
  'https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=80',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&q=80',
  'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1920&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  'https://images.unsplash.com/photo-1507041957456-9c397ce39c3f?w=1920&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa9f34da4f?w=1920&q=80',
  'https://images.unsplash.com/photo-1462275646964-a0e3f2d3d7c6?w=1920&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1920&q=80',
  'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1920&q=80',
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1920&q=80',
  'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=1920&q=80',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=1920&q=80',
  'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80',
  'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&q=80',
  'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1920&q=80',
];

const ReportPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    NATURE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % NATURE_IMAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/reportar' }} replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Carrusel */}
      <div className="absolute inset-0">
        {NATURE_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Naturaleza ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                transform: index === currentImage ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 8s ease-out',
              }}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-gray-900/70 to-teal-950/85" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Contador */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/30 backdrop-blur rounded-full px-3 py-1 text-xs text-white/60 font-mono">
          {currentImage + 1} / {NATURE_IMAGES.length}
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium text-emerald-100">
                Reporte Ambiental Ciudadano
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4 tracking-tight">
              Documenta un{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Incidente
              </span>
            </h1>
            
            <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
              Tu reporte ayuda a proteger el Río Magdalena y las ciénagas de Barrancabermeja.
            </p>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-1 mb-8 max-w-md mx-auto flex-wrap">
            {NATURE_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImage 
                    ? 'w-4 bg-emerald-400' 
                    : 'w-1 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Formulario */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex items-start gap-3 mb-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-400/20">
                <Camera className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-200">
                    Incluye una foto y la ubicación exacta
                  </p>
                  <p className="text-xs text-emerald-200/60 mt-1">
                    Los reportes con evidencia visual son priorizados.
                  </p>
                </div>
              </div>

              {/* ===== ESTILOS SELECTIVOS ===== */}
              <div className="report-form-wrapper">
                <style>{`
                  /* TEXTO BLANCO en todo el formulario */
                  .report-form-wrapper,
                  .report-form-wrapper * {
                    color: #ffffff !important;
                  }
                  
                  /* EXCEPCIÓN: Cuadro de ubicación → NEGRO */
                  .report-form-wrapper form > div:first-of-type,
                  .report-form-wrapper form > div:first-of-type * {
                    color: #000000 !important;
                  }
                  .report-form-wrapper form > div:first-of-type svg {
                    color: #2563eb !important;
                  }
                  .report-form-wrapper form > div:first-of-type .animate-spin {
                    color: #6b7280 !important;
                  }
                  
                  /* ARREGLO: Textarea y inputs → texto NEGRO para que se lea */
                  .report-form-wrapper textarea,
                  .report-form-wrapper input[type="text"],
                  .report-form-wrapper input:not([type="button"]):not([type="submit"]) {
                    color: #000000 !important;
                  }
                  .report-form-wrapper textarea::placeholder,
                  .report-form-wrapper input::placeholder {
                    color: #6b7280 !important;
                  }
                  
                  /* ARREGLO: Categorías - hover con fondo visible */
                  .report-form-wrapper [class*="category"]:hover,
                  .report-form-wrapper [class*="Category"]:hover,
                  .report-form-wrapper .category-card:hover {
                    background: rgba(16, 185, 129, 0.3) !important;
                    border-color: #10b981 !important;
                    color: #ffffff !important;
                  }
                  .report-form-wrapper [class*="category"]:hover *,
                  .report-form-wrapper [class*="Category"]:hover *,
                  .report-form-wrapper .category-card:hover * {
                    color: #ffffff !important;
                  }
                  
                  /* Categoría seleccionada */
                  .report-form-wrapper [class*="selected"],
                  .report-form-wrapper .selected {
                    background: rgba(16, 185, 129, 0.5) !important;
                    border-color: #10b981 !important;
                  }
                  
                  /* NO TOCAR ImageUploader */
                  .report-form-wrapper [class*="ImageUploader"],
                  .report-form-wrapper [class*="image-uploader"],
                  .report-form-wrapper [class*="dropzone"],
                  .report-form-wrapper [class*="upload"] {
                    color: inherit !important;
                  }
                  .report-form-wrapper [class*="ImageUploader"] *,
                  .report-form-wrapper [class*="image-uploader"] *,
                  .report-form-wrapper [class*="dropzone"] *,
                  .report-form-wrapper [class*="upload"] * {
                    color: inherit !important;
                  }
                  .report-form-wrapper [class*="ImageUploader"] svg,
                  .report-form-wrapper [class*="image-uploader"] svg,
                  .report-form-wrapper [class*="dropzone"] svg,
                  .report-form-wrapper [class*="upload"] svg {
                    color: #ffffff !important;
                  }
                  
                  /* EXCEPCIÓN: Botón Cancelar → NEGRO */
                  .report-form-wrapper button[type="button"] {
                    color: #000000 !important;
                  }
                  /* Botón Enviar → BLANCO */
                  .report-form-wrapper button[type="submit"] {
                    color: #ffffff !important;
                  }
                  
                  /* Mensajes de error: ROJO */
                  .report-form-wrapper p.text-red-600,
                  .report-form-wrapper [class*="text-red"] {
                    color: #ef4444 !important;
                  }
                `}</style>
                <ReportForm />
              </div>
            </div>
            
            <div className="px-8 sm:px-10 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-200/50">
                <MapPin className="w-3 h-3" />
                <span>Barrancabermeja, Santander</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-200/50">
                <AlertCircle className="w-3 h-3" />
                <span>Todos los reportes son revisados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;