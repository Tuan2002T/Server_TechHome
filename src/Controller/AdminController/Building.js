const { Building } = require("../../Model/ModelDefinition")

const getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.findAll()
        res.status(200).json({ buildings })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }

}

const getBuildingById = async (req, res) => {
    try {
        const buildingId = req.params.id
        const building = await Building.findOne({
            where: { buildingId }
        })

        if (!building) {
            return res.status(400).json({ message: 'Building not found' })
        }

        res.status(200).json({ building })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const createBuilding = async (req, res) => {
    try {
        const { buildingName, buildingAddress } = req.body

        if (!buildingName || !buildingAddress) {
            return res.status(400).json({ message: 'Building name and address is required' })
        }

        const newBuilding = {
            buildingName,
            buildingAddress
        }

        await Building.create(newBuilding)
        res.status(201).json({ message: 'Building created' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const updateBuilding = async (req, res) => {
    try {
        const buildingId = req.params.id
        const { buildingName, buildingAddress } = req.body

        const building = await Building.findOne({
            where: { buildingId }
        })

        if (!building) {
            return res.status(400).json({ message: 'Building not found' })
        }

        const updatedBuilding = {
            buildingName,
            buildingAddress
        }

        await Building.update(updatedBuilding, {
            where: { buildingId }
        })

        res.status(200).json({ message: 'Building updated' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteBuilding = async (req, res) => {
    try {
        const buildingId = req.params.id

        const building = await Building.findOne({
            where: { buildingId }
        })

        if (!building) {
            return res.status(400).json({ message: 'Building not found' })
        }

        await Building.destroy({
            where: { buildingId }
        })

        res.status(200).json({ message: 'Building deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    getAllBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
}