const jwt = require('jsonwebtoken');

const jwtToken = (payload) => {
     return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

module.exports = jwtToken