import { Request, Response, NextFunction } from 'express'

const notAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session!.isLoggedIn) {
    return res.redirect('/')
  }
  next()
}

export default notAuth
