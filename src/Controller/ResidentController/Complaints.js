const { Complaint } = require('../../Model/ModelDefinition')

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
  const { title, description } = req.body
  const newComplaint = new Complaint({
    title,
    description,
    resident: req.user.id
  })

  try {
    await newComplaint.save()
    res.status(201).json(newComplaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Complaint deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllComplaints,
  sendComplaint,
  deleteComplaint
}
