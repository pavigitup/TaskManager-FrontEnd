
// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, pipe, nonEmpty } from 'valibot'
import type { InferInput } from 'valibot'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import { MenuItem } from '@mui/material'

// Styled CustomTextField component
const CustomTextFieldStyled = styled(CustomTextField)({
    '& .MuiInputBase-root.MuiFilledInput-root': {
        backgroundColor: 'var(--mui-palette-background-paper) !important'
    }
})

type FormData = InferInput<typeof schema>

const schema = object({
    content: pipe(string(), nonEmpty('Content is required'), minLength(1)),
    assigneeId: pipe(string(), nonEmpty('Assignee ID is required'), minLength(1))
})

type NewTaskProps = {
    addTask: (title: string, assigneeId: string) => void
    assigneeId: string
    setAssigneeId: (value: string) => void
    userIds: string[]
}

const NewTask = ({ addTask, assigneeId, setAssigneeId, userIds }: NewTaskProps) => {
    // States
    const [displayNewItem, setDisplayNewItem] = useState(false)

    // Hooks
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            content: '',
            assigneeId: ''
        },
        resolver: valibotResolver(schema)
    })

    // Display the Add New Task form
    const toggleDisplay = () => {
        setDisplayNewItem(!displayNewItem)
    }

    // Handle the Add New Task form
    const onSubmit = (data: FormData) => {
        addTask(data.content, data.assigneeId)
        setDisplayNewItem(false)
        reset({ content: '', assigneeId: '' })
    }

    // Handle reset
    const handleReset = () => {
        toggleDisplay()
        reset({ content: '', assigneeId: '' })
    }

    return (
        <div className='flex flex-col gap-4 items-start'>
            <Typography onClick={toggleDisplay} color='text.primary' className='flex items-center gap-1 cursor-pointer'>
                <i className='tabler-plus text-base' />
                <span>Add New Item</span>
            </Typography>
            {displayNewItem && (
                <form className='flex flex-col gap-4 min-is-[16.5rem]' onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name='content'
                        control={control}
                        render={({ field }) => (
                            <CustomTextFieldStyled
                                fullWidth
                                multiline
                                autoFocus
                                rows={2}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSubmit(onSubmit)(e)
                                    }

                                    if (e.key === 'Escape') {
                                        handleReset()
                                    }
                                }}
                                placeholder='Add Content'
                                variant='outlined'
                                {...field}
                                error={Boolean(errors.content)}
                                helperText={errors.content ? errors.content.message : null}
                            />
                        )}
                    />
                    <Controller
                        name='assigneeId'
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={Boolean(errors.assigneeId)}>
                                <InputLabel id="assignee-select-label">Assignee</InputLabel>
                                <Select
                                    labelId="assignee-select-label"
                                    id="assignee-select"
                                    label="Assignee"
                                    {...field}
                                >
                                    {userIds.map((userId) => (
                                        <MenuItem key={userId} value={userId}>
                                            {userId}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.assigneeId && (
                                    <Typography variant="caption" color="error">
                                        {errors.assigneeId.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />
                    <div className='flex gap-3'>
                        <Button variant='contained' size='small' color='primary' type='submit'>
                            Add
                        </Button>
                        <Button
                            variant='tonal'
                            size='small'
                            color='secondary'
                            onClick={() => {
                                handleReset()
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default NewTask
