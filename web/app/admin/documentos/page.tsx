import { createClient } from '@/app/supabase/server'
import { DocumentIcon } from '@heroicons/react/24/outline'

export default async function AdminDocumentosPage() {
    const supabase = await createClient()

    const { data: documents } = await supabase
        .from('documents')
        .select(`
      id,
      name,
      type,
      competence,
      file_size,
      uploaded_at,
      company:companies(name),
      uploader:profiles!uploaded_by(full_name)
    `)
        .order('uploaded_at', { ascending: false })
        .limit(100)

    // Get stats
    const { count: totalDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })

    const { count: totalCompanies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })

    const totalSize = documents?.reduce((acc, doc) => acc + (doc.file_size || 0), 0) || 0
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Todos os Documentos</h1>
                <p className="mt-1 text-sm text-gray-500">Visualização global do sistema</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total de Documentos</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalDocs || 0}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total de Empresas</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalCompanies || 0}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Espaço Utilizado</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalSizeMB} MB</dd>
                </div>
            </div>

            {/* Documents Table */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competência</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enviado por</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents && documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                                            {doc.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(doc.company as any)?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-800">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.competence || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(doc.uploader as any)?.full_name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum documento no sistema
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
