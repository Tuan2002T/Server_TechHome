const { Op } = require('sequelize')
const {
  Apartment,
  Resident,
  User,
  Roles,
  sequelize
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
      ],
      // sort by id
      order: [['residentId', 'ASC']]
    })

    const formatData = residents.map((resident) => {
      return {
        residentId: resident.residentId,
        fullname: resident.User.fullname,
        avatar: resident.User.avatar,
        username: resident.User.username,
        idcard: resident.idcard,
        phonenumber: resident.phonenumber,
        email: resident.User.email,
        status: resident.active
      }
    })

    res.status(200).json({ data: formatData })
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

    // get apartment of resident
    const apartments = await resident.getApartments()

    res
      .status(200)
      .json({ status: true, data: resident, apartment: apartments })
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

    // await resident.update({ active: false })

    // if resident.active is true set active to false
    if (resident.active) {
      await resident.update({ active: false })
    } else {
      await resident.update({ active: true })
    }

    // const message
    let message = resident.active ? 'Activated' : 'Deactivated'

    res.status(200).json({ status: true, data: resident, message: message })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// const registerResident = async (req, res) => {
//   const t = await sequelize.transaction() // Start transaction
//   try {
//     if (req.user.roleId !== 1) {
//       return res.status(403).json({ message: 'Access denied. Admins only.' })
//     }

//     const { fullname, idcard, apartmentId } = req.body

//     if (!fullname || !idcard) {
//       return res
//         .status(400)
//         .json({ message: 'Full name and ID card are required' })
//     }

//     if (idcard.length !== 12) {
//       return res.status(400).json({ message: 'ID card must be 12 characters' })
//     }

//     const username = fullname.toLowerCase().replace(/\s/g, '') + Date.now()

//     const role = await Roles.findOne({
//       where: { roleId: 2 },
//       transaction: t
//     })

//     if (!role) {
//       return res.status(400).json({ message: 'Role not found' })
//     }

//     const existingUser = await User.findOne({
//       where: { username },
//       transaction: t
//     })
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' })
//     }

//     const existingResident = await Resident.findOne({
//       where: { idcard },
//       transaction: t
//     })
//     if (existingResident) {
//       return res.status(400).json({ message: 'ID card already exists' })
//     }

//     const newUser = await User.create(
//       { fullname, username, roleId: role.roleId },
//       { transaction: t }
//     )

//     const newResident = await Resident.create(
//       { userId: newUser.userId, idcard },
//       { transaction: t }
//     )

//     // If apartmentId is provided, associate the resident with the apartment
//     if (apartmentId) {
//       const existingApartment = await Apartment.findByPk(apartmentId, {
//         transaction: t
//       })
//       if (!existingApartment) {
//         return res.status(400).json({ message: 'Apartment not found' })
//       }

//       // Add the resident using the primary key or the instance of the Resident model
//       await existingApartment.addResident(newResident, { transaction: t })
//     }

//     await t.commit() // Commit transaction if everything is successful

//     res.status(201).json({
//       message: 'Resident created successfully',
//       data: { fullname, username, idcard }
//     })
//   } catch (error) {
//     await t.rollback() // Rollback transaction if there's an error
//     console.error('Error in registerResident:', error.message, error.stack)

//     res
//       .status(500)
//       .json({ error: 'Internal Server Error', details: error.message })
//   }
// }

const registerResident = async (req, res) => {
  const t = await sequelize.transaction() // Start transaction
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { fullname, idcard, apartmentId, phonenumber, email } = req.body

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

    const newResident = await Resident.create(
      { userId: newUser.userId, idcard, phonenumber, email },
      { transaction: t }
    )

    // If apartmentId is provided, associate the resident with the apartment
    if (apartmentId) {
      const existingApartment = await Apartment.findByPk(apartmentId, {
        transaction: t
      })
      if (!existingApartment) {
        return res.status(400).json({ message: 'Apartment not found' })
      }

      // Add the resident using the primary key or the instance of the Resident model
      await existingApartment.addResident(newResident, { transaction: t })
    }

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

const deleteResident = async (req, res) => {
  const t = await sequelize.transaction()

  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { id } = req.params

    // Find the resident first to verify existence
    const resident = await Resident.findOne({
      where: { residentId: id },
      transaction: t
    })

    if (!resident) {
      await t.rollback()
      return res.status(400).json({ message: 'Resident not found' })
    }

    // 1. Delete all chat associations
    await sequelize.query('DELETE FROM "ChatResident" WHERE "residentId" = ?', {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
      transaction: t
    })

    // 2. Delete all notification associations
    await sequelize.query(
      'DELETE FROM "ResidentNotifications" WHERE "residentId" = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t
      }
    )

    // 3. Delete all apartment associations with sequelize
    await sequelize.query(
      'DELETE FROM "ResidentApartments" WHERE "residentId" = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t
      }
    )

    // 4. Delete all user associations by resident (residentId) have column userId as foreign key with userId as primary key in User table
    await sequelize.query('DELETE FROM "Users" WHERE "userId" = ?', {
      replacements: [resident.userId],
      type: sequelize.QueryTypes.DELETE,
      transaction: t
    })

    await sequelize.query(
      'DELETE FROM "ServiceBookings" WHERE "residentId" = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t
      }
    )

    await sequelize.query('DELETE FROM "Bills" WHERE "residentId" = ?', {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
      transaction: t
    })

    // 5. Delete the resident
    await resident.destroy({ transaction: t })

    await t.commit()
    res.status(200).json({ message: 'Resident deleted successfully' })
  } catch (error) {
    await t.rollback()
    console.error('Error in deleteResident:', error.message, error.stack)
    res.status(500).json({ message: 'Internal server error' })
  }
}
// delete resident by idcard
const deleteResidentByIdcard = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const { idcard } = req.params

    const resident = await Resident.findOne({
      where: { idcard }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    await resident.destroy()

    res.status(200).json({ message: 'Resident deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// update resident
const updateResident = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    const { id } = req.params
    const { fullname, idcard, phonenumber, email } = req.body
    const resident = await Resident.findByPk(id)
    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }
    await resident.update({ idcard, phonenumber })
    const user = await User.findByPk(resident.userId)
    await user.update({ fullname, email })
    res.status(200).json({ message: 'Resident updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllResidents,
  getResidentById,
  unActiveResident,
  registerResident,
  deleteResident,
  deleteResidentByIdcard,
  updateResident
}
