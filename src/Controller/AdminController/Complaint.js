const { Complaint } = require('../../Model/ModelDefinition')

const getComplaints = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const services = await Complaint.findAll()
    res.status(200).json({ data: services })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addComplaint = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const date = new Date()

    const {
      complaintTitle,
      complaintDescription,
      buildingId,
      floorId,
      apartmentId,
      residentId
    } = req.body

    const complaint = await Complaint.create({
      complaintTitle,
      complaintDescription,
      buildingId,
      floorId,
      apartmentId,
      residentId,
      complaintDate: date,
      complaintStatus: 'Pending'
    })
    res.status(200).json({ data: complaint })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getComplaints, addComplaint }
