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

    const jenisProperti   = (formData.get('jenis_properti') as string) || null
    const kisaranAnggaran = (formData.get('kisaran_anggaran') as string) || null

    const { error } = await admin.from('contact_messages').insert({
      nama,
      email,
      nomor_hp:         nomorHp,
      jenis_properti:   jenisProperti,
      kisaran_anggaran: kisaranAnggaran,
      pesan,
      ip_address:       ip,
    })

    if (error) return { error: 'Gagal mengirim pesan. Coba lagi.', success: false }

    // Kirim email notifikasi ke admin
    await sendEmailNotification({ nama, email, nomorHp, pesan, jenisProperti, kisaranAnggaran })

    return { error: null, success: true }
  } catch {
    return { error: 'Terjadi kesalahan. Coba lagi.', success: false }
  }
}

// Kirim email notifikasi ke admin via Resend
async function sendEmailNotification(data: {
  nama: string
  email: string
  nomorHp: string
  pesan: string
  jenisProperti: string | null
  kisaranAnggaran: string | null
}) {
  const apiKey     = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL

  // Jika env belum diisi, skip tanpa error (tidak blokir user)
  if (!apiKey || apiKey === 'RESEND_API_KEY_PLACEHOLDER' || !adminEmail) return

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from:    'Prime Property <noreply@primeproperty.id>',
      to:      adminEmail,
      subject: `[Prime Property] Pesan baru dari ${data.nama}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1A1A;">
          <div style="background: #1A1A1A; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #C9A961; margin: 0; font-size: 18px;">Pesan Kontak Baru</h2>
            <p style="color: #ffffff80; margin: 4px 0 0; font-size: 13px;">Prime Property · Portal Internal</p>
          </div>
          <div style="border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px; width: 140px;">Nama</td><td style="padding: 8px 0; font-size: 13px; font-weight: 600;">${data.nama}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${data.email}" style="color: #C9A961;">${data.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Nomor HP</td><td style="padding: 8px 0; font-size: 13px;"><a href="https://wa.me/${data.nomorHp.replace(/\D/g, '')}" style="color: #C9A961;">${data.nomorHp}</a></td></tr>
              ${data.jenisProperti ? `<tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Jenis Properti</td><td style="padding: 8px 0; font-size: 13px;">${data.jenisProperti}</td></tr>` : ''}
              ${data.kisaranAnggaran ? `<tr><td style="padding: 8px 0; color: #6B6B6B; font-size: 13px;">Kisaran Anggaran</td><td style="padding: 8px 0; font-size: 13px;">${data.kisaranAnggaran}</td></tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #F5F5F5; border-radius: 6px; border-left: 3px solid #C9A961;">
              <p style="margin: 0; font-size: 13px; color: #6B6B6B; margin-bottom: 6px;">Pesan:</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.pesan.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      `,
    })
  } catch {
    // Gagal kirim email tidak boleh blokir response ke user
    console.error('[contact] Failed to send email notification')
  }
}
