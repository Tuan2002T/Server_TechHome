const redis = require('redis')

const isDocker = process.env.USE_DOCKER === 'true'

const redisClient = isDocker
  ? redis.createClient({
      url: process.env.REDIS_URL_DOCKER
    })
  : redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})
;(async () => {
  try {
    await redisClient.connect()
    console.log('Connected to Redis')
  } catch (err) {
    console.error('Error connecting to Redis:', err)
  }
})()

module.exports = redisClient
