
const express = require('express')

const router = express.Router()
const skill = require('../controllers/skill')
// 取得教練專長列表
router.get('/', skill.getAll)
// 新增教練專長
router.post('/', skill.post)
// 刪除教練專長
router.delete('/:skillId', skill.deletePackage)

module.exports = router
