import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );
    
    await pool.query(schemaSQL);
    console.log('✅ Migraciones ejecutadas exitosamente');
    
    // Ejecutar migraciones adicionales
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.match(/^\d+_.*\.sql$/))
      .sort();
    
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await pool.query(sql);
      console.log(`✅ Migración ejecutada: ${file}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    process.exit(1);
  }
};

runMigrations();