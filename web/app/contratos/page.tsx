import { createClient } from '@/utils/supabase/server'
import { DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default async function ContratosPage() {
    const supabase = await createClient()

    const { data: contratos } = await supabase
        .from('documents')
        .select(`
      id,
      name,
      uploaded_at,
      company:companies(name, id)
    `)
        .eq('type', 'contrato')
        .order('uploaded_at', { ascending: false })

    // Group by company
    const contratosByCompany = contratos?.reduce((acc, contrato) => {
        const companyName = (contrato.company as any)?.name || 'Sem empresa'
        if (!acc[companyName]) acc[companyName] = []
        acc[companyName].push(contrato)
        return acc
    }, {} as Record<string, any[]>)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
                <p className="mt-2 text-gray-600">Baixe seus contratos organizados por empresa</p>
            </div>

            <div className="space-y-4">
                {contratosByCompany && Object.keys(contratosByCompany).length > 0 ? (
                    Object.entries(contratosByCompany).map(([companyName, docs]) => (
                        <div key={companyName} className="rounded-lg bg-white shadow">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <DocumentIcon className="h-6 w-6 text-purple-600" />
                                    {companyName}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {docs.map((doc) => (
                                    <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Enviado em {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            Baixar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum contrato</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Nenhum contrato foi enviado ainda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
