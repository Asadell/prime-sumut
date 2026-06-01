'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

// Cek apakah email sedang dalam status lockout
async function isLockedOut(email: string): Promise<boolean> {
  const admin = createAdminClient()
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString()

  const { count } = await admin
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('success', false)
    .gte('attempted_at', since)

  return (count ?? 0) >= MAX_ATTEMPTS
}

// Catat percobaan login
async function recordAttempt(email: string, ip: string, success: boolean) {
  const admin = createAdminClient()
  await admin.from('login_attempts').insert({ email, ip_address: ip, success })
}

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const ip       = 'unknown' // di production ambil dari headers

  // Cek lockout
  if (await isLockedOut(email)) {
    return { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${LOCKOUT_MINUTES} menit.` }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    await recordAttempt(email, ip, false)
    return { error: 'Email atau password salah.' }
  }

  await recordAttempt(email, ip, true)

  // Update last_login_at
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const admin = createAdminClient()
    await admin.from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)
  }

  redirect('/agent/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/agent/login')
}

export async function getSessionUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
