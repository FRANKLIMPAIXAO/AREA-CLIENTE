'use client'

import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {
        setIsLoading(true)
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
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

                    {message && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                            {message}
                        </div>
                    )}

                    <Button
                        formAction={login}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar com Email'}
                    </Button>
                </div>
            </form>

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
        </div>
    )
}
