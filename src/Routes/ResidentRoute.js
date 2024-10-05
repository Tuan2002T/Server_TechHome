const express = require('express')
const router = express.Router()
const auth = require('../Middleware/auth')

const {
  loginResident,
  updateResident
} = require('../Controller/ResidentController')
const { upload } = require('../AWS/s3')

router.post('/login', loginResident)
router.put('/:id',auth, upload.single('file'), updateResident)

module.exports = router
