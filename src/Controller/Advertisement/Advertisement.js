const { uploadToS3, bucketName } = require('../../AWS/s3')
const { Advertisement, Resident, User } = require('../../Model/ModelDefinition')

const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.findAll()

    return res.status(200).json({ data: advertisements })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getAdvertisementById = async (req, res) => {
  try {
    const a = await Advertisement.findByPk(req.params.id)
    if (!a) {
      return res.status(404).json({ message: 'Không tìm thấy quảng cáo' })
    }

    // get resident information
    const r = await Resident.findOne({
      where: {
        residentId: a.residentId
      }
    })

    if (!r) {
      return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' })
    }

    // get user information
    const u = await User.findOne({
      where: {
        userId: r.userId
      }
    })

    // format response
    const outsourcingServiceData = {
      advertisementId: a.advertisementId,
      advertisementName: a.advertisementName,
      advertisementContent: a.advertisementContent,
      adverLocation: a.adverLocation,
      advertisementImage: a.advertisementImage,
      advertisementStatus: a.advertisementStatus,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      fullname: u.fullname,
      avatar: u.avatar,
      email: u.email,
      phonenumber: r.phonenumber
    }

    return res.status(200).json({ data: outsourcingServiceData })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createAdvertisement = async (req, res) => {
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

    const { advertisementName, advertisementContent, adverLocation } = req.body
    const advertisementImage = req.file
    console.log(req.file)

    if (
      !advertisementName ||
      !advertisementContent ||
      !advertisementImage ||
      !adverLocation
    ) {
      return res.status(400).json({
        message: 'Advertisement name, content and image are required'
      })
    }

    const img = await uploadToS3(
      advertisementImage,
      bucketName,
      'advertisementImage/'
    )

    const advertisement = await Advertisement.create({
      advertisementName,
      advertisementContent,
      advertisementImage: img,
      adverLocation,
      residentId: req.resident.residentId
    })

    console.log(advertisement)

    return res.status(201).json({ advertisement: advertisement })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({
      where: {
        advertisementId: req.params.id
      }
    })

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' })
    }

    if (advertisement.residentId !== req.user.residentId) {
      return res
        .status(403)
        .json({ message: 'Access denied. Advertisement owner only.' })
    }

    const { advertisementName, advertisementContent, adverLocation } = req.body
    const advertisementImage = req.file

    if (advertisementImage) {
      const img = await uploadToS3(
        advertisementImage,
        bucketName,
        'advertisementImage/'
      )
      advertisement.advertisementImage = img
    }

    if (advertisementName) {
      advertisement.advertisementName = advertisementName
    }

    if (advertisementContent) {
      advertisement.advertisementContent = advertisementContent
    }

    if (adverLocation) {
      advertisement.adverLocation = adverLocation
    }

    // Sử dụng phương thức cập nhật đúng
    await Advertisement.update(
      {
        advertisementName: advertisement.advertisementName,
        advertisementContent: advertisement.advertisementContent,
        advertisementImage: advertisement.advertisementImage,
        adverLocation: advertisement.adverLocation
      },
      {
        where: { advertisementId: req.params.id }
      }
    )

    return res.status(200).json({ message: 'Advertisement updated' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

const deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({
      where: {
        advertisementId: req.params.id
      }
    })

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' })
    }

    if (advertisement.residentId !== req.user.residentId) {
      return res
        .status(403)
        .json({ message: 'Access denied. Advertisement owner only.' })
    }

    await advertisement.destroy()

    return res.status(200).json({ message: 'Advertisement deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateAdvertisementAdmin = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({
      where: {
        advertisementId: req.params.id
      }
    })

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' })
    }

    const {
      advertisementName,
      advertisementContent,
      adverLocation,
      advertisementStatus
    } = req.body

    const advertisementImage = req.file

    if (advertisementImage) {
      const img = await uploadToS3(
        advertisementImage,
        bucketName,
        'advertisementImage/'
      )
      advertisement.advertisementImage = img
    }

    if (advertisementName) {
      advertisement.advertisementName = advertisementName
    }

    if (advertisementContent) {
      advertisement.advertisementContent = advertisementContent
    }

    if (adverLocation) {
      advertisement.adverLocation = adverLocation
    }

    if (advertisementStatus) {
      advertisement.advertisementStatus = advertisementStatus
    }

    await advertisement.save()

    return res.status(200).json({ message: 'Advertisement updated' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllAdvertisements,
  getAdvertisementById,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  updateAdvertisementAdmin
}
