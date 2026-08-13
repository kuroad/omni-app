import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import apiRoutes from './routes/api';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ 
  logger: true 
});

// Mendaftarkan plugin Rate Limiting
fastify.register(rateLimit, {
  max: 30, // Max 30 request per 1 menit per IP
  timeWindow: '1 minute',
  errorResponseBuilder: function (request, context) {
    return {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Terlalu banyak permintaan. Coba lagi dalam beberapa saat.`,
      }
    };
  }
});

// Mendaftarkan grup rute API
fastify.register(apiRoutes, { prefix: '/api' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    // Listen on 0.0.0.0 agar bisa diakses dari luar container Docker
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Backend server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
