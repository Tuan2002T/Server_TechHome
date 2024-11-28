const { User } = require('../Model/ModelDefinition')
const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { user, resident, admin } = decoded.payload

    const check = await User.findOne({ where: { userId: user.userId } })
    if (!check) {
      return res.status(403).json({ message: 'User not found' })
    }

    if (check.token !== token) {
      return res.status(403).json({ message: 'Invalid token' })
    }

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
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired',
        expiredAt: err.expiredAt,
        refreshToken: true
      })
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    } else {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

module.exports = verifyToken
