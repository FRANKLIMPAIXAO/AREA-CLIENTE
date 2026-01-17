'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '../app/login/actions'
import NotificationBell from './NotificationBell'
import {
    HomeIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    DocumentIcon,
    ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Empresas', href: '/empresas', icon: BuildingOfficeIcon },
    { name: 'Documentos', href: '/documentos', icon: DocumentTextIcon },
    { name: 'Guias', href: '/guias', icon: ClipboardDocumentListIcon },
    { name: 'Contratos', href: '/contratos', icon: DocumentIcon },
]

export default function Sidebar({ userEmail, isAdmin }: { userEmail: string; isAdmin: boolean }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-72 flex-col border-r bg-card text-card-foreground shadow-sm transition-all duration-300">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Área do Cliente
                    </span>
                </Link>
                <NotificationBell />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Menu Principal
                </p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                                )}
                            />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                            )}
                        </Link>
                    )
                })}

                {/* Admin Link */}
                {isAdmin && (
                    <>
                        <div className="my-6 border-t border-border/50" />
                        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Administração
                        </p>
                        <Link
                            href="/admin"
                            className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            <Cog6ToothIcon className="h-5 w-5" />
                            Painel Admin
                        </Link>
                    </>
                )}
            </div>

            {/* User Info & Logout */}
            <div className="border-t border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                            {userEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isAdmin ? 'Administrador' : 'Cliente'}
                        </p>
                    </div>
                </div>
                <form action={signOut}>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2 h-9"
                    >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Sair da conta
                    </Button>
                </form>
            </div>
        </div>
    )
}
