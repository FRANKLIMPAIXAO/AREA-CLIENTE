'use client'

import { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface DownloadButtonProps {
    documentId: string
    documentName: string
}

export default function DownloadButton({ documentId, documentName }: DownloadButtonProps) {
    const [downloading, setDownloading] = useState(false)

    async function handleDownload() {
        setDownloading(true)
        try {
            const response = await fetch(`/api/documents/download/${documentId}`)
            const data = await response.json()

            if (data.url) {
                // Force download by fetching the blob and creating a download link
                const fileResponse = await fetch(data.url)
                const blob = await fileResponse.blob()

                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = data.filename || documentName
                link.style.display = 'none'
                document.body.appendChild(link)
                link.click()

                // Cleanup
                setTimeout(() => {
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(link)
                }, 100)
            }
        } catch (error) {
            console.error('Download error:', error)
            alert('Erro ao fazer download do arquivo')
        } finally {
            setDownloading(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 disabled:opacity-50"
        >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {downloading ? 'Baixando...' : 'Baixar'}
        </button>
    )
}
