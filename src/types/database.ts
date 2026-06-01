export type PropertyType   = 'Ruko' | 'Villa'
export type PropertyStatus = 'in_stock' | 'sold_out'
export type PropertyReady  = 'siap_huni' | 'siap_kosong' | 'siap_huni_renovasi'
export type UserRole       = 'admin' | 'superadmin'

export interface Profile {
  id:            string
  full_name:     string
  email:         string
  role:          UserRole
  is_active:     boolean
  last_login_at: string | null
  created_at:    string
  updated_at:    string
}

export interface Property {
  id:            string
  nama_property: string
  group_name:    string | null
  kawasan:       string
  lebar:         number
  panjang:       number
  hadap:         string[]
  tipe:          PropertyType
  tingkat:       number
  price:         number
  carport:       boolean
  status:        PropertyStatus
  siap:          PropertyReady
  maps_link:     string | null
  unit:          string | null
  catatan:       string | null
  deleted_at:    string | null
  created_at:    string
  updated_at:    string
  created_by:    string | null
}

export interface AuditLog {
  id:         string
  table_name: string
  record_id:  string
  action:     'INSERT' | 'UPDATE' | 'DELETE'
  changed_by: string | null
  old_data:   Record<string, unknown> | null
  new_data:   Record<string, unknown> | null
  changed_at: string
}

export interface ContactMessage {
  id:               string
  nama:             string
  email:            string
  nomor_hp:         string
  jenis_properti:   string | null
  kisaran_anggaran: string | null
  pesan:            string
  ip_address:       string | null
  is_read:          boolean
  created_at:       string
}

// Form types (untuk create/update - tanpa field auto-generate)
export type PropertyInsert = Omit<Property, 'id' | 'deleted_at' | 'created_at' | 'updated_at' | 'created_by'>
export type PropertyUpdate = Partial<PropertyInsert>

export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>
