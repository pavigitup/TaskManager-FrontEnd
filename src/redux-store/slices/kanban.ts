import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { KanbanType, TaskTypeRequest } from '@/types/apps/kanbanTypes'




const getAuthToken = () => localStorage.getItem('token')


export const fetchTasks = createAsyncThunk(
    'kanban/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken()
            const response = await axios.get("https://taskmanager-backend-2-otiv.onrender.com/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            })
            return response.data.data.tasks
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks')
        }
    }
)

export const addTask = createAsyncThunk(
    'kanban/addTask',
    async (taskData: TaskTypeRequest, { rejectWithValue }) => {
        try {
            const token = getAuthToken()
            const response = await axios.post("https://taskmanager-backend-2-otiv.onrender.com/api/tasks", taskData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            return response.data.data.task
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add task')
        }
    }
)

export const editTask = createAsyncThunk(
    'kanban/editTask',
    async (taskData: {
        id: string
        title?: string
        description?: string
        badgeText?: string[]
        dueDate?: string
        assignee?: string
        status?: string
        comment?: string
        priority?: string
    }, { rejectWithValue }) => {
        try {
            const token = getAuthToken()
            const { id, ...updateData } = taskData

            const response = await axios.put(`https://taskmanager-backend-2-otiv.onrender.com/api/tasks/${id}`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log(response.data.data);


            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task')
        }
    }
)

export const deleteTask = createAsyncThunk(
    'kanban/deleteTask',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const token = getAuthToken()
            await axios.delete(`https://taskmanager-backend-2-otiv.onrender.com/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            return taskId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task')
        }
    }
)


const initialState: KanbanType = {
    tasks: [],
    currentTaskId: null,
    loading: false,
    error: null
}

// Kanban slice
const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        setCurrentTaskId: (state, action) => {
            state.currentTaskId = action.payload
        },

        clearCurrentTask: (state) => {
            state.currentTaskId = null
        },

        addColumn: (state, action) => {
            console.log('Add column:', action.payload)
        },

        editColumn: (state, action) => {
            console.log('Edit column:', action.payload)
        },

        deleteColumn: (state, action) => {
            console.log('Delete column:', action.payload)
        },

        updateColumnTaskIds: (state, action) => {
            console.log('Update column task IDs:', action.payload)
        },

        // Clear error
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false
                state.tasks = action.payload
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Add Task
            .addCase(addTask.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false
                state.tasks.push(action.payload)
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Edit Task
            .addCase(editTask.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(editTask.fulfilled, (state, action) => {
                state.loading = false
                const updatedTask = action.payload
                const taskIndex = state.tasks.findIndex(task => task._id === updatedTask._id)

                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = updatedTask
                }

                if (state.currentTaskId === updatedTask._id) {
                    state.currentTaskId = null
                }
            })
            .addCase(editTask.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false
                const deletedTaskId = action.payload
                state.tasks = state.tasks.filter(task => task._id !== deletedTaskId)
                if (state.currentTaskId === deletedTaskId) {
                    state.currentTaskId = null
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})


export const {
    setCurrentTaskId,
    clearCurrentTask,
    addColumn,
    editColumn,
    deleteColumn,
    updateColumnTaskIds,
    clearError
} = kanbanSlice.actions

export default kanbanSlice.reducer
