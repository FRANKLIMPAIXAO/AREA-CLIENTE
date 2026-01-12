import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await context.params

        // Get document
        const { data: document, error: docError } = await supabase
            .from('documents')
            .select(`
        id,
        file_path,
        name,
        company_id
      `)
            .eq('id', id)
            .single()

        if (docError || !document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Verify user has access to company
        const { data: access } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id)
            .eq('company_id', document.company_id)
            .single()

        if (!access) {
            return NextResponse.json({ error: 'No access to this document' }, { status: 403 })
        }

        // Generate signed URL (valid for 60 seconds)
        const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('documents')
            .createSignedUrl(document.file_path, 60)

        if (urlError || !signedUrlData) {
            console.error('Error generating signed URL:', urlError)
            return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
        }

        return NextResponse.json({
            url: signedUrlData.signedUrl,
            filename: document.name
        })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
