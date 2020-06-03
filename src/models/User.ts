import { Document, model, Model, Schema } from 'mongoose'

interface IUser extends Document {
  name: string
  email: string
  password: string
  posts: [Schema.Types.ObjectId]
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> = model<IUser>('User', userSchema)

export default User
