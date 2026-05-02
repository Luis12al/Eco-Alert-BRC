/**
 * Configuración principal de Express
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { env } from './config/env.js';
import { logger } from './shared/utils/logger.js';
import { apiLimiter } from './shared/middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './shared/middleware/errorHandler.js';

// Rutas
import authRoutes from './modules/auth/auth.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import mapRoutes from './modules/map/map.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? ['https://ecoalert-brc.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Compresión
app.use(compression());

// Rate limiting global
app.use('/api/', apiLimiter);

// Rutas
app.use('/api/map', mapRoutes);
app.use('/api/notifications', notificationsRoutes);

// Passport Google OAuth config
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0]?.value,
      };
      done(null, user);
    }
  )
);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;