const express = require('express')
const router = express.Router()

const { loginResident } = require('../Controller/ResidentController')

router.post('/login', loginResident)

module.exports = router
