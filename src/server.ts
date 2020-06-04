import express from 'express'
import path from 'path'
import session from 'express-session'

import connectDB from './config/db'
import authRouter from './routes/auth'

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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session!.isLoggedIn
  res.locals.user = req.session!.user
  next()
})

app.use('/auth', authRouter)

const PORT = process.env.PORT || 4000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
  })
})
