// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-Party Imports
import classnames from 'classnames'

// Type Imports
import type { ColumnType, TaskType } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'
import type { ThemeColor } from '@core/types'

// Slice Imports
import { deleteTask, setCurrentTaskId } from '@/redux-store/slices/kanban'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import styles from './styles.module.css'

type chipColorType = {
    color: ThemeColor
}

type TaskCardProps = {
    task: TaskType
    dispatch: AppDispatch
    column: ColumnType
    setColumns: (value: ColumnType[]) => void
    columns: ColumnType[]
    setDrawerOpen: (value: boolean) => void
    tasksList: (TaskType | undefined)[]
    setTasksList: React.Dispatch<React.SetStateAction<TaskType[]>>
    onTaskClick: (task: TaskType) => void
    onTaskDelete: (taskId: string) => void
}

export const chipColor: { [key: string]: chipColorType } = {
    UX: { color: 'success' },
    'Code Review': { color: 'error' },
    Dashboard: { color: 'info' },
    Images: { color: 'warning' },
    App: { color: 'secondary' },
    'Charts & Map': { color: 'primary' }
}

const TaskCard = (props: TaskCardProps) => {
    // Props
    const {
        task,
        dispatch,
        onTaskClick,
        onTaskDelete
    } = props

    // States
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    // Handle menu click
    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation() // Prevent card click
        setAnchorEl(e.currentTarget)
    }

    // Handle menu close
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    // Handle Task Card Click (opens drawer for editing)
    const handleTaskCardClick = () => {
        dispatch(setCurrentTaskId(task._id))
        onTaskClick(task)
    }

    // Handle Edit Task
    const handleEditTask = () => {
        handleMenuClose()
        dispatch(setCurrentTaskId(task._id))
        onTaskClick(task) // This will open the drawer for editing
    }

    // Delete Task
    const handleDeleteTask = () => {
        handleMenuClose()
        dispatch(deleteTask(task._id))
        onTaskDelete(task._id)
    }

    return (
        <Card
            className={classnames(
                'item-draggable is-[16.5rem] cursor-grab active:cursor-grabbing overflow-visible mbe-4',
                styles.card
            )}
            onClick={handleTaskCardClick}
        >
            <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
                <div className='absolute block-start-4 inline-end-3'>
                    <IconButton
                        aria-label='more'
                        size='small'
                        className={styles.menu}
                        onClick={handleMenuClick}
                    >
                        <i className='tabler-dots-vertical' />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MenuItem onClick={handleEditTask}>
                            <i className='tabler-pencil me-2' />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteTask}>
                            <i className='tabler-trash me-2' />
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
                <Typography color='text.primary' className='max-is-[85%] break-words'>
                    {task.title}
                </Typography>

                {task.description && task.description !== 'string' && (
                    <Typography variant='body2' color='text.secondary' className='max-is-[85%] break-words'>
                        {task.description}
                    </Typography>
                )}

                {task.assigned && task.assigned.length > 0 && (
                    <div className='flex justify-between items-center gap-4 is-full'>
                        <AvatarGroup max={4} className='pull-up'>
                            {task.assigned.map((avatar, index) => (
                                <Tooltip title={avatar.name} key={index}>
                                    <CustomAvatar
                                        src={avatar.src}
                                        alt={avatar.name}
                                        size={26}
                                        className='cursor-pointer'
                                    />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </div>
                )}

                {task.dueDate && (
                    <Typography variant='caption' color='text.secondary'>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default TaskCard
