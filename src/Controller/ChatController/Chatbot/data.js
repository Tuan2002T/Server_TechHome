const {
  Apartment,
  Resident,
  Building,
  Floor,
  Vehicle,
  User
} = require('../../../Model/ModelDefinition')

const getResidentApartmentInfo = async (residentId) => {
  try {
    if (!residentId) {
      throw new Error('Resident ID is required')
    }

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
      throw new Error('Không tìm thấy căn hộ cho cư dân này.')
    }

    const floor = await Floor.findAll({
      where: { floorId: filteredApartments[0].floorId }
    })

    const building = await Building.findAll({
      where: { buildingId: floor[0].buildingId }
    })

    const residents = filteredApartments[0].Residents.map((resident) => ({
      id: resident.residentId,
      phone: resident.phonenumber,
      idCard: resident.idcard,
      fullname: resident.User ? resident.User.fullname : null
    }))

    const vehicle = await Vehicle.findOne({
      where: { residentId: residentId }
    })

    const response = {
      apartment: {
        id: filteredApartments[0].apartmentId,
        number: filteredApartments[0].apartmentNumber,
        type: filteredApartments[0].apartmentType,
        residents: residents
      },
      floor: {
        id: floor[0].floorId,
        number: floor[0].floorNumber
      },
      building: {
        id: building[0].buildingId,
        name: building[0].buildingName,
        address: building[0].buildingAddress
      },
      vehicle: vehicle
        ? {
            id: vehicle.vehicleId,
            number: vehicle.vehicleNumber,
            type: vehicle.vehicleType
          }
        : null
    }

    return response
  } catch (error) {
    console.error(error)
    throw new Error('Lỗi máy chủ nội bộ')
  }
}

module.exports = getResidentApartmentInfo
