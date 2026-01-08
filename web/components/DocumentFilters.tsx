'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState, useTransition } from 'react'

interface DocumentFiltersProps {
    companies: Array<{ id: string; name: string }>
}

export default function DocumentFilters({ companies }: DocumentFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')

    function updateFilter(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        // Reset to page 1 when filtering
        params.delete('page')

        startTransition(() => {
            router.push(`/documentos?${params.toString()}`)
        })
    }

    function handleSearch(value: string) {
        setSearch(value)

        // Debounce search
        const timeoutId = setTimeout(() => {
            updateFilter('search', value)
        }, 500)

        return () => clearTimeout(timeoutId)
    }

    return (
        <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-2 mb-4">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">Filtros</h3>
                {isPending && <span className="text-xs text-gray-500">(Carregando...)</span>}
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar por nome
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Digite o nome do arquivo..."
                        className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                    </label>
                    <select
                        value={searchParams.get('company') || ''}
                        onChange={(e) => updateFilter('company', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Todas</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                    </label>
                    <select
                        value={searchParams.get('type') || ''}
                        onChange={(e) => updateFilter('type', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="documento">Documento</option>
                        <option value="guia">Guia</option>
                        <option value="contrato">Contrato</option>
                        <option value="balancete">Balancete</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Competência
                    </label>
                    <input
                        type="month"
                        value={searchParams.get('competence') || ''}
                        onChange={(e) => updateFilter('competence', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Clear Filters */}
            {(searchParams.get('company') || searchParams.get('type') || searchParams.get('competence') || searchParams.get('search')) && (
                <div className="mt-4">
                    <button
                        onClick={() => {
                            setSearch('')
                            router.push('/documentos')
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </div>
    )
}
