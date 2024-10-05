const { Building, Admin } = require('../../Model/ModelDefinition')

const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll()
    res.status(200).json(buildings)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getBuildingById = async (req, res) => {
  try {
    const buildingId = req.params.id
    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(400).json({ message: 'Building not found' })
    }

    res.status(200).json( building )
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createBuilding = async (req, res) => {
  try {
    const { buildingName, buildingAddress } = req.body
    const { adminId } = req.params

    if (!buildingName || !buildingAddress || !adminId) {
      return res
        .status(400)
        .json({ message: 'Building name and address is required' })
    }

    if (isNaN(adminId)) {
      return res
        .status(400)
        .json({ message: 'Invalid adminId. It must be an integer.' })
    }

    const admin = await Admin.findOne({
      where: { adminId }
    })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
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
