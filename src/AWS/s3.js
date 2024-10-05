const multer = require('multer')
const AWS = require('aws-sdk')
const path = require('path')

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

const uploadToS3 = async (file, bucketName, folder = '') => {
  if (!file) {
    throw new Error('No file provided for upload')
  }

  const fileName = `${folder}avatar.${Date.now()}.${file.originalname.split('.').pop()}`

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  try {
    const data = await s3.upload(params).promise()
    return data.Location
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }
}

const deleteFromS3 = async (fileUrl, bucketName) => {
  if (!fileUrl) {
    throw new Error('No file URL provided for deletion')
  }

  // Tách chính xác Key của file từ URL
  const fileName = fileUrl.split('/').pop() 

  if (!fileName) {
    throw new Error('Invalid file URL format')
  }

  const params = {
    Bucket: bucketName,
    Key: `user/${fileName}` // Tùy chỉnh nếu file nằm trong folder
  }

  try {
    await s3.deleteObject(params).promise()
    console.log(`File deleted successfully: ${fileName}`)
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`)
  }
}



module.exports = {
  upload,
  s3,
  bucketName,
  uploadToS3,
  deleteFromS3
}
