import { createClient } from '../../../supabase/server'
import { revalidatePath } from 'next/cache'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default async function AdminEmpresasPage() {
    const supabase = await createClient()

    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

    async function createCompany(formData: FormData) {
        'use server'
        const supabase = await createClient()

        const name = formData.get('name') as string
        const cnpj = formData.get('cnpj') as string

        await supabase.from('companies').insert({ name, cnpj })
        revalidatePath('/admin/empresas')
    }

    async function deleteCompany(formData: FormData) {
        'use server'
        const supabase = await createClient()
        const id = formData.get('id') as string
        await supabase.from('companies').delete().eq('id', id)
        revalidatePath('/admin/empresas')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Empresas</h1>
                    <p className="mt-1 text-sm text-gray-500">Criar, editar e excluir empresas</p>
                </div>
            </div>

            {/* Create Form */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Empresa</h2>
                <form action={createCompany} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome/Razão Social</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                required
                                placeholder="00.000.000/0000-00"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Criar Empresa
                    </button>
                </form>
            </div>

            {/* Companies List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies && companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {company.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.cnpj}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(company.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <form action={deleteCompany} className="inline">
                                            <input type="hidden" name="id" value={company.id} />
                                            <button
                                                type="submit"
                                                className="text-red-600 hover:text-red-900 ml-4"
                                                onClick={(e) => {
                                                    if (!confirm('Tem certeza? Isso removerá todos os vínculos e documentos!')) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4 inline" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Nenhuma empresa cadastrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
