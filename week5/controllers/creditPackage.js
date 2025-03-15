
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackageController')
const appError = require('../utils/appError');
const validCheck = require('../utils/validCheck');

// 取得購買方案列表
async function getAll (req, res, next) {
  try {
    const creditPackages = await dataSource.getRepository('CreditPackage').find({
      select: ['id', 'name', 'credit_amount', 'price']
    })
    res.status(200).json({
      status: 'success',
      data: creditPackages
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 新增購買方案只接受
async function post (req, res, next) {
  try {
    const { name, credit_amount: creditAmount, price } = req.body
    if (validCheck.isUndefined(name) || validCheck.isNotValidSting(name) ||
    validCheck.isUndefined(creditAmount) || validCheck.isNotValidInteger(creditAmount) ||
    validCheck.isUndefined(price) || validCheck.isNotValidInteger(price)) {
      return next(appError(400, 'failed', '欄位未填寫正確', next))
    }
    const creditPackageRepo = dataSource.getRepository('CreditPackage')
    const existCreditPackage = await creditPackageRepo.findOne({
      where: {
        name
      }
    })
    if (existCreditPackage) {
      return next(appError(409, 'failed', '資料重複', next))
    }
    const newCreditPackage = await creditPackageRepo.create({
      name,
      credit_amount: creditAmount,
      price
    })
    const result = await creditPackageRepo.save(newCreditPackage)
    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 使用者購買方案
async function postUserBuy (req, res, next) {
  try {
    const { id } = req.user
    const { creditPackageId } = req.params
    const creditPackageRepo = dataSource.getRepository('CreditPackage')
    const creditPackage = await creditPackageRepo.findOne({
      where: {
        id: creditPackageId
      }
    })
    if (!creditPackage) {
      return next(appError(400, 'failed', 'ID錯誤', next))
    }
    const creditPurchaseRepo = dataSource.getRepository('CreditPurchase')
    const newPurchase = await creditPurchaseRepo.create({
      user_id: id,
      credit_package_id: creditPackageId,
      purchased_credits: creditPackage.credit_amount,
      price_paid: creditPackage.price,
      purchaseAt: new Date().toISOString()
    })
    await creditPurchaseRepo.save(newPurchase)
    res.status(200).json({
      status: 'success',
      data: null
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
// 刪除購買方案
async function deletePackage (req, res, next) {
  try {
    const { creditPackageId } = req.params
    if (validCheck.isUndefined(creditPackageId) || validCheck.isNotValidSting(creditPackageId)) {
      return next(appError(400, 'failed', '欄位未填寫正確', next))
    }
    const result = await dataSource.getRepository('CreditPackage').delete(creditPackageId)
    if (result.affected === 0) {
      return next(appError(400, 'failed', 'ID錯誤', next))
    }
    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = {
  getAll,
  post,
  postUserBuy,
  deletePackage
}
