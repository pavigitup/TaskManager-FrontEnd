import { useEffect, useState, useCallback } from 'react'
import type { FormEvent, RefObject } from 'react'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'
import classnames from 'classnames'
import axios from 'axios'
import OptionMenu from '@core/components/option-menu'
import TaskCard from './TaskCard'
import NewTask from './NewTask'
import styles from './styles.module.css'

import { addTask, editColumn, deleteColumn, updateColumnTaskIds } from '@/redux-store/slices/kanban'
import type { TaskType, ColumnType, KanbanType, TaskTypeRequest } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'

type KanbanListProps = {
  column: ColumnType
  tasks: TaskType[]
  dispatch: AppDispatch
  store: KanbanType
  setDrawerOpen: (value: boolean) => void
  columns: ColumnType[]
  setColumns: (value: ColumnType[]) => void
  currentTask: TaskType | undefined
  onTaskClick: (task: TaskType) => void
}

const KanbanList = ({
  column,
  tasks,
  dispatch,
  store,
  setDrawerOpen,
  columns,
  setColumns,
  currentTask,
  onTaskClick
}: KanbanListProps) => {
  const [editDisplay, setEditDisplay] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [userIds, setUserIds] = useState<string[]>([])

  const [tasksListRef, tasksList, setTasksList] = useDragAndDrop(tasks, {
    group: 'tasksList',
    plugins: [animations()],
    draggable: el => el.classList.contains('item-draggable')
  })

  const fetchUserIds = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}` + '/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const ids = response?.data?.data?.users?.map((user: any) => user._id) || []
      setUserIds(ids)
    } catch (error) {
      console.error('Error fetching user IDs:', error)
    }
  }

  useEffect(() => {
    fetchUserIds()
  }, [])

  useEffect(() => {
    setTasksList(tasks)
  }, [tasks])

  const addNewTask = useCallback(async (title: string, assigneeId: string) => {
    const taskData: TaskTypeRequest = {
      title,
      description: 'string',
      status: column.title,
      priority: 'medium',
      assignee: assigneeId,
      dueDate: new Date().toISOString()
    }

    try {
      const result = await dispatch(addTask(taskData)).unwrap()
      const updatedTaskList = [...tasksList, result]
      setTasksList(updatedTaskList)

      const newColumns = columns.map(col =>
        col.id === column.id ? { ...col, taskIds: [...col.taskIds, result._id] } : col
      )
      setColumns(newColumns)
    } catch (err) {
      console.error('Add Task Error:', err)
    }
  }, [dispatch, column.title, column.id, tasksList, columns, setColumns])


  const handleSubmitEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditDisplay(false)
    dispatch(editColumn({ id: column.id, title }))
    setColumns(columns.map(col => (col.id === column.id ? { ...col, title } : col)))
  }

  const cancelEdit = () => {
    setEditDisplay(false)
    setTitle(column.title)
  }

  const handleDeleteColumn = () => {
    dispatch(deleteColumn({ columnId: column.id }))
    setColumns(columns.filter(col => col.id !== column.id))
  }

  const handleTaskDelete = (taskId: string) => {
    const filteredTasks = tasksList.filter(task => task._id !== taskId)
    setTasksList(filteredTasks)

    const newTaskIds = column.taskIds.filter(id => id !== taskId)
    const updatedColumns = columns.map(col =>
      col.id === column.id ? { ...col, taskIds: newTaskIds } : col
    )
    setColumns(updatedColumns)
  }

  useEffect(() => {
    const newTaskIds = tasksList.map(task => task._id)
    if (JSON.stringify(newTaskIds) !== JSON.stringify(column.taskIds)) {
      dispatch(updateColumnTaskIds({ id: column.id, taskIds: newTaskIds }))
    }
  }, [tasksList])

  useEffect(() => {
    if (!currentTask) return
    const updated = tasksList.map(task => (task._id === currentTask._id ? currentTask : task))
    setTasksList(updated)
  }, [currentTask])

  useEffect(() => {
    const validTaskIds = columns.flatMap(col => col.taskIds)
    const filtered = tasksList.filter(task => validTaskIds.includes(task._id))
    setTasksList(filtered)
  }, [columns])

  return (
    <div ref={tasksListRef as RefObject<HTMLDivElement>} className='flex flex-col is-[16.5rem]'>
      {editDisplay ? (
        <form className='flex items-center mbe-4' onSubmit={handleSubmitEdit}>
          <InputBase value={title} autoFocus onChange={e => setTitle(e.target.value)} required className='flex-auto' />
          <IconButton color='success' size='small' type='submit'>
            <i className='tabler-check' />
          </IconButton>
          <IconButton color='error' size='small' type='reset' onClick={cancelEdit}>
            <i className='tabler-x' />
          </IconButton>
        </form>
      ) : (
        <div id='no-drag' className={classnames('flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4', styles.kanbanColumn)}>
          <Typography variant='h5' noWrap className='max-is-[80%]'>
            {column.title}
          </Typography>
          <div className='flex items-center'>
            <i className={classnames('tabler-arrows-move text-textSecondary list-handle', styles.drag)} />
            <OptionMenu
              iconClassName='text-xl text-textPrimary'
              options={[
                { text: 'Edit', icon: 'tabler-pencil', menuItemProps: { className: 'flex items-center gap-2', onClick: () => setEditDisplay(true) } },
                { text: 'Delete', icon: 'tabler-trash', menuItemProps: { className: 'flex items-center gap-2', onClick: handleDeleteColumn } }
              ]}
            />
          </div>
        </div>
      )}

      {tasksList.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          dispatch={dispatch}
          column={column}
          setColumns={setColumns}
          columns={columns}
          setDrawerOpen={setDrawerOpen}
          tasksList={tasksList}
          setTasksList={setTasksList}
          onTaskClick={onTaskClick}
          onTaskDelete={handleTaskDelete}
        />
      ))}

      <NewTask addTask={addNewTask} assigneeId='' setAssigneeId={() => { }} userIds={userIds} />
    </div>
  )
}

export default KanbanList
