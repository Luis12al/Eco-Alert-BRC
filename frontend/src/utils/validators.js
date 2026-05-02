export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPassword = (password) => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

export const isWithinBarrancabermeja = (lat, lng) => {
  // Coordenadas aproximadas del área de Barrancabermeja
  return lat >= 6.5 && lat <= 7.5 && lng >= -74.5 && lng <= -73.5;
};

export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return validTypes.includes(file.type) && file.size <= maxSize;
};