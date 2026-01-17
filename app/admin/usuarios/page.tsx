import { createClient } from '../../../supabase/server'
import { revalidatePath } from 'next/cache'
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { ImportClientsButton } from './import-button'

export default async function AdminUsuariosPage() {
    const supabase = await createClient()

    // Get all users
    const { data: users } = await supabase.auth.admin.listUsers()

    // Get all companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('name')

    // Get all user-company relationships
    const { data: userCompanies } = await supabase
        .from('user_companies')
        .select(`
      user_id,
      role,
      company:companies(id, name)
    `)

    async function linkUser(formData: FormData) {
        'use server'
        const supabase = await createClient()

        const userId = formData.get('userId') as string
        const companyId = formData.get('companyId') as string
        const role = formData.get('role') as string

        await supabase.from('user_companies').insert({
            user_id: userId,
            company_id: companyId,
            role,
        })

        revalidatePath('/admin/usuarios')
    }

    async function unlinkUser(formData: FormData) {
        'use server'
        const supabase = await createClient()

        const userId = formData.get('userId') as string
        const companyId = formData.get('companyId') as string

        await supabase
            .from('user_companies')
            .delete()
            .eq('user_id', userId)
            .eq('company_id', companyId)

        revalidatePath('/admin/usuarios')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                    <p className="mt-1 text-sm text-gray-500">Vincular usuários a empresas</p>
                </div>
                <ImportClientsButton />
            </div>

            {/* Link User Form */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vincular Usuário</h2>
                <form action={linkUser} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Usuário</label>
                            <select
                                name="userId"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Selecione...</option>
                                {users?.users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Empresa</label>
                            <select
                                name="companyId"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Selecione...</option>
                                {companies?.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                name="role"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="owner">Owner</option>
                                <option value="accountant">Accountant</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        <UserPlusIcon className="h-4 w-4" />
                        Vincular
                    </button>
                </form>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {users?.users.map((user) => {
                    const userLinks = userCompanies?.filter(uc => uc.user_id === user.id) || []

                    return (
                        <div key={user.id} className="rounded-lg bg-white p-6 shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{user.email}</h3>
                                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    {userLinks.length} empresa(s)
                                </span>
                            </div>

                            {userLinks.length > 0 ? (
                                <div className="space-y-2">
                                    {userLinks.map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">{(link.company as any)?.name}</span>
                                                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                                                    {link.role}
                                                </span>
                                            </div>
                                            <form action={unlinkUser} className="inline">
                                                <input type="hidden" name="userId" value={user.id} />
                                                <input type="hidden" name="companyId" value={(link.company as any)?.id} />
                                                <button
                                                    type="submit"
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={(e) => {
                                                        if (!confirm('Desvincular usuário desta empresa?')) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Nenhuma empresa vinculada</p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
