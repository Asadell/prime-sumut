'use server'

import { createClient } from '@/lib/supabase/server'

export type AuditLogWithProfile = {
  id: string
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  changed_by: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_at: string
  profiles: { full_name: string; email: string } | null
}

// Ambil audit log - hanya untuk superadmin
export async function getAuditLogs(limit = 100): Promise<AuditLogWithProfile[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') throw new Error('Forbidden')

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`*, profiles:changed_by ( full_name, email )`)
    .order('changed_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as AuditLogWithProfile[]
}
