import { model, Schema, Model, Document } from 'mongoose'

interface IPost extends Document {
  title: string
  body: string
  slug: string
  author: Schema.Types.ObjectId
}

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Post: Model<IPost> = model<IPost>('Post', postSchema)

export default Post
