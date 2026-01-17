import { createClient } from '../../supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.is_admin || false

    return (
        <div className="flex h-screen bg-muted/40 text-foreground">
            <Sidebar userEmail={user.email!} isAdmin={isAdmin} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in transition-all duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
