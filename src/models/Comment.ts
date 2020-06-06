import { Document, Model, model, Schema } from 'mongoose'

interface IComment extends Document {
  comment: string
  user: any
  post: any
}

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
)

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema)

export default Comment
