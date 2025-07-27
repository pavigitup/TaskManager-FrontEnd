// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import kanbanReducer from '@/redux-store/slices/kanban'
import authReducer from '@/redux-store/slices/auth'


export const store = configureStore({
    reducer: {
        authReducer,
        kanbanReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
