const dotenv = require('dotenv')
dotenv.config()

const nodeMailer = require('nodemailer')

const fs = require('fs')
const path = require('path')
const redisClient = require('../Redis/redis')
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'truongvantuan02042002@gmail.com',
    pass: 'pasd mcea xehs bjap'
  }
})

const sendEmail = async (to, subject, otp) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'truongvantuan02042002@gmail.com',
      pass: 'pasd mcea xehs bjap'
    }
  })

  const date = new Date()
  const dateStr = formatDate(date)

  const mailOptions = {
    from: '"TechHome" <your-email@gmail.com>',
    to,
    subject,
    html: htmlTemplate.replace('{{otp}}', otp).replace('{{date}}', dateStr)
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { OTP: otp }
  } catch (error) {
    throw new Error('Không thể gửi email: ' + error.message)
  }
}

const https = require('follow-redirects').https
const apiKey = process.env.SMS_API_KEY
const host = process.env.SMS_HOST

const sendSMS = (to, otp) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: host,
      path: '/sms/2/text/advanced',
      headers: {
        Authorization: `App ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      maxRedirects: 20
    }

    const req = https.request(options, (res) => {
      let chunks = []

      res.on('data', (chunk) => {
        chunks.push(chunk)
      })

      res.on('end', () => {
        const body = Buffer.concat(chunks)
        const responseBody = body.toString()

        if (res.statusCode === 200) {
          resolve({ OTP: otp })
        } else {
          reject(`Gửi SMS không thành công: ${responseBody}`)
        }
      })

      res.on('error', (error) => {
        reject(`Error: ${error.message}`)
      })
    })

    const postData = JSON.stringify({
      messages: [
        {
          destinations: [{ to }],
          from: '447491163443',
          text: `Mã OTP của bạn là: ${otp}`
        }
      ]
    })

    req.write(postData)

    req.on('error', (error) => {
      reject(`Request Error: ${error.message}`)
    })

    req.end()
  })
}

const sendOTP = async (to, otp, type, id) => {
  try {
    await redisClient.setEx(`${type}:${id}`, 300, otp)

    if (type === 'email') {
      await sendEmail(to, 'Xác thực OTP', otp)
      return { id: id }
    } else {
      await sendSMS(to, otp)
      return { id: id }
    }
  } catch (error) {
    throw new Error('Không thể gửi OTP: ' + error.message)
  }
}

module.exports = sendOTP
