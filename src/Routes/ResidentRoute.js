const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const {
  loginResident,
  updateResident,
  readToken,
  getResidentNoActiveByIdcard,
  activeResident,
  sentOTPHandler,
  verifyOTP,
  forgotPassword,

  getResidentApartmentInfo,
  updateTokenFCM
} = require('../Controller/ResidentController')
const { upload } = require('../AWS/s3')
const limiter = require('../Middleware/limiter')
const {
  bookingService,
  cancelBooking,
  getAllServiceBooking
} = require('../Controller/ResidentController/BookingService')
const {
  getAllNotifications,
  readNotification,
  readAllNotifications
} = require('../Controller/ResidentController/Notification')
const {
  getAllComplaints
} = require('../Controller/ResidentController/Complaints')

router.post('/login', loginResident)
router.put('/updateTokenFCM', auth, updateTokenFCM)
router.put('/update', auth, upload.single('file'), updateResident)
router.get('/readToken', auth, readToken)
router.get(
  '/getResidentNoActiveByIdcard/:idcard',
  limiter,
  getResidentNoActiveByIdcard
)
router.put('/active', limiter, activeResident)
router.post('/sendOTP', limiter, sentOTPHandler)
router.post('/verifyOTP', limiter, verifyOTP)
router.put('/forgotPassword', limiter, forgotPassword)
router.get('/getResidentApartmentInfo', auth, getResidentApartmentInfo)

router.post('/bookingService/:id', auth, bookingService)
router.put('/cancelBooking/:bookingId', auth, cancelBooking)
router.get('/getAllServiceBooking', auth, getAllServiceBooking)

router.get('/getAllNotifications', auth, getAllNotifications)
router.put('/readNotification/:notificationId', auth, readNotification)
router.put('/readAllNotification', auth, readAllNotifications)

router.get('/getAllComplaints', auth, getAllComplaints)

module.exports = router
