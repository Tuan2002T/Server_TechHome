const {
  sequelize,
  Vehicle,
  Resident,
  User,
  Complaint,
  Facility
} = require('../../Model/ModelDefinition')

const getFacilities = async (req, res) => {
  try {
    const rs = await Facility.findAll()
    return res.status(200).json({
      status: true,
      data: rs
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving facilities.'
    })
  }
}

module.exports = {
  getFacilities
}
