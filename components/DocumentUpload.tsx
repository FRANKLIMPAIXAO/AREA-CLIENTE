'use client'

import { useState } from 'react'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

interface Department {
    id: string
    name: string
    icon: string
}

export default function DocumentUpload({
    companyId,
    departments,
    currentFolderId
}: {
    companyId: string
    departments: Department[]
    currentFolderId?: string | null
}) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setUploading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Erro ao fazer upload')
            }

            // Reload page to show new document
            window.location.reload()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleUpload} className="space-y-4">
            <input type="hidden" name="companyId" value={companyId} />
            {currentFolderId && <input type="hidden" name="folderId" value={currentFolderId} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                    <select
                        name="departmentId"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Selecione...</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.icon} {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        name="type"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="documento">Documento</option>
                        <option value="guia">Guia</option>
                        <option value="contrato">Contrato</option>
                        <option value="balancete">Balancete</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Competência (Mês/Ano)</label>
                <input
                    type="month"
                    name="competence"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Arquivo</label>
                <input
                    type="file"
                    name="file"
                    required
                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                />
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
                <DocumentArrowUpIcon className="h-5 w-5" />
                {uploading ? 'Enviando...' : 'Enviar Documento'}
            </button>
        </form>
    )
}
