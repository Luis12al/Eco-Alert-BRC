// Coordenadas de Barrancabermeja, Colombia
export const BARRANCABERMEJA_CENTER = {
  lat: 7.0653,
  lng: -73.8547,
};

// Radio máximo de reportes en km
export const MAX_REPORT_RADIUS_KM = 10;

// Categorías de reportes
export const REPORT_CATEGORIES = [
  { value: 'agua', label: '💧 Agua', color: '#3b82f6' },
  { value: 'aire', label: '🌬️ Aire', color: '#06b6d4' },
  { value: 'olor', label: '👃 Olor', color: '#a855f7' },
  { value: 'residuos', label: '🗑️ Residuos', color: '#f97316' },
  { value: 'ruido', label: '🔊 Ruido', color: '#6366f1' },
  { value: 'otro', label: '📋 Otro', color: '#6b7280' },
];

// Niveles de alerta
export const ALERT_LEVELS = [
  { value: 'verde', label: 'Normal', color: '#22c55e', icon: '🟢', severity: 1 },
  { value: 'amarillo', label: 'Sospechoso', color: '#eab308', icon: '🟡', severity: 2 },
  { value: 'rojo', label: 'Alerta', color: '#ef4444', icon: '🔴', severity: 3 },
];

// Roles de usuario
export const USER_ROLES = {
  CITIZEN: 'citizen',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

// Reputación
export const REPUTATION_LEVELS = [
  { min: -50, max: -10, label: 'Restringido', color: 'text-red-600' },
  { min: -9, max: 0, label: 'Nuevo', color: 'text-gray-500' },
  { min: 1, max: 10, label: 'Activo', color: 'text-green-600' },
  { min: 11, max: 50, label: 'Confiable', color: 'text-blue-600' },
  { min: 51, max: 999, label: 'Experto', color: 'text-purple-600' },
];

export const getReputationInfo = (reputation) => {
  return REPUTATION_LEVELS.find(
    (level) => reputation >= level.min && reputation <= level.max
  ) || REPUTATION_LEVELS[1];
};