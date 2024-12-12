const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const getAIResponse = async (
  residentMessage,
  classificationResult,
  details
) => {
  try {
    const bills = classificationResult.bills || []
    const facilities = classificationResult.facilities || []
    const events = classificationResult.events || []
    const services = classificationResult.services || []
    const complaint = classificationResult.complaint || []
    const vehicles = classificationResult.vehicles || []
    console.log('details', details)

    const prompt = `
      Người cư dân đã gửi yêu cầu: "${residentMessage}"

      Hệ thống đã phân loại yêu cầu này như sau:
      - Danh mục hóa đơn: ${bills.join(', ')}
      - Danh mục cơ sở vật chất: ${facilities.join(', ')}
      - Danh mục sự kiện: ${events.join(', ')}
      - Danh mục dịch vụ: ${services.join(', ')}
      - Khiếu nại: ${complaint.join(', ')}
      - Phương tiện: ${vehicles.join(', ')}

      Dữ liệu liên quan mà hệ thống tìm thấy:
      ${JSON.stringify(details, null, 2)}
      Nếu câu hỏi về "cách đặt dịch vụ, hướng dẫn đặt dịch vụ" thì hướng dẫn như sau: Vào mục "Dịch vụ" -> Chọn dịch vụ cần đặt -> Ở bước này có thể đặt qua app hoặc dựa theo thông tin liên lạc để đặt dịch vụ -> nếu đặt qua app thì sẽ có QR code xuất hiện có thể thanh toán ngay hoặc quay về để thanh toán sau ở mục Thanh toán -> Nếu muốn huỷ dịch vụ vui lòng liên hệ với admin để huỷ. -> Còn không thì bỏ qua bước này.
      Dựa trên các thông tin trên, hãy đưa ra câu trả lời chi tiết và thân thiện, giải thích rõ cho cư dân về câu hỏi của họ.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('No response received from the AI model.')
    }

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error)

    if (error.response) {
      console.error('Error details:', error.response.data)
    } else if (error.request) {
      console.error('No response received from OpenAI:', error.request)
    }

    throw new Error('Failed to get response from AI: ' + error.message)
  }
}

module.exports = getAIResponse
