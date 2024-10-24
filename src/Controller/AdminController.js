const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Admin, Resident, Roles } = require('../Model/ModelDefinition')
const { Op } = require('sequelize')
const { deleteFromS3, uploadToS3, bucketName } = require('../AWS/s3')
const jwtToken = require('../JWT/jwt')

const loginAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body
    console.log(username, email, password)

    if (!email && !username && !password) {
      return res
        .status(400)
        .json({ message: 'Username, email, or password is required' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    const user = await User.findOne({
      where: {
        [Op.and]: [
          { roleId: 1 }, // Kiểm tra roleId của admin
          {
            [Op.or]: [
              username ? { username } : undefined,
              email ? { email } : undefined
            ].filter(Boolean)
          }
        ]
      }
    })

    if (!user) {
      return res.status(400).json({ status: false, message: 'User not found' })
    }

    const admin = await Admin.findOne({
      where: { userId: user.userId }
    })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const payload = { user, admin }
    console.log(payload)

    const token = jwtToken(payload)

    res
      .status(200)
      .json({ status: true, message: 'success', data: { user, admin, token } })
  } catch (error) {
    console.error('Error during admin login:', error)
    res.status(500).json({ message: 'An internal error occurred' })
  }
}

const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params

    const admin = await Admin.findOne({
      where: { userId: adminId }
    })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
    }

    const user = await User.findOne({
      where: { userId: admin.userId }
    })

    res.status(200).json({ user, admin })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateAdmin = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body
    const avatar = req.file

    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const admin = await Admin.findOne({
      where: { adminId: req.admin.adminId }
    })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ userId: req.admin.userId }]
      }
    })

    console.log(user)
    console.log(avatar)

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (fullname) {
      user.fullname = fullname
    }

    if (username) {
      user.username = username
    }

    if (email) {
      user.email = email
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    if (avatar) {
      if (user.avatar) {
        await deleteFromS3(user.avatar, bucketName)
      }

      user.avatar = await uploadToS3(avatar, bucketName, 'user/')
    }

    await user.save()
    await admin.save()

    res.status(200).json({ admin, user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  loginAdmin,
  getAdminById,
  updateAdmin
}
