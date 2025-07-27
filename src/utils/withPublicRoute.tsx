"use client";

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ComponentType } from 'react'
import { RootState } from '@/redux-store'

interface WithPublicRouteProps {
    [key: string]: any;
}

const withPublicRoute = <P extends WithPublicRouteProps>(WrappedComponent: ComponentType<P>) => {
    const PublicRouteComponent = (props: P) => {
        const router = useRouter()
        const token = useSelector((state: RootState) => state.authReducer.token)
        const [isHydrated, setIsHydrated] = useState(false)
        const [isRedirecting, setIsRedirecting] = useState(false)

        useEffect(() => {
            setIsHydrated(true)
        }, [])

        useEffect(() => {
            if (isHydrated && token) {
                setIsRedirecting(true)
                router.replace('/kanban')
            }
        }, [token, router, isHydrated])

        if (!isHydrated || (token && isRedirecting)) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                </div>
            )
        }

        if (!token) {
            return <WrappedComponent {...props} />
        }

        return null
    }

    PublicRouteComponent.displayName = `withPublicRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

    return PublicRouteComponent
}

export default withPublicRoute
