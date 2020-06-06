import { model, Schema, Model, Document, HookNextFunction } from 'mongoose'
import marked from 'marked'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = (new JSDOM().window as unknown) as Window
const dompurify = createDOMPurify(window)

interface IPost extends Document {
  title: string
  body: string
  description: string
  slug: string
  html: string
  author: any
  comments: any[]
}

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    html: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
)

postSchema.pre('validate', function (this: IPost, next: HookNextFunction) {
  if (this.body) {
    this.html = dompurify.sanitize(marked(this.body, { breaks: true }))
  }
  next()
})

const Post: Model<IPost> = model<IPost>('Post', postSchema)

export default Post
