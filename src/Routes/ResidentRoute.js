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
  forgotPassword
} = require('../Controller/ResidentController')
const { upload } = require('../AWS/s3')
const limiter = require('../Middleware/limiter')

router.post('/login', loginResident)
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

module.exports = router
