const { uploadToS3, bucketName } = require('../../AWS/s3')
const {
  OutsourcingService,
  Resident,
  User
} = require('../../Model/ModelDefinition')

const getAllOutsourcingServices = async (req, res) => {
  try {
    const outsourcingServices = await OutsourcingService.findAll()
    return res.status(200).json({ data: outsourcingServices })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getOutsourcingServiceById = async (req, res) => {
  try {
    const outsourcingService = await OutsourcingService.findByPk(req.params.id)
    if (!outsourcingService) {
      return res.status(404).json({ message: 'Outsourcing service not found' })
    }

    // get resident information
    const resident = await Resident.findOne({
      where: {
        residentId: outsourcingService.residentId
      }
    })

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' })
    }

    // get user information
    const user = await User.findOne({
      where: {
        userId: resident.userId
      }
    })

    // format response
    const outsourcingServiceData = {
      outsourcingServiceId: outsourcingService.outsourcingServiceId,
      outsourcingServiceName: outsourcingService.outsourcingServiceName,
      outsourcingServiceDescription:
        outsourcingService.outsourcingServiceDescription,
      outsourceServicePrice: outsourcingService.outsourceServicePrice,
      outsourceServiceLocation: outsourcingService.outsourceServiceLocation,
      outsourcingServiceType: outsourcingService.outsourcingServiceType,
      outsourcingServiceImage: outsourcingService.outsourcingServiceImage,
      outsourcingServiceStatus: outsourcingService.outsourcingServiceStatus,
      createdAt: outsourcingService.createdAt,
      updatedAt: outsourcingService.updatedAt,
      fullname: user.fullname,
      avatar: user.avatar,
      email: user.email,
      phonenumber: resident.phonenumber
    }

    return res.status(200).json({ data: outsourcingServiceData })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createOutsourcingService = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res
        .status(403)
        .json({ message: 'Access denied. ServiceProvider only.' })
    }

    const serviceProvider = await Resident.findOne({
      where: {
        residentId: req.resident.residentId
      }
    })

    if (!serviceProvider || serviceProvider.role !== 'SERVICEPROVIDER') {
      return res.status(404).json({ message: 'Service provider not found' })
    }

    const {
      outsourcingServiceName,
      outsourcingServiceDescription,
      outsourceServicePrice,
      outsourceServiceLocation,
      outsourcingServiceType
    } = req.body

    const outsourcingServiceImage = req.file
    if (
      !outsourcingServiceName ||
      !outsourcingServiceDescription ||
      !outsourceServicePrice ||
      !outsourcingServiceImage ||
      !outsourceServiceLocation
    ) {
      return res.status(400).json({
        message: 'Service name, description and price are required'
      })
    }
    const img = await uploadToS3(
      outsourcingServiceImage,
      bucketName,
      'outsourcingServiceImage/'
    )
    const outsourcingService = await OutsourcingService.create({
      outsourcingServiceName,
      outsourcingServiceDescription,
      outsourcingServiceImage: img,
      outsourceServicePrice,
      outsourceServiceLocation,
      residentId: req.resident.residentId,
      outsourcingServiceType: outsourcingServiceType || 'FOOD'
    })

    return res.status(201).json(outsourcingService)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateOutsourcingService = async (req, res) => {
  try {
    const outsourcingServiceId = req.params.id

    const {
      outsourcingServiceName,
      outsourcingServiceDescription,
      outsourceServicePrice,
      outsourceServiceLocation,
      outsourcingServiceType
    } = req.body

    const outsourcingServiceImage = req.file

    const outsourcingService = await OutsourcingService.findOne({
      where: {
        outsourcingServiceId
      }
    })

    if (!outsourcingService) {
      return res.status(404).json({ message: 'Outsourcing service not found' })
    }

    const updateData = {}

    if (outsourcingServiceImage) {
      const img = await uploadToS3(
        outsourcingServiceImage,
        bucketName,
        'outsourcingServiceImage/'
      )
      updateData.outsourcingServiceImage = img
    }

    if (outsourcingServiceName) {
      updateData.outsourcingServiceName = outsourcingServiceName
    }

    if (outsourcingServiceDescription) {
      updateData.outsourcingServiceDescription = outsourcingServiceDescription
    }

    if (outsourceServicePrice) {
      updateData.outsourceServicePrice = outsourceServicePrice
    }

    if (outsourceServiceLocation) {
      updateData.outsourceServiceLocation = outsourceServiceLocation
    }

    if (outsourcingServiceType) {
      updateData.outsourcingServiceType = outsourcingServiceType
    }

    await OutsourcingService.update(updateData, {
      where: {
        outsourcingServiceId
      }
    })

    const updatedOutsourcingService = await OutsourcingService.findOne({
      where: { outsourcingServiceId }
    })

    return res.status(200).json(updatedOutsourcingService)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteOutsourcingService = async (req, res) => {
  try {
    const outsourcingServiceId = req.params.id

    const outsourcingService = await OutsourcingService.findOne({
      where: {
        outsourcingServiceId
      }
    })

    if (!outsourcingService) {
      return res.status(404).json({ message: 'Outsourcing service not found' })
    }

    await outsourcingService.destroy()

    return res.status(200).json({ message: 'Outsourcing service deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateOutsourcingServiceAdmin = async (req, res) => {
  try {
    const outsourcingServiceId = req.params.id

    const {
      outsourcingServiceName,
      outsourcingServiceDescription,
      outsourceServicePrice,
      outsourceServiceLocation,
      outsourcingServiceType,
      outsourcingServiceStatus
    } = req.body

    const outsourcingServiceImage = req.file

    const outsourcingService = await OutsourcingService.findOne({
      where: {
        outsourcingServiceId
      }
    })

    if (!outsourcingService) {
      return res.status(404).json({ message: 'Outsourcing service not found' })
    }

    const updateData = {}

    if (outsourcingServiceImage) {
      const img = await uploadToS3(
        outsourcingServiceImage,
        bucketName,
        'outsourcingServiceImage/'
      )
      updateData.outsourcingServiceImage = img
    }

    if (outsourcingServiceName) {
      updateData.outsourcingServiceName = outsourcingServiceName
    }

    if (outsourcingServiceDescription) {
      updateData.outsourcingServiceDescription = outsourcingServiceDescription
    }

    if (outsourceServicePrice) {
      updateData.outsourceServicePrice = outsourceServicePrice
    }

    if (outsourceServiceLocation) {
      updateData.outsourceServiceLocation = outsourceServiceLocation
    }

    if (outsourcingServiceType) {
      updateData.outsourcingServiceType = outsourcingServiceType
    }

    if (outsourcingServiceStatus) {
      updateData.outsourcingServiceStatus = outsourcingServiceStatus
    }

    await OutsourcingService.update(updateData, {
      where: {
        outsourcingServiceId
      }
    })

    const updatedOutsourcingService = await OutsourcingService.findOne({
      where: { outsourcingServiceId }
    })

    return res.status(200).json(updatedOutsourcingService)
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllOutsourcingServices,
  getOutsourcingServiceById,
  createOutsourcingService,
  updateOutsourcingService,
  deleteOutsourcingService,
  updateOutsourcingServiceAdmin
}
