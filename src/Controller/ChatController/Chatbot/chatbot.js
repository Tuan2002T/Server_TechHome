const removeAccents = require('remove-accents')
const getResidentApartmentInfo = require('./data')
const {
  Facility,
  Building,
  Event,
  Bill,
  Payment,
  Complaint
} = require('../../../Model/ModelDefinition')
const messageClassification = {
  facilities: [
    'thang máy',
    'cửa ra vào',
    'tòa nhà',
    'khu vực',
    'cơ sở',
    'hệ thống',
    'sảnh',
    'cầu thang',
    'lối đi',
    'phòng gym',
    'bể bơi',
    'hành lang',
    'nhà xe',
    'vườn',
    'khu vui chơi',
    'công viên',
    'hồ bơi',
    'sân thượng',
    'phòng sinh hoạt chung',
    'sân chơi trẻ em',
    'phòng chiếu phim'
  ],
  services: [
    'dọn dẹp',
    'sửa chữa',
    'vệ sinh',
    'dịch vụ',
    'hỗ trợ',
    'bảo trì',
    'chăm sóc',
    'giúp đỡ',
    'cung cấp',
    'tiện ích',
    'kỹ thuật',
    'hướng dẫn',
    'sửa chữa máy móc',
    'dọn dẹp vệ sinh',
    'hỗ trợ khẩn cấp',
    'dịch vụ khách hàng',
    'kỹ thuật viên',
    'hỗ trợ 24/7',
    'cấp cứu'
  ],
  events: [
    'buổi họp',
    'lễ hội',
    'sự kiện',
    'hội nghị',
    'hoạt động cộng đồng',
    'triển lãm',
    'buổi tiệc',
    'lớp học',
    'khóa học',
    'cuộc họp',
    'giải trí',
    'chương trình',
    'hội thảo',
    'buổi tập huấn',
    'họp mặt',
    'buổi lễ',
    'trình diễn',
    'diễn đàn',
    'công bố',
    'lễ kỷ niệm'
  ],
  bills: [
    'thanh toán',
    'hóa đơn',
    'phí',
    'tiền điện',
    'phí bảo trì',
    'nợ',
    'tiền nước',
    'tiền gas',
    'phí quản lý',
    'phí dịch vụ',
    'hóa đơn điện thoại',
    'chi phí',
    'thanh toán tiền',
    'hóa đơn điện',
    'phí sinh hoạt',
    'phí bảo hiểm',
    'trả nợ',
    'thuế',
    'phí giao dịch',
    'phí đăng ký',
    'tiền nhà',
    'tiền'
  ],
  vehicles: [
    'đỗ xe',
    'bãi đỗ',
    'xe',
    'đăng ký xe',
    'vị trí đỗ xe',
    'xe máy',
    'xe hơi',
    'xe đạp',
    'hỗ trợ xe',
    'bãi giữ xe',
    'thẻ xe',
    'giấy tờ xe',
    'chỗ đậu xe',
    'bãi đỗ xe',
    'sửa chữa xe',
    'kiểm tra xe',
    'dịch vụ xe',
    'giá xe',
    'bảo hiểm xe',
    'xe ô tô',
    'xe buýt',
    'tuyến xe',
    'số xe',
    'thay lốp xe'
  ],
  complaint: [
    'phàn nàn',
    'góp ý',
    'khó chịu',
    'bực mình',
    'chê bai',
    'than vãn',
    'phê phán',
    'kêu ca',
    'lời phản ánh',
    'sự phản đối',
    'điều không hài lòng',
    'phản hồi',
    'phản ánh'
  ]
}

async function classifyMessage(message, residentId) {
  const messageNoAccents = removeAccents(message.toLowerCase())

  const classificationResult = {
    facilities: [],
    services: [],
    events: [],
    bills: [],
    vehicles: [],
    complaint: []
  }
  const data = await getResidentApartmentInfo(residentId)

  for (const [category, keywords] of Object.entries(messageClassification)) {
    for (const word of keywords) {
      const wordNoAccents = removeAccents(word.toLowerCase())

      if (messageNoAccents.includes(wordNoAccents)) {
        classificationResult[category].push(word)

        if (category === 'facilities') {
          const facilities = await Facility.findAll({
            include: [
              {
                model: Building,
                as: 'Buildings',
                where: { buildingId: data.building.id }
              }
            ]
          })
          data.facilities = facilities
        } else if (category === 'services') {
          const services = await Facility.findAll({
            include: [
              {
                model: Building,
                as: 'Buildings',
                where: { buildingId: data.building.id }
              }
            ]
          })
          data.services = services
        } else if (category === 'events') {
          const events = await Event.findAll({
            where: { buildingId: data.building.id }
          })
          data.events = events
        } else if (category === 'bills') {
          const bills = await Bill.findAll({
            where: { residentId: residentId },
            include: [
              {
                model: Payment,
                as: 'Payments'
              }
            ]
          })
          data.bills = bills
        } else if (category === 'complaint') {
          const complaints = await Complaint.findAll({
            where: { residentId: residentId }
          })
          data.complaints = complaints
        }
      }
    }
  }
  return data
}

module.exports = classifyMessage
