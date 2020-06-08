import express from 'express'
import path from 'path'
import session from 'express-session'
import flash from 'connect-flash'

import connectDB from './config/db'
import socketIo from './utils/socket'
import authRouter from './routes/auth'
import postRouter from './routes/post'
import userRouter from './routes/user'
import commentRouter from './routes/comment'

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session!.isLoggedIn
  res.locals.user = req.session!.user
  next()
})

app.use('/auth', authRouter)
app.use('/comment', commentRouter)
app.use(postRouter)
app.use(userRouter)

const PORT = process.env.PORT || 4000
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
  })

  socketIo.init(server)
})
