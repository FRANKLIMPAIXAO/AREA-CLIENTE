import { createClient } from '@/app/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <main className="w-full max-w-3xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Área do Cliente
        </h1>

        <p className="text-xl text-gray-400 max-w-lg">
          Gerencie seus serviços e solicitações em um só lugar.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/login"
            className="px-8 py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-lg shadow-indigo-500/30"
          >
            Acessar Conta
          </Link>
        </div>
      </main>
    </div>
  )
}
