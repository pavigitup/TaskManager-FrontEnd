// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

import auth from './slices/auth'

// Slice Imports
import kanbanReducer from '../redux-store/slices/kanban'

export const store = configureStore({
    reducer: {
        auth,
        kanbanReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
