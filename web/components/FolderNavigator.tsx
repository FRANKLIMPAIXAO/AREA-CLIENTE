'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FolderTree from './FolderTree'
import FolderBreadcrumb from './FolderBreadcrumb'

interface Folder {
    id: string
    name: string
    parent_folder_id: string | null
    path: string
}

interface FolderNavigatorProps {
    companyId: string
    departmentId: string
    initialFolders: Folder[]
}

export default function FolderNavigator({ companyId, departmentId, initialFolders }: FolderNavigatorProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [folders, setFolders] = useState<Folder[]>(initialFolders)
    const currentFolderId = searchParams.get('folder')

    // Build breadcrumb path
    const buildPath = (folderId: string | null): Array<{ id: string | null; name: string }> => {
        if (!folderId) return []

        const folder = folders.find(f => f.id === folderId)
        if (!folder) return []

        const pathParts = [{ id: folder.id, name: folder.name }]

        if (folder.parent_folder_id) {
            pathParts.unshift(...buildPath(folder.parent_folder_id))
        }

        return pathParts
    }

    const breadcrumbPath = buildPath(currentFolderId)

    function handleFolderClick(folderId: string | null) {
        const params = new URLSearchParams(searchParams.toString())
        if (folderId) {
            params.set('folder', folderId)
        } else {
            params.delete('folder')
        }
        router.push(`/documentos?${params.toString()}`)
    }

    async function handleCreateFolder(parentId: string | null, name: string) {
        try {
            const response = await fetch('/api/folders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId,
                    departmentId,
                    parentFolderId: parentId,
                    name,
                }),
            })

            if (response.ok) {
                // Reload to get updated folders
                router.refresh()
            }
        } catch (error) {
            console.error('Error creating folder:', error)
        }
    }

    return (
        <div className="space-y-4">
            <FolderBreadcrumb path={breadcrumbPath} onNavigate={handleFolderClick} />
            <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                <FolderTree
                    folders={folders}
                    currentFolderId={currentFolderId}
                    onFolderClick={handleFolderClick}
                    onCreateFolder={handleCreateFolder}
                />
            </div>
        </div>
    )
}
