const { Resident, Advertisement } = require('../../Model/ModelDefinition')

const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = Resident.findAll({
      where: {
        role: 'SERVICEPROVIDER'
      }
    })

    return res.status(200).json({ serviceProviders: serviceProviders })
  } catch (error) {}
}

module.exports = {
  getAllServiceProviders
}
