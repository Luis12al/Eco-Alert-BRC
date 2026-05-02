/**
 * Configuración de Multer para subida de imágenes
 * Almacena en memoria (buffer) para enviar directo a Cloudinary
 */
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Solo se permiten imágenes JPG, PNG o WebP'), false);
  }
};

// Límites: máximo 5MB
const limits = {
  fileSize: 5 * 1024 * 1024,
  files: 1,
};

export const upload = multer({
  storage: multer.memoryStorage(), // Buffer en memoria, no disco
  fileFilter,
  limits,
});