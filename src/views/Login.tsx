'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { loginSchema } from '@/schemas/loginSchema'
import { InferInput } from 'valibot'
import { useDispatch } from 'react-redux'
import { loginUser, getTasks } from '@/redux-store/slices/auth'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

// Infer types from schema
type LoginFormData = InferInput<typeof loginSchema>

const LoginPage = () => {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: valibotResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)

    const result = await dispatch(loginUser(data))

    if (result.meta.requestStatus === 'fulfilled') {
      await dispatch(getTasks())
      
      router.push('/kanban')
    } else {
      const errorMsg =
        result.payload?.message || 'Login failed. Please check your credentials.'
      setLoginError(errorMsg)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant='h5' component='h1' mb={3}>
        Login
      </Typography>

      {loginError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  )
}

export default LoginPage
