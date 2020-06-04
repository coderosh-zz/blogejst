import { Request, Response, NextFunction } from 'express'

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session!.isLoggedIn) {
    return res.redirect('/auth/login')
  }
  next()
}

export default isAuth
