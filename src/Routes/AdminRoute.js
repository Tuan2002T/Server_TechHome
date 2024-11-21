const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const {
  loginAdmin,
  signIn,
  getCurrentAdmin,
  getAdminById,
  updateAdmin
} = require('../Controller/AdminController')
const {
  getAllBuildings,
  getBuildingDetail,
  buildingDetail2,
  getBuildingById,
  createBuilding,
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
router.post('/sign-in', signIn)
router.get('/current', auth, getCurrentAdmin)
router.get('/:id', auth, getAdminById)
router.put('/update', auth, upload.single('file'), updateAdmin)

// manage building
router.get('/building/getAll', auth, getAllBuildings)
router.get('/building/detail', auth, getBuildingDetail)
router.get('/building/detail-include-apartment', auth, buildingDetail2)
router.get('/building/:id', auth, getBuildingById)
router.post('/building', auth, createBuilding)
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

module.exports = router
