export interface UlokEksternal {
  id: string;
  users_eksternal_id: string;
  latitude: number;
  longitude: number;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  alamat: string;
  bentuk_objek: "Tanah" | "Bangunan" | string;
  alas_hak: string;
  jumlah_lantai: number;
  lebar_depan: number;
  panjang: number;
  luas: number;
  harga_sewa: number;
  nama_pemilik: string;
  kontak_pemilik: string;
  created_at: string;
  updated_at: string;
  branch_id: string | null;
  penanggungjawab: string | null;
  penanggungjawab_nama?: string | null;
  penanggungjawab_telp?: string | null;
  survey_assigned_at?: string | null;
  kplt_approval?: string | null;
  ulok_approval?: string | null;
  internal_reviewed_at?: string | null;
  
  kplt_approved_at?: string | null;
  foto_lokasi: string | null;
  status_ulok_eksternal: "Draft" | "In Progress" | "OK" | "Rejected" | string;
  approved_at: string | null;
}

export interface TimelineStep {
    step: string;
    status: "completed" | "in-progress" | "pending";
    details?: string; 
    linkText?: string; 
    linkUrl?: string;
}
