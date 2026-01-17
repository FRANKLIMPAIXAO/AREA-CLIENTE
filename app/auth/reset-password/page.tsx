'use client'

import { useActionState } from 'react'
import { resetPassword } from './actions'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { LockClosedIcon } from '@heroicons/react/24/outline'

const initialState = {
    error: '',
    message: ''
}

function ResetPasswordForm() {
    const [state, formAction, isPending] = useActionState(resetPassword, initialState)

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {state.error}
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                    Nova Senha
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Digite sua nova senha"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                    Confirmar Nova Senha
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Confirme sua nova senha"
                />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-orange-600 font-bold text-white" disabled={isPending}>
                {isPending ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <LockClosedIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Definir Nova Senha</CardTitle>
                    <CardDescription>
                        Digite sua nova senha abaixo para recuperar o acesso à sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </div>
    )
}
