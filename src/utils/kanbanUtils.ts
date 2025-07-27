// @/utils/kanbanUtils.ts

import type { User, TaskType } from '@/types/apps/kanbanTypes'

/**
 * Get user name by ID from users array
 */
export const getUserNameById = (userId: string, users: User[]): string => {
    const user = users.find(user => user._id === userId)
    return user ? user.name : 'Unknown User'
}

/**
 * Get user by ID from users array
 */
export const getUserById = (userId: string, users: User[]): User | undefined => {
    return users.find(user => user._id === userId)
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string | undefined): string => {
    if (!date) return ''

    try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return ''

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return ''
    }
}

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: Date | string | undefined): boolean => {
    if (!dueDate) return false

    try {
        const due = new Date(dueDate)
        const now = new Date()
        now.setHours(0, 0, 0, 0) // Reset time to start of day

        return due < now
    } catch {
        return false
    }
}

/**
 * Get priority color
 */
export const getPriorityColor = (priority: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'error'
        case 'medium':
            return 'warning'
        case 'low':
            return 'success'
        default:
            return 'default'
    }
}

/**
 * Validate task data before submission
 */
export const validateTaskData = (task: Partial<TaskType>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!task.title || task.title.trim().length === 0) {
        errors.push('Title is required')
    }

    if (task.title && task.title.trim().length > 100) {
        errors.push('Title must be less than 100 characters')
    }

    if (task.description && task.description.length > 500) {
        errors.push('Description must be less than 500 characters')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Group tasks by status
 */
export const groupTasksByStatus = (tasks: TaskType[]): Record<string, TaskType[]> => {
    return tasks.reduce((acc, task) => {
        const status = task.status || 'No Status'
        if (!acc[status]) {
            acc[status] = []
        }
        acc[status].push(task)
        return acc
    }, {} as Record<string, TaskType[]>)
}

/**
 * Sort tasks by priority and due date
 */
export const sortTasks = (tasks: TaskType[]): TaskType[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }

    return [...tasks].sort((a, b) => {
        // First sort by priority
        const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
        const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0

        if (priorityA !== priorityB) {
            return priorityB - priorityA // Higher priority first
        }

        // Then sort by due date (overdue first)
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }

        if (a.dueDate && !b.dueDate) return -1
        if (!a.dueDate && b.dueDate) return 1

        // Finally sort by creation date (newest first)
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }

        return 0
    })
}

/**
 * Generate initials from user name
 */
export const generateInitials = (name: string): string => {
    if (!name) return 'U'

    const words = name.trim().split(' ')
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase()
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

/**
 * Debounce function for search/filter operations
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout

    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
