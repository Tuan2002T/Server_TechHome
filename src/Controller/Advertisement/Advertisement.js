const { uploadToS3, bucketName } = require('../../AWS/s3')
const { Advertisement, Resident } = require('../../Model/ModelDefinition')

const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.findAll()

    return res.status(200).json({ advertisements: advertisements })
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

    if (advertisement.residentId !== req.resident.residentId) {
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

    // if (advertisement.residentId !== req.resident.residentId) {
    //   return res
    //     .status(403)
    //     .json({ message: 'Access denied. Advertisement owner only.' })
    // }

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
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  updateAdvertisementAdmin
}
