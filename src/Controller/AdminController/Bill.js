const { Bill } = require('../../Model/ModelDefinition')

const getBills = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const bills = await Bill.findAll()
    res.status(200).json({ data: bills })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getBills }
