import slugify from 'slugify'

const slug = (str: string): string => {
  return slugify(str, {
    lower: true,
    strict: true,
  })
}

export default slug
