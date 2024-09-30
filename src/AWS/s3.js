const multer = require('multer')
const AWS = require('aws-sdk')
const path = require('path')

const fs = require('fs')

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1'

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
})

const s3 = new AWS.S3()

const bucketName = process.env.S3_BUCKET_NAME
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '')
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback)
  }
})

function checkFileType(file, callback) {
  const fileTypes =
    /jpeg|jpg|png|gif|mp4|mov|avi|doc|docx|pdf|txt|ppt|pptx|xls|xlsx|zip|rar|mp3|wav|html|css|js|json/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)
  if (extname && mimeType) {
    return callback(null, true)
  }
  return callback('Chỉ chấp nhận file ảnh, video hoặc tài liệu!')
}

module.exports = {
  upload,
  s3,
  bucketName
}
