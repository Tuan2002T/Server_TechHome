const removeAccents = require('remove-accents')
const natural = require('natural')
const getResidentApartmentInfo = require('./data')
const {
  Facility,
  Building,
  Event,
  Bill,
  Payment,
  Complaint,
  Vehicle
} = require('../../../Model/ModelDefinition')

const classifier = new natural.BayesClassifier()
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
    'tiền',
    'chi tiêu',
    'thanh toán online',
    'thanh toán hóa đơn',
    'cách thanh toán hóa đơn?',
    'làm sao để thanh toán tiền điện?',
    'hóa đơn tháng này bao nhiêu tiền?',
    'có thể thanh toán qua internet không?'
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
    'thay lốp xe',
    'làm sao đăng ký xe?',
    'có thể đậu xe ở đâu?',
    'thẻ xe làm như thế nào?'
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
    'phản ánh',
    'tôi muốn phàn nàn về...',
    'có thể gửi phản ánh như thế nào?',
    'phàn nàn về bãi đỗ xe'
  ]
}

function trainClassifier() {
  for (const [category, keywords] of Object.entries(messageClassification)) {
    keywords.forEach((keyword) => {
      const text = `${category}: ${keyword}`
      classifier.addDocument(removeAccents(text.toLowerCase()), category)
    })
  }

  classifier.train()
}

async function classifyMessage(message, residentId) {
  const messageNoAccents = removeAccents(message.toLowerCase())

  let classification = classifier.classify(messageNoAccents)

  if (!classification) {
    classification = 'unknown'
    classifier.addDocument(messageNoAccents, classification)
    classifier.train()
  }

  const data = await getResidentApartmentInfo(residentId)
  const details = {}

  if (classification === 'facilities') {
    const facilities = await Facility.findAll({
      include: [
        {
          model: Building,
          as: 'Buildings',
          where: { buildingId: data.building.id }
        }
      ]
    })
    details[classification] = facilities
  } else if (classification === 'services') {
    const services = await Facility.findAll({
      include: [
        {
          model: Building,
          as: 'Buildings',
          where: { buildingId: data.building.id }
        }
      ]
    })
    details[classification] = services
  } else if (classification === 'events') {
    const events = await Event.findAll({
      where: { buildingId: data.building.id }
    })
    details[classification] = events
  } else if (classification === 'bills') {
    const billsPayment = await Bill.findAll({
      where: { residentId: residentId },
      include: [
        {
          model: Payment,
          as: 'Payments'
        }
      ]
    })
    const bills = await Bill.findAll({
      where: { residentId: residentId }
    })
    details['billPayment'] = billsPayment
    details[classification] = bills
  } else if (classification === 'complaint') {
    const complaints = await Complaint.findAll({
      where: { residentId: residentId }
    })
    details[classification] = complaints
  } else if (classification === 'vehicles') {
    const vehicles = await Vehicle.findAll({
      where: { residentId: residentId }
    })
    details[classification] = vehicles
  } else if (classification === 'unknown') {
    details['unknown'] =
      'Đây là tin nhắn không xác định. Hãy cập nhật bộ từ khóa.'
  }

  return {
    residentMessage: message,
    classificationResult: classification,
    details
  }
}

trainClassifier()

module.exports = classifyMessage
