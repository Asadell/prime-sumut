'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Verifikasi superadmin
async function requireSuperadmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'superadmin') throw new Error('Forbidden')
  return user.id
}

// Buat akun admin baru
export async function createAdminAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  try {
    await requireSuperadmin()
    const admin = createAdminClient()

    const email    = (formData.get('email') as string).trim()
    const password = (formData.get('password') as string)
    const fullName = (formData.get('full_name') as string).trim()

    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: 'admin' },
    })

    if (error) return { error: error.message, success: false }

    revalidatePath('/agent/dashboard')
    return { error: null, success: true }
  } catch (err) {
    return { error: (err as Error).message, success: false }
  }
}

// Toggle is_active admin
export async function toggleAdminStatusAction(
  adminId: string,
  isActive: boolean
): Promise<{ error: string | null }> {
  try {
    await requireSuperadmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', adminId)

    if (error) return { error: error.message }

    revalidatePath('/agent/dashboard')
    return { error: null }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// Ambil semua admin (untuk management page)
export async function getAllAdmins() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
