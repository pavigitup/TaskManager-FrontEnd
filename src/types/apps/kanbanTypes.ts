export type TaskType = {
  id: string
  title: string
  badgeText?: string[]
  attachments?: number
  comments?: number
  assigned?: { src: string; name: string }[]
  image?: string
  dueDate?: Date
  columnId: string
}

export type ColumnType = {
  id: string
  title: string
  taskIds: string[]
}

export type KanbanType = {
  columns: ColumnType[]
  tasks: TaskType[]
  currentTaskId?: string
}
