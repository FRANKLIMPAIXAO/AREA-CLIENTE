'use client'

import { useState } from 'react'
import { DocumentArrowUpIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface Department {
    id: string
    name: string
    slug: string
    icon: string
}

interface AIAnalysis {
    tipo_documento: string
    departamento_sugerido: string
    tipo_sugerido: string
    competencia_extraida: string | null
    vencimento: string | null
    valor_total: number | null
    cnpj: string | null
    codigo_receita: string | null
    pasta_sugerida: string
    empresa_nome: string | null
    observacoes: string
}

export default function SmartUpload({
    companyId,
    departments,
    currentFolderId,
    onSuccess
}: {
    companyId: string
    departments: Department[]
    currentFolderId?: string | null
    onSuccess?: () => void
}) {
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiSuggestions, setAiSuggestions] = useState<AIAnalysis | null>(null)
    const [confidence, setConfidence] = useState<number>(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Form state (pre-filled by AI or manual)
    const [formData, setFormData] = useState({
        departmentId: '',
        type: 'documento',
        competence: '',
        dueDate: ''
    })

    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setAnalyzing(true)
        setError(null)
        setAiSuggestions(null)

        try {
            // Analisar com IA
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/documents/analyze', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Falha na análise')
            }

            const result = await response.json()

            setAiSuggestions(result.data)
            setConfidence(result.confidence)

            // Pre-preencher formulário com sugestões da IA
            const suggestedDept = departments.find(d => d.slug === result.data.departamento_sugerido)

            setFormData({
                departmentId: suggestedDept?.id || '',
                type: result.data.tipo_sugerido || 'documento',
                competence: result.data.competencia_extraida ?
                    result.data.competencia_extraida.substring(0, 7) : '', // Convert YYYY-MM
                dueDate: result.data.vencimento || ''
            })
        } catch (err: any) {
            setError('Não foi possível analisar o documento. Preencha manualmente.')
            console.error('Analysis error:', err)
        } finally {
            setAnalyzing(false)
        }
    }

    async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedFile) return

        setUploading(true)
        setError(null)

        const uploadFormData = new FormData(e.currentTarget)
        uploadFormData.append('file', selectedFile)

        // Adicionar metadados da IA
        if (aiSuggestions) {
            uploadFormData.append('extracted_data', JSON.stringify(aiSuggestions))
            uploadFormData.append('ai_confidence', confidence.toString())
        }

        try {
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: uploadFormData,
            })

            if (!response.ok) {
                throw new Error('Erro ao fazer upload')
            }

            // Reset
            setSelectedFile(null)
            setAiSuggestions(null)
            setFormData({ departmentId: '', type: 'documento', competence: '', dueDate: '' })

            if (onSuccess) {
                onSuccess()
            } else {
                window.location.reload()
            }
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
            {formData.dueDate && <input type="hidden" name="dueDate" value={formData.dueDate} />}

            {/* File Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {analyzing ? (
                        <span className="flex items-center gap-2 text-indigo-600">
                            <SparklesIcon className="h-5 w-5 animate-pulse" />
                            Analisando com IA...
                        </span>
                    ) : (
                        'Arquivo (A IA analisará automaticamente)'
                    )}
                </label>
                <input
                    type="file"
                    onChange={handleFileSelect}
                    disabled={analyzing || uploading}
                    required
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
            disabled:opacity-50"
                />
            </div>

            {/* AI Suggestions */}
            {aiSuggestions && (
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                        <SparklesIcon className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-indigo-900">Análise da IA</h3>
                        <span className="ml-auto text-xs font-medium text-indigo-600">
                            {Math.round(confidence * 100)}% confiança
                        </span>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p><strong>Tipo:</strong> {aiSuggestions.tipo_documento}</p>
                        {aiSuggestions.valor_total && (
                            <p><strong>Valor:</strong> R$ {aiSuggestions.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        )}
                        {aiSuggestions.vencimento && (
                            <p><strong>Vencimento:</strong> {new Date(aiSuggestions.vencimento).toLocaleDateString('pt-BR')}</p>
                        )}
                        {aiSuggestions.observacoes && (
                            <p className="text-gray-600 italic">{aiSuggestions.observacoes}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Form Fields (pre-filled by AI) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                    <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    value={formData.competence}
                    onChange={(e) => setFormData({ ...formData, competence: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={uploading || analyzing || !selectedFile}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
                <DocumentArrowUpIcon className="h-5 w-5" />
                {uploading ? 'Enviando...' : analyzing ? 'Aguarde análise...' : 'Enviar Documento'}
            </button>
        </form>
    )
}
