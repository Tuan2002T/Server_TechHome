const express = require('express')
const router = express.Router()

const { registerAdmin, loginAdmin, registerResident } = require('../Controller/AdminController')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/registerResident/:adminId', registerResident)

module.exports = router
