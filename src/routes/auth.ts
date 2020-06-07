import { Router } from 'express'
import { check } from 'express-validator'
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout,
  verify,
  getVerify,
  getForgetPassword,
  postForgetPassword,
  getResetPassword,
  postResetPassword,
} from '../controllers/auth'
import isAuth from '../middlewares/isAuth'
import notAuth from '../middlewares/notAuth'

const router = Router()

router
  .route('/login')
  .get(getLogin)
  .post(
    [
      check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Please provide valid email'),
      check('password').notEmpty().withMessage('Please provide password'),
    ],
    postLogin
  )

router
  .route('/signup')
  .get(getSignup)
  .post(
    [
      check('name').trim().notEmpty().withMessage('Please provid name'),
      check('password')
        .trim()
        .notEmpty()
        .withMessage('Please provide password'),
      check('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Please provide confirm password'),
      check('email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Please provide valid email'),
    ],
    postSignup
  )

router.route('/logout').post(isAuth, logout)

router.route('/verify').get(notAuth, getVerify)

router.route('/verify/:token').get(notAuth, verify)

router.route('/forget').get(getForgetPassword).post(postForgetPassword)

router
  .route('/reset/:token')
  .get(getResetPassword)
  .post(
    [
      check('password')
        .trim()
        .notEmpty()
        .withMessage('Please enter your password'),
      check('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Please confirm your password'),
    ],
    postResetPassword
  )

export default router
