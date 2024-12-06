const {
  sequelize,
  Vehicle,
  Resident,
  User
} = require('../../Model/ModelDefinition')
const { Op } = require('sequelize')

const getVehicles = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.roleId !== 1) {
      return res.status(403).json({
        status: false,
        message: 'Access denied. Admins only.'
      })
    }
    // Get all vehicles with eager loaded resident and user data
    const vehicles = await Vehicle.findAll({
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      include: [
        {
          model: Resident,
          attributes: {
            exclude: ['updatedAt', 'createdAt', 'fcmToken', 'residentId']
          },
          include: [
            {
              model: User,
              attributes: {
                exclude: [
                  'userId',
                  'password',
                  'token',
                  'refreshToken',
                  'createdAt',
                  'updatedAt',
                  'residentId',
                  'roleId'
                ]
              }
            }
          ]
        }
      ]
    })

    return res.status(200).json({
      status: true,
      data: vehicles
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return res.status(500).json({
      status: false,
      message: 'Internal server error'
    })
  }
}

module.exports = {
  getVehicles
}
