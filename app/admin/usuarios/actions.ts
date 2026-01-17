'use server'

import { createAdminClient } from '../../../supabase/admin'
import { createClient } from '../../../supabase/server'
import { revalidatePath } from 'next/cache'

export type ImportError = {
    row: number
    email: string
    error: string
}

export type ImportResult = {
    successCount: number
    errorCount: number
    errors: ImportError[]
}

export type ParsedClient = {
    nome_empresa: string
    cnpj: string
    email_usuario: string
    nome_usuario: string
    telefone: string
    senha_padrao: string
}

export async function importClients(clients: ParsedClient[]): Promise<ImportResult> {
    const supabaseAdmin = createAdminClient()
    const supabase = await createClient()

    // Verify current user is admin/authorized
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const result: ImportResult = {
        successCount: 0,
        errorCount: 0,
        errors: []
    }

    // Process each client
    for (const [index, client] of clients.entries()) {
        try {
            // 1. Create or Get Company
            // Check if company exists by CNPJ
            const { data: existingCompany } = await supabaseAdmin
                .from('companies')
                .select('id')
                .eq('cnpj', client.cnpj)
                .single()

            let companyId = existingCompany?.id

            if (!companyId) {
                const { data: newCompany, error: companyError } = await supabaseAdmin
                    .from('companies')
                    .insert({
                        name: client.nome_empresa,
                        cnpj: client.cnpj
                    })
                    .select('id')
                    .single()

                if (companyError) throw new Error(`Erro ao criar empresa: ${companyError.message}`)
                companyId = newCompany.id
            }

            // 2. Create or Get User
            let userId: string

            // Check if user exists
            const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = existingUsers.find(u => u.email === client.email_usuario)

            if (existingUser) {
                userId = existingUser.id
            } else {
                // Create new user
                const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
                    email: client.email_usuario,
                    password: client.senha_padrao,
                    email_confirm: true,
                    user_metadata: {
                        full_name: client.nome_usuario,
                        phone: client.telefone
                    }
                })

                if (userError) throw new Error(`Erro ao criar usuário: ${userError.message}`)
                userId = newUser.user.id
            }

            // 3. Link User to Company
            // Check if link exists
            const { data: existingLink } = await supabaseAdmin
                .from('user_companies')
                .select('*')
                .eq('user_id', userId)
                .eq('company_id', companyId)
                .single()

            if (!existingLink) {
                const { error: linkError } = await supabaseAdmin
                    .from('user_companies')
                    .insert({
                        user_id: userId,
                        company_id: companyId,
                        role: 'owner' // Default role for imported clients
                    })

                if (linkError) throw new Error(`Erro ao vincular usuário: ${linkError.message}`)
            }

            result.successCount++

        } catch (error: any) {
            console.error(`Error importing row ${index + 1}:`, error)
            result.errorCount++
            result.errors.push({
                row: index + 1,
                email: client.email_usuario,
                error: error.message || 'Erro desconhecido'
            })
        }
    }

    revalidatePath('/admin/usuarios')
    return result
}
