const {
  Complaint,
  Resident,
  User,
  Building,
  Floor,
  Apartment,
  Sequelize,
  Op
} = require('../../Model/ModelDefinition')

Complaint.belongsTo(Building, { foreignKey: 'buildingId' })
Building.hasMany(Complaint, { foreignKey: 'buildingId' })

Complaint.belongsTo(Floor, { foreignKey: 'floorId' })
Floor.hasMany(Complaint, { foreignKey: 'floorId' })

Complaint.belongsTo(Apartment, { foreignKey: 'apartmentId' })
Apartment.hasMany(Complaint, { foreignKey: 'apartmentId' })

Complaint.belongsTo(Resident, { foreignKey: 'residentId' })
Resident.hasMany(Complaint, { foreignKey: 'residentId' })

Resident.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Resident, { foreignKey: 'userId' })

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [
        {
          model: Resident,
          include: [
            {
              model: User
            }
          ]
        },
        {
          model: Building
        },
        {
          model: Floor
        },
        {
          model: Apartment
        }
      ],
      order: [['complaintId', 'ASC']]
    })

    const formattedComplaints = complaints.map((complaint) => {
      const plainComplaint = complaint.get({ plain: true })
      return {
        ...plainComplaint,
        buildingName: plainComplaint.Building?.buildingName,
        floorNumber: plainComplaint.Floor?.floorNumber,
        apartmentNumber: plainComplaint.Apartment?.apartmentNumber,
        residentName: plainComplaint.Resident?.User?.fullname,
        Building: undefined,
        Floor: undefined,
        Apartment: undefined,
        Resident: undefined
      }
    })

    return res.status(200).json({
      status: true,
      data: formattedComplaints
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving complaints.' + error
    })
  }
}

const createComplaint = async (req, res) => {
  try {
    const {
      complaintTitle,
      complaintDescription,
      buildingId,
      floorId,
      apartmentId,
      residentId
    } = req.body

    // Validate required fields
    if (!complaintDescription) {
      return res.status(400).json({
        status: false,
        message: 'Complaint description is required'
      })
    }

    // Create new complaint
    const newComplaint = await Complaint.create({
      complaintTitle,
      complaintDescription,
      complaintDate: new Date(), // Set current date
      complaintStatus: 'Pending', // Default status
      buildingId,
      floorId,
      apartmentId,
      residentId
    })

    return res.status(201).json({
      status: true,
      message: 'Complaint created successfully',
      data: newComplaint
    })
  } catch (error) {
    console.error('Error creating complaint:', error)
    return res.status(500).json({
      status: false,
      message: 'An error occurred while creating the complaint'
    })
  }
}

module.exports = {
  getComplaints,
  createComplaint
}
