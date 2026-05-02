import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    // Crear usuario admin
    const adminHash = await bcrypt.hash('Admin123!', 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role, reputation, created_at)
       VALUES ($1, $2, $3, 'admin', 100, NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['admin@ecoalert.com', adminHash, 'Administrador']
    );

    // Crear usuario moderador
    const modHash = await bcrypt.hash('Moderator123!', 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role, reputation, created_at)
       VALUES ($1, $2, $3, 'moderator', 50, NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['moderator@ecoalert.com', modHash, 'Moderador']
    );

    // Crear usuario ciudadano de prueba
    const citizenHash = await bcrypt.hash('Citizen123!', 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role, reputation, created_at)
       VALUES ($1, $2, $3, 'citizen', 5, NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['ciudadano@ecoalert.com', citizenHash, 'Ciudadano Ejemplo']
    );

    // Crear reportes de ejemplo
    await pool.query(
      `INSERT INTO reports (user_id, category, alert_level, description, location, status, created_at)
       SELECT 
         u.id,
         'agua',
         'rojo',
         'Agua con coloración anormal y olor fuerte en el sector del río',
         ST_SetSRID(ST_MakePoint(-73.8547, 7.0653), 4326),
         'approved',
         NOW() - INTERVAL '2 hours'
       FROM users u WHERE u.email = 'ciudadano@ecoalert.com'
       ON CONFLICT DO NOTHING`
    );

    console.log('✅ Datos de prueba insertados');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();