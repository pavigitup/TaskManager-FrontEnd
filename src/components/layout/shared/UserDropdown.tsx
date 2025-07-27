'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { getRedirectUrl, ROUTES } from '@/utils/navigationUtils'
import ErrorMessage from '@/components/ErrorMessage'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuth } from '@/redux-store/slices/auth'
import { RootState } from '@/redux-store'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = (dictionary: any) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.authReducer.token)
  const [error, setError] = useState<{ titleCode: string; detailCode: string } | null>(null)

  const handleDropdownOpen = () => {
    setOpen(!open)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      // Check if the user should be redirected based on auth status
      const redirectUrl = getRedirectUrl(url, !!token)
      const targetUrl = redirectUrl || url
      router.push(targetUrl)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem('access_token')

      // Clear Redux state
      dispatch(clearAuth())

      // Close dropdown
      setOpen(false)

      // Small delay to ensure state is cleared, then navigate
      setTimeout(() => {
        router.replace(ROUTES.DEFAULT_UNAUTHENTICATED)
      }, 100)

    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleProtectedNavigation = (e: MouseEvent<HTMLLIElement>, url: string) => {
    if (token) {
      handleDropdownClose(e, url)
    } else {
      setOpen(false)
      router.replace(ROUTES.DEFAULT_UNAUTHENTICATED)
    }
  }

  return (
    <>
      {error && (
        <ErrorMessage
          titleCode={error.titleCode}
          detailCode={error.detailCode}
          message={`${error.titleCode}: ${error.detailCode}`}
        />
      )}
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt='John Doe'
          src='/images/avatars/1.avif'
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleProtectedNavigation(e, '/profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
