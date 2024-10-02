const { Op } = require('sequelize')
const { Resident, User } = require('../../Model/ModelDefinition')

const getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.findAll({
      include: [
        {
          model: User,
          where: { roleId: { [Op.ne]: 1 } },
          attributes: { exclude: ['password'] }
        }
      ]
    })

    res.status(200).json({ residents })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getResidentById = async (req, res) => {
  try {
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

    res.status(200).json({ resident })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getAllResidents, getResidentById }
