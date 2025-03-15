const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CoachesController')
const appError = require('../utils/appError')
const validCheck = require('../utils/validCheck')

// 取得教練列表
async function getCoaches (req, res, next) {
  try {
    const { per, page } = req.query
    if(validCheck.isUndefined(per) || validCheck.isNotValidSting(per) || validCheck.isUndefined(page) || validCheck.isNotValidSting(page)){
        logger.warn('欄位未填寫正確')
        return next(appError(400, 'failed', '欄位未填寫正確', next))
    }

    const perNum = parseInt(per)
    const pageNum = parseInt(page)
    const newCoach = await dataSource.getRepository("Coach").find({
        skip: (perNum * (pageNum - 1)),
        take: perNum,
        relations: {
            User: true
        }
    })

    res.status(200).json({
        status: "success",
        data: newCoach
    })
  }catch (error) {
    logger.error(error)
    next(error)
  }
}
// 取得教練詳細資訊
async function getCoachDetail (req, res, next) {
  try {
    const { coachId } = req.params
    if (validCheck.isUndefined(coachId) || validCheck.isNotValidSting(coachId)) {
      return next(appError(400, 'failed', '欄位未填寫正確', next))
    }
    const coach = await dataSource.getRepository('Coach').findOne({
      select: {
        id: true,
        user_id: true,
        experience_years: true,
        description: true,
        profile_image_url: true,
        created_at: true,
        updated_at: true,
        User: {
          name: true,
          role: true
        }
      },
      where: {
        id: coachId
      },
      relations: {
        User: true
      }
    })
    if (!coach) {
      logger.warn('找不到該教練')
      return next(appError(400, 'failed', '找不到該教練', next))
    }
    res.status(200).json({
      status: 'success',
      data: {
        user: coach.User,
        coach: {
          id: coach.id,
          user_id: coach.user_id,
          experience_years: coach.experience_years,
          description: coach.description,
          profile_image_url: coach.profile_image_url,
          created_at: coach.created_at,
          updated_at: coach.updated_at
        }
      }
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 取得指定教練課程列表
async function getCoachCourses (req, res, next) {
  try {
    const { coachId } = req.params
    if (validCheck.isUndefined(coachId) || validCheck.isNotValidSting(coachId)) {
      return next(appError(400, 'failed', '欄位未填寫正確', next))
    }
    const coach = await dataSource.getRepository('Coach').findOne({
      select: {
        id: true,
        user_id: true,
        User: {
          name: true
        }
      },
      where: {
        id: coachId
      },
      relations: {
        User: true
      }
    })
    if (!coach) {
      logger.warn('找不到該教練')
      return next(appError(400, 'failed', '找不到該教練', next))
    }
    logger.info(`coach: ${JSON.stringify(coach)}`)
    const courses = await dataSource.getRepository('Course').find({
      select: {
        id: true,
        name: true,
        description: true,
        start_at: true,
        end_at: true,
        max_participants: true,
        Skill: {
          name: true
        }
      },
      where: {
        user_id: coach.user_id
      },
      relations: {
        Skill: true
      }
    })
    logger.info(`courses: ${JSON.stringify(courses)}`)
    res.status(200).json({
      status: 'success',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        coach_name: coach.User.name,
        skill_name: course.Skill.name
      }))
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = {
  getCoaches,
  getCoachDetail,
  getCoachCourses
}