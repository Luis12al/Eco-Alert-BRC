# Eco-Alert BRC: Red de Monitoreo Ambiental Ciudadano 🌍💧

## 📋 Descripción del Proyecto
Eco-Alert BRC es una plataforma web (PWA) diseñada para empoderar a los ciudadanos y pescadores de Barrancabermeja. Permite reportar en tiempo real el estado ambiental del Río Magdalena y las ciénagas aledañas mediante alertas georreferenciadas y un sistema visual de "Semáforo Ambiental" (Verde, Amarillo/Sospechoso, Rojo), mitigando la desconfianza histórica sobre la calidad del agua y el aire.

## 🚀 Arquitectura y Tecnologías
- **Frontend:** React.js / Vite, Tailwind CSS (diseño responsivo y adaptado para PWA).
- **Mapas:** Leaflet.js / React-Leaflet (OpenStreetMap).
- **Backend:** Node.js con Express (arquitectura RESTful).
- **Base de Datos:** PostgreSQL con extensión PostGIS (para el manejo de coordenadas geográficas).

## ⚙️ Requisitos Previos e Instalación

### Backend
1. Clonar el repositorio e ingresar a la carpeta del servidor:
```bash
   cd backend
   npm install
   npm run dev


Frontend
cd frontend
   npm install
   npm run dev