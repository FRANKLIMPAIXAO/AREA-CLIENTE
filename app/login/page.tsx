import LoginForm from './login-form'
import { Suspense } from 'react'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-stone-50">
            {/* Left: Branding & Visuals */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden">
                {/* Brand Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EA580C] via-[#C2410C] to-[#7C2D12]" />

                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                <div className="relative z-20 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white shadow-inner border border-white/10">
                        P
                    </div>
                    <span className="text-2xl font-bold tracking-tight">PAC <span className="text-white/80">Tributária</span></span>
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <blockquote className="space-y-4">
                        <p className="text-xl font-medium leading-relaxed text-orange-50">
                            &ldquo;Nossa missão é transformar a complexidade tributária em oportunidades de crescimento para o seu negócio.&rdquo;
                        </p>
                        <footer className="text-sm font-semibold tracking-wider text-orange-200 uppercase">
                            Excelência e Tecnologia
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="lg:p-8 flex items-center justify-center bg-white">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Carregando...</div>}>
                        <LoginForm />
                    </Suspense>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Precisa de ajuda?{' '}
                        <Link href="https://wa.me/550000000000" className="underline underline-offset-4 hover:text-primary font-medium text-primary">
                            Fale com o Suporte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
