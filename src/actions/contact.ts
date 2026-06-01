'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'

const RATE_LIMIT = 3        // max submit per jam per IP
const WINDOW_MS  = 3600000  // 1 jam

export async function submitContactAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  try {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

    const admin = createAdminClient()

    // Rate limiting: cek berapa kali IP ini submit dalam 1 jam terakhir
    const since = new Date(Date.now() - WINDOW_MS).toISOString()
    const { count } = await admin
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', since)

    if ((count ?? 0) >= RATE_LIMIT) {
      return { error: 'Terlalu banyak pesan. Coba lagi dalam 1 jam.', success: false }
    }

    // Validasi
    const nama    = (formData.get('nama') as string)?.trim()
    const email   = (formData.get('email') as string)?.trim()
    const nomorHp = (formData.get('nomor_hp') as string)?.trim()
    const pesan   = (formData.get('pesan') as string)?.trim()

    if (!nama || !email || !nomorHp || !pesan) {
      return { error: 'Semua field wajib diisi.', success: false }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Format email tidak valid.', success: false }
    }
    if (nomorHp.replace(/\D/g, '').length < 10) {
      return { error: 'Nomor HP minimal 10 digit.', success: false }
    }

    const { error } = await admin.from('contact_messages').insert({
      nama,
      email,
      nomor_hp:         nomorHp,
      jenis_properti:   (formData.get('jenis_properti') as string) || null,
      kisaran_anggaran: (formData.get('kisaran_anggaran') as string) || null,
      pesan,
      ip_address:       ip,
    })

    if (error) return { error: 'Gagal mengirim pesan. Coba lagi.', success: false }

    return { error: null, success: true }
  } catch {
    return { error: 'Terjadi kesalahan. Coba lagi.', success: false }
  }
}
