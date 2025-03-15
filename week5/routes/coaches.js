const express = require('express')

const router = express.Router()
const coaches = require('../controllers/coaches')
// 取得教練列表
router.get('/', coaches.getCoaches)
// 取得教練詳細資訊
router.get('/:coachId', coaches.getCoachDetail)
// 取得指定教練課程列表
router.get('/:coachId/courses', coaches.getCoachCourses)

module.exports = router