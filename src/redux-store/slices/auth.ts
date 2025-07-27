import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    userRole: string
    username: string
    token: string
}

const initialState: AuthState = {
    userRole: typeof window !== 'undefined' ? localStorage.getItem('userRole') || '' : '',
    username: typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '',
    token: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<string>) => {
            state.userRole = action.payload
            localStorage.setItem('userRole', action.payload)
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.username = action.payload
            localStorage.setItem('username', action.payload)
        },
        setTokens: (state, action: PayloadAction<string>) => {
            state.token = action.payload
            localStorage.setItem('token', action.payload)
        },
        clearAuth: (state) => {
            state.username = ''
            state.userRole = ''
            state.token = ''
            localStorage.removeItem('username')
            localStorage.removeItem('userRole')
            localStorage.removeItem('token')
        }
    }
})

export const { setUserRole, setUserName, setTokens, clearAuth } = authSlice.actions

export default authSlice.reducer
