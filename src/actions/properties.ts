'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { PropertyInsert, PropertyUpdate } from '@/types/database'

// Helper: catat audit log
async function writeAuditLog(params: {
  table_name: string
  record_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  changed_by: string
  old_data?: Record<string, unknown> | null
  new_data?: Record<string, unknown> | null
}) {
  const admin = createAdminClient()
  await admin.from('audit_logs').insert(params)
}

// Verifikasi bahwa user yang request adalah superadmin
async function requireSuperadmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') throw new Error('Forbidden: Superadmin only')
  return user.id
}

// Ambil semua properti aktif (untuk halaman publik — Server Component)
export async function getPublicProperties() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

// Ambil 6 properti unggulan untuk halaman beranda
export async function getFeaturedProperties() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .is('deleted_at', null)
    .eq('status', 'in_stock')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw new Error(error.message)
  return data ?? []
}

// Ambil satu properti by ID
export async function getPropertyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// CREATE — hanya superadmin
export async function createPropertyAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean; id?: string }> {
  try {
    const userId = await requireSuperadmin()
    const supabase = await createClient()

    // Parse form data
    const hadapRaw = formData.get('hadap') as string
    const payload: PropertyInsert = {
      nama_property: (formData.get('nama_property') as string).trim(),
      group_name:    (formData.get('group_name') as string)?.trim() || null,
      kawasan:       (formData.get('kawasan') as string).trim(),
      lebar:         parseFloat(formData.get('lebar') as string),
      panjang:       parseFloat(formData.get('panjang') as string),
      hadap:         hadapRaw ? hadapRaw.split(',').map(s => s.trim()) : [],
      tipe:          formData.get('tipe') as 'Ruko' | 'Villa',
      tingkat:       parseFloat(formData.get('tingkat') as string),
      price:         parseInt(formData.get('price') as string, 10),
      carport:       formData.get('carport') === 'true',
      status:        formData.get('status') as 'in_stock' | 'sold_out',
      siap:          formData.get('siap') as 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi',
      maps_link:     (formData.get('maps_link') as string)?.trim() || null,
      unit:          (formData.get('unit') as string)?.trim() || null,
      catatan:       (formData.get('catatan') as string)?.trim() || null,
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({ ...payload, created_by: userId })
      .select()
      .single()

    if (error) return { error: error.message, success: false }

    await writeAuditLog({
      table_name: 'properties',
      record_id: data.id,
      action: 'INSERT',
      changed_by: userId,
      new_data: data,
    })

    revalidatePath('/properti')
    revalidatePath('/agent/dashboard')
    return { error: null, success: true, id: data.id }
  } catch (err) {
    return { error: (err as Error).message, success: false }
  }
}

// UPDATE — hanya superadmin
export async function updatePropertyAction(
  id: string,
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  try {
    const userId = await requireSuperadmin()
    const supabase = await createClient()

    // Ambil data lama untuk audit log
    const { data: oldData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    const hadapRaw = formData.get('hadap') as string
    const updates: PropertyUpdate = {
      nama_property: (formData.get('nama_property') as string).trim(),
      group_name:    (formData.get('group_name') as string)?.trim() || null,
      kawasan:       (formData.get('kawasan') as string).trim(),
      lebar:         parseFloat(formData.get('lebar') as string),
      panjang:       parseFloat(formData.get('panjang') as string),
      hadap:         hadapRaw ? hadapRaw.split(',').map(s => s.trim()) : [],
      tipe:          formData.get('tipe') as 'Ruko' | 'Villa',
      tingkat:       parseFloat(formData.get('tingkat') as string),
      price:         parseInt(formData.get('price') as string, 10),
      carport:       formData.get('carport') === 'true',
      status:        formData.get('status') as 'in_stock' | 'sold_out',
      siap:          formData.get('siap') as 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi',
      maps_link:     (formData.get('maps_link') as string)?.trim() || null,
      unit:          (formData.get('unit') as string)?.trim() || null,
      catatan:       (formData.get('catatan') as string)?.trim() || null,
    }

    const { data: newData, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { error: error.message, success: false }

    await writeAuditLog({
      table_name: 'properties',
      record_id: id,
      action: 'UPDATE',
      changed_by: userId,
      old_data: oldData,
      new_data: newData,
    })

    revalidatePath('/properti')
    revalidatePath('/agent/dashboard')
    return { error: null, success: true }
  } catch (err) {
    return { error: (err as Error).message, success: false }
  }
}

// DELETE (soft delete) — hanya superadmin
export async function deletePropertyAction(id: string): Promise<{ error: string | null }> {
  try {
    const userId = await requireSuperadmin()
    const supabase = await createClient()

    const { data: oldData } = await supabase
      .from('properties')
      .select('nama_property')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { error: error.message }

    await writeAuditLog({
      table_name: 'properties',
      record_id: id,
      action: 'DELETE',
      changed_by: userId,
      old_data: oldData,
    })

    revalidatePath('/properti')
    revalidatePath('/agent/dashboard')
    return { error: null }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
