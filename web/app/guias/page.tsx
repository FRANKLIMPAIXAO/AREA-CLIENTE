import { createClient } from '@/utils/supabase/server'
import { ClipboardDocumentListIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default async function GuiasPage() {
    const supabase = await createClient()

    const { data: guias } = await supabase
        .from('documents')
        .select(`
      id,
      name,
      competence,
      uploaded_at,
      company:companies(name)
    `)
        .eq('type', 'guia')
        .order('competence', { ascending: false })

    // Group by competence
    const guiasByCompetence = guias?.reduce((acc, guia) => {
        const comp = guia.competence || 'Sem competência'
        if (!acc[comp]) acc[comp] = []
        acc[comp].push(guia)
        return acc
    }, {} as Record<string, any[]>)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Guias de Impostos</h1>
                <p className="mt-2 text-gray-600">Visualize suas guias organizadas por competência</p>
            </div>

            <div className="space-y-4">
                {guiasByCompetence && Object.keys(guiasByCompetence).length > 0 ? (
                    Object.entries(guiasByCompetence)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .map(([competence, docs]) => (
                            <div key={competence} className="rounded-lg bg-white shadow">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600" />
                                        {competence}
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {docs.map((doc) => (
                                        <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                <p className="text-sm text-gray-500">{(doc.company as any)?.name}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-400">
                                                    {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                                </span>
                                                <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                    Baixar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma guia</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Nenhuma guia de imposto foi enviada ainda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
