const { Apartment } = require('../../Model/ModelDefinition')

const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.findAll()

    res.status(200).json(apartments)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getApartmentById = async (req, res) => {
  try {
    const apartmentId = req.params.id
    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    res.status(200).json(apartment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createApartment = async (req, res) => {
  try {
    const { apartmentNumber, floorId } = req.body

    if (!apartmentNumber || !floorId) {
      return res
        .status(400)
        .json({ message: 'Apartment number and floorId is required' })
    }

    const newApartment = {
      apartmentNumber,
      floorId
    }

    await Apartment.create(newApartment)
    res.status(201).json({ message: 'Apartment created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateApartment = async (req, res) => {
  try {
    const apartmentId = req.params.id
    const { apartmentNumber, floorId } = req.body

    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    const updatedApartment = {
      apartmentNumber,
      floorId
    }

    await Apartment.update(updatedApartment, {
      where: { apartmentId }
    })

    res.status(200).json({ message: 'Apartment updated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment
}
