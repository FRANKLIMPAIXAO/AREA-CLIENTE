'use client'

import { useState } from 'react'
import { FolderIcon, FolderOpenIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Folder {
    id: string
    name: string
    parent_folder_id: string | null
    path: string
}

interface FolderTreeProps {
    folders: Folder[]
    currentFolderId: string | null
    onFolderClick: (folderId: string | null) => void
    onCreateFolder: (parentId: string | null, name: string) => void
}

export default function FolderTree({ folders, currentFolderId, onFolderClick, onCreateFolder }: FolderTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([]))
    const [creatingIn, setCreatingIn] = useState<string | null>(null)
    const [newFolderName, setNewFolderName] = useState('')

    // Build folder tree structure
    const rootFolders = folders.filter(f => !f.parent_folder_id)

    function getChildFolders(parentId: string) {
        return folders.filter(f => f.parent_folder_id === parentId)
    }

    function toggleFolder(folderId: string) {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
        } else {
            newExpanded.add(folderId)
        }
        setExpandedFolders(newExpanded)
    }

    function handleCreateFolder(parentId: string | null) {
        if (newFolderName.trim()) {
            onCreateFolder(parentId, newFolderName.trim())
            setNewFolderName('')
            setCreatingIn(null)
        }
    }

    function renderFolder(folder: Folder, level: number = 0) {
        const isExpanded = expandedFolders.has(folder.id)
        const isActive = currentFolderId === folder.id
        const children = getChildFolders(folder.id)
        const hasChildren = children.length > 0

        return (
            <div key={folder.id}>
                <div
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 ${isActive ? 'bg-indigo-50 text-indigo-700' : ''
                        }`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                >
                    {hasChildren && (
                        <button
                            onClick={() => toggleFolder(folder.id)}
                            className="p-0.5 hover:bg-gray-200 rounded"
                        >
                            <ChevronRightIcon
                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                        </button>
                    )}
                    <div
                        onClick={() => onFolderClick(folder.id)}
                        className="flex items-center gap-2 flex-1"
                    >
                        {isExpanded ? (
                            <FolderOpenIcon className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <FolderIcon className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    <button
                        onClick={() => setCreatingIn(folder.id)}
                        className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
                        title="Criar subpasta"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* New folder form */}
                {creatingIn === folder.id && (
                    <div style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }} className="mt-1 mb-2">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateFolder(folder.id)
                                if (e.key === 'Escape') setCreatingIn(null)
                            }}
                            placeholder="Nome da pasta..."
                            className="w-full px-2 py-1 text-sm border rounded"
                            autoFocus
                        />
                    </div>
                )}

                {/* Child folders */}
                {isExpanded && children.map(child => renderFolder(child, level + 1))}
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {/* Root level */}
            <div
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 ${currentFolderId === null ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                onClick={() => onFolderClick(null)}
            >
                <FolderIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">📁 Raiz</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setCreatingIn('root')
                    }}
                    className="ml-auto p-1 hover:bg-gray-200 rounded"
                    title="Criar pasta"
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>

            {/* New folder at root */}
            {creatingIn === 'root' && (
                <div className="ml-4 mt-1 mb-2">
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder(null)
                            if (e.key === 'Escape') setCreatingIn(null)
                        }}
                        placeholder="Nome da pasta..."
                        className="w-full px-2 py-1 text-sm border rounded"
                        autoFocus
                    />
                </div>
            )}

            {/* Render folder tree */}
            {rootFolders.map(folder => renderFolder(folder))}
        </div>
    )
}
