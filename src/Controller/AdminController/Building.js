const {
  Building,
  Floor,
  Apartment,
  Resident,
  sequelize
} = require('../../Model/ModelDefinition')
const { Op } = require('sequelize')

const getAllBuildings = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const buildings = await Building.findAll({
      attributes: [
        'buildingId',
        'buildingName',
        'buildingAddress',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT "Residents"."residentId")
            FROM "Floors"
            LEFT JOIN "Apartments" ON "Apartments"."floorId" = "Floors"."floorId"
            LEFT JOIN "ResidentApartments" ON "ResidentApartments"."apartmentId" = "Apartments"."apartmentId"
            LEFT JOIN "Residents" ON "Residents"."residentId" = "ResidentApartments"."residentId"
            WHERE "Floors"."buildingId" = "Building"."buildingId"
          )`),
          'totalResidents'
        ]
      ]
    })

    const formattedBuildings = buildings.map((building) => ({
      ...building.dataValues,
      totalResidents: parseInt(building.dataValues.totalResidents) || 0
    }))

    res.status(200).json({
      status: true,
      data: formattedBuildings
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getBuildingById = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const buildingId = req.params.id
    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    const floors = await building.getFloors()

    building.dataValues.floors = floors

    res.status(200).json({ status: true, data: building })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createBuilding = async (req, res) => {
  try {
    const { buildingName, buildingAddress } = req.body

    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    if (!buildingName || !buildingAddress) {
      return res
        .status(400)
        .json({ message: 'Building name and address is required' })
    }

    const newBuilding = {
      buildingName,
      buildingAddress
    }

    await Building.create(newBuilding)
    res.status(201).json({ message: 'Building created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateBuilding = async (req, res) => {
  try {
    const buildingId = req.params.id
    const { buildingName, buildingAddress } = req.body

    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(400).json({ message: 'Building not found' })
    }

    const updatedBuilding = {}

    if (buildingName && buildingName.trim() !== '') {
      updatedBuilding.buildingName = buildingName
    }

    if (buildingAddress && buildingAddress.trim() !== '') {
      updatedBuilding.buildingAddress = buildingAddress
    }

    if (Object.keys(updatedBuilding).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    await Building.update(updatedBuilding, {
      where: { buildingId }
    })

    res.status(200).json({ message: 'Building updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteBuilding = async (req, res) => {
  try {
    const buildingId = req.params.id

    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(400).json({ message: 'Building not found' })
    }

    await Building.destroy({
      where: { buildingId }
    })

    res.status(200).json({ message: 'Building deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
}
