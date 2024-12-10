const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const {
  loginAdmin,
  authentication,
  getCurrentAdmin,
  getAdminById,
  updateAdmin
} = require('../Controller/AdminController')
const {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  newBuilding,
  updateBuilding,
  deleteBuilding
} = require('../Controller/AdminController/Building')
const {
  getEventById,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../Controller/AdminController/Event')
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../Controller/AdminController/Service')
const {
  getAllFloors,
  getFloorById,
  createFloor,
  updateFloor,
  getApartmentByFloorId,
  deleteFloor
} = require('../Controller/AdminController/Floor')
const {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  getResidentByApartmentId,
  addApartmentandResidentToApartmentDetail
} = require('../Controller/AdminController/Apartment')
const {
  getAllResidents,
  getResidentById,
  unActiveResident,
  registerResident
} = require('../Controller/AdminController/Resident')
const { getAllFacilities } = require('../Controller/AdminController/Facilities')
const { getVehicles } = require('../Controller/AdminController/Vehicle')
const {
  getNotifications
} = require('../Controller/AdminController/Notification')
const {
  getComplaints,
  addComplaint
} = require('../Controller/AdminController/Complaint')
const { getBills } = require('../Controller/AdminController/Bill')
const {
  getPayments,
  addPayment
} = require('../Controller/AdminController/Payment')

const { upload } = require('../AWS/s3')
router.get('/apartment', auth, (req, res) => {
  res.status(200).json({ message: 'Apartment endpoint is working' })
})
router.get('/building', auth, (req, res) => {
  res.status(200).json({ message: 'Building endpoint is working' })
})
router.get('/event', auth, (req, res) => {
  res.status(200).json({ message: 'Event endpoint is working' })
})
router.get('/floor', auth, (req, res) => {
  res.status(200).json({ message: 'Floor endpoint is working' })
})
router.get('/resident', auth, (req, res) => {
  res.status(200).json({ message: 'Resident endpoint is working' })
})
router.get('/service', auth, (req, res) => {
  res.status(200).json({ message: 'Service endpoint is working' })
})

router.post('/login', loginAdmin)
router.post('/authentication', authentication)
router.get('/current', auth, getCurrentAdmin)
router.get('/:id', auth, getAdminById)
router.put('/update', auth, upload.single('file'), updateAdmin)

// manage building
router.get('/building/getAll', auth, getAllBuildings)
router.get('/building/:id', auth, getBuildingById)
router.post('/building', auth, createBuilding)
 router.post('/building/new', auth, newBuilding) // create a new building with default values for floors, apartments, and residents
router.put('/building/:id', auth, updateBuilding)
router.delete('/building/:id', auth, deleteBuilding)

// manage event
router.get('/event/getAll', auth, getAllEvents)
router.get('/event/:id', auth, getEventById)
router.post('/event', auth, createEvent)
router.put('/event/:id', auth, updateEvent)
router.delete('/event/:id', auth, deleteEvent)

// manage service
router.get('/service/getAll', auth, getAllServices)
router.get('/service/:id', auth, getServiceById)
router.post('/service', auth, createService)
router.put('/service/:id', auth, updateService)
router.delete('/service/:id', auth, deleteService)

// manage floor
router.get('/floor/getAll', auth, getAllFloors)
router.get('/floor/:id', auth, getFloorById)
router.post('/floor', auth, createFloor)
router.put('/floor/:id', auth, updateFloor)
router.delete('/floor/:id', auth, deleteFloor)
router.get('/floor/apartment/:id', auth, getApartmentByFloorId)

// manage apartment
router.get('/apartment/getAll', auth, getAllApartments)
router.get('/apartment/:id', auth, getApartmentById)
router.post('/apartment', auth, createApartment)
router.put('/apartment/:id', auth, updateApartment)
router.delete('/apartment/:id', auth, deleteApartment)
router.get('/apartment/resident/:id', auth, getResidentByApartmentId)
router.put(
  '/apartment/resident/addApartmentandResidentToApartmentDetail',
  auth,
  addApartmentandResidentToApartmentDetail
)

// manage resident
router.get('/resident/getAll', auth, getAllResidents)
router.get('/resident/:id', auth, getResidentById)
router.put('/resident/:id', auth, unActiveResident)
router.post('/registerResident', auth, registerResident)

// manage facilities
router.get('/facilities/getAll', auth, getAllFacilities)

// manage vehicles
router.get('/vehicles/getAll', auth, getVehicles)

// manage notifications
router.get('/notifications/getAll', auth, getNotifications)

// manage complaints
router.get('/complaints/getAll', auth, getComplaints)
router.post('/complaints', auth, addComplaint)

// manage bills
router.get('/bills/getAll', auth, getBills)

// manage payments
router.get('/payments/getAll', auth, getPayments)
router.post('/payments', auth, addPayment)

module.exports = router
