// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { minLength, nonEmpty, object, pipe, string } from 'valibot'
import type { InferInput } from 'valibot'
import axios from 'axios'

// Utils
import { validateTaskData, generateInitials } from '@/utils/kanbanUtils'

// Type Imports
import type { ColumnType, TaskType } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'

// Slice Imports
import { editTask, deleteTask } from '@/redux-store/slices/kanban'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

type KanbanDrawerProps = {
    drawerOpen: boolean
    dispatch: AppDispatch
    setDrawerOpen: (value: boolean) => void
    task: TaskType
    columns: ColumnType[]
    setColumns: (value: ColumnType[]) => void
}

type FormData = InferInput<typeof schema>

type User = {
    _id: string
    username: string
    email: string
    avatar?: string
}

const schema = object({
    title: pipe(string(), nonEmpty('Title is required'), minLength(1)),
    description: pipe(string(), nonEmpty('Description is required'))
})

const KanbanDrawer = (props: KanbanDrawerProps) => {
    // Props
    const { drawerOpen, dispatch, setDrawerOpen, task, columns, setColumns } = props

    // States
    const [date, setDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
    const [comment, setComment] = useState<string>('')
    const [assigneeId, setAssigneeId] = useState<string>(task.assignee || '')
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [updateError, setUpdateError] = useState<string>('')
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            title: task.title,
            description: task.description || ''
        },
        resolver: valibotResolver(schema)
    })

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:8001/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        reset({
            title: task.title,
            description: task.description || ''
        })
        setDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setComment(task.comment || '')
        fetchUsers()
    }, [task, reset])

    useEffect(() => {
        if (drawerOpen) {
            fetchUsers()
        }
    }, [drawerOpen])

    const handleClose = () => {
        setDrawerOpen(false)
        setUpdateError('')
        reset({
            title: task.title,
            description: task.description || ''
        })
        setDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setComment('')
        setAssigneeId(task.assignee || '')
    }

    const updateTask = async (data: FormData) => {
        try {
            setLoading(true)
            setUpdateError('')

            const validation = validateTaskData({
                title: data.title,
                description: data.description
            })

            if (!validation.isValid) {
                setUpdateError(validation.errors.join(', '))
                return
            }

            const updatedTaskData = {
                id: task._id,
                title: data.title.trim(),
                description: data.description.trim(),
                dueDate: date?.toISOString(),
                assignee: assigneeId,
                status: task.status,
                priority: task.priority,
                comment: task?.comment
            }
            const result = await dispatch(editTask(updatedTaskData)).unwrap()
            const updatedColumns = columns.map(column => {
                const updatedTaskIds = column.taskIds.map(taskId =>
                    taskId === task._id ? result._id || task._id : taskId
                )
                return { ...column, taskIds: updatedTaskIds }
            })
            setColumns(updatedColumns)

            handleClose()
        } catch (error: any) {
            console.error('Error updating task:', error)
            setUpdateError(error.message || 'Failed to update task')
        } finally {
            setLoading(false)
        }
    }

    // Handle Delete Task
    const handleDeleteTask = async () => {
        try {
            setLoading(true)
            await dispatch(deleteTask(task._id)).unwrap()
            const updatedColumns = columns.map(column => ({
                ...column,
                taskIds: column.taskIds.filter(taskId => taskId !== task._id)
            }))

            setColumns(updatedColumns)
            setDrawerOpen(false)
        } catch (error) {
            console.error('Error deleting task:', error)
        } finally {
            setLoading(false)
        }
    }

    // Set initial values when task changes
    useEffect(() => {
        reset({
            title: task.title,
            description: task.description || ''
        })
        setDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setAssigneeId(task.assignee || '')
    }, [task, reset])

    return (
        <Drawer
            open={drawerOpen}
            anchor='right'
            variant='temporary'
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            onClose={handleClose}
        >
            <div className='flex justify-between items-center pli-6 plb-5 border-be'>
                <Typography variant='h5'>Edit Task</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='tabler-x text-2xl text-textPrimary' />
                </IconButton>
            </div>

            <div className='p-6'>
                <form className='flex flex-col gap-y-5' onSubmit={handleSubmit(updateTask)}>
                    {/* Error Display */}
                    {updateError && (
                        <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                            <Typography variant='body2' color='error'>
                                {updateError}
                            </Typography>
                        </div>
                    )}

                    {/* Title Field */}
                    <Controller
                        name='title'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                fullWidth
                                label='Title'
                                {...field}
                                error={Boolean(errors.title)}
                                helperText={errors.title?.message}
                                disabled={loading}
                            />
                        )}
                    />

                    {/* Description Field */}
                    <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                fullWidth
                                label='Description'
                                {...field}
                                multiline
                                rows={3}
                                error={Boolean(errors.description)}
                                helperText={errors.description?.message}
                                disabled={loading}
                            />
                        )}
                    />

                    {/* Due Date */}
                    <AppReactDatepicker
                        selected={date}
                        id='due-date-picker'
                        onChange={(date: Date) => setDate(date)}
                        placeholderText='Click to select a date'
                        dateFormat={'d MMMM, yyyy'}
                        customInput={<CustomTextField label='Due Date' fullWidth disabled={loading} />}
                    />

                    {/* Assignee Dropdown */}
                    <FormControl fullWidth disabled={loading}>
                        <InputLabel id="assignee-select-label">Assignee</InputLabel>
                        <Select
                            labelId="assignee-select-label"
                            id="assignee-select"
                            value={assigneeId}
                            label="Assignee"
                            onChange={(e) => setAssigneeId(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>No Assignee</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    <div className='flex items-center gap-2'>
                                        <CustomAvatar
                                            src={user.avatar}
                                            size={24}
                                            className='shrink-0'
                                        >
                                            {generateInitials(user.username)}
                                        </CustomAvatar>
                                        <div className='flex flex-col'>
                                            <Typography variant='body2'>{user.username}</Typography>
                                            <Typography variant='caption' color='text.secondary'>
                                                {user.email}
                                            </Typography>
                                        </div>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Current Assigned Users Display */}
                    {task.assigned && task.assigned.length > 0 && (
                        <div>
                            <Typography variant='caption' color='text.primary'>
                                Currently Assigned
                            </Typography>
                            <div className='flex gap-1 mt-2'>
                                {task.assigned.map((avatar, index) => (
                                    <Tooltip title={avatar.name} key={index}>
                                        <CustomAvatar
                                            src={avatar.src}
                                            size={26}
                                            className='cursor-pointer'
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Comments */}
                    <CustomTextField
                        fullWidth
                        label='Comment'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        multiline
                        rows={4}
                        placeholder='Write a Comment....'
                        disabled={loading}
                    />

                    {/* Action Buttons */}
                    <div className='flex gap-4'>
                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                        <Button
                            variant='tonal'
                            color='error'
                            onClick={handleDeleteTask}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default KanbanDrawer
