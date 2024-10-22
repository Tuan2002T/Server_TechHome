const { Op } = require('sequelize')
const {
  Resident,
  User,
  Roles,
  Apartment
} = require('../../Model/ModelDefinition')

const getAllResidents = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const residents = await Resident.findAll({
      include: [
        {
          model: User,
          where: { roleId: { [Op.ne]: 1 } },
          attributes: { exclude: ['password'] }
        }
      ]
    })

    res.status(200).json(residents)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getResidentById = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { id } = req.params

    const resident = await Resident.findOne({
      where: { residentId: id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        }
      ]
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    res.status(200).json(resident)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const unActiveResident = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { id } = req.params

    const resident = await Resident.findOne({
      where: { residentId: id }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    await resident.update({ active: false })

    res.status(200).json({ message: 'Resident unactivated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const registerResident = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { fullname, username, idcard, apartment } = req.body

    if (!fullname || !idcard || !username || !apartment) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const role = await Roles.findOne({
      where: { roleName: 'Resident' }
    })

    if (!role) {
      return res.status(400).json({ message: 'Role not found' })
    }

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

    const resident = await Resident.findOne({
      where: { idcard }
    })

    if (resident) {
      return res
        .status(400)
        .json({ message: 'Username or ID card already exists' })
    }

    const am = await Apartment.findOne({
      where: { aparmentId: apartment }
    })

    if (!am) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    const newUser = {
      fullname,
      username,
      roleId: role.roleId
    }

    const u = await User.create(newUser)

    await Resident.create({ userId: u.userId, idcard })

    res.status(201).json({ message: 'Resident created successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllResidents,
  getResidentById,
  unActiveResident,
  registerResident
}
