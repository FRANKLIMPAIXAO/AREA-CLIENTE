import { createClient } from '../../supabase/server'
import { redirect } from 'next/navigation'
import SmartUpload from '../../components/SmartUpload'
import DocumentFilters from '../../components/DocumentFilters'
import Pagination from '../../components/Pagination'
import DepartmentNav from '../../components/DepartmentNav'
import FolderNavigator from '../../components/FolderNavigator'
import DownloadButton from '../../components/DownloadButton'

const ITEMS_PER_PAGE = 20

export default async function DocumentosPage({
    searchParams,
}: {
    searchParams: {
        company?: string
        type?: string
        competence?: string
        search?: string
        page?: string
        department?: string
        folder?: string
    }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const currentPage = parseInt(searchParams.page || '1')
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    // Get departments
    const { data: departments } = await supabase
        .from('departments')
        .select('*')
        .order('name')

    // Get user companies for filter
    const { data: userCompanies } = await supabase
        .from('user_companies')
        .select('company:companies(id, name)')
        .eq('user_id', user.id)

    const companies = userCompanies?.map(uc => (uc.company as any)) || []

    // Get current department
    const currentDept = departments?.find(d => d.slug === searchParams.department)

    // Get folders for current company and department
    let folders: any[] = []
    if (companies.length > 0 && currentDept) {
        const { data: folderData } = await supabase
            .from('folders')
            .select('*')
            .eq('company_id', companies[0].id)
            .eq('department_id', currentDept.id)
            .order('path')

        folders = folderData || []
    }

    // Build query with filters
    let query = supabase
        .from('documents')
        .select(`
      id,
      name,
      type,
      competence,
      file_path,
      file_size,
      uploaded_at,
      company:companies(name),
      department:departments(name, icon, color),
      folder:folders(name, path)
    `, { count: 'exact' })
        .order('uploaded_at', { ascending: false })

    // Apply filters
    if (searchParams.company) {
        query = query.eq('company_id', searchParams.company)
    }
    if (searchParams.type) {
        query = query.eq('type', searchParams.type)
    }
    if (searchParams.competence) {
        query = query.eq('competence', searchParams.competence)
    }
    if (searchParams.search) {
        query = query.ilike('name', `%${searchParams.search}%`)
    }
    if (searchParams.department) {
        const dept = departments?.find(d => d.slug === searchParams.department)
        if (dept) {
            query = query.eq('department_id', dept.id)
        }
    }
    if (searchParams.folder) {
        query = query.eq('folder_id', searchParams.folder)
    }

    // Apply pagination
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1)

    const { data: documents, count } = await query

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
                    <p className="mt-2 text-gray-600">Gerencie seus documentos por departamento e pastas</p>
                </div>
            </div>

            {/* Department Navigation */}
            {departments && <DepartmentNav departments={departments} />}

            {/* Folder Navigator (only show if department selected) */}
            {currentDept && companies.length > 0 && (
                <FolderNavigator
                    companyId={companies[0].id}
                    departmentId={currentDept.id}
                    initialFolders={folders}
                />
            )}

            {/* Upload Form */}
            {companies.length > 0 && departments && (
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        <span className="flex items-center gap-2">
                            Enviar Novo Documento
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                                ✨ Com IA
                            </span>
                        </span>
                    </h2>
                    <SmartUpload
                        companyId={companies[0].id}
                        departments={departments}
                        currentFolderId={searchParams.folder || null}
                    />
                </div>
            )}

            {/* Filters */}
            <DocumentFilters companies={companies} />

            {/* Documents Table */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents && documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(doc.folder as any)?.path || '📁 Raiz'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(doc.company as any)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {(doc.department as any) ? (
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full px-2 text-xs font-semibold"
                                                style={{
                                                    backgroundColor: `${(doc.department as any).color}20`,
                                                    color: (doc.department as any).color
                                                }}
                                            >
                                                {(doc.department as any).icon} {(doc.department as any).name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Não categorizado</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-800">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <DownloadButton documentId={doc.id} documentName={doc.name} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    {searchParams.search || searchParams.company || searchParams.type || searchParams.competence || searchParams.department
                                        ? 'Nenhum documento encontrado com os filtros aplicados'
                                        : 'Nenhum documento encontrado'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={count || 0}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </div>
    )
}
