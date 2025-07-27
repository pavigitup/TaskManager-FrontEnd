export interface TaskType {
  _id: string
  title: string
  description?: string
  status: string
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: Date | string
  assigned?: Array<{
    name: string
    src: string
  }>
  attachments?: number
  comment?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export interface TaskTypeRequest {
  title: string
  description: string
  status: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
}

export interface ColumnType {
  id: string
  title: string
  taskIds: string[]
}

export interface KanbanType {
  tasks: TaskType[]
  currentTaskId: string | null
  loading: boolean
  error: string | null
}

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

// Redux slice action types
export interface EditTaskPayload {
  id: string
  title?: string
  description?: string
  dueDate?: string
  assignee?: string
  status?: string
  priority?: string
  comment?: string
}

export interface UpdateColumnTaskIdsPayload {
  id: string
  taskIds: string[]
}

export interface EditColumnPayload {
  id: string
  title: string
}

export interface DeleteColumnPayload {
  columnId: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

// Additional utility types
export interface TaskFilter {
  status?: string
  priority?: string
  assignee?: string
  search?: string
}

export interface TaskSort {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt'
  order: 'asc' | 'desc'
}

export interface KanbanState {
  tasks: TaskType[]
  columns: ColumnType[]
  currentTaskId: string | null
  loading: boolean
  error: string | null
  filter: TaskFilter
  sort: TaskSort
}

// Form types
export interface TaskFormData {
  title: string
  description: string
  status: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
  comment: string
  // badgeText: string[]
}

export interface ColumnFormData {
  title: string
}

// Component prop types
export interface KanbanBoardProps {
  // Add specific props if needed
}

export interface KanbanListProps {
  column: ColumnType
  tasks: TaskType[]
  dispatch: any // Replace with proper AppDispatch type
  store: KanbanType
  setDrawerOpen: (value: boolean) => void
  columns: ColumnType[]
  setColumns: (value: ColumnType[]) => void
  currentTask: TaskType | undefined
  onTaskClick: (task: TaskType) => void
}

export interface TaskCardProps {
  task: TaskType
  dispatch: any // Replace with proper AppDispatch type
  column: ColumnType
  setColumns: (value: ColumnType[]) => void
  columns: ColumnType[]
  setDrawerOpen: (value: boolean) => void
  tasksList: (TaskType | undefined)[]
  setTasksList: React.Dispatch<React.SetStateAction<TaskType[]>>
  onTaskClick: (task: TaskType) => void
  onTaskDelete: (taskId: string) => void
}

export interface KanbanDrawerProps {
  drawerOpen: boolean
  dispatch: any // Replace with proper AppDispatch type
  setDrawerOpen: (value: boolean) => void
  task: TaskType
  columns: ColumnType[]
  setColumns: (value: ColumnType[]) => void
}


export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

// Error types
export interface KanbanError {
  message: string
  code?: string
  field?: string
}

// Drag and drop types
export interface DragItem {
  id: string
  type: 'task' | 'column'
  index: number
}

export interface DropResult {
  draggableId: string
  type: string
  source: {
    droppableId: string
    index: number
  }
  destination?: {
    droppableId: string
    index: number
  } | null
}
