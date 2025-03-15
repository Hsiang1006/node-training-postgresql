const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const creditPackage = require('../controllers/creditPackage')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
// 取得購買方案列表
router.get('/', creditPackage.getAll)
// 新增購買方案只接受
router.post('/', creditPackage.post)
// 使用者購買方案
router.post('/:creditPackageId', auth, creditPackage.postUserBuy)
// 刪除購買方案
router.delete('/:creditPackageId', creditPackage.deletePackage)

module.exports = router