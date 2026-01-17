import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client for Server Actions (can write cookies)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            console.error('Supabase Cookie Set Error:', error)
          }
        },
      },
    }
  )
}

// Client for Server Components (Read-Only) - Prevents crashes if setAll is called
export async function createSafeClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          // Intentionally do nothing or simple log
          // In RSC, setting cookies throws. We swallow explicitly here.
          // console.log('Refusing to set cookies in RSC', cookiesToSet) 
        },
      },
    }
  )
}
