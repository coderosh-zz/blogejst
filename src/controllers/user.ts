import { Request, Response } from 'express'
import User from '../models/User'
import { validationResult } from 'express-validator'
import errsToObj from '../utils/errstoobj'
import Post from '../models/Post'

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.session!.user._id)
    const posts = await Post.find({ author: req.session!.user._id })
      .sort({ createdAt: -1 })
      .populate('author')
    if (!user) {
      return res.redirect('/')
    }

    const errors = validationResult(req)
    const errs = errsToObj(errors)

    if (!errors.isEmpty()) {
      return res.render('me', {
        pageTitle: 'Profile',
        errors: errs,
        posts,
      })
    }

    const { name, username } = req.body

    if (username && username !== req.session!.user.username) {
      const userNameExists = await User.findOne({ username })
      if (userNameExists) {
        return res.render('me', {
          pageTitle: 'Profile',
          errors: { username: 'Username already exists' },
          posts,
        })
      }
    }

    user.name = name
    user.username = username

    await user.save()

    req.session!.isLoggedIn = true
    req.session!.user = user
    req.session!.save(() => {
      res.redirect('/me')
    })
  } catch (e) {
    res.redirect('/')
  }
}

const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username.substr(1)

    const user = await User.findOne({ username }).populate('posts')

    if (!user) {
      return res.redirect('/')
    }

    res.render('userPost', {
      pageTitle: '@' + user.username,
      userPost: user,
    })
  } catch (e) {
    res.redirect('/')
  }
}

export { updateUser, getUserPosts }
