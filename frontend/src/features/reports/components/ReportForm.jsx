import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { useMutation } from 'react-query';
import { reportsApi } from '../../../api/reportsApi.js';
import { useAuthStore } from '../../../stores/authStore.js';
import { useReportStore } from '../../../stores/reportStore.js';
import { useUiStore } from '../../../stores/uiStore.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import CategorySelector from './CategorySelector.jsx';
import AlertLevelPicker from './AlertLevelPicker.jsx';
import ImageUploader from './ImageUploader.jsx';
import { getCurrentPosition, getDefaultLocation } from '../../../utils/geolocation.js';

const ReportForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { setSubmitting, setSubmitError } = useReportStore();
  const { addToast } = useUiStore();
  
  const [formData, setFormData] = useState({
    category: '',
    alertLevel: '',
    description: '',
    latitude: null,
    longitude: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  React.useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await getCurrentPosition();
      setFormData(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    } catch (error) {
      const defaultLoc = getDefaultLocation();
      setFormData(prev => ({
        ...prev,
        latitude: defaultLoc.lat,
        longitude: defaultLoc.lng,
      }));
      addToast({
        type: 'warning',
        title: 'Ubicación por defecto',
        message: 'Usando ubicación central de Barrancabermeja. Puedes ajustarla en el mapa.',
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.category) errors.category = 'Selecciona una categoría';
    if (!formData.alertLevel) errors.alertLevel = 'Selecciona un nivel de alerta';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    if (formData.description.length < 10) errors.description = 'Mínimo 10 caracteres';
    if (!formData.latitude || !formData.longitude) errors.location = 'Ubicación requerida';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createReportMutation = useMutation(
    (formDataToSend) => reportsApi.create(formDataToSend),
    {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: '¡Reporte enviado!',
          message: 'Tu reporte será revisado por nuestros moderadores.',
        });
        navigate('/mapa');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Error al enviar el reporte';
        setSubmitError(message);
        addToast({
          type: 'error',
          title: 'Error',
          message,
        });
      },
      onSettled: () => {
        setSubmitting(false);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Inicia sesión',
        message: 'Debes iniciar sesión para crear un reporte',
      });
      navigate('/login');
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.category);
    formDataToSend.append('alertLevel', formData.alertLevel);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('latitude', formData.latitude);
    formDataToSend.append('longitude', formData.longitude);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    createReportMutation.mutate(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Ubicación del reporte</p>
          <p className="text-sm text-blue-800">
            {formData.latitude && formData.longitude
              ? `${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)}`
              : 'Obteniendo ubicación...'}
          </p>
          {isGettingLocation && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Detectando tu ubicación...
            </p>
          )}
        </div>
      </div>

      <CategorySelector
        value={formData.category}
        onChange={(category) => setFormData(prev => ({ ...prev, category }))}
        error={fieldErrors.category}
      />

      <AlertLevelPicker
        value={formData.alertLevel}
        onChange={(alertLevel) => setFormData(prev => ({ ...prev, alertLevel }))}
        error={fieldErrors.alertLevel}
      />

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Descripción del incidente
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Describe lo que observaste: olores, colores del agua, basura acumulada, etc..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      <ImageUploader
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
        preview={imagePreview}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => navigate('/mapa')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={createReportMutation.isLoading}
        >
          Enviar reporte
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;