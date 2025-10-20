export enum Role {
  Mahasiswa = 'mahasiswa',
  Dosen = 'dosen',
  Sekretariat = 'sekretariat',
  Kaprodi = 'kaprodi',
  Komkordik = 'komkordik',
  Admin = 'admin',
}

export enum LogbookStatus {
  Draft = 'Draft',
  Diajukan = 'Diajukan',
  Disetujui = 'Disetujui',
  Revisi = 'Revisi',
}

export interface User {
  id: number;
  username: string;
  nama_lengkap: string;
  role: Role;
  id_ref: number;
  details: Mahasiswa | Dosen | AdminDetails;
}

export interface Mahasiswa {
  nim: string;
  angkatan: number;
}

export interface Dosen {
  nidn: string;
  spesialisasi: string;
}

export interface AdminDetails {
  title: string;
}

export interface LogbookEntry {
  id: number;
  mahasiswa_id: number;
  dosen_id: number;
  tanggal_kegiatan: string;
  judul_kegiatan: string;
  isi_logbook: string;
  status: LogbookStatus;
  attachment?: string;
  catatan_revisi?: string;
  tgl_pengajuan?: string;
  tgl_verifikasi?: string;
}

export interface StaseGrade {
    id: number;
    mahasiswa_id: number;
    dosen_id: number;
    nama_stase: string;
    nilai_kognitif: number;
    nilai_keterampilan: number;
    nilai_sikap: number;
    nilai_akhir: number;
    tanggal_penilaian: string;
}