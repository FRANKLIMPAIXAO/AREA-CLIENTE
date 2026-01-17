'use client'

import { useEffect } from 'react'
import { Button } from '../../components/ui/button'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-lg shadow-sm border border-gray-100 m-4">
            <div className="bg-red-50 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Algo deu errado no Painel Admin!</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                {error.message || "Ocorreu um erro inesperado ao carregar esta página."}
            </p>
            {error.digest && (
                <code className="text-xs bg-gray-100 text-gray-500 p-2 rounded mb-6 block">
                    Error Digest: {error.digest}
                </code>
            )}
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="bg-primary hover:bg-orange-600 text-white font-bold"
            >
                Tentar novamente
            </Button>
        </div>
    )
}
