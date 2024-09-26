const express = require('express')
const router = express.Router()

const {
  registerAdmin,
  loginAdmin,
  registerResident
} = require('../Controller/AdminController')
const {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding
} = require('../Controller/AdminController/Building')
const {
  getEventById,
  getAllEvents,
  createEvent,
  updateEvent
} = require('../Controller/AdminController/Event')
const {
  getAllServices,
  getServiceById,
  createService,
  updateService
} = require('../Controller/AdminController/Service')
const {
  getAllFloors,
  getFloorById,
  createFloor,
  updateFloor,
  getApartmentByFloorId
} = require('../Controller/AdminController/Floor')
const {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment
} = require('../Controller/AdminController/Apartment')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/registerResident/:adminId', registerResident)

// manage building
router.get('/building', getAllBuildings)
router.get('/building/:id', getBuildingById)
router.post('/building', createBuilding)
router.put('/building/:id', updateBuilding)

// manage event
router.get('/event', getAllEvents)
router.get('/event/:id', getEventById)
router.post('/event', createEvent)
router.put('/event/:id', updateEvent)

// manage service
router.get('/service', getAllServices)
router.get('/service/:id', getServiceById)
router.post('/service', createService)
router.put('/service/:id', updateService)

// manage floor
router.get('/floor', getAllFloors)
router.get('/floor/:id', getFloorById)
router.post('/floor', createFloor)
router.put('/floor/:id', updateFloor)
router.get('/floor/apartment/:id', getApartmentByFloorId)

// manage apartment
router.get('/apartment', getAllApartments)
router.get('/apartment/:id', getApartmentById)
router.post('/apartment', createApartment)
router.put('/apartment/:id', updateApartment)

module.exports = router
