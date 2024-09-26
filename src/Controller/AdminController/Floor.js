const { Floor } = require("../../Model/ModelDefinition")

const getAllFloors = async (req, res) => {
    try {
        const floors = await Floor.findAll()
        res.status(200).json(floors)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const getFloorById = async (req, res) => {
    try {
        const floorId = req.params.id
        const floor = await Floor.findOne({
            where: { floorId }
        })

        if (!floor) {
            return res.status(400).json({ message: 'Floor not found' })
        }

        res.status(200).json(floor)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const createFloor = async (req, res) => {
    try {
        const { floorNumber, buildingId } = req.body

        if (!floorNumber || !buildingId) {
            return res.status(400).json({ message: 'Floor name and buildingId is required' })
        }

        const newFloor = {
            floorNumber,
            buildingId
        }

        await Floor.create(newFloor)
        res.status(201).json({ message: 'Floor created' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const updateFloor = async (req, res) => {
    try {
        const floorId = req.params.id
        const { floorNumber, buildingId } = req.body

        const floor = await Floor.findOne({
            where: { floorId }
        })

        if (!floor) {
            return res.status(400).json({ message: 'Floor not found' })
        }

        const updatedFloor = {
            floorNumber,
            buildingId
        }

        await Floor.update(updatedFloor, {
            where: { floorId }
        })

        res.status(200).json({ message: 'Floor updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const getApartmentByFloorId = async (req, res) => {
    try {
        const floorId = req.params.id
        const floor = await Floor.findOne({
            where: { floorId }
        })

        if (!floor) {
            return res.status(400).json({ message: 'Floor not found' })
        }

        const apartments = await floor.getApartments()
        res.status(200).json(apartments)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    getAllFloors,
    getFloorById,
    createFloor,
    updateFloor,
    getApartmentByFloorId
}