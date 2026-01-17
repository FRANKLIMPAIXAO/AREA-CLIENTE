import { createClient } from '../../../../supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const companyId = formData.get('companyId') as string
        const type = formData.get('type') as string
        const competence = formData.get('competence') as string | null
        const departmentId = formData.get('departmentId') as string | null
        const folderId = formData.get('folderId') as string | null
        const dueDate = formData.get('dueDate') as string | null
        const extractedData = formData.get('extracted_data') as string | null
        const aiConfidence = formData.get('ai_confidence') as string | null

        if (!file || !companyId || !type) {
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

        // Upload to Storage
        const fileName = `${Date.now()}_${file.name}`
        const filePath = `${companyId}/${competence || 'sem-competencia'}/${type}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
        }

        // Create document record
        const documentData: any = {
            company_id: companyId,
            name: file.name,
            type,
            competence,
            file_path: filePath,
            file_size: file.size,
            uploaded_by: user.id,
            department_id: departmentId,
            folder_id: folderId,
            due_date: dueDate,
        }

        // Add AI metadata if available
        if (extractedData) {
            documentData.extracted_data = JSON.parse(extractedData)
            documentData.ai_confidence = parseFloat(aiConfidence || '0')
            documentData.ai_analyzed_at = new Date().toISOString()
        }

        const { error: dbError } = await supabase
            .from('documents')
            .insert(documentData)

        if (dbError) {
            console.error('DB error:', dbError)
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
