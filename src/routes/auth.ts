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

export default router
