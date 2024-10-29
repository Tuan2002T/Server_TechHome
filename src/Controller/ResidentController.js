const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const {
  User,
  Resident,
  Apartment,
  Floor,
  Building,
  Vehicle
} = require('../Model/ModelDefinition')
const { Op } = require('sequelize')
const { bucketName, uploadToS3, deleteFromS3 } = require('../AWS/s3')
const jwtToken = require('../JWT/jwt')
const sendOTP = require('../OTP/sendOTP')
const redisClient = require('../Redis/redis')

const activeResident = async (req, res) => {
  try {
    const { email, fullname, idcard, phonenumber, username, password } =
      req.body

    if (
      !email &&
      !idcard &&
      !phonenumber &&
      !username &&
      !password &&
      !fullname
    ) {
      return res.status(400).json({
        message:
          'Email, ID card, fullname, password or phone number is required'
      })
    }

    const conditions = []
    if (email) conditions.push({ email })
    if (username) conditions.push({ username })

    const user = await User.findOne({
      where: { [Op.or]: conditions }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const conditionsResident = []

    if (idcard) conditionsResident.push({ idcard })
    if (phonenumber) conditionsResident.push({ phonenumber })

    const resident = await Resident.findOne({
      where: { [Op.or]: conditionsResident }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    if (resident.userId !== user.userId) {
      return res.status(400).json({ message: 'Invalid resident' })
    }

    await User.update(conditions, { where: { userId: user.userId } })
    conditionsResident.push({ active: 'active' })
    await Resident.update(conditionsResident, {
      where: { residentId: resident.residentId }
    })

    res.status(200).json({ message: 'Resident activated' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginResident = async (req, res) => {
  try {
    const { username, password, email, phonenumber, idcard } = req.body

    if ((!username && !email && !phonenumber && !idcard) || !password) {
      return res.status(400).json({
        message:
          'Username, email, phonenumber, idcard, and password are required'
      })
    }

    let user, resident

    if (username || email) {
      user = await User.findOne({
        where: {
          [Op.and]: [
            { roleId: 2 },
            {
              [Op.or]: [
                username ? { username } : undefined,
                email ? { email } : undefined
              ].filter(Boolean)
            }
          ]
        }
      })

      if (!user) {
        return res
          .status(400)
          .json({ message: 'Login information is incorrect' })
      }

      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined,
            { userId: user.userId }
          ].filter(Boolean)
        }
      })

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' })
      }

      if (resident.active === false) {
        return res.status(400).json({ message: 'Resident is not active' })
      }
    }

    if (phonenumber || idcard) {
      resident = await Resident.findOne({
        where: {
          [Op.or]: [
            idcard ? { idcard } : undefined,
            phonenumber ? { phonenumber } : undefined
          ].filter(Boolean)
        }
      })

      if (!resident) {
        return res.status(400).json({ message: 'Resident does not exist' })
      }

      if (resident.active === false) {
        return res.status(400).json({ message: 'Resident is not active' })
      }
      user = await User.findOne({
        where: {
          [Op.and]: [{ userId: resident.userId }, { roleId: 2 }]
        }
      })

      if (!user) {
        return res
          .status(400)
          .json({ message: 'Login information is incorrect' })
      }
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const payload = { user, resident }
    const token = jwtToken(payload)

    res.status(200).json({ user, resident, token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'An internal error occurred' })
  }
}

const updateResident = async (req, res) => {
  try {
    const { user, resident } = req
    const { fullname, email, password, idcard, phonenumber, username } =
      req.body
    const avatar = req.file

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found in token' })
    }

    const residentFromDb = await Resident.findOne({
      where: { residentId: resident.residentId }
    })

    if (!residentFromDb) {
      return res.status(400).json({ message: 'Resident not found in database' })
    }

    const userFromDb = await User.findOne({
      where: { userId: residentFromDb.userId }
    })

    if (!userFromDb) {
      return res.status(400).json({ message: 'User not found in database' })
    }

    if (fullname) {
      userFromDb.fullname = fullname
    }

    if (username) {
      userFromDb.username = username
    }

    if (email) {
      userFromDb.email = email
    }

    if (password) {
      userFromDb.password = await bcrypt.hash(password, 10)
    }

    if (idcard) {
      residentFromDb.idcard = idcard
    }

    if (phonenumber) {
      residentFromDb.phonenumber = phonenumber
    }

    if (avatar) {
      if (userFromDb.avatar) {
        await deleteFromS3(userFromDb.avatar, bucketName)
      }
      const data = await uploadToS3(avatar, bucketName, 'user/')
      userFromDb.avatar = data
    }

    await userFromDb.save()
    await residentFromDb.save()

    res.status(200).json({
      resident: residentFromDb,
      user: userFromDb
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const readToken = async (req, res) => {
  try {
    // Kiểm tra xem người dùng có vai trò là admin hay resident
    if (req.user.roleId === 1) {
      // Người dùng là admin
      res.status(200).json({
        user: req.user,
        admin: req.admin,
        message: 'Admin access'
      })
    } else if (req.user.roleId === 2) {
      // Người dùng là resident
      res.status(200).json({
        user: req.user,
        resident: req.resident,
        message: 'Resident access'
      })
    } else {
      // Nếu không phải admin hoặc resident
      res.status(403).json({ message: 'Forbidden' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getResidentNoActiveByIdcard = async (req, res) => {
  try {
    const idcard = req.params.idcard

    if (!idcard) {
      return res.status(400).json({ message: 'ID card is required' })
    }
    const resident = await Resident.findOne({
      where: {
        [Op.and]: [{ idcard }, { active: false }]
      }
    })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    const user = await User.findOne({
      where: { userId: resident.userId }
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    const mergedData = {
      ...user.dataValues, // Dữ liệu từ user
      ...resident.dataValues // Dữ liệu từ resident
    }

    res.status(200).json(mergedData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const generateOTP = () => {
  // Tạo mã OTP ngẫu nhiên từ 100000 đến 999999
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const sentOTPHandler = async (req, res) => {
  const { to } = req.body // Lấy chỉ số liên hệ từ yêu cầu, không lấy otp

  if (!to) {
    return res.status(400).json({
      success: false,
      error: 'Địa chỉ liên hệ là bắt buộc.'
    })
  }

  const phoneRegex = /^\+?[0-9]{7,15}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  let validatedType = ''
  let id = ''

  if (phoneRegex.test(to)) {
    validatedType = 'sms'

    const phone = to.replace('+84', '0')

    const resident = await Resident.findOne({
      where: { phonenumber: phone }
    })

    if (!resident) {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy cư dân với số điện thoại này.'
      })
    }

    id = resident.residentId
  } else if (emailRegex.test(to)) {
    validatedType = 'email'

    const user = await User.findOne({
      where: { email: to }
    })

    if (user) {
      const resident = await Resident.findOne({
        where: { userId: user.userId }
      })

      if (!resident) {
        return res.status(400).json({
          success: false,
          error: 'Không tìm thấy cư dân với email này.'
        })
      }

      id = resident.residentId
    } else {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy người dùng với email này.'
      })
    }
  } else {
    return res.status(400).json({
      success: false,
      error:
        'Địa chỉ liên hệ không hợp lệ. Vui lòng nhập số điện thoại hoặc email hợp lệ.'
    })
  }

  // Tạo mã OTP ngẫu nhiên
  const otp = generateOTP()

  try {
    const response = await sendOTP(to, otp, validatedType, id)
    return res.status(200).json({ success: true, response })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

const verifyOTP = async (req, res) => {
  const { id, otp } = req.body

  if (!id || !otp) {
    return res.status(400).json({ message: 'ID và mã OTP là bắt buộc.' })
  }

  const storedOTP =
    (await redisClient.get(`sms:${id}`)) ||
    (await redisClient.get(`email:${id}`))

  if (!storedOTP) {
    return res
      .status(400)
      .json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' })
  }

  if (storedOTP === otp) {
    // ;(await redisClient.del(`sms:${id}`)) ||
    //   (await redisClient.del(`email:${id}`))
    return res
      .status(200)
      .json({ success: true, message: 'Xác minh thành công.' })
  } else {
    return res
      .status(400)
      .json({ success: false, message: 'Mã OTP không chính xác.' })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { residentId, password, otp } = req.body

    if (!residentId || !password || !otp) {
      return res
        .status(400)
        .json({ message: 'Resident ID, password, and OTP are required.' })
    }

    // Kiểm tra mã OTP trước khi thay đổi mật khẩu
    const storedOTP =
      (await redisClient.get(`sms:${residentId}`)) ||
      (await redisClient.get(`email:${residentId}`))

    if (!storedOTP) {
      return res
        .status(400)
        .json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' })
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ message: 'Mã OTP không chính xác.' })
    }

    ;(await redisClient.del(`sms:${residentId}`)) ||
      (await redisClient.del(`email:${residentId}`))

    const resident = await Resident.findOne({ where: { residentId } })

    if (!resident) {
      return res.status(400).json({ message: 'Resident not found' })
    }

    const user = await User.findOne({ where: { userId: resident.userId } })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    user.password = await bcrypt.hash(password, 10)
    await user.save()

    return res.status(200).json({ message: 'Password updated successfully.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// const getResidentApartmentInfo = async (req, res) => {
//   try {
//     if (req.user.roleId !== 2) {
//       return res.status(403).json({ message: 'Access denied. Residents only.' })
//     }

//     const residentId = req.user.userId

//     const apartmentResidents = await Apartment.findAll({
//       include: [
//         {
//           model: Resident,
//           include: [
//             {
//               model: User,
//               attributes: ['fullname']
//             }
//           ],
//           through: {
//             attributes: []
//           }
//         }
//       ]
//     })

//     const filteredApartments = apartmentResidents.filter((apartment) =>
//       apartment.Residents.some((resident) => resident.residentId === residentId)
//     )

//     if (filteredApartments.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'Không tìm thấy căn hộ cho cư dân này.' })
//     }

//     const floor = await Floor.findAll({
//       where: { floorId: filteredApartments[0].floorId }
//     })

//     const building = await Building.findAll({
//       where: { buildingId: floor[0].buildingId }
//     })

//     const residents = filteredApartments[0].Residents.map((resident) => ({
//       id: resident.residentId,
//       phone: resident.phonenumber,
//       idCard: resident.idcard,
//       fullname: resident.User ? resident.User.fullname : null
//     }))

//     const response = {
//       apartment: {
//         id: filteredApartments[0].apartmentId,
//         number: filteredApartments[0].apartmentNumber,
//         type: filteredApartments[0].apartmentType,
//         residents: residents
//       },
//       floor: {
//         id: floor[0].floorId,
//         number: floor[0].floorNumber
//       },
//       building: {
//         id: building[0].buildingId,
//         name: building[0].buildingName,
//         address: building[0].buildingAddress
//       }
//     }

//     res.status(200).json(response)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
//   }
// }
const getResidentApartmentInfo = async (req, res) => {
  try {
    if (req.user.roleId !== 2) {
      return res.status(403).json({ message: 'Access denied. Residents only.' })
    }

    const residentId = req.user.userId

    const apartmentResidents = await Apartment.findAll({
      include: [
        {
          model: Resident,
          include: [
            {
              model: User,
              attributes: ['fullname']
            },
            {
              model: Vehicle, // Thêm mô hình Vehicle vào đây
              attributes: ['vehicleId', 'vehicleNumber', 'vehicleType'] // Các trường từ bảng Vehicles
            }
          ],
          through: {
            attributes: []
          }
        }
      ]
    })

    const filteredApartments = apartmentResidents.filter((apartment) =>
      apartment.Residents.some((resident) => resident.residentId === residentId)
    )

    if (filteredApartments.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy căn hộ cho cư dân này.' })
    }

    const floor = await Floor.findAll({
      where: { floorId: filteredApartments[0].floorId }
    })

    const building = await Building.findAll({
      where: { buildingId: floor[0].buildingId }
    })

    const residents = filteredApartments[0].Residents.map((resident) => ({
      id: resident.residentId,
      phone: resident.phonenumber,
      idCard: resident.idcard,
      fullname: resident.User ? resident.User.fullname : null,
      vehicles:
        resident.Vehicles.map((vehicle) => ({
          id: vehicle.vehicleId,
          number: vehicle.vehicleNumber,
          type: vehicle.vehicleType
        })) || [] // Lấy thông tin phương tiện
    }))

    const response = {
      apartment: {
        id: filteredApartments[0].apartmentId,
        number: filteredApartments[0].apartmentNumber,
        type: filteredApartments[0].apartmentType,
        residents: residents
      },
      floor: {
        id: floor[0].floorId,
        number: floor[0].floorNumber
      },
      building: {
        id: building[0].buildingId,
        name: building[0].buildingName,
        address: building[0].buildingAddress
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' })
  }
}

module.exports = {
  loginResident,
  activeResident,
  updateResident,
  readToken,
  getResidentNoActiveByIdcard,
  sentOTPHandler,
  verifyOTP,
  forgotPassword,
  getResidentApartmentInfo
}
