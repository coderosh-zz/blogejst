import { Result, ValidationError } from 'express-validator'

const errsToObj = (
  errors: Result<ValidationError>
): { [x: string]: string } => {
  const errArray = errors.array()

  const errs: { [x: string]: string } = {}

  for (let i = 0; i < errArray.length; i++) {
    const key: string = errArray[i].param
    errs[key] = errArray[i].msg
  }
  return errs
}

export default errsToObj
