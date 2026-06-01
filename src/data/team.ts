export interface TeamMember {
  nama: string;
  jabatan: string;
  bio: string;
  foto: string;
}

export const team: TeamMember[] = [
  { nama: "Ahmad Fauzi", jabatan: "Direktur Utama", bio: "12 tahun di industri properti Sumatera Utara. Spesialis kawasan komersial dan investasi.", foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200" },
  { nama: "Rina Lestari", jabatan: "Senior Property Agent", bio: "Konsultan berpengalaman untuk segmen hunian premium dan keluarga muda.", foto: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200" },
  { nama: "Bachtiar Nst", jabatan: "Legal & Dokumen", bio: "Memastikan setiap transaksi bersih secara hukum dan menguntungkan semua pihak.", foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" },
  { nama: "Sari Dewi", jabatan: "Marketing Specialist", bio: "Menghubungkan properti terbaik dengan pembeli yang tepat melalui riset pasar mendalam.", foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200" },
];
