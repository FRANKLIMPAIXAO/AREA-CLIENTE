'use client'

import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
    id: string | null
    name: string
}

interface FolderBreadcrumbProps {
    path: BreadcrumbItem[]
    onNavigate: (folderId: string | null) => void
}

export default function FolderBreadcrumb({ path, onNavigate }: FolderBreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button
                onClick={() => onNavigate(null)}
                className="hover:text-gray-700 flex items-center gap-1"
            >
                <HomeIcon className="h-4 w-4" />
                Raiz
            </button>

            {path.filter(p => p.id !== null).map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                    <ChevronRightIcon className="h-4 w-4" />
                    <button
                        onClick={() => onNavigate(item.id)}
                        className={`hover:text-gray-700 ${index === path.length - 1 ? 'font-medium text-gray-900' : ''
                            }`}
                    >
                        {item.name}
                    </button>
                </div>
            ))}
        </nav>
    )
}
