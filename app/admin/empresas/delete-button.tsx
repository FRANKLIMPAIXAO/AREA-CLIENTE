'use client'

import { TrashIcon } from '@heroicons/react/24/outline'

export function DeleteButton({ formAction, companyId }: { formAction: (formData: FormData) => void, companyId: string }) {
    return (
        <form action={formAction} className="inline">
            <input type="hidden" name="id" value={companyId} />
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 ml-4"
                onClick={(e) => {
                    if (!confirm('Tem certeza? Isso removerá todos os vínculos e documentos!')) {
                        e.preventDefault()
                    }
                }}
            >
                <TrashIcon className="h-4 w-4 inline" />
            </button>
        </form>
    )
}
