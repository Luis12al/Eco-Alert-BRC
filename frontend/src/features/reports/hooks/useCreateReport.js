import { useMutation, useQueryClient } from 'react-query';
import { reportsApi } from '../../../api/reportsApi.js';
import { useUiStore } from '../../../stores/uiStore.js';

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation(
    (formData) => reportsApi.create(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('nearbyReports');
        queryClient.invalidateQueries('reportStats');
        addToast({
          type: 'success',
          title: '¡Reporte creado!',
          message: 'Tu reporte ha sido enviado exitosamente.',
        });
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Error al crear reporte',
          message: error.response?.data?.message || 'Ocurrió un error inesperado',
        });
      },
    }
  );
};