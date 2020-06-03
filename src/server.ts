import express from 'express'

import connectDB from './config/db'
import authRouter from './routes/auth'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.use('/auth', authRouter)

const PORT = process.env.PORT || 4000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
  })
})
