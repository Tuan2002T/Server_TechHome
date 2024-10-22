const { default: rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5,
  message: 'Too many requests, please try again later.'
})

module.exports = limiter
