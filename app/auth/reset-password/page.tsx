import { createClient } from '../../../supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import ResetPasswordForm from './reset-password-form'
import Link from 'next/link'

export default async function ResetPasswordPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <LockClosedIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Definir Nova Senha</CardTitle>
                    <CardDescription>
                        {user ? (
                            <>
                                Logado como: <span className="font-medium text-orange-600">{user.email}</span>
                                <br />
                                Digite sua nova senha abaixo.
                            </>
                        ) : (
                            <span className="text-red-500 font-bold">
                                Erro: Sessão não encontrada. O link pode ter expirado.
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {user ? (
                        <ResetPasswordForm />
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-4">
                                Tente solicitar um novo link de recuperação.
                            </p>
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Voltar para o Login
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
