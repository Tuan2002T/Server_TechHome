const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const {
  loginResident,
  updateResident,
  readToken
} = require('../Controller/ResidentController')
const { upload } = require('../AWS/s3')

router.post('/login', loginResident)
router.put('/update', auth, upload.single('file'), updateResident)
router.get('/readToken', auth, readToken)

module.exports = router
