// loginSchema.ts
import { object, string, email, minLength, pipe } from 'valibot'

export const loginSchema = object({
  email: pipe(
    string(),
    minLength(1, 'Email is required'),
    email('Enter a valid email address')
  ),
  password: pipe(
    string(),
    minLength(1, 'Password is required'),
    minLength(6, 'Password must be at least 6 characters')
  )
})
