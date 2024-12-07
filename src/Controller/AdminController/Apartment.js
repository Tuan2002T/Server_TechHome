const {
  Apartment,
  Floor,
  Building,
  Resident,
  User
} = require('../../Model/ModelDefinition')

const getAllApartments = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    // Get all apartments with related data
    const apartments = await Apartment.findAll({
      include: [
        {
          model: Floor,
          include: [
            {
              model: Building,
              attributes: ['buildingName']
            }
          ],
          attributes: ['floorNumber']
        },
        {
          model: Resident,
          through: {
            attributes: [] // Exclude junction table attributes
          },
          include: [
            {
              model: User,
              attributes: ['fullname']
            }
          ],
          attributes: ['residentId']
        }
      ],
      order: [['apartmentId', 'ASC']]
    })

    // Transform the data to include only what we need
    const formattedApartments = apartments.map((apartment) => {
      return {
        apartmentId: apartment.apartmentId,
        apartmentNumber: apartment.apartmentNumber,
        apartmentType: apartment.apartmentType,
        buildingName: apartment.Floor?.Building?.buildingName || 'N/A',
        floorNumber: apartment.Floor?.floorNumber || 'N/A',
        totalResidents: apartment.Residents?.length || 0,
        residents:
          apartment.Residents?.map((resident) => ({
            residentId: resident.residentId,
            fullname: resident.User?.fullname || 'N/A'
          })) || []
      }
    })

    res.status(200).json({
      status: true,
      data: formattedApartments,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getApartmentById = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const apartmentId = req.params.id
    if (!apartmentId) {
      return res.status(400).json({ message: 'Apartment ID is required' })
    }

    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    res.status(200).json(apartment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error2' })
  }
}

const createApartment = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

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
    res.status(500).json({ message: 'Internal server error3' })
  }
}

const updateApartment = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

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
    res.status(500).json({ message: 'Internal server error4' })
  }
}

const deleteApartment = async (req, res) => {
  try {
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

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
    // Kiểm tra quyền truy cập
    if (req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Access denied. Admins only.' })
    }

    const apartmentId = req.params.id

    // Tìm căn hộ
    const apartment = await Apartment.findOne({
      where: { apartmentId }
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    // Lấy danh sách cư dân
    const apartmentResidents = await Resident.findAll({
      include: [
        {
          model: Apartment,
          where: { apartmentId },
          through: {
            attributes: []
          }
        }
      ]
    })

    if (apartmentResidents.length === 0) {
      return res.status(400).json({ message: 'No residents found' })
    }

    // Lấy thông tin người dùng cho từng cư dân
    const residents = await Promise.all(
      apartmentResidents.map(async (resident) => {
        const user = await User.findOne({
          where: { userId: resident.userId }
        })

        if (!user) {
          return {
            residentId: resident.residentId,
            fullname: null,
            username: null,
            idcard: resident.idcard,
            phonenumber: resident.phonenumber,
            email: null
          }
        }

        return {
          residentId: resident.residentId,
          fullname: user.fullname,
          avatar: user.avatar,
          username: user.username,
          idcard: resident.idcard,
          phonenumber: resident.phonenumber,
          email: user.email
        }
      })
    )

    res.status(200).json({ status: true, data: residents })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const addApartmentandResidentToApartmentDetail = async (req, res) => {
  try {
    const { apartmentId, residentId } = req.body

    if (isNaN(apartmentId) || isNaN(residentId)) {
      return res
        .status(400)
        .json({ message: 'Invalid apartmentId or residentId' })
    }

    const apartment = await Apartment.findOne({
      where: { apartmentId: apartmentId } // Đảm bảo apartmentId là số
    })

    if (!apartment) {
      return res.status(400).json({ message: 'Apartment not found' })
    }

    const resident = await Resident.findOne({
      where: { residentId: residentId } // Đảm bảo residentId là số
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    await apartment.addResident(resident) // Thêm cư dân vào căn hộ

    res.status(200).json({ message: 'Resident added to apartment' })
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
  deleteApartment,
  addApartmentandResidentToApartmentDetail
}
