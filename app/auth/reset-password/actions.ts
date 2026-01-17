'use server'

import { createClient } from '../../../supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(prevState: any, formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const supabase = await createClient()

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem' }
    }

    if (password.length < 6) {
        return { error: 'A senha deve ter pelo menos 6 caracteres' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/dashboard?message=Senha atualizada com sucesso')
}
