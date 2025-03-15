
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('SkillController')
const appError = require('../utils/appError');
const validCheck = require('../utils/validCheck');

// 取得教練專長列表
async function getAll (req, res, next) {
  try {
    const skills = await dataSource.getRepository('Skill').find({
      select: ['id', 'name']
    })
    res.status(200).json({
      status: 'success',
      data: skills
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 新增教練專長
async function post (req, res, next) {
  try {
    const { name } = req.body
    if (validCheck.isUndefined(name) || validCheck.isNotValidSting(name)) {
      return next(appError(400, 'failed', '欄位未填寫正確', next))
    }
    const skillRepo = dataSource.getRepository('Skill')
    const existSkill = await skillRepo.findOne({
      where: {
        name
      }
    })
    if (existSkill) {
      return next(appError(409, 'failed', '資料重複', next))
    }
    const newSkill = await skillRepo.create({
      name
    })
    const result = await skillRepo.save(newSkill)
    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 刪除教練專長
async function deletePackage (req, res, next) {
  try {
    const { skillId } = req.params
    if (validCheck.isUndefined(skillId) || validCheck.isNotValidSting(skillId)) {
      return next(appError(400, 'failed', 'ID錯誤', next))
    }
    const result = await dataSource.getRepository('Skill').delete(skillId)
    if (result.affected === 0) {
      return next(appError(400, 'failed', 'ID錯誤', next))
    }
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = {
  getAll,
  post,
  deletePackage
}
