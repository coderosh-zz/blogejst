import nodemailer, { SendMailOptions } from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> => {
  const msg: SendMailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    html,
    subject,
  }

  return transporter.sendMail(msg)
}

export default sendMail
