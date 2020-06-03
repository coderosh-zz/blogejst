import { Router } from 'express'
import { getLogin, postLogin, getSignup, postSignup } from '../controllers/user'

const router = Router()

router.route('/login').get(getLogin).post(postLogin)

router.route('/signup').get(getSignup).post(postSignup)

export default router
