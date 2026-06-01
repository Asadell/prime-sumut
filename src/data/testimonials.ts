export interface Testimonial {
  quote: string;
  nama: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  { quote: "Proses cepat, transparan, dan tim Prime sangat membantu dari survei hingga akad. Properti yang saya beli sesuai ekspektasi.", nama: "Budi Santoso", detail: "Pembelian Ruko Krakatau · Maret 2026" },
  { quote: "Saya sudah 3 kali bertransaksi dengan Prime Property. Selalu profesional dan harga terbaik di kelasnya.", nama: "Dewi Hartati", detail: "Pembelian Villa Pancing · Januari 2026" },
  { quote: "Tim legal Prime membantu saya verifikasi sertifikat dari awal. Tidak ada kejutan di akhir — semua berjalan mulus.", nama: "Hendra Wijaya", detail: "Pembelian Villa Tembung · Februari 2026" },
];
