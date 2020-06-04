import mongoose, { ConnectionOptions } from 'mongoose'

const connectionOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

const mongoURI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/nodeejsblog'

const connectDb = async (): Promise<void> => {
  const con = await mongoose.connect(mongoURI, connectionOptions)
  console.log(`MongoDB Connected: ${con.connection.host}`)
}

export default connectDb
