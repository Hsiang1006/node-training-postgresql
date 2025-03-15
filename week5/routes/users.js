
const express = require('express')
const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Users')
const users = require('../controllers/users')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
// 使用者註冊
router.post('/signup', users.postSignup)
// 使用者登入
router.post('/login', users.postLogin)
// 取得個人資料
router.get('/profile', auth, users.getProfile)
// 取得使用者已購買的方案列表
router.get('/credit-package', auth, users.getCreditPackage)
// 更新個人資料
router.put('/profile', auth, users.putProfile)
// 使用者更新密碼
router.put('/password', auth, users.putPassword)
// 取得已預約的課程列表
router.get('/courses', auth, users.getCourseBooking)

module.exports = router
