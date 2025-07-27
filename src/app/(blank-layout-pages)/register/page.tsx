// app/login/page.tsx
import dynamic from 'next/dynamic'

const RegisterClient = dynamic(() => import('./RegisterClient'), { ssr: false })

export default function RegisterPage() {
    return <RegisterClient />
}
