import { createClient } from '@/app/supabase/server'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default async function EmpresasPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: userCompanies } = await supabase
        .from('user_companies')
        .select(`
      role,
      company:companies (
        id,
        name,
        cnpj,
        created_at
      )
    `)
        .eq('user_id', user!.id)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Minhas Empresas</h1>
                <p className="mt-2 text-gray-600">Empresas que você tem acesso</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userCompanies && userCompanies.length > 0 ? (
                    userCompanies.map((uc) => {
                        const company = uc.company as any
                        return (
                            <div
                                key={company.id}
                                className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                                            <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{company.name}</h3>
                                            <p className="text-sm text-gray-500">CNPJ: {company.cnpj}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                            {uc.role}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(company.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full text-center py-12">
                        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma empresa</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Você ainda não tem acesso a nenhuma empresa.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
