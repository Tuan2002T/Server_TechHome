const {
  Complaint,
  Building,
  Apartment,
  Floor
} = require('../../Model/ModelDefinition')

const getAllComplaints = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    console.log(req.resident.residentId)

    const complaints = await Complaint.findAll({
      where: { residentId: req.resident.residentId }
    })
    res.status(200).json(complaints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const sendComplaint = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const {
      complaintTitle,
      complaintDescription,
      buildingId,
      floorId,
      apartmentId
    } = req.body

    if (!complaintTitle || !complaintDescription) {
      return res
        .status(400)
        .json({ message: 'Complaint title and description are required' })
    }

    if (buildingId) {
      const building = await Building.findByPk(buildingId)
      if (!building) {
        return res.status(404).json({ message: 'Building not found' })
      }
    }

    if (floorId) {
      const floor = await Floor.findByPk(floorId)
      if (!floor) {
        return res.status(404).json({ message: 'Floor not found' })
      }
    }

    if (apartmentId) {
      const apartment = await Apartment.findByPk(apartmentId)
      if (!apartment) {
        return res.status(404).json({ message: 'Apartment not found' })
      }
    }

    const complaint = await Complaint.create({
      complaintTitle,
      complaintDescription,
      complaintDate: new Date(),
      buildingId: buildingId || null,
      floorId: floorId || null,
      apartmentId: apartmentId || null,
      residentId: req.resident.residentId
    })

    res.status(201).json(complaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComplaint = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const complaintId = req.params.id

    const complaint = await Complaint.findOne({
      where: { complaintId, residentId: req.resident.residentId }
    })

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    await complaint.destroy()
    res.status(202).json({ message: 'Complaint deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllBuidlingsAndFloorsAndApartments = async (req, res) => {
  try {
    const buildings = await Building.findAll()
    const floors = await Floor.findAll()
    const apartments = await Apartment.findAll()
    res.status(200).json({ buildings, floors, apartments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getBuildings = async (req, res) => {
  try {
    const building = await Building.findAll()
    console.log(building)

    res.status(200).json(building)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getFloorsByBuildingId = async (req, res) => {
  try {
    const buildingId = req.params.id
    const floors = await Floor.findAll({ where: { buildingId } })
    res.status(200).json(floors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getApartmentsByFloorId = async (req, res) => {
  try {
    const floorId = req.params.id
    const apartments = await Apartment.findAll({ where: { floorId } })
    res.status(200).json(apartments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllComplaints,
  sendComplaint,
  deleteComplaint,
  getAllBuidlingsAndFloorsAndApartments,
  getBuildings,
  getFloorsByBuildingId,
  getApartmentsByFloorId
}
