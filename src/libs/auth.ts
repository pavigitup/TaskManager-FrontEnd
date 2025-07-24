import jwt from 'jsonwebtoken'

export const verifyToken = (token: string) => {
  try {
    console.log(token)
    
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (err) {
    return null
  }
}
