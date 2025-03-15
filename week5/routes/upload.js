const express = require('express')

const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const upload = require('../controllers/upload')
const logger = require('../utils/logger')('Upload')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})

const router = express.Router()
// 上傳圖片
router.post('/', auth, upload.postUploadImage)

module.exports = router