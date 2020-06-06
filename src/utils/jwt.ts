import { sign, verify } from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'secretkey'

const createToken = (payload: string): string => {
  return sign({ payload }, jwtSecret, {
    expiresIn: '1d',
  })
}

const verifyToken = (token: string): { payload: string } => {
  return verify(token, jwtSecret) as { payload: string }
}

export { createToken, verifyToken }
