const {
  Floor,
  Building,
  Apartment,
  Resident,
  sequelize
} = require('../../Model/ModelDefinition')

const getAllFloors = async (req, res) => {
  try {
    // Get all floors with associated building data
    const floors = await Floor.findAll({
      include: [
        {
          model: Building,
          attributes: ['buildingName']
        },
        {
          model: Apartment,
          attributes: ['apartmentId'],
          include: [
            {
              model: Resident,
              through: {
                attributes: []
              }
            }
          ]
        }
      ],
      order: [['floorId', 'ASC']]
    })

    // Transform the data to include total residents
    const formattedFloors = floors.map((floor) => {
      // Count total unique residents across all apartments on this floor
      const uniqueResidents = new Set()
      floor.Apartments.forEach((apartment) => {
        apartment.Residents.forEach((resident) => {
          uniqueResidents.add(resident.residentId)
        })
      })

      return {
        floorId: floor.floorId,
        floorNumber: floor.floorNumber,
        buildingId: floor.buildingId,
        buildingName: floor.Building ? floor.Building.buildingName : null,
        totalResidents: uniqueResidents.size,
        createdAt: floor.createdAt,
        updatedAt: floor.updatedAt
      }
    })

    res.status(200).json({ status: true, data: formattedFloors })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getFloorById = async (req, res) => {
  try {
    const floorId = req.params.id
    const floor = await Floor.findOne({
      where: { floorId }
    })

    if (!floor) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    res.status(200).json(floor)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createFloor = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { floorNumber, buildingId } = req.body

    if (!floorNumber || !buildingId) {
      return res
        .status(400)
        .json({ message: 'Floor name and buildingId is required' })
    }

    const newFloor = {
      floorNumber,
      buildingId
    }

    await Floor.create(newFloor)
    res.status(201).json({ message: 'Floor created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateFloor = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const floorId = req.params.id
    const { floorNumber, buildingId } = req.body

    const floor = await Floor.findOne({
      where: { floorId }
    })

    if (!floor) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    const updatedFloor = {
      floorNumber,
      buildingId
    }

    await Floor.update(updatedFloor, {
      where: { floorId }
    })

    res.status(200).json({ message: 'Floor updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getApartmentByFloorId = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const floorId = req.params.id
    const floor = await Floor.findOne({
      where: { floorId }
    })

    if (!floor) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    const apartments = await floor.getApartments()
    res.status(200).json({ status: true, data: apartments })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteFloor = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const floorId = req.params.id

    const floor = await Floor.findOne({
      where: { floorId }
    })

    if (!floor) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    await Floor.destroy({
      where: { floorId }
    })

    res.status(200).json({ message: 'Floor deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllFloors,
  getFloorById,
  createFloor,
  updateFloor,
  getApartmentByFloorId,
  deleteFloor
}
