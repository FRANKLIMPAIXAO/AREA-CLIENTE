import LoginForm from './login-form'
import { Suspense } from 'react'
import Link from 'next/link'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding & Testimonial/visuals */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2">
                        <BuildingOfficeIcon className="h-6 w-6" />
                        Área do Cliente
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Esta plataforma transformou a maneira como gerenciamos nossa contabilidade.
                            Tudo está organizado e acessível em segundos.&rdquo;
                        </p>
                        <footer className="text-sm">Empresa Parceira</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="lg:p-8 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acessar conta
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entre com seu email para acessar o painel
                        </p>
                    </div>

                    <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Carregando...</div>}>
                        <LoginForm />
                    </Suspense>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Ao clicar em continuar, você concorda com nossos{' '}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Termos de Serviço
                        </Link>{' '}
                        e{' '}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacidade
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
