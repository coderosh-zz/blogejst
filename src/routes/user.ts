import { Router } from 'express'
import { getUserPosts } from '../controllers/user'

const router = Router()

router.route('/:username').get(getUserPosts)

export default router
