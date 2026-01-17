import { createClient } from '../../../supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin
    const next = requestUrl.searchParams.get('next') || '/'

    console.log(`Auth Callback hit. Code: ${code ? 'Yes' : 'No'}, Next: ${next}`)

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth Code Exchange Error:', error)
            redirect(`/login?message=${encodeURIComponent(`Erro ao validar link de recuperação: ${error.message}`)}`)
        }
        console.log('Auth Code Exchange Success')
    }

    // URL to redirect to after sign in process completes
    redirect(`${origin}${next}`)
}
