import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Grid, Typography } from '@mui/material'
import { RootState } from '@/redux-store/index'
import { fetchTasks, addColumn } from '@/redux-store/slices/kanban'
import KanbanList from './KanbanList'
import { ColumnType, TaskType } from '@/types/apps/kanbanTypes'
import { nanoid } from 'nanoid'
import KanbanDrawer from './KanbanDrawer'

const KanbanBoard = () => {
  const dispatch = useDispatch()
  const kanbanStore = useSelector((state: RootState) => state.kanbanReducer)

  const [columns, setColumns] = useState<ColumnType[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskType | undefined>(undefined)

  useEffect(() => {
    dispatch(fetchTasks() as any)
  }, [dispatch])

  useEffect(() => {
    const groupedByStatus: Record<string, string[]> = {}

    kanbanStore?.tasks?.forEach(task => {

      const status = task.status
      if (!groupedByStatus[status]) {
        groupedByStatus[status] = []
      }
      groupedByStatus[status].push(task._id)
    })

    const newColumns: ColumnType[] = Object.entries(groupedByStatus).map(([status, taskIds]) => ({
      id: nanoid(),
      title: status,
      taskIds
    }))

    setColumns(newColumns)
  }, [kanbanStore.tasks])

  useEffect(() => {
    if (kanbanStore.currentTaskId) {
      const task = kanbanStore.tasks.find(task => task._id === kanbanStore.currentTaskId)
      if (task) {
        setCurrentTask(task)
        setDrawerOpen(true)
      }
    } else {
      setCurrentTask(undefined)
      setDrawerOpen(false)
    }
  }, [kanbanStore.currentTaskId, kanbanStore.tasks])

  const addNewColumn = (title: string) => {
    const newColumn: ColumnType = {
      id: nanoid(),
      title,
      taskIds: []
    }

    dispatch(addColumn(newColumn))
    setColumns(prev => [...prev, newColumn])
  }

  const handleTaskClick = (task: TaskType) => {
    setCurrentTask(task)
    setDrawerOpen(true)
  }

  const handleDrawerClose = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setCurrentTask(undefined)
    }
  }

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Kanban Board
      </Typography>

      <Grid container spacing={4}>
        {columns.map(column => {
          const tasks: TaskType[] = column.taskIds
            .map(taskId => kanbanStore.tasks.find(task => task._id === taskId))
            .filter((task): task is TaskType => !!task)

          return (
            <Grid item xs={12} md={4} key={column.id}>
              <KanbanList
                column={column}
                tasks={tasks}
                dispatch={dispatch}
                store={kanbanStore}
                setDrawerOpen={handleDrawerClose}
                columns={columns}
                setColumns={setColumns}
                currentTask={currentTask}
                onTaskClick={handleTaskClick}
              />
            </Grid>
          )
        })}
      </Grid>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => addNewColumn(`Column ${columns.length + 1}`)}
        >
          Add New Column
        </Button>
      </Box>

      {currentTask && (
        <KanbanDrawer
          task={currentTask}
          drawerOpen={drawerOpen}
          setDrawerOpen={handleDrawerClose}
          dispatch={dispatch}
          columns={columns}
          setColumns={setColumns}
        />
      )}
    </Box>
  )
}

export default KanbanBoard
