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
            SELECT COUNT(DISTINCT "Floors"."floorId")
            FROM "Floors"
            WHERE "Floors"."buildingId" = "Building"."buildingId"
          )`),
          'totalFloors'
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(DISTINCT "Apartments"."apartmentId")
            FROM "Floors"
            LEFT JOIN "Apartments" ON "Apartments"."floorId" = "Floors"."floorId"
            WHERE "Floors"."buildingId" = "Building"."buildingId"
          )`),
          'totalApartments'
        ],
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
      totalFloors: parseInt(building.dataValues.totalFloors) || 0,
      totalApartments: parseInt(building.dataValues.totalApartments) || 0,
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

// const newBuilding = async (req, res) => {
//   try {
//     const { buildingName, numOfFloor, numOfApartment } = req.body

//     // Input validation
//     if (req.user.roleId !== 1) {
//       return res.status(403).json({ message: 'Access denied. Admins only.' })
//     }

//     if (!buildingName || !numOfFloor || !numOfApartment) {
//       return res.status(400).json({
//         message:
//           'Building name, number of floors, and number of apartments are required'
//       })
//     }

//     if (numOfFloor <= 0 || numOfApartment <= 0) {
//       return res.status(400).json({
//         message: 'Number of floors and apartments must be positive numbers'
//       })
//     }

//     // Create building and get ID in one step
//     const building = await Building.create({
//       buildingName,
//       buildingAddress: '123A'
//     })

//     const buildingId = building.buildingId

//     // Prepare bulk floor creation data
//     const floorsData = Array.from({ length: numOfFloor }, (_, i) => ({
//       buildingId,
//       floorNumber: i + 1
//     }))

//     // Bulk create floors
//     const floors = await Floor.bulkCreate(floorsData)

//     // Prepare bulk apartment creation data
//     const apartmentsData = floors.flatMap((floor) =>
//       Array.from({ length: numOfApartment }, (_, j) => ({
//         floorId: floor.floorId,
//         apartmentNumber: j + 1,
//         apartmentType: 'DEFAULT'
//       }))
//     )

//     // Bulk create apartments
//     await Apartment.bulkCreate(apartmentsData)

//     return res.status(201).json({
//       status: true,
//       message: 'Building created successfully',
//       building: {
//         buildingId,
//         buildingName,
//         buildingAddress: '123A',
//         numOfFloor,
//         numOfApartment
//       }
//     })
//   } catch (error) {
//     console.error('Error creating building:', error)

//     // Handle specific database errors
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({
//         message: 'Building with this name already exists'
//       })
//     }

//     return res.status(500).json({
//       message: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     })
//   }
// }

const newBuilding = async (req, res) => {
  try {
    const { buildingName, numOfFloor, numOfApartment } = req.body

    // Input validation
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    if (!buildingName || !numOfFloor || !numOfApartment) {
      return res.status(400).json({
        message:
          'Building name, number of floors, and number of apartments are required'
      })
    }

    if (numOfFloor <= 0 || numOfApartment <= 0) {
      return res.status(400).json({
        message: 'Number of floors and apartments must be positive numbers'
      })
    }

    // Check for duplicate building name
    const existingBuilding = await Building.findOne({
      where: { buildingName }
    })

    if (existingBuilding) {
      return res.status(409).json({
        message: 'Building with this name already exists'
      })
    }

    // Create building and get ID in one step
    const building = await Building.create({
      buildingName,
      buildingAddress: '123A'
    })

    const buildingId = building.buildingId

    // Prepare bulk floor creation data
    const floorsData = Array.from({ length: numOfFloor }, (_, i) => ({
      buildingId,
      floorNumber: i + 1
    }))

    // Bulk create floors
    const floors = await Floor.bulkCreate(floorsData)

    // Prepare bulk apartment creation data
    const apartmentsData = floors.flatMap((floor) =>
      Array.from({ length: numOfApartment }, (_, j) => ({
        floorId: floor.floorId,
        apartmentNumber: j + 1,
        apartmentType: 'DEFAULT'
      }))
    )

    // Bulk create apartments
    await Apartment.bulkCreate(apartmentsData)

    return res.status(201).json({
      status: true,
      message: 'Building created successfully',
      building: {
        buildingId,
        buildingName,
        buildingAddress: '123A',
        numOfFloor,
        numOfApartment
      }
    })
  } catch (error) {
    console.error('Error creating building:', error)

    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Building with this name already exists'
      })
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// const updateBuilding = async (req, res) => {
//   try {
//     const buildingId = req.params.id
//     const { buildingName, buildingAddress } = req.body

//     if (req.user.roleId !== 1) {
//       return res.status(403).json({ message: 'Access denied. Admins only.' })
//     }

//     const building = await Building.findOne({
//       where: { buildingId }
//     })

//     if (!building) {
//       return res.status(400).json({ message: 'Building not found' })
//     }

//     const updatedBuilding = {}

//     if (buildingName && buildingName.trim() !== '') {
//       updatedBuilding.buildingName = buildingName
//     }

//     if (buildingAddress && buildingAddress.trim() !== '') {
//       updatedBuilding.buildingAddress = buildingAddress
//     }

//     if (Object.keys(updatedBuilding).length === 0) {
//       return res.status(400).json({ message: 'No fields to update' })
//     }

//     await Building.update(updatedBuilding, {
//       where: { buildingId }
//     })

//     res.status(200).json({ message: 'Building updated' })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

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
      return res.status(404).json({ message: 'Building not found' })
    }

    const updatedBuilding = {}

    // Check for duplicate building name if a new name is provided
    if (buildingName && buildingName.trim() !== '') {
      const existingBuilding = await Building.findOne({
        where: { buildingName, buildingId: { [Op.ne]: buildingId } } // Exclude the current building
      })

      if (existingBuilding) {
        return res
          .status(409)
          .json({ message: 'Building with this name already exists' })
      }

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
    console.error('Error updating building:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// const deleteBuilding = async (req, res) => {
//   try {
//     const buildingId = req.params.id

//     const building = await Building.findOne({
//       where: { buildingId }
//     })

//     if (!building) {
//       return res.status(400).json({ message: 'Building not found' })
//     }

//     await Building.destroy({
//       where: { buildingId }
//     })

//     res.status(200).json({ message: 'Building deleted' })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

const deleteBuilding = async (req, res) => {
  try {
    const buildingId = req.params.id

    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(404).json({ message: 'Building not found' })
    }

    // Xóa tất cả các tầng và căn hộ liên quan trong một transaction
    await sequelize.transaction(async (transaction) => {
      // Lấy danh sách các tầng trong tòa nhà
      const floors = await Floor.findAll({
        where: { buildingId },
        transaction
      })

      // Xóa tất cả các căn hộ liên quan đến các tầng
      const floorIds = floors.map((floor) => floor.floorId)
      await Apartment.destroy({
        where: { floorId: { [Op.in]: floorIds } },
        transaction
      })

      // Xóa các tầng
      await Floor.destroy({
        where: { buildingId },
        transaction
      })

      // Xóa tòa nhà
      await Building.destroy({
        where: { buildingId },
        transaction
      })
    })

    res.status(200).json({ message: 'Building and related data deleted' })
  } catch (error) {
    console.error('Error deleting building:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  newBuilding,
  updateBuilding,
  deleteBuilding
}
