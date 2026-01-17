import { createClient } from '../../supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('Admin Layout: Auth error or no user', authError)
            redirect('/login')
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Admin Layout: Profile fetch error', profileError)
            // Fallback or redirect if profile fetch fails
            redirect('/dashboard?message=Erro ao verificar permissões de administrador')
        }

        if (!profile?.is_admin) {
            redirect('/dashboard')
        }

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                                <nav className="flex gap-4">
                                    <a href="/admin/empresas" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Empresas
                                    </a>
                                    <a href="/admin/usuarios" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Usuários
                                    </a>
                                    <a href="/admin/documentos" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Documentos
                                    </a>
                                </nav>
                            </div>
                            <a href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
                                ← Voltar para Área do Cliente
                            </a>
                        </div>
                    </div>
                </div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        )
    } catch (e) {
        console.error('Unexpected error in AdminLayout:', e)
        redirect('/dashboard?message=Erro inesperado ao acessar painel administrativo')
    }
}
