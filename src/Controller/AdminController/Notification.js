const { Notification } = require('../../Model/ModelDefinition')
const { notificationPush } = require('../../FireBase/NotificationPush')

const getNotifications = async (req, res) => {
  try {
    const rs = await Notification.findAll()
    return res.status(200).json({
      status: true,
      data: rs
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'An error occurred while retrieving notifications.'
    })
  }
}

const pushNotifications = async (req, res) => {
  const { tokens, title, body } = req.body

  // Validate request body
  if (
    !tokens ||
    !Array.isArray(tokens) ||
    tokens.length === 0 ||
    !title ||
    !body
  ) {
    return res.status(400).json({
      status: false,
      message:
        'Invalid request: tokens must be a non-empty array, and title and body are required'
    })
  }

  try {
    // Send push notifications to all tokens
    const results = await Promise.all(
      tokens.map(async (token) => {
        try {
          const pushResult = await notificationPush(token, title, body)
          return {
            token,
            success: pushResult.success,
            response: pushResult.success ? pushResult.response : null,
            error: !pushResult.success ? pushResult.error : null
          }
        } catch (error) {
          return {
            token,
            success: false,
            response: null,
            error: error.message
          }
        }
      })
    )

    // Check if any notifications were sent successfully
    const successfulNotifications = results.filter((result) => result.success)
    const failedNotifications = results.filter((result) => !result.success)

    if (successfulNotifications.length === 0) {
      return res.status(500).json({
        status: false,
        message: 'All notifications failed to send',
        results: {
          successful: successfulNotifications,
          failed: failedNotifications,
          totalAttempted: tokens.length,
          totalSuccessful: successfulNotifications.length,
          totalFailed: failedNotifications.length
        }
      })
    }

    return res.status(200).json({
      status: true,
      message:
        successfulNotifications.length === tokens.length
          ? 'All notifications sent successfully'
          : `${successfulNotifications.length} out of ${tokens.length} notifications sent successfully`,
      results: {
        successful: successfulNotifications,
        failed: failedNotifications,
        totalAttempted: tokens.length,
        totalSuccessful: successfulNotifications.length,
        totalFailed: failedNotifications.length
      }
    })
  } catch (error) {
    console.error('Error in pushNotifications:', error)
    return res.status(500).json({
      status: false,
      message: 'Failed to send notifications',
      error: error.message
    })
  }
}

module.exports = {
  getNotifications,
  pushNotifications
}
