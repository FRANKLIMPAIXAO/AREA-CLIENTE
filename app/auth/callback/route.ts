import { createClient } from '../../../supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const next = requestUrl.searchParams.get('next') || '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth Code Exchange Error:', error)
            return NextResponse.redirect(`${origin}/login?message=Erro ao validar link de recuperação: ${error.message}`)
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}${next}`)
}
