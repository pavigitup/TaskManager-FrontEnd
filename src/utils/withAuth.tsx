// utils/withAuth.tsx
"use client";

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ComponentType } from 'react'
import { RootState } from '@/redux-store'

interface WithAuthProps {
    [key: string]: any;
}

const withAuth = <P extends WithAuthProps>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter()
        const token = useSelector((state: RootState) => state.authReducer.token)
        const [isHydrated, setIsHydrated] = useState(false)
        const [isCheckingAuth, setIsCheckingAuth] = useState(true)

        // Handle hydration to prevent SSR mismatch
        useEffect(() => {
            setIsHydrated(true)
        }, [])

        // Handle authentication check
        useEffect(() => {
            if (isHydrated) {
                if (!token) {
                    router.replace('/login')
                } else {
                    setIsCheckingAuth(false)
                }
            }
        }, [token, router, isHydrated])

        // Show loading state during hydration and auth check
        if (!isHydrated || isCheckingAuth) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                </div>
            )
        }

        // Only render the wrapped component after hydration and auth success
        return <WrappedComponent {...props} />
    }

    // Set display name for better debugging
    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

    return AuthenticatedComponent
}

export default withAuth
