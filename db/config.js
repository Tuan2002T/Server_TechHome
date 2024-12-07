// db/config.js
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres', // Use service name from docker-compose
  database: process.env.POSTGRES_DB || 'techhome',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432')
})

// Add error listener
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Utility function for connection retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      console.log('Successfully connected to PostgreSQL')
      return client
    } catch (err) {
      if (i === retries - 1) throw err
      console.log(`Connection attempt ${i + 1} failed, retrying in ${delay/1000} seconds...`)
      await sleep(delay)
    }
  }
}

module.exports = {
  pool,
  connectWithRetry
}