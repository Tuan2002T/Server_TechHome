const { Apartment, Floor, Resident } = require('../../Model/ModelDefinition')

const getAllApartments = async (req, res) => {
    try {

        const apartments = await Apartment.findAll()
        console.log('apartments');
        
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
    const { apartmentNumber, floorId, apartmentType } = req.body

    if (!apartmentNumber || !floorId || !apartmentType) {
      return res
        .status(400)
        .json({ message: 'Apartment number and floorId is required' })
    }

    const floor = await Floor.findOne({
      where: { floorId }
    })

    if (!floor) {
      return res.status(400).json({ message: 'Floor not found' })
    }

    const newApartment = {
      apartmentNumber,
      floorId,
      apartmentType
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
    const { apartmentNumber, floorId, apartmentImage } = req.body // Lấy các trường từ yêu cầu

    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    // Tạo đối tượng cập nhật
    const updatedApartment = {}

    if (apartmentNumber) {
      updatedApartment.apartmentNumber = apartmentNumber
    }

    if (floorId) {
      updatedApartment.floorId = floorId
    }

    if (apartmentImage) {
      updatedApartment.apartmentImage = apartmentImage
    }

    // Nếu không có gì để cập nhật, trả về thông báo
    if (Object.keys(updatedApartment).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
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

const deleteApartment = async (req, res) => {
  try {
    const apartmentId = req.params.id

    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    await Apartment.destroy({
      where: { apartmentId }
    })

    res.status(200).json({ message: 'Apartment deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getResidentByApartmentId = async (req, res) => {
  try {
    const apartmentId = req.params.id

    // Kiểm tra xem căn hộ có tồn tại không
    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    // Tìm tất cả cư dân thông qua bảng ResidentApartments
    const apartmentResidents = await Resident.findAll({
      include: [
        {
          model: Apartment,
          where: { apartmentId }, // Chỉ lấy cư dân của căn hộ này
          through: {
            attributes: [] // Nếu không cần thuộc tính từ bảng trung gian
          }
        }
      ]
    })

    if (apartmentResidents.length === 0) {
      return res.status(400).json({ message: 'No residents found' })
    }

    const residents = apartmentResidents.map((resident) => {
      return {
        residentId: resident.id, // Hoặc resident.residentId tùy thuộc vào định nghĩa mô hình
        userId: resident.userId,
        residentName: resident.residentName,
        idcard: resident.idcard,
        phonenumber: resident.phonenumber,
        email: resident.email
      }
    })

    res.status(200).json(residents)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  getResidentByApartmentId,
  deleteApartment
}
