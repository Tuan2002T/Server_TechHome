const { Pool } = require('pg')

class DatabaseManager {
  constructor(config) {
    this.config = config
    this.pool = new Pool(config)

    // Handle pool errors
    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err)
    })
  }

  async withTransaction(callback) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async createDatabase() {
    const defaultPool = new Pool({
      ...this.config,
      database: 'postgres'
    })

    let client
    try {
      client = await defaultPool.connect()
      const dbName = this.config.database

      const { rows } = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      )

      if (rows.length === 0) {
        await client.query(`CREATE DATABASE ${dbName}`)
        logger.info(`Database "${dbName}" created successfully`)
        return true
      }
      return false
    } finally {
      if (client) client.release()
      await defaultPool.end()
    }
  }

  async connect(retries = this.config.retry.max) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.pool.query('SELECT 1')
        logger.info('Database connected successfully')
        return true
      } catch (error) {
        if (attempt === retries) {
          throw new Error(
            `Failed to connect after ${retries} attempts: ${error.message}`
          )
        }
        logger.warn(`Connection attempt ${attempt} failed, retrying...`)
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retry.delay)
        )
      }
    }
  }

  async end() {
    await this.pool.end()
  }
}

module.exports = DatabaseManager