const { Event, Building } = require('../../Model/ModelDefinition')

const getAllEvents = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const events = await Event.findAll({
      include: Building
    })

    res.status(200).json({ status: true, data: events })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id
    const event = await Event.findOne({
      where: { eventId }
    })

    if (!event) {
      return res.status(400).json({ message: 'Event not found' })
    }

    res.status(200).json(event)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      buildingId
    } = req.body

    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    if (
      !eventName ||
      !eventDate ||
      !eventLocation ||
      !eventDescription ||
      !buildingId
    ) {
      return res.status(400).json({
        message:
          'Event name, date, time, description and buildingId is required'
      })
    }

    const newEvent = {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      buildingId
    }

    await Event.create(newEvent)
    res.status(201).json({ message: 'Event created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateEvent = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const eventId = req.params.id
    const {
      eventName,
      eventDate,
      eventlocation,
      eventDescription,
      buildingId
    } = req.body

    const event = await Event.findOne({
      where: { eventId }
    })

    if (!event) {
      return res.status(400).json({ message: 'Event not found' })
    }

    await Event.update(
      {
        eventName,
        eventDate,
        eventlocation,
        eventDescription,
        buildingId
      },
      {
        where: { eventId }
      }
    )

    res.status(200).json({ message: 'Event updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteEvent = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const eventId = req.params.id

    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const event = await Event.findOne({
      where: { eventId }
    })

    if (!event) {
      return res.status(400).json({ message: 'Event not found' })
    }

    await Event.destroy({
      where: { eventId }
    })

    res.status(200).json({ message: 'Event deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
}
