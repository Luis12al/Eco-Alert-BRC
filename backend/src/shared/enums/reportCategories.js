export const ReportCategory = Object.freeze({
  WATER: 'agua',
  AIR: 'aire',
  ODOR: 'olor',
  WASTE: 'residuos',
  NOISE: 'ruido',
  OTHER: 'otro',
});

export const ReportCategoryLabels = Object.freeze({
  [ReportCategory.WATER]: '💧 Agua',
  [ReportCategory.AIR]: '🌬️ Aire',
  [ReportCategory.ODOR]: '👃 Olor',
  [ReportCategory.WASTE]: '🗑️ Residuos',
  [ReportCategory.NOISE]: '🔊 Ruido',
  [ReportCategory.OTHER]: '📋 Otro',
});