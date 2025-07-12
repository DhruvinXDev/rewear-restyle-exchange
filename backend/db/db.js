const mysql = require('mysql2/promise')
require('dotenv').config({ path: './config.env' })

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Test database connection
const testConnection = async () => {
  try {
    const connection = await db.getConnection()
    console.log('✅ Database connected successfully!')
    connection.release()
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()

module.exports = db 