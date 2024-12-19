const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')
const {
  getAllAdvertisements,
  getAdvertisementById,
  createAdvertisement,
  deleteAdvertisement,
  updateAdvertisement,
  updateAdvertisementAdmin
} = require('../Controller/Advertisement/Advertisement')
const { upload } = require('../AWS/s3')
const {
  getAllOutsourcingServices,
  getOutsourcingServiceById,
  createOutsourcingService,
  updateOutsourcingService,
  deleteOutsourcingService,
  updateOutsourcingServiceAdmin
} = require('../Controller/OutsourcingService/OutsourcingService')
const { registerServiceProvider } = require('../Controller/SERVICEPROVIDER/ServiceProvider')

//Advertisement routes
router.get('/getAllAdvertisements', auth, getAllAdvertisements)
router.get('/getAdvertisementById/:id', auth, getAdvertisementById)
router.post(
  '/createAdvertisement',
  auth,
  upload.single('file'),
  createAdvertisement
)
router.put(
  '/updateAdvertisement/:id',
  auth,
  upload.single('file'),
  updateAdvertisement
)
router.delete('/deleteAdvertisement/:id', auth, deleteAdvertisement)
router.put(
  '/updateAdvertisementAdmin/:id',
  auth,
  upload.single('file'),
  updateAdvertisementAdmin
)

//Outsourcing service routes
router.get('/getAllOutsourcingServices', auth, getAllOutsourcingServices)
router.get('/getOutsourcingServiceById/:id', auth, getOutsourcingServiceById)
router.post(
  '/createOutsourcingService',
  auth,
  upload.single('file'),
  createOutsourcingService
)
router.put(
  '/updateOutsourcingService/:id',
  auth,
  upload.single('file'),
  updateOutsourcingService
)
router.delete('/deleteOutsourcingService/:id', auth, deleteOutsourcingService)
router.put(
  '/updateOutsourcingServiceAdmin/:id',
  auth,
  upload.single('file'),
  updateOutsourcingServiceAdmin
)

router.post('/registerServiceProvider', auth, registerServiceProvider)

module.exports = router
