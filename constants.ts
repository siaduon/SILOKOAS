import type { User, LogbookEntry, StaseGrade } from './types';
import { Role, LogbookStatus } from './types';

export const USERS: User[] = [
  { id: 1, username: 'budi.s', nama_lengkap: 'Budi Santoso', role: Role.Mahasiswa, id_ref: 101, details: { nim: '2021001', angkatan: 2021 } },
  { id: 2, username: 'citra.w', nama_lengkap: 'Citra Wulandari', role: Role.Mahasiswa, id_ref: 102, details: { nim: '2021002', angkatan: 2021 } },
  { id: 3, username: 'dr.agus', nama_lengkap: 'Dr. Agus Purnomo, Sp.A', role: Role.Dosen, id_ref: 201, details: { nidn: '081234567', spesialisasi: 'Anak' } },
  { id: 4, username: 'dr.dewi', nama_lengkap: 'Dr. Dewi Lestari, Sp.PD', role: Role.Dosen, id_ref: 202, details: { nidn: '087654321', spesialisasi: 'Penyakit Dalam' } },
  { id: 5, username: 'sekretariat', nama_lengkap: 'Admin Sekretariat', role: Role.Sekretariat, id_ref: 301, details: { title: 'Staf Sekretariat' } },
  { id: 6, username: 'kaprodi', nama_lengkap: 'Ketua Program Studi', role: Role.Kaprodi, id_ref: 401, details: { title: 'Kaprodi' } },
  { id: 7, username: 'admin', nama_lengkap: 'Super Admin', role: Role.Admin, id_ref: 901, details: { title: 'Administrator' } },
];

export const MOCK_LOGBOOKS: LogbookEntry[] = [
  { id: 1, mahasiswa_id: 101, dosen_id: 201, tanggal_kegiatan: '2023-10-26', judul_kegiatan: 'Pemeriksaan Pasien Anak Demam', isi_logbook: 'Melakukan anamnesis dan pemeriksaan fisik pada pasien anak dengan keluhan demam tinggi.', status: LogbookStatus.Disetujui, tgl_pengajuan: '2023-10-26T10:00:00Z', tgl_verifikasi: '2023-10-27T14:00:00Z', attachment: 'hasil_lab_pasien_a.pdf' },
  { id: 2, mahasiswa_id: 101, dosen_id: 201, tanggal_kegiatan: '2023-10-27', judul_kegiatan: 'Diskusi Kasus Pneumonia', isi_logbook: 'Presentasi dan diskusi kasus mengenai pasien anak dengan diagnosis pneumonia.', status: LogbookStatus.Diajukan, tgl_pengajuan: '2023-10-28T09:00:00Z' },
  { id: 3, mahasiswa_id: 102, dosen_id: 202, tanggal_kegiatan: '2023-10-25', judul_kegiatan: 'Follow up Pasien Diabetes', isi_logbook: 'Melakukan follow up pada pasien diabetes melitus tipe 2, memantau kadar gula darah dan memberikan edukasi.', status: LogbookStatus.Revisi, catatan_revisi: 'Tolong tambahkan detail mengenai anjuran diet yang diberikan kepada pasien.', tgl_pengajuan: '2023-10-25T11:00:00Z' },
  { id: 4, mahasiswa_id: 102, dosen_id: 202, tanggal_kegiatan: '2023-10-28', judul_kegiatan: 'Pemasangan Infus', isi_logbook: 'Melakukan tindakan pemasangan infus pada pasien dewasa di bangsal penyakit dalam.', status: LogbookStatus.Draft },
  { id: 5, mahasiswa_id: 101, dosen_id: 202, tanggal_kegiatan: '2023-10-29', judul_kegiatan: 'Ronde Bangsal Penyakit Dalam', isi_logbook: 'Mengikuti ronde besar bersama konsulen dan PPDS di bangsal penyakit dalam, membahas kasus-kasus menarik.', status: LogbookStatus.Diajukan, tgl_pengajuan: '2023-10-29T15:00:00Z' },
];

export const MOCK_GRADES: StaseGrade[] = [
    { id: 1, mahasiswa_id: 101, dosen_id: 201, nama_stase: "Ilmu Kesehatan Anak", nilai_kognitif: 85, nilai_keterampilan: 90, nilai_sikap: 88, nilai_akhir: 87.3, tanggal_penilaian: '2023-09-30' },
    { id: 2, mahasiswa_id: 102, dosen_id: 202, nama_stase: "Ilmu Penyakit Dalam", nilai_kognitif: 88, nilai_keterampilan: 85, nilai_sikap: 90, nilai_akhir: 87.5, tanggal_penilaian: '2023-09-30' },
     { id: 3, mahasiswa_id: 101, dosen_id: 201, nama_stase: "Bedah", nilai_kognitif: 82, nilai_keterampilan: 88, nilai_sikap: 85, nilai_akhir: 84.7, tanggal_penilaian: '2023-08-30' },
];