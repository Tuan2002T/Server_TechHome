const { Resident, Advertisement, Roles, User, sequelize } = require('../../Model/ModelDefinition')

const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = Resident.findAll({
      where: {
        role: 'SERVICEPROVIDER'
      }
    })

    return res.status(200).json({ serviceProviders: serviceProviders })
  } catch (error) {}
}

const registerServiceProvider = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { fullname, idcard, phonenumber, email } = req.body

    if (!fullname || !idcard) {
      return res
        .status(400)
        .json({ message: 'Full name and ID card are required' })
    }

    if (idcard.length !== 12) {
      return res.status(400).json({ message: 'ID card must be 12 characters' })
    }

    // Optional: Validate phone and email if they are provided
    if (phonenumber && !/^\d{10}$/.test(phonenumber)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' })
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const username = fullname.toLowerCase().replace(/\s/g, '') + Date.now()

    const role = await Roles.findOne({
      where: { roleId: 2 },
      transaction: t
    })

    if (!role) {
      return res.status(400).json({ message: 'Role not found' })
    }

    const existingUser = await User.findOne({
      where: { username },
      transaction: t
    })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    const existingResident = await Resident.findOne({
      where: { idcard },
      transaction: t
    })
    if (existingResident) {
      return res.status(400).json({ message: 'ID card already exists' })
    }

    const newUser = await User.create(
      { fullname, username, email, roleId: role.roleId },
      { transaction: t }
    )
    const roleProvider = "SERVICEPROVIDER"
    const newResident = await Resident.create(
      { userId: newUser.userId, idcard, phonenumber, email, role: roleProvider },
      { transaction: t }
    )


    await t.commit() // Commit transaction if everything is successful

    res.status(201).json({
      message: 'Resident created successfully',
      data: { fullname, username, idcard, phonenumber, email } // Ensure correct response data
    })
  } catch (error) {
    // Only rollback if transaction is still pending
    if (t.finished !== 'commit' && t.finished !== 'rollback') {
      await t.rollback() // Rollback transaction if there's an error
    }
    console.error('Error in registerResident:', error.message, error.stack)

    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message })
  }
}

module.exports = {
  getAllServiceProviders,
  registerServiceProvider
}
