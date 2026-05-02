export const AlertLevel = Object.freeze({
  GREEN: 'verde',
  YELLOW: 'amarillo',
  RED: 'rojo',
});

export const AlertLevelConfig = Object.freeze({
  [AlertLevel.GREEN]: {
    label: 'Normal',
    color: '#22c55e',
    icon: '🟢',
    severity: 1,
  },
  [AlertLevel.YELLOW]: {
    label: 'Sospechoso',
    color: '#eab308',
    icon: '🟡',
    severity: 2,
  },
  [AlertLevel.RED]: {
    label: 'Alerta',
    color: '#ef4444',
    icon: '🔴',
    severity: 3,
  },
});