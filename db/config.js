const config = {
  db: {
    user: process.env.USERNAMEPG || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DATABASE || 'techhome',
    password: process.env.PASSWORD || 'postgres',
    port: parseInt(process.env.PORT) || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    retry: {
      max: 5,
      delay: 2000
    }
  },
  server: {
    port: process.env.SERVER_PORT || 3000,
    corsOptions: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
}

module.exports = config