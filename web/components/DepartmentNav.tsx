'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Department {
    id: string
    name: string
    slug: string
    icon: string
    color: string
}

interface DepartmentNavProps {
    departments: Department[]
}

export default function DepartmentNav({ departments }: DepartmentNavProps) {
    const pathname = usePathname()

    return (
        <div className="border-b border-gray-200 bg-white">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Departments">
                <Link
                    href="/documentos"
                    className={`
            whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
            ${pathname === '/documentos'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
          `}
                >
                    📋 Todos
                </Link>
                {departments.map((dept) => (
                    <Link
                        key={dept.id}
                        href={`/documentos?department=${dept.slug}`}
                        className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
              ${pathname.includes(dept.slug) || (new URLSearchParams(window.location.search).get('department') === dept.slug)
                                ? `border-[${dept.color}] text-gray-900`
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
            `}
                        style={{
                            borderBottomColor: (new URLSearchParams(window.location.search).get('department') === dept.slug) ? dept.color : undefined
                        }}
                    >
                        {dept.icon} {dept.name}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
