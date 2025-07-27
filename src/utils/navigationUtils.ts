// utils/navigationUtils.ts

// Define your route configurations
export const ROUTES = {
    // Public routes - authenticated users will be redirected away from these
    PUBLIC: ['/login', '/register', '/forgot-password', '/reset-password'],

    // Protected routes - unauthenticated users will be redirected to login
    PROTECTED: ['/kanban'],

    // Default routes
    DEFAULT_AUTHENTICATED: '/kanban',
    DEFAULT_UNAUTHENTICATED: '/login'
}

// Utility function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
    return ROUTES.PUBLIC.includes(path)
}

// Utility function to check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
    return ROUTES.PROTECTED.some(route => path.startsWith(route))
}

// Function to get redirect URL based on authentication status and target route
export const getRedirectUrl = (targetUrl: string, isAuthenticated: boolean): string | null => {
    if (isAuthenticated && isPublicRoute(targetUrl)) {
        return ROUTES.DEFAULT_AUTHENTICATED
    }

    if (!isAuthenticated && isProtectedRoute(targetUrl)) {
        return ROUTES.DEFAULT_UNAUTHENTICATED
    }

    return null
}
