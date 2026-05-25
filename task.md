# Roadmap Proyek: Sistem Rapor Web-Based Edupena

Dokumen ini memuat seluruh tahapan pengembangan dari awal hingga proyek benar-benar selesai secara menyeluruh, diadaptasi langsung dari PRD.

## FASE 1: MVP Prioritas (Aplikasi Inti Berjalan)
Fokus utama adalah memindahkan proses pengolahan nilai dari Excel ke dalam bentuk Web App yang dapat digunakan.

- `[x]` **Tahap 1. Persiapan Database & Authentication**
  - `[x]` Install Laravel Breeze (React/Inertia)
  - `[x]` Setup struktur Migration & Model (users, students, subjects, teachers, grades, dll)
  - `[x]` Modifikasi skema `users` untuk role management
  - `[x]` Jalankan Migration ke Database

- `[ ]` **Tahap 2. Modul Master Data**
  - `[ ]` CRUD Data Sekolah (Tahun Ajaran, Semester, Kelas)
  - `[ ]` CRUD Data Siswa (Input, Edit, Hapus)
  - `[ ]` CRUD Data Guru & Mata Pelajaran

- `[ ]` **Tahap 3. Modul TP & KKTP**
  - `[ ]` Input Tujuan Pembelajaran (TP)
  - `[ ]` Penentuan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)

- `[ ]` **Tahap 4. Modul Penilaian**
  - `[ ]` UI Form Input Nilai berbentuk Grid (Harian, Tugas, Sumatif)
  - `[ ]` Logika perhitungan otomatis nilai akhir
  - `[ ]` Logika *Auto Generate* deskripsi nilai

- `[ ]` **Tahap 5. Modul Legger & Rapor**
  - `[ ]` Menghitung rekap nilai seluruh kelas (Legger) dan Ranking
  - `[ ]` Generate Rapor otomatis berdasarkan data nilai
  - `[ ]` Format cetak rapor secara rapi (Print/PDF)

---

## FASE 2: Pengembangan Fitur Sekunder
Fokus pada penambahan elemen pelengkap non-akademik dan statistik dasbor.

- `[ ]` **Tahap 6. Modul Ekstrakurikuler & Absensi**
  - `[ ]` Form Input Absensi harian/bulanan (Sakit, Izin, Alfa)
  - `[ ]` Form Input nilai Ekstrakurikuler dan catatan pembina

- `[ ]` **Tahap 7. Dashboard Analytics**
  - `[ ]` Tampilan statistik jumlah siswa, kelas, & kehadiran
  - `[ ]` Peringatan untuk nilai yang belum lengkap

- `[ ]` **Tahap 8. Modul Export Data**
  - `[ ]` Export data nilai ke Excel/CSV
  - `[ ]` Arsip data per semester agar aman

---

## FASE 3: Integrasi Lanjutan & Skalabilitas
Fokus pada kenyamanan akses pengguna luar (orang tua) dan sistem pintar.

- `[ ]` **Tahap 9. Pengembangan Akses Eksternal**
  - `[ ]` Portal khusus Orang Tua (Parent Portal) untuk cek nilai realtime
  - `[ ]` Optimasi Mobile Responsive yang lebih *advance* (atau PWA)

- `[ ]` **Tahap 10. Fitur Notifikasi & Integrasi**
  - `[ ]` Integrasi Notifikasi via WhatsApp (menginfokan rapor sudah rilis)
  - `[ ]` Sistem e-Rapor Online Terpusat (Bisa diakses kapanpun dari mana saja)
