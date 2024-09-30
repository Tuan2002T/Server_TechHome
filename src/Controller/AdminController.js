const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Admin, Resident, Roles } = require('../Model/ModelDefinition')
const { Op } = require('sequelize')

const jwtToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const registerAdmin = async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body

    if (!fullname || !username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }]
      }
    })

    if (user) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const adminRole = await Roles.findOne({
      where: { roleName: 'Admin' }
    })

    if (!adminRole) {
      return res.status(400).json({ message: 'Role not found' })
    }

    const newUser = {
      fullname,
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.roleId
    }

    const u = await User.create(newUser)

    await Admin.create({ userId: u.userId })

    res.status(201).json({ message: 'Admin created successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!email && !username && !password) {
      return res
        .status(400)
        .json({ message: 'Username, email or phone number is required' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' })
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

    if (user.roleId !== 1) {
      return res.status(400).json({ message: 'User is not an admin' })
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

const registerResident = async (req, res) => {
  try {
    const { fullname, username, idcard } = req.body
    const { adminId } = req.params

    // Kiểm tra xem tất cả các trường có hợp lệ không
    if (!fullname || !idcard || !username) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Kiểm tra xem admin có tồn tại không
    const admin = await Admin.findOne({
      where: { userId: adminId }
    })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
    }

    // Kiểm tra xem vai trò 'resident' có tồn tại không
    const role = await Roles.findOne({
      where: { roleName: 'resident' }
    })

    if (!role) {
      return res.status(400).json({ message: 'Role not found' })
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const user = await User.findOne({
      where: {
        username
      }
    })

    if (user) {
      return res
        .status(400)
        .json({ message: 'Username or ID card already exists' })
    }

    // Tạo người dùng mới
    const newUser = {
      fullname,
      username,
      roleId: role.roleId
    }

    const u = await User.create(newUser)

    // Tạo cư dân
    await Resident.create({ userId: u.userId, idcard })

    res.status(201).json({ message: 'Resident created successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { registerAdmin, loginAdmin, registerResident, getAdminById }
