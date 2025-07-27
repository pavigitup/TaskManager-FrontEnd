'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import classnames from 'classnames'
import axios from 'axios'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Redux
import { useDispatch } from 'react-redux'
import { setTokens } from '@/redux-store/slices/auth'
import withPublicRoute from '@/utils/withPublicRoute'


const Register = ({ mode }: { mode: SystemMode }) => {
    // States
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role] = useState('admin')
    const [errorMsg, setErrorMsg] = useState('')
    const [showSubmitError, setShowSubmitError] = useState(false)

    const dispatch = useDispatch()
    const router = useRouter()

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    const onSubmitSuccess = async (accessToken: string) => {
        dispatch(setTokens(accessToken))
        setShowSubmitError(false)
        router.replace('/login')
    }

    const onSubmitFailure = (msg: string) => {
        setErrorMsg(msg)
        setShowSubmitError(true)
    }

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!username || !email || !password) {
            return onSubmitFailure('All fields are required.')
        }

        try {
            const res = await axios.post('http://localhost:8001/api/auth/register', {
                username,
                email,
                password,
                role
            })

            const token = res?.data?.data?.token
            if (token) {
                onSubmitSuccess(token)
            } else {
                onSubmitFailure('Registration failed. No token received.')
            }
        } catch (err: any) {
            onSubmitFailure(err?.response?.data?.message || err.message || 'Registration failed.')
        }
    }

    return (
        <div className='flex bs-full justify-center'>
            <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
                <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='h4'>Join Task Manager 📋</Typography>
                        <Typography>Streamline your workflow and boost productivity!</Typography>
                    </div>
                    <form noValidate autoComplete='off' onSubmit={submitForm} className='flex flex-col gap-6'>
                        <CustomTextField fullWidth label='Username' placeholder='Enter your username' value={username} onChange={e => setUsername(e.target.value)} />
                        <CustomTextField fullWidth label='Email' placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} />
                        <CustomTextField
                            fullWidth
                            label='Password'
                            placeholder='············'
                            type={isPasswordShown ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                        {showSubmitError && (
                            <Typography variant='body2' color='error'>
                                {errorMsg}
                            </Typography>
                        )}
                        <Button fullWidth variant='contained' type='submit'>
                            Sign Up
                        </Button>
                        <div className='flex justify-center items-center flex-wrap gap-2'>
                            <Typography>Already have an account?</Typography>
                            <Typography component={Link} href='/login' color='primary'>
                                Sign in instead
                            </Typography>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withPublicRoute(Register)
