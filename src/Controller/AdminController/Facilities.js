const { Facility } = require('../../Model/ModelDefinition')

const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.findAll()
    res.status(200).json({ data: facilities })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getFacilityById = async (req, res) => {
  try {
    const facilityId = req.params.id
    const facility = await Facility.findOne({
      where: { facilityId }
    })

    if (!facility) {
      return res.status(400).json({ message: 'Facility not found' })
    }

    res.status(200).json(facility)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createFacility = async (req, res) => {
  try {
    const { facilityName, facilityPrice, buildingId } = req.body

    if (!facilityName || !facilityPrice || !buildingId) {
      return res
        .status(400)
        .json({ message: 'Facility name, price and buildingId is required' })
    }

    const newFacility = {
      facilityName,
      facilityPrice,
      buildingId
    }

    await Facility.create(newFacility)
    res.status(201).json({ message: 'Facility created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateFacility = async (req, res) => {
  try {
    const facilityId = req.params.id
    const { facilityName, facilityPrice, buildingId } = req.body

    const facility = await Facility.findOne({
      where: { facilityId }
    })

    if (!facility) {
      return res.status(400).json({ message: 'Facility not found' })
    }

    await Facility.update(
      {
        facilityName,
        facilityPrice,
        buildingId
      },
      {
        where: { facilityId }
      }
    )

    res.status(200).json({ message: 'Facility updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// remove facility
const removeFacility = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { id } = req.params
    const facilityId = id
    const facility = await Facility.findOne({ where: { facilityId } })
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' })
    }

    await Facility.destroy({ where: { facilityId } })
    res.status(200).json({ message: 'Facility removed' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  removeFacility
}
