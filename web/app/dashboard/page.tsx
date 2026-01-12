import { createClient } from '@/app/supabase/server'
import DueDatesCalendar from '@/components/DueDatesCalendar'
import { CalendarIcon, DocumentTextIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Buscar empresas do usuário
    const { data: companies } = await supabase
        .from('user_companies')
        .select(`
      company:companies (
        id,
        name,
        cnpj
      )
    `)
        .eq('user_id', user!.id)

    const companiesCount = companies?.length || 0

    // Buscar documentos recentes
    const { data: recentDocuments } = await supabase
        .from('documents')
        .select(`
      id,
      name,
      type,
      competence,
      uploaded_at,
      company:companies (
        name
      ),
      department:departments(name, icon)
    `)
        .order('uploaded_at', { ascending: false })
        .limit(5)

    const totalDocuments = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true })

    // Buscar documentos com vencimento (apenas do mês atual)
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const { data: rawDueDocs } = await supabase
        .from('documents')
        .select('id, name, type, due_date, company_id')
        .not('due_date', 'is', null)
        .gte('due_date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('due_date', lastDayOfMonth.toISOString().split('T')[0])
        .order('due_date')

    // Buscar nomes das empresas
    const dueDocsWithCompany = await Promise.all(
        (rawDueDocs || []).map(async (doc) => {
            const { data: company } = await supabase
                .from('companies')
                .select('name')
                .eq('id', doc.company_id)
                .single()

            return {
                id: doc.id,
                name: doc.name,
                type: doc.type,
                due_date: doc.due_date,
                company: { name: company?.name || 'Desconhecida' }
            }
        })
    )

    // Contar documentos por departamento
    const { data: depStats } = await supabase
        .from('documents')
        .select(`
      department_id,
      department:departments(name, icon, color)
    `)

    const departmentCounts = depStats?.reduce((acc, doc) => {
        const deptName = (doc.department as any)?.name || 'Sem departamento'
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const stats = [
        { name: 'Empresas', value: companiesCount, icon: BuildingOfficeIcon, color: 'bg-indigo-600' },
        { name: 'Documentos', value: totalDocuments.count || 0, icon: DocumentTextIcon, color: 'bg-purple-600' },
        { name: 'Vencimentos', value: dueDocsWithCompany.length, icon: ClockIcon, color: 'bg-red-600' },
        {
            name: 'Este Mês', value: recentDocuments?.filter(d =>
                new Date(d.uploaded_at).getMonth() === new Date().getMonth()
            ).length || 0, icon: CalendarIcon, color: 'bg-green-600'
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Bem-vindo à sua área do cliente</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                    >
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 rounded-md ${stat.color} p-3`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                    {stat.value}
                                </dd>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Calendar and Documents Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Calendar */}
                <DueDatesCalendar documents={dueDocsWithCompany} />

                {/* Department Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos por Departamento</h2>
                    <div className="space-y-3">
                        {departmentCounts && Object.entries(departmentCounts).map(([dept, count]) => (
                            <div key={dept} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{dept}</span>
                                <span className="text-sm font-semibold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Documents */}
            <div className="rounded-lg bg-white shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Documentos Recentes</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentDocuments && recentDocuments.length > 0 ? (
                        recentDocuments.map((doc) => (
                            <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {(doc.department as any)?.icon && (
                                            <span>{(doc.department as any).icon}</span>
                                        )}
                                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {(doc.company as any)?.name} • {doc.type} • {doc.competence || 'N/A'}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            Nenhum documento encontrado
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
