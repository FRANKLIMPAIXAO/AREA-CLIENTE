import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { companyId, departmentId, parentFolderId, name } = await request.json()

        if (!companyId || !departmentId || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify user has access to company
        const { data: access } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id)
            .eq('company_id', companyId)
            .single()

        if (!access) {
            return NextResponse.json({ error: 'No access to company' }, { status: 403 })
        }

        // Build path
        let path = `/${name}`
        if (parentFolderId) {
            const { data: parentFolder } = await supabase
                .from('folders')
                .select('path')
                .eq('id', parentFolderId)
                .single()

            if (parentFolder) {
                path = `${parentFolder.path}/${name}`
            }
        }

        // Create folder
        const { data: folder, error } = await supabase
            .from('folders')
            .insert({
                company_id: companyId,
                department_id: departmentId,
                parent_folder_id: parentFolderId,
                name,
                path,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating folder:', error)
            return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
        }

        return NextResponse.json({ folder })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
