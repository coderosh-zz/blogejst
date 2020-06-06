import { Router } from 'express'
import {
  createComment,
  deleteComment,
  editComment,
} from '../controllers/comment'
import { check } from 'express-validator'
import isAuth from '../middlewares/isAuth'

const router = Router()

router
  .route('/:post')
  .post(
    isAuth,
    [check('comment').trim().notEmpty().withMessage('Please provide comment')],
    createComment
  )

router.route('/delete/:post/:id').post(isAuth, deleteComment)

router.route('/edit/:post/:id').post(isAuth, editComment)

export default router
