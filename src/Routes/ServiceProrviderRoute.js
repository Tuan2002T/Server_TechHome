const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')
const {
  getAllAdvertisements,
  createAdvertisement,
  deleteAdvertisement,
  updateAdvertisement,
  updateAdvertisementAdmin
} = require('../Controller/Advertisement/Advertisement')
const { upload } = require('../AWS/s3')
const {
  getAllOutsourcingServices,
  createOutsourcingService,
  updateOutsourcingService,
  deleteOutsourcingService,
  updateOutsourcingServiceAdmin
} = require('../Controller/OutsourcingService/OutsourcingService')

//Advertisement routes
router.get('/getAllAdvertisements', auth, getAllAdvertisements)
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

module.exports = router
