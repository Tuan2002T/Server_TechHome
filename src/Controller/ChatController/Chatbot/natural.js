const natural = require('natural')
const removeAccents = require('remove-accents')
const classifier = new natural.BayesClassifier()

function preprocessMessage(message) {
  return removeAccents(message.toLowerCase())
}

classifier.addDocument('Khi nào thang máy được bảo trì?', 'facilities')
classifier.addDocument('Cửa ra vào bị hỏng, làm sao để sửa?', 'facilities')
classifier.addDocument(
  'Khu vực chung cần được làm sạch vào lúc nào?',
  'facilities'
)
classifier.addDocument(
  'Có ai chịu trách nhiệm về hệ thống điện không?',
  'facilities'
)
classifier.addDocument('Sảnh chung cư cần bảo trì khi nào?', 'facilities')
classifier.addDocument('Cầu thang bị trơn trượt, ai sẽ xử lý?', 'facilities')
classifier.addDocument(
  'Bể bơi có được vệ sinh thường xuyên không?',
  'facilities'
)

classifier.addDocument('Làm thế nào để đặt lịch vệ sinh?', 'services')
classifier.addDocument('Cách yêu cầu sửa chữa điện nước?', 'services')
classifier.addDocument('Dịch vụ hỗ trợ khẩn cấp có sẵn không?', 'services')
classifier.addDocument(
  'Làm thế nào để đăng ký sử dụng phòng hội nghị?',
  'services'
)
classifier.addDocument('Có dịch vụ sửa chữa ngay không?', 'services')
classifier.addDocument(
  'Tôi muốn yêu cầu dọn dẹp khẩn cấp, làm thế nào?',
  'services'
)

classifier.addDocument('Khi nào buổi họp chung cư được tổ chức?', 'events')
classifier.addDocument('Lễ hội cộng đồng sắp diễn ra vào ngày nào?', 'events')
classifier.addDocument('Có những sự kiện nào trong tháng này?', 'events')
classifier.addDocument('Tôi cần biết thông tin về hội nghị tới', 'events')
classifier.addDocument('Ngày tổ chức buổi họp là khi nào?', 'events')
classifier.addDocument('Sắp tới có sự kiện nào đặc biệt không?', 'events')

classifier.addDocument('Khi nào tôi cần thanh toán tiền điện?', 'bills')
classifier.addDocument('Tôi cần xem hóa đơn tháng này', 'bills')
classifier.addDocument('Làm thế nào để nộp phí bảo trì?', 'bills')
classifier.addDocument('Phí bảo trì có tăng trong năm nay không?', 'bills')
classifier.addDocument(
  'Tôi cần thanh toán hóa đơn tiền nước vào ngày nào?',
  'bills'
)
classifier.addDocument('Phí bảo trì có thể thanh toán online không?', 'bills')

classifier.addDocument(
  'Tôi cần đăng ký xe trong chung cư, làm thế nào?',
  'vehicles'
)
classifier.addDocument('Có còn chỗ đỗ xe trong khu vực không?', 'vehicles')
classifier.addDocument('Bãi đỗ xe có đủ chỗ cho khách không?', 'vehicles')
classifier.addDocument('Cách đặt chỗ đỗ xe cho khách đến thăm?', 'vehicles')
classifier.addDocument('Tôi muốn biết cách đăng ký xe máy mới', 'vehicles')
classifier.addDocument('Có thể đỗ xe lâu dài ở đâu trong chung cư?', 'vehicles')

classifier.train()

function classifyMessageNatural(message) {
  const preprocessedMessage = preprocessMessage(message)
  const classification = classifier.getClassifications(preprocessedMessage)
  return classification
}

module.exports = classifyMessageNatural
