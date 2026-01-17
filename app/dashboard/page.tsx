import { createClient } from '../../supabase/server'
import DueDatesCalendar from '../../components/DueDatesCalendar'
import { CalendarIcon, DocumentTextIcon, BuildingOfficeIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { cn } from '../../lib/utils'

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

    const thisMonthDocs = recentDocuments?.filter(d =>
        new Date(d.uploaded_at).getMonth() === new Date().getMonth()
    ).length || 0

    const stats = [
        {
            name: 'Empresas Ativas',
            value: companiesCount,
            icon: BuildingOfficeIcon,
            description: "Empresas vinculadas",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            name: 'Total Documentos',
            value: totalDocuments.count || 0,
            icon: DocumentTextIcon,
            description: "Arquivos processados",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            name: 'Vencimentos',
            value: dueDocsWithCompany.length,
            icon: ClockIcon,
            description: "Neste mês",
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            name: 'Recentes',
            value: thisMonthDocs,
            icon: CalendarIcon,
            description: "Uploads este mês",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Visão Geral
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Acompanhe o status e as atividades recentes das suas empresas.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sistema Online
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="overflow-hidden transition-all hover:shadow-md border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.name}
                            </CardTitle>
                            <div className={cn("p-2 rounded-full", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Calendar Section */}
                <Card className="col-span-4 border-border/50">
                    <CardHeader>
                        <CardTitle>Calendário de Obrigações</CardTitle>
                        <CardDescription>Visualize os vencimentos previstos para este mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DueDatesCalendar documents={dueDocsWithCompany} />
                    </CardContent>
                </Card>

                {/* Department Stats */}
                <Card className="col-span-3 border-border/50">
                    <CardHeader>
                        <CardTitle>Documentos por Departamento</CardTitle>
                        <CardDescription>Distribuição dos arquivos processados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {departmentCounts && Object.entries(departmentCounts).map(([dept, count], index) => (
                                <div key={dept} className="flex items-center">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{dept}</p>
                                        <div className="h-2 w-full max-w-[200px] rounded-full bg-secondary overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{ width: `${(count / (totalDocuments.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="font-bold text-muted-foreground">{count}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Documents */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Últimos Documentos</CardTitle>
                    <CardDescription>
                        Arquivos enviados recentemente para sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentDocuments && recentDocuments.length > 0 ? (
                            recentDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background group-hover:bg-background/80 transition-colors">
                                            {(doc.department as any)?.icon ? (
                                                <span className="text-xl">{(doc.department as any).icon}</span>
                                            ) : (
                                                <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none line-clamp-1">
                                                {doc.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(doc.company as any)?.name} • {doc.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                        </p>
                                        <p className="text-xs text-muted-foreground uppercase">
                                            {doc.competence || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Nenhum documento recente encontrado
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
