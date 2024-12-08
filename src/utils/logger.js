const winston = require('winston')
const path = require('path')
const fs = require('fs')

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Define custom log levels and colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  }
}

// Custom format for log messages
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} | ${level.toUpperCase().padEnd(5)} | ${message}`

    // Add metadata if exists
    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta)}`
    }

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`
    }

    return log
  })
)

// Create the logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: customFormat,
  transports: [
    // Console transport with colors (development)
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),

    // File transport for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // File transport for HTTP requests
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
})

// Add colors to Winston
winston.addColors(customLevels.colors)

// Request logger middleware for Express
const requestLogger = (req, res, next) => {
  const startTime = Date.now()

  // Log when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    )
  })

  next()
}

// Error logger middleware for Express
const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params
  })

  next(err)
}

// Database logger
const dbLogger = {
  query: (query) => {
    logger.debug('Database Query', {
      sql: query.sql,
      duration: query.duration,
      rows: query.rows
    })
  },
  error: (error) => {
    logger.error('Database Error', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
  }
}

// Helper function to redact sensitive information
const redactSensitiveInfo = (obj) => {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization'
  ]
  const redacted = { ...obj }

  Object.keys(redacted).forEach((key) => {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]'
    }
  })

  return redacted
}

// Export the logger and utilities
module.exports = {
  logger,
  requestLogger,
  errorLogger,
  dbLogger,
  redactSensitiveInfo
}
