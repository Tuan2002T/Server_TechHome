const { Pool } = require('pg');

// Create a pool for connecting to the default 'postgres' database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432
})

const createDatabase = async () => {
  let client;
  
  try {
    // Wait for PostgreSQL to be ready
    console.log('Attempting to connect to PostgreSQL...');
    client = await pool.connect();
    
    // Check if database exists (case-insensitive query)
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE LOWER(datname) = LOWER('techhome')"
    );
    
    if (result.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query('CREATE DATABASE techhome WITH ENCODING = \'UTF8\'');
      console.log('Database "techhome" created successfully!');
    } else {
      console.log('Database "techhome" already exists!');
    }
    
  } catch (err) {
    console.error('Database setup error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    
    // If this is a connection error, provide more helpful message
    if (err.code === 'ECONNREFUSED') {
      console.error(`
        Connection refused. Please check:
        1. PostgreSQL service is running
        2. Database host is correct (current: ${pool.options.host})
        3. Port is correct (current: ${pool.options.port})
        4. Network settings in docker-compose.yml
      `);
    }
    
    // Rethrow error to handle it in the calling code
    throw err;
  } finally {
    if (client) {
      await client.release();
    }
    await pool.end();
  }
};

// Only run if this file is being executed directly
if (require.main === module) {
  createDatabase()
    .catch(err => {
      console.error('Failed to setup database:', err);
      process.exit(1);
    });
}

module.exports = { createDatabase, pool };