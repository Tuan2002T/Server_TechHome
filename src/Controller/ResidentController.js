const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Resident } = require('../Model/ModelDefinition')
const { Op } = require('sequelize')
const { bucketName, uploadToS3, deleteFromS3 } = require('../AWS/s3')
const jwtToken = require('../JWT/jwt')

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
        message:
          'Username, email, phonenumber, idcard, and password are required'
      })
    }

    let user, resident

    if (username || email) {
      user = await User.findOne({
        where: {
          [Op.and]: [
            { roleId: 2 },
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
        return res
          .status(400)
          .json({ message: 'Login information is incorrect' })
      }

      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined,
            { userId: user.userId }
          ].filter(Boolean)
        }
      })

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' })
      }
    }

    if (phonenumber || idcard) {
      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined
          ].filter(Boolean)
        }
      })

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' })
      }

      user = await User.findOne({
        where: {
          [Op.and]: [{ userId: resident.userId }, { roleId: 2 }]
        }
      })

      if (!user) {
        return res
          .status(400)
          .json({ message: 'Login information is incorrect' })
      }
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const payload = { user, resident }
    const token = jwtToken(payload)

    res.status(200).json({ user, resident, token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'An internal error occurred' })
  }
}

const updateResident = async (req, res) => {
  try {
    const { user, resident } = req
    const { fullname, email, password, idcard, phonenumber, username } =
      req.body
    const avatar = req.file

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found in token' })
    }

    const residentFromDb = await Resident.findOne({
      where: { residentId: resident.residentId }
    })

    if (!residentFromDb) {
      return res.status(400).json({ message: 'Resident not found in database' })
    }

    const userFromDb = await User.findOne({
      where: { userId: residentFromDb.userId }
    })

    if (!userFromDb) {
      return res.status(400).json({ message: 'User not found in database' })
    }

    if (fullname) {
      userFromDb.fullname = fullname
    }

    if (username) {
      userFromDb.username = username
    }

    if (email) {
      userFromDb.email = email
    }

    if (password) {
      userFromDb.password = await bcrypt.hash(password, 10)
    }

    if (idcard) {
      residentFromDb.idcard = idcard
    }

    if (phonenumber) {
      residentFromDb.phonenumber = phonenumber
    }

    if (avatar) {
      if (userFromDb.avatar) {
        await deleteFromS3(userFromDb.avatar, bucketName)
      }
      const data = await uploadToS3(avatar, bucketName, 'user/')
      userFromDb.avatar = data
    }

    await userFromDb.save()
    await residentFromDb.save()

    res.status(200).json({
      resident: residentFromDb,
      user: userFromDb
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const readToken = async (req, res) => {
  try {
    // Kiểm tra xem người dùng có vai trò là admin hay resident
    if (req.user.roleId === 1) {
      // Người dùng là admin
      res.status(200).json({
        user: req.user,
        admin: req.admin,
        message: 'Admin access'
      })
    } else if (req.user.roleId === 2) {
      // Người dùng là resident
      res.status(200).json({
        user: req.user,
        resident: req.resident,
        message: 'Resident access'
      })
    } else {
      // Nếu không phải admin hoặc resident
      res.status(403).json({ message: 'Forbidden' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { loginResident, activeResident, updateResident, readToken }
