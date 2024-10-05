const express = require('express')
const router = express.Router()

const {
  registerAdmin,
  loginAdmin,
  registerResident,
  getAdminById,
  updateAdmin
} = require('../Controller/AdminController')
const {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
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
  updateApartment,
  deleteApartment,
  getResidentByApartmentId
} = require('../Controller/AdminController/Apartment')
const {
  getAllResidents,
  getResidentById
} = require('../Controller/AdminController/Resident')
const { updateResident } = require('../Controller/ResidentController')
const { upload } = require('../AWS/s3')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/registerResident/:adminId', registerResident)
router.get('/:id', getAdminById)
router.put('/:id',upload.single('file'), updateAdmin)

// manage building
router.get('/building/getAll', getAllBuildings)
router.get('/building/:id', getBuildingById)
router.post('/building/:adminId', createBuilding)
router.put('/building/:id', updateBuilding)
router.delete('/building/:id', deleteBuilding)

// manage event
router.get('/event/getAll', getAllEvents)
router.get('/event/:id', getEventById)
router.post('/event', createEvent)
router.put('/event/:id', updateEvent)

// manage service
router.get('/service/getAll', getAllServices)
router.get('/service/:id', getServiceById)
router.post('/service', createService)
router.put('/service/:id', updateService)

// manage floor
router.get('/floor/getAll', getAllFloors)
router.get('/floor/:id', getFloorById)
router.post('/floor', createFloor)
router.put('/floor/:id', updateFloor)

// manage apartment
router.get('/apartment/getAll', getAllApartments)
router.get('/apartment/:id', getApartmentById)
router.post('/apartment', createApartment)
router.put('/apartment/:id', updateApartment)
router.delete('/apartment/:id', deleteApartment)
router.get('/apartment/resident/:id', getResidentByApartmentId)

// manage resident
router.get('/resident/getAll', getAllResidents)
router.get('/resident/:id', getResidentById)

module.exports = router
