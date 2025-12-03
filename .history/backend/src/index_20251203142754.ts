import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

console.log('📦 Loading routes...');
import depotRoutes from './routes/depotRoutes';
import containerRoutes from './routes/containerRoutes';
import authRoutes from './routes/authRoutes';
import shippingLineRoutes from './routes/shippingLineRoutes';
import containerTypeRoutes from './routes/containerTypeRoutes';
import locationRoutes from './routes/locationRoutes';
import driverRoutes from './routes/driverRoutes';
console.log('✅ Routes loaded');

console.log('📦 Loading depot API service...');
import depotApiService from './services/depotApiService';
console.log('✅ Depot API service loaded');

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_req, res) => {
  res.json({
    message: 'Container Reseu Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test API endpoint
app.get('/api/test-depot-api', async (_req, res) => {
  try {
    console.log('🧪 Testing depot API connection...');
    const depots = await depotApiService.fetchDepots();
    const stats = await depotApiService.getStatistics();
    
    res.json({
      success: true,
      message: 'API connection successful',
      depotsCount: depots.length,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/iContainerHub_Depot', depotRoutes);
app.use('/api/iContainerHub_HangTau', shippingLineRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/container-types', containerTypeRoutes);
app.use('/api/locations', locationRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access from network: http://[YOUR-IP]:${PORT}`);
});

export default app;