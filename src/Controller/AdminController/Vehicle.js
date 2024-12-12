const { Vehicle, Resident } = require('../../Model/ModelDefinition')

const getVehicles = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const services = await Vehicle.findAll()
    res.status(200).json({ data: services })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// delete vehicle

const deleteVehicle = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const vehicle = await Vehicle.findByPk(req.params.id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    await vehicle.destroy()
    res.status(200).json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// update vehicle

const updateVehicle = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const vehicle = await Vehicle.findByPk(req.params.id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }

    await vehicle.update(req.body)
    res.status(200).json({ message: 'Vehicle updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// add vehicle

const addVehicle = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { vehicleNumber, vehicleType, residentId } = req.body

    // Validate required fields
    if (!vehicleNumber || !vehicleType || !residentId) {
      return res.status(400).json({
        message: 'Vehicle number, type, and resident ID are required'
      })
    }

    // Check if resident exists
    const resident = await Resident.findByPk(residentId)
    if (!resident) {
      return res.status(404).json({
        message: `Resident with ID ${residentId} not found`
      })
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      vehicleNumber,
      vehicleType,
      residentId
    })

    res.status(201).json({
      message: 'Vehicle added successfully',
      data: vehicle
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Invalid resident ID provided'
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getVehicles, addVehicle, updateVehicle, deleteVehicle }
