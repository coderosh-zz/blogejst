import { Router } from 'express'
import { check } from 'express-validator'
import {
  getAllPosts,
  getSinglePost,
  getCreatePost,
  postCreatePost,
  getMyPosts,
  getEditPost,
  postEditPost,
  deletePost,
} from '../controllers/post'
import { updateUser } from '../controllers/user'
import isAuth from '../middlewares/isAuth'

const router = Router()

router.route('/').get(getAllPosts)

router
  .route('/create')
  .get(isAuth, getCreatePost)
  .post(
    isAuth,
    [
      check('title').trim().notEmpty().withMessage('Please provide title'),
      check('description')
        .trim()
        .notEmpty()
        .withMessage('Please provide description'),
      check('body').notEmpty().trim().withMessage('Please provide body'),
    ],
    postCreatePost
  )

router
  .route('/me')
  .get(isAuth, getMyPosts)
  .post(
    isAuth,
    [
      check('name').trim().notEmpty().withMessage('Name cannot be empty'),
      check('username')
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty'),
    ],
    updateUser
  )

router.route('/edit/:id').get(isAuth, getEditPost).post(isAuth, postEditPost)

router.route('/delete/:id').post(isAuth, deletePost)

router.route('/:author/:slug').get(getSinglePost)

export default router
