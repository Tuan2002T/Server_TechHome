const { Event } = require('../../Model/ModelDefinition')

const getAllEvents = async (req, res) => {
  try {
    const buildingId = req.params.buildingId
    const events = await Event.findAll({
      where: {
        buildingId: buildingId
      }
    })

    res.status(200).json(events)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllEvents
}
