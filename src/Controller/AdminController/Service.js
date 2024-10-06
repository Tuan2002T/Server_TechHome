const { Service, Building } = require('../../Model/ModelDefinition')

const getAllServices = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const services = await Service.findAll()
    res.status(200).json(services)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getServiceById = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const serviceId = req.params.id
    const service = await Service.findOne({
      where: { serviceId }
    })

    if (!service) {
      return res.status(400).json({ message: 'Service not found' })
    }

    res.status(200).json(service)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createService = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const { serviceName, servicePrice, buildingId } = req.body

    if (!serviceName || !servicePrice || !buildingId) {
      return res
        .status(400)
        .json({ message: 'Service name, price and buildingId is required' })
    }

    const building = await Building.findOne({
      where: { buildingId }
    })

    if (!building) {
      return res.status(400).json({ message: 'Building not found' })
    }

    const newService = {
      serviceName,
      servicePrice,
      buildingId
    }

    await Service.create(newService)
    res.status(201).json({ message: 'Service created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateService = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const serviceId = req.params.id
    const { serviceName, servicePrice } = req.body

    const service = await Service.findOne({
      where: { serviceId }
    })

    if (!service) {
      return res.status(400).json({ message: 'Service not found' })
    }

    const updateService = {
      serviceName,
      servicePrice
    }

    await Service.update(updateService, {
      where: { serviceId }
    })

    res.status(200).json({ message: 'Service updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteService = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const serviceId = req.params.id

    const service = await Service.findOne({
      where: { serviceId }
    })

    if (!service) {
      return res.status(400).json({ message: 'Service not found' })
    }

    await Service.destroy({
      where: { serviceId }
    })

    res.status(200).json({ message: 'Service deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
}
