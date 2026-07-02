export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL!, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT!, 10) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
});