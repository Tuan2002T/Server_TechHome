const { Pool } = require('pg')
require('dotenv').config()

const createDatabase = async () => {
  // Connect to default postgres database first
  const pool = new Pool({
    user: process.env.USERNAMEPG || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    database: 'postgres', // Connect to default database
    password: process.env.PASSWORD || 'postgres',
    port: parseInt(process.env.PORT) || 5432,
    connectionTimeoutMillis: 5000
  })

  let client
  try {
    client = await pool.connect()

    // Check if database exists
    const dbName = process.env.DATABASE || 'techhome'
    const checkDb = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    )

    if (checkDb.rows.length === 0) {
      // Terminate existing connections
      await client.query(
        `
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = $1 AND pid <> pg_backend_pid()`,
        [dbName]
      )

      // Create database
      await client.query(`CREATE DATABASE ${dbName}`)
      console.log(`Database "${dbName}" created`)
    }

    return true
  } catch (err) {
    console.error('Database creation error:', err)
    throw err
  } finally {
    if (client) {
      await client.release()
    }
    await pool.end()
  }
}

module.exports = { createDatabase }
