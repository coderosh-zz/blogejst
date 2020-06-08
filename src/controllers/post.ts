import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from '../utils/slug'
import socketIo from '../utils/socket'
import Post from '../models/Post'
import errsToObj from '../utils/errstoobj'
import User from '../models/User'
import Comment from '../models/Comment'

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author')
    res.render('home', {
      pageTitle: 'Home',
      posts,
    })
  } catch (e) {
    res.redirect('/auth/login')
  }
}

const getMyPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ author: req.session!.user._id })
      .sort({ createdAt: -1 })
      .populate('author')

    res.render('me', {
      pageTitle: 'My Articles',
      errors: {},
      posts,
    })
  } catch (e) {
    res.redirect('/')
  }
}

const getSinglePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.author.substr(1)
    const user = await User.findOne({ username })
    if (!user) {
      return res.redirect('/')
    }

    const post = await Post.findOne({
      author: user.id,
      slug: req.params.slug,
    })
      .populate('author')
      .populate({
        path: 'comments',
        populate: { path: 'user', model: 'User' },
      })

    if (!post) {
      return res.redirect('/')
    }

    res.render('post', {
      pageTitle: post.title,
      post,
    })
  } catch (e) {
    res.redirect('/')
  }
}

const getCreatePost = (req: Request, res: Response): void => {
  res.render('create', {
    pageTitle: 'Create Post',
    errors: {},
    oldValues: {
      title: '',
      description: '',
      body: '',
    },
  })
}

const getEditPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.redirect('/')
    }

    if (post.author != req.session!.user._id) {
      return res.redirect('/')
    }

    res.render('create', {
      pageTitle: 'Edit Post',
      errors: {},
      editing: true,
      id: req.params.id,
      oldValues: {
        title: post.title,
        description: post.description,
        body: post.body,
      },
    })
  } catch (e) {
    res.redirect('/')
  }
}

const postCreatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    const errs = errsToObj(errors)

    const { title, description, body } = req.body

    if (!errors.isEmpty()) {
      return res.render('create', {
        pageTitle: 'Create Post',
        errors: errs,
        oldValues: {
          title,
          description,
          body,
        },
      })
    }

    const titleSlug = slug(title)

    const slugExists = await Post.findOne({
      author: req.session!.user._id,
      slug: titleSlug,
    })

    if (slugExists) {
      return res.render('create', {
        pageTitle: 'Create Post',
        errors: { title: 'Your post with this title already exists' },
        oldValues: {
          title,
          description,
          body,
        },
      })
    }
    const createdPost = await Post.create({
      title,
      body,
      description,
      slug: titleSlug,
      author: req.session!.user._id,
    })

    const author = await User.findById(req.session!.user._id)

    author!.posts.push(createdPost.id)
    await author!.save()

    socketIo.getIo().emit('postCreated', { post: createdPost, author: author })

    res.redirect(`/@${req.session!.user.username}/${titleSlug}`)
  } catch (e) {
    res.redirect('/')
  }
}

const postEditPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    const errs = errsToObj(errors)

    const { title, description, body } = req.body

    if (!errors.isEmpty()) {
      return res.render('create', {
        pageTitle: 'Edit Post',
        errors: errs,
        oldValues: {
          title,
          description,
          body,
        },
      })
    }

    const post = await Post.findById(req.params.id).populate('author')

    if (!post) {
      return res.redirect('/')
    }

    if (post.author._id != req.session!.user._id) {
      return res.redirect('/')
    }

    const titleSlug = slug(title)

    const slugExists = await Post.findOne({
      author: req.session!.user._id,
      slug: titleSlug,
    })

    if (slugExists && slugExists.slug != post.slug) {
      return res.render('create', {
        pageTitle: 'Edit Post',
        errors: { title: 'Your post with this title already exists' },
        oldValues: {
          title,
          description,
          body,
        },
      })
    }

    post.title = title
    post.slug = titleSlug
    post.description = description
    post.body = body

    await post.save()

    socketIo.getIo().emit('postUpdate', post)

    res.redirect(`/@${req.session!.user.username}/${titleSlug}`)
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
}

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.redirect('/')
    }

    if (post.author != req.session!.user._id) {
      return res.redirect('/')
    }

    const deletedComments = await Comment.find({ post: post.id }).populate(
      'user'
    )

    deletedComments.forEach(async (comment) => {
      const user = await User.findById(comment.user._id)
      if (user) {
        user.comments.filter((cmt) => cmt != comment.id)
        await user.save()
      }
    })

    await Comment.deleteMany({ post: post.id })

    await Post.deleteOne({ _id: req.params.id })

    const author = await User.findById(req.session!.user._id)

    author!.posts = author!.posts.filter((post) => post != req.params.id)

    await author!.save()

    socketIo.getIo().emit('postDelete', post)

    res.redirect('/me')
  } catch (e) {
    console.log(e.message)
    res.redirect('/')
  }
}

export {
  getCreatePost,
  postCreatePost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  getEditPost,
  postEditPost,
  deletePost,
}
