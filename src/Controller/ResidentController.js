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
    const { email, idcard, phonenumber, username, pa } = req.body

    if (!email && !idcard && !phonenumber && !username) {
      return res
        .status(400)
        .json({ message: 'Email, ID card or phone number is required' })
    }

    const conditions = []
    if (email) conditions.push({ email })
    if (idcard) conditions.push({ idcard })
    if (phonenumber) conditions.push({ phonenumber })

    const user = await User.findOne({
      where: { [Op.or]: conditions }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const token = jwtToken(user.userId)
    res.status(200).json({ user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginResident = async (req, res) => {
  try {
    const { email, idcard, phonenumber, password } = req.body

    if (!email && !idcard && !phonenumber) {
      return res
        .status(400)
        .json({ message: 'Email, ID card or phone number is required' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    if (phonenumber && !validator.isMobilePhone(phonenumber, 'vi-VN')) {
      return res.status(400).json({ message: 'Invalid phone number' })
    }

    const conditions = []
    if (email) conditions.push({ email })
    if (idcard) conditions.push({ idcard })
    if (phonenumber) conditions.push({ phonenumber })

    const user = await User.findOne({
      where: { [Op.or]: conditions }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const token = jwtToken(user.userId)
    res.status(200).json({ user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { loginResident }
