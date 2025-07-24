
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import type { ColumnType, TaskType, KanbanType } from '@/types/apps/kanbanTypes'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Async Thunks
export const fetchKanbanData = createAsyncThunk('kanban/fetchData', async () => {
  const response = await axios.get<KanbanType>(`${API_URL}/kanban`)
  return response.data
})

export const addColumn = createAsyncThunk('kanban/addColumn', async (title: string) => {
  const response = await axios.post<ColumnType>(`${API_URL}/columns`, { title })
  return response.data
})

export const editColumn = createAsyncThunk(
  'kanban/editColumn',
  async ({ id, title }: { id: number; title: string }) => {
    const response = await axios.put<ColumnType>(`${API_URL}/columns/${id}`, { title })
    return response.data
  }
)

export const deleteColumn = createAsyncThunk('kanban/deleteColumn', async (columnId: number) => {
  await axios.delete(`${API_URL}/columns/${columnId}`)
  return columnId
})

export const updateColumns = createAsyncThunk('kanban/updateColumns', async (columns: ColumnType[]) => {
  const response = await axios.put<ColumnType[]>(`${API_URL}/columns`, columns)
  return response.data
})

export const addTask = createAsyncThunk(
  'kanban/addTask',
  async ({ columnId, title }: { columnId: number; title: string }) => {
    const response = await axios.post<TaskType>(`${API_URL}/tasks`, { columnId, title })
    return response.data
  }
)

export const editTask = createAsyncThunk(
  'kanban/editTask',
  async (taskData: Partial<TaskType> & { id: number }) => {
    const response = await axios.put<TaskType>(`${API_URL}/tasks/${taskData.id}`, taskData)
    return response.data
  }
)

export const deleteTask = createAsyncThunk('kanban/deleteTask', async (taskId: number) => {
  await axios.delete(`${API_URL}/tasks/${taskId}`)
  return taskId
})

// interface KanbanState extends KanbanType {
//   currentTaskId: number | null
// }

const initialState: KanbanType = {
  tasks: [],
  columns: [],
  currentTaskId: undefined
}

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    getCurrentTask: (state, action: PayloadAction<string | undefined>) => {
      state.currentTaskId = action.payload
    },
    updateColumnTaskIds: (state, action: PayloadAction<{ id: string; tasksList: TaskType[] }>) => {
      const { id, tasksList } = action.payload
      const column = state.columns.find(col => col.id === id)
      if (column) {
        column.taskIds = tasksList.map(task => task.id)
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchKanbanData.fulfilled, (state, action) => {
        return { ...state, ...action.payload }
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload)
      })
      .addCase(editColumn.fulfilled, (state, action) => {
        const index = state.columns.findIndex(col => col.id === action.payload.id)
        if (index !== -1) {
          state.columns[index] = action.payload
        }
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.columns = state.columns.filter(col => col.id !== action.payload)
        state.tasks = state.tasks.filter(task => task.columnId !== action.payload)
      })
      .addCase(updateColumns.fulfilled, (state, action) => {
        state.columns = action.payload
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
        const column = state.columns.find(col => col.id === action.payload.columnId)
        if (column) {
          column.taskIds.push(action.payload.id)
        }
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id)
        if (index !== -1) {
          state.tasks[index] = action.payload
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload)
        state.columns.forEach(column => {
          column.taskIds = column.taskIds.filter(id => id !== action.payload)
        })
      })
  }
})

export const { getCurrentTask, updateColumnTaskIds } = kanbanSlice.actions

export default kanbanSlice.reducer