export interface Admin {
  id: number;
  nama: string;
  email: string;
  role: "admin" | "superadmin";
  status: "active" | "inactive";
  createdAt: string;
}

export const admins: Admin[] = [
  { id: 1, nama: "Rina Lestari", email: "rina@primeproperty.id", role: "admin", status: "active", createdAt: "2024-03-10" },
  { id: 2, nama: "Bachtiar Nst", email: "bachtiar@primeproperty.id", role: "admin", status: "active", createdAt: "2024-05-22" },
  { id: 3, nama: "Sari Dewi", email: "sari@primeproperty.id", role: "admin", status: "inactive", createdAt: "2024-07-01" },
  { id: 4, nama: "Hendra Wibowo", email: "hendra@primeproperty.id", role: "admin", status: "active", createdAt: "2025-01-08" },
];
