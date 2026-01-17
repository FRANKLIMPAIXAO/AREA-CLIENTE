import LoginForm from './login-form'
import { Suspense } from 'react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-3xl rounded-full animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-3xl rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
