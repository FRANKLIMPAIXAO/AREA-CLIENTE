'use client'

import { login, signup, forgotPassword } from './actions'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const message = searchParams?.get('message') // Optional chaining for safety
    const [isLoading, setIsLoading] = useState(false)
    const [isRecovery, setIsRecovery] = useState(false)

    // Ensure message is a string before checking includes
    const isSuccessMessage = message && typeof message === 'string' && message.includes('enviado')
    const isErrorMessage = message && typeof message === 'string' && !isSuccessMessage

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="grid gap-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {isRecovery ? 'Recuperar Senha' : 'Bem-vindo de volta'}
                </h1>
                <p className="text-sm text-gray-500">
                    {isRecovery
                        ? 'Digite seu email para receber o link de recuperação'
                        : 'Acesse sua conta para gerenciar seus documentos'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="email" className="sr-only">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="nome@exemplo.com"
                    />
                </div>

                {!isRecovery && (
                    <div className="grid gap-2">
                        <label htmlFor="password" className="sr-only">
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Senha"
                        />
                    </div>
                )}

                {message && (
                    <div className={cn(
                        "p-3 text-sm rounded-md border",
                        isSuccessMessage ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-500 border-red-200"
                    )}>
                        {message}
                    </div>
                )}

                <Button
                    formAction={isRecovery ? forgotPassword : login}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-orange-600 font-bold text-white shadow-md transition-all hover:shadow-lg"
                >
                    {isLoading ? 'Processando...' : (isRecovery ? 'Enviar Email de Recuperação' : 'Entrar com Email')}
                </Button>
            </form>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={() => setIsRecovery(!isRecovery)}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    {isRecovery ? 'Voltar para o Login' : 'Esqueci minha senha'}
                </button>
            </div>

            {!isRecovery && (
                <>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Ou continue com
                            </span>
                        </div>
                    </div>

                    <form>
                        <Button
                            formAction={signup}
                            variant="outline"
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            Criar nova conta
                        </Button>
                    </form>
                </>
            )}
        </div>
    )
}
