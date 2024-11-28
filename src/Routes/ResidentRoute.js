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
  getAllComplaints,
  sendComplaint,
  getAllBuidlingsAndFloorsAndApartments,
  deleteComplaint
} = require('../Controller/ResidentController/Complaints')
const {
  getAllBuildingServices
} = require('../Controller/ResidentController/Service')
const {
  getAllBills,
  createBill
} = require('../Controller/ResidentController/Bills')
const {
  createPayment,
  paymentWebhook,
  cancelledPayment
} = require('../Controller/ResidentController/Payment')
const { refreshToken } = require('../Controller/RefreshToken')

router.post('/login', loginResident)
router.post('/refreshToken', refreshToken)
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
router.get('/getAllBuildingServices', auth, getAllBuildingServices)
router.post('/sendComplaint', auth, sendComplaint)
router.get(
  '/getAllBuidlingsAndFloorsAndApartments',
  auth,
  getAllBuidlingsAndFloorsAndApartments
)
router.delete('/deleteComplaint/:id', auth, deleteComplaint)

router.get('/getAllBills', auth, getAllBills)
router.post('/createBill', auth, createBill)
router.post('/cancelledPayment', auth, cancelledPayment)

router.post('/createPayment', auth, createPayment)
router.post('/paymentWebhook', paymentWebhook)

module.exports = router
