import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date) => {
  // Manejar valores nulos, undefined, o inválidos
  if (!date || date === null || date === undefined) {
    return 'Fecha no disponible';
  }
  
  try {
    const dateObj = new Date(date);
    // Verificar que la fecha sea válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    console.warn('Error formateando fecha:', date, error);
    return 'Fecha no disponible';
  }
};

export const formatRelativeDate = (date) => {
  if (!date || date === null || date === undefined) {
    return 'Hace un momento';
  }
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Fecha desconocida';
    }
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
  } catch (error) {
    return 'Fecha desconocida';
  }
};

export const formatCoordinates = (lat, lng) => {
  if (lat == null || lng == null) return 'Ubicación no disponible';
  return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
};

export const formatReputation = (reputation) => {
  if (reputation == null) return '0';
  const sign = reputation > 0 ? '+' : '';
  return `${sign}${reputation}`;
};