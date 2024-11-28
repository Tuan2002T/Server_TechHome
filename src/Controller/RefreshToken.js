const { jwtToken } = require('../JWT/jwt')
const { User, Resident } = require('../Model/ModelDefinition')
const jwt = require('jsonwebtoken')
const refreshToken = async (req, res) => {
  const { refresh_token } = req.body

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' })
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN)
    console.log(decoded)

    const userId = decoded.payload.user.userId

    const user = await User.findOne({ where: { userId } })
    const resident = await Resident.findOne({ where: { userId } })

    if (!user || user.refreshToken !== refresh_token) {
      return res.status(403).json({ message: 'Invalid refresh token' })
    }

    user.token = null

    const userPayload = { userId: user.userId, roleId: user.roleId }
    const payload = { user: userPayload, resident }

    console.log(payload)

    const newAccessToken = jwtToken(payload)
    user.token = newAccessToken

    await user.save()

    return res.status(200).json({
      user,
      resident,
      accessToken: newAccessToken,
      refreshToken: refresh_token
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({
          message: 'Refresh token has expired',
          expiredAt: error.expiredAt,
          refreshToken: true
        })
    }

    return res.status(500).json({ message: error.message })
  }
}

module.exports = { refreshToken }
