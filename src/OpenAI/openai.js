const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const getAIResponse = async (message, data) => {
  try {
    const prompt = `Message: ${message}\nClassification data: ${JSON.stringify(
      data
    )}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('No response received from the AI model.')
    }
    console.log(response)

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
