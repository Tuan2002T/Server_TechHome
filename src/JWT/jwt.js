const jwt = require('jsonwebtoken')

const jwtToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const jwtRefreshToken = (payload) => {
  return jwt.sign({ payload }, process.env.REFRESH_TOKEN, { expiresIn: '30d' })
}

module.exports = { jwtToken, jwtRefreshToken }
