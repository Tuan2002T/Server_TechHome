const admin = require('../FireBase/FirebaseConfig')

const notificationPush = async (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: token
  }

  try {
    const response = await admin.messaging().send(message)
    console.log('Successfully sent message:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error }
  }
}

module.exports = { notificationPush }
