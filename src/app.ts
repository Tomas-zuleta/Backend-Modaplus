import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import {
  authRoutes,
  usuarioRoutes,
  rolRoutes,
  catalogoRoutes,
  clienteRoutes,
  ventaRoutes,
  compraRoutes,
  proveedorRoutes,
  devolucionRoutes,
  separeRoutes,
  dashboardRoutes,
  perdidaRoutes,
} from './routes';

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ModaPlus API estÃ¡ funcionando',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/devoluciones', devolucionRoutes);
app.use('/api/separe', separeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/perdidas', perdidaRoutes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
