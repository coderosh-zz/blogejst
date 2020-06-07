import url from 'url'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import User from '../models/User'
import errsToObj from '../utils/errstoobj'
import { hash, compare } from 'bcryptjs'
import sendMail from '../utils/mail'
import mailTemplate from '../utils/template'
import { createToken, verifyToken } from '../utils/jwt'

const siteUrl = (req: Request) => {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
  })
}

const getSignup = (req: Request, res: Response): void => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    errors: {},
    oldValue: {
      name: '',
      password: '',
      confirmPassword: '',
      email: '',
    },
  })
}

const postSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    const errs = errsToObj(errors)

    const { name, password, confirmPassword, email } = req.body
    if (!errors.isEmpty()) {
      return res.render('auth/signup', {
        pageTitle: 'Signup',
        errors: errs,
        oldValue: {
          name,
          password,
          confirmPassword,
          email,
        },
      })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.render('auth/signup', {
        pageTitle: 'Signup',
        errors: { email: 'Email already in use' },
        oldValue: {
          name,
          password,
          confirmPassword,
          email,
        },
      })
    }

    if (password !== confirmPassword) {
      return res.render('auth/signup', {
        pageTitle: 'Signup',
        errors: { confirmPassword: "Passwords don't match" },
        oldValue: {
          name,
          password,
          confirmPassword,
          email,
        },
      })
    }

    const hashedPassword = await hash(password, 10)

    await User.create({ name, email, password: hashedPassword })

    req.flash('visitVerify', JSON.stringify([true, email]))

    res.redirect('/auth/verify')

    await sendMail({
      to: email,
      subject: 'Verify your email address',
      html: mailTemplate({
        text: 'Please verify your email',
        button: 'VERIFY',
        link: siteUrl(req) + `/auth/verify/${createToken(email)}`,
      }),
    })
  } catch (e) {
    console.log(e.message)
    res.redirect('/auth/signup')
  }
}

const getLogin = (req: Request, res: Response): void => {
  res.render('auth/login', {
    pageTitle: 'Login',
    errors: {},
    flashMsg: req.flash('login')[0],
    oldValue: {
      password: '',
      email: '',
    },
  })
}

const postLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    const errs = errsToObj(errors)

    const { password, email } = req.body

    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        pageTitle: 'Login',
        errors: errs,
        oldValue: {
          password,
          email,
        },
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.render('auth/login', {
        pageTitle: 'Login',
        errors: { email: 'Email not found' },
        oldValue: {
          password,
          email,
        },
      })
    }

    const matchPassword = await compare(password, user.password)

    if (!matchPassword) {
      return res.render('auth/login', {
        pageTitle: 'Login',
        errors: { password: 'Wrong password' },
        oldValue: {
          password,
          email,
        },
      })
    }

    if (!user.verified) {
      return res.render('auth/login', {
        pageTitle: 'Login',
        errors: { email: 'Email not verified' },
        oldValue: {
          password,
          email,
        },
      })
    }

    req.session!.isLoggedIn = true
    req.session!.user = user
    req.session!.save(() => {
      res.redirect('/')
    })
  } catch (e) {
    res.redirect('/auth/signup')
  }
}

const logout = (req: Request, res: Response): void => {
  req.session!.destroy(() => {
    res.redirect('/')
  })
}

const getVerify = (req: Request, res: Response): void => {
  const email = req.flash('visitVerify')[0]
  if (!email) {
    return res.redirect('/')
  }
  res.render('verify', {
    pageTitle: 'Verify',
    email,
  })
}

const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token
    const decoded = verifyToken(token)
    if (!decoded) return res.redirect('/')

    const user = await User.findOne({ email: decoded.payload })

    if (!user) return res.redirect('/')

    user.verified = true

    await user.save()

    res.redirect('/auth/login')
  } catch (e) {
    res.redirect('/')
  }
}

const getForgetPassword = (req: Request, res: Response): void => {
  res.render('forgetPassword', {
    pageTitle: 'Forget Password',
    errors: {},
  })
}

const postForgetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.render('forgetPassword', {
        pageTitle: 'Forget Password',
        errors: { email: 'Please enter correct email' },
      })
    }

    user.reset = true

    user.save()

    req.flash('login', 'Password reset link is sent, please check your email')

    res.redirect('/auth/login')

    await sendMail({
      to: user.email,
      subject: 'Password reset link',
      html: mailTemplate({
        text: 'Click on the link below to reset your password',
        button: 'RESET',
        link: siteUrl(req) + `/auth/reset/${createToken(user.email)}`,
        fullName: user.name,
      }),
    })
  } catch (e) {
    res.redirect('/')
  }
}

const getResetPassword = async (req: Request, res: Response): Promise<void> => {
  const decoded = verifyToken(req.params.token)

  if (!decoded) return res.redirect('/')

  const user = await User.findOne({ email: decoded.payload, reset: true })

  if (!user) return res.redirect('/')

  res.render('resetPassword', {
    pageTitle: 'Reset Password',
    token: req.params.token,
    errors: {},
  })
}

const postResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req)

  const errs = errsToObj(errors)

  if (!errors.isEmpty()) {
    return res.render('resetPassword', {
      pageTitle: 'Reset Password',
      token: req.params.token,
      errors: errs,
    })
  }

  if (req.body.password != req.body.confirmPassword) {
    return res.render('resetPassword', {
      pageTitle: 'Reset Password',
      token: req.params.token,
      errors: { confirmPassword: 'Passwords do not match' },
    })
  }

  const decoded = verifyToken(req.params.token)

  if (!decoded) return res.redirect('/')

  const user = await User.findOne({ email: decoded.payload, reset: true })

  if (!user) return res.redirect('/')

  const hashedPassword = await hash(req.body.password, 10)

  user.password = hashedPassword

  user.reset = false

  user.verified = true

  await user.save()

  req.flash('login', 'Password reset successful')

  res.redirect('/auth/login')
}

export {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
  getVerify,
  verify,
  getForgetPassword,
  postForgetPassword,
  getResetPassword,
  postResetPassword,
}
