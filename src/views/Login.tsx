'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Component Imports
import Link from '@components/Link'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { useDispatch } from 'react-redux'

// Hook Imports
import { setTokens } from '@/redux-store/slices/auth'
import withPublicRoute from '@/utils/withPublicRoute'
import axios from 'axios'

interface DecodedToken {
  unique_name: string
  roles: string
}

const LoginV2 = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)


  // Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)


  const onChangeUsername = (e: any) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e: any) => {
    setPassword(e.target.value)
  }

  const onSubmitSuccess = async (accessToken: string) => {
    dispatch(setTokens(accessToken));
    router.replace('/kanban');
    setShowSubmitError(false);
  };

  const onSubmitFailure = (errorMsg: string) => {
    setShowSubmitError(true)
    setErrorMsg(errorMsg)
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const authLoginPostRequest = {
      email: username,
      password: password
    }

    try {
      const responseData = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}` + "/login", authLoginPostRequest);
      if (responseData && responseData?.data?.data?.token) {
        onSubmitSuccess(responseData?.data?.data?.token);
      }
    } catch (error: any) {
      onSubmitFailure(error.message)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            onSubmit={submitForm}
            className='flex flex-col gap-5 w-full max-w-md'
          >
            <CustomTextField autoFocus fullWidth label='Email or Username' placeholder='Enter your email or username' value={username}
              onChange={onChangeUsername}
              autoComplete="username" />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={onChangePassword}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {showSubmitError && <Typography color='error'>{errorMsg}</Typography>}
            <Button fullWidth variant='contained' type='submit'>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} color='primary' href='/register'>
                Create an account
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withPublicRoute(LoginV2)
