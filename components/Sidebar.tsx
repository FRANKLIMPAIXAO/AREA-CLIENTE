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
        <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Área do Cliente
                </h1>
                <NotificationBell />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
              `}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Admin Link */}
            {isAdmin && (
                <a
                    href="/admin"
                    className="mx-3 mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-purple-900 text-white hover:bg-purple-800 transition-colors"
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Admin
                </a>
            )}

            {/* User Info & Logout */}
            <div className="border-t border-gray-800 p-4">
                <div className="mb-3">
                    <p className="text-xs text-gray-400">Logado como</p>
                    <p className="text-sm font-medium truncate">{userEmail}</p>
                </div>
                <form action={signOut}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Sair
                    </button>
                </form>
            </div>
        </div>
    )
}
