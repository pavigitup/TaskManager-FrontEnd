import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface User {

  // Define user properties here
  id: string;
  email: string;

  // Add other relevant user properties
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  tasks: any[]; // Consider creating a Task interface
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const res = await axios.post<{ token: string; user: User }>(
                'http://localhost:5000/api/auth/login',
                { email, password },
                {
                    withCredentials: true
                }
            )

            localStorage.setItem('token', res.data.token)
            
return res.data.user
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Login failed')
        }
    }
)

export const getTasks = createAsyncThunk('auth/getTasks', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token')

        const res = await axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` }
        })

        
return res.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch tasks')
    }
})

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    tasks: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.tasks = []
            localStorage.removeItem('token') 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false
                state.user = action.payload
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.error = action.payload?.message || 'Login failed'
            })
            .addCase(getTasks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false
                state.tasks = action.payload
                state.error = null
            })
            .addCase(getTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.error = action.payload?.message || 'Failed to fetch tasks'
            })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer