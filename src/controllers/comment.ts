import { Request, Response } from 'express'
import User from '../models/User'
import { validationResult } from 'express-validator'
import Comment from '../models/Comment'
import Post from '../models/Post'

const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const createdBy = await User.findById(req.session!.user._id)
    const post = await Post.findById(req.params.post).populate('author')

    if (!createdBy || !post) return res.redirect('/')

    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.redirect(`/@${post.author.username}/${post.slug}`)

    const comment = await Comment.create({
      user: createdBy.id,
      post: post.id,
      comment: req.body.comment,
    })

    createdBy!.comments.push(comment.id)
    post!.comments.push(comment.id)
    await createdBy.save()
    await post.save()
    res.redirect(`/@${post.author.username}/${post.slug}`)
  } catch (e) {
    res.redirect('/')
  }
}

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBy = await User.findById(req.session!.user._id)
    const post = await Post.findById(req.params.post).populate('author')

    if (!deletedBy || !post) return res.redirect('/')

    post.comments.filter((comment) => comment != req.params.id)
    deletedBy.comments.filter((comment) => comment != req.params.id)

    const comment = await Comment.findById(req.params.id)

    if (!comment || !deletedBy.comments.includes(comment.id)) {
      return res.redirect('/')
    }

    await Comment.remove({ _id: req.params.id })
    await post.save()
    await deletedBy.save()

    res.redirect(`/@${post.author.username}/${post.slug}`)
  } catch (e) {
    res.redirect('/')
  }
}

const editComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const editedBy = await User.findById(req.session!.user._id)
    const post = await Post.findById(req.params.post).populate('author')

    if (!editedBy || !post) return res.redirect('/')

    const comment = await Comment.findById(req.params.id)

    if (!comment || !editedBy.comments.includes(comment.id)) {
      return res.redirect('/')
    }

    comment.comment = req.body.comment
    await comment.save()
    res.redirect(`/@${post.author.username}/${post.slug}`)
  } catch (e) {
    res.redirect('/')
  }
}

export { createComment, deleteComment, editComment }
