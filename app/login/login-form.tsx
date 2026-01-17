'use client'

import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo</h2>
                <p className="mt-2 text-sm text-gray-300">Acesse sua conta ou crie uma nova</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all outline-none"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all outline-none"
                            placeholder="Senha"
                        />
                    </div>

                    {/* Optional: Full Name for Signup */}
                    <div>
                        <label htmlFor="fullName" className="sr-only">
                            Nome Completo (apenas para cadastro)
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all outline-none"
                            placeholder="Nome Completo (para cadastro)"
                        />
                    </div>
                </div>

                {message && (
                    <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/50 rounded-lg">
                        {message}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        formAction={login}
                        disabled={isLoading}
                        className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processando...' : 'Entrar'}
                    </button>
                    <button
                        formAction={signup}
                        disabled={isLoading}
                        className="w-full px-4 py-3 text-sm font-medium text-indigo-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Criar Conta
                    </button>
                </div>
            </form>
        </div>
    )
}
