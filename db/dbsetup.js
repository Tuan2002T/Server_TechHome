const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432
})

const createDatabase = async () => {
  const client = await pool.connect()
  try {
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'TechHome'"
    )
    if (result.rows.length > 0) {
      console.log('Database "Techhome" already exists!')
      return
    }
    await client.query("CREATE DATABASE techhome WITH ENCODING 'UTF8'")
    console.log('Database "Techhome" created successfully!')
  } catch (err) {
    console.error('Error creating database:', err.message)
  } finally {
    client.release()
    await pool.end()
  }
}

createDatabase()
