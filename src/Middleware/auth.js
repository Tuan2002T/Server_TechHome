const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    const { user, resident, admin } = decoded.payload

    const userRoleId = user.roleId

    if (userRoleId === 1) {
      req.user = user
      req.admin = admin
      req.role = 'admin'
    } else if (userRoleId === 2) {
      req.user = user
      req.resident = resident
      req.role = 'resident'
    } else {
      return res.status(403).json({ message: 'Unauthorized access' })
    }

    next()
  })
}

module.exports = verifyToken
