const {
  Apartment,
  Floor,
  Building,
  Service,
  BuildingServices,
  Resident,
  User,
  Facility
} = require('../../Model/ModelDefinition')

const getAllBuildingServices = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const residentId = req.user.userId

    const apartmentResidents = await Apartment.findAll({
      include: [
        {
          model: Resident,
          include: [
            {
              model: User,
              attributes: ['fullname']
            }
          ],
          through: {
            attributes: []
          }
        }
      ]
    })

    const filteredApartments = apartmentResidents.filter((apartment) =>
      apartment.Residents.some((resident) => resident.residentId === residentId)
    )

    if (filteredApartments.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy căn hộ cho cư dân này.' })
    }

    const floor = await Floor.findOne({
      where: { floorId: filteredApartments[0].floorId }
    })

    const building = await Building.findOne({
      where: { buildingId: floor.buildingId }
    })

    const buildingServices = await Building.findAll({
      where: { buildingId: building.buildingId },
      include: [
        {
          model: Service,
          through: {
            attributes: []
          }
        }
      ]
    })

    const buildingFacilities = await Building.findAll({
      where: { buildingId: building.buildingId },
      include: [
        {
          model: Facility,
          through: {
            attributes: []
          }
        }
      ]
    })

    const response = {
      buildingServices: buildingServices[0].Services,
      buildingFacilities: buildingFacilities[0].Facilities
    }

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

module.exports = {
  getAllBuildingServices
}
