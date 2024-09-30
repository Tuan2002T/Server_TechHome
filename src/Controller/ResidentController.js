const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Resident } = require('../Model/ModelDefinition')
const { Op } = require('sequelize')

const jwtToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const activeResident = async (req, res) => {
  try {
    const { email, fullname, idcard, phonenumber, username, password } =
      req.body

    if (
      !email &&
      !idcard &&
      !phonenumber &&
      !username &&
      !password &&
      !fullname
    ) {
      return res.status(400).json({
        message:
          'Email, ID card, fullname, password or phone number is required'
      })
    }

    const conditions = []
    if (email) conditions.push({ email })
    if (username) conditions.push({ username })

    const user = await User.findOne({
      where: { [Op.or]: conditions }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const conditionsResident = []

    if (idcard) conditionsResident.push({ idcard })
    if (phonenumber) conditionsResident.push({ phonenumber })

    const resident = await Resident.findOne({
      where: { [Op.or]: conditionsResident }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    if (resident.userId !== user.userId) {
      return res.status(400).json({ message: 'Invalid resident' })
    }

    await User.update(conditions, { where: { userId: user.userId } })
    conditionsResident.push({ active: 'active' })
    await Resident.update(conditionsResident, {
      where: { residentId: resident.residentId }
    })

    res.status(200).json({ message: 'Resident activated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginResident = async (req, res) => {
  try {
    const { username, password, email, phonenumber, idcard } = req.body

    if ((!username && !email && !phonenumber && !idcard) || !password) {
      return res.status(400).json({
        message: 'Username/email/phonenumber/idcard and password are required'
      })
    }

    const whereCondition = {}

    if (username) whereCondition.username = username
    if (email) whereCondition.email = email

    const user = await User.findOne({
      where: {
        [Op.or]: [whereCondition]
      }
    })

    const whereConditionResident = {}
    if (idcard) whereConditionResident.idcard = idcard
    if (phonenumber) whereConditionResident.phonenumber = phonenumber

    const resident = await Resident.findOne({
      [Op.or]: [whereConditionResident]
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwtToken(user.userId)

    res.status(200).json({ user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { loginResident, activeResident }
