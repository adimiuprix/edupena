# Roadmap Proyek: Sistem Rapor Web-Based Edupena

Dokumen ini memuat seluruh tahapan pengembangan dari awal hingga proyek benar-benar selesai secara menyeluruh, diadaptasi langsung dari PRD.

> **Terakhir disesuaikan:** penelusuran codebase — centang `[x]` = sudah ada di aplikasi (backend + UI).

## FASE 1: MVP Prioritas (Aplikasi Inti Berjalan)

Fokus utama adalah memindahkan proses pengolahan nilai dari Excel ke dalam bentuk Web App yang dapat digunakan.

- `[x]` **Tahap 1. Persiapan Database & Authentication**
  - `[x]` Install Laravel Breeze (React/Inertia)
  - `[x]` Setup struktur Migration & Model (users, students, mapels, teachers, targets, student_scores, roles, settings, dll)
  - `[x]` Modifikasi skema `users` untuk role management (`roles` + `role_id`)
  - `[x]` Jalankan Migration ke Database
  - `[x]` Login custom + profil user (`AuthenticationController`, Breeze partial)

- `[x]` **Tahap 2. Modul Master Data** *(sebagian data sekolah via Pengaturan, bukan modul tahun ajaran terpisah)*
  - `[x]` Data sekolah & akademik (`settings`: nama sekolah, tahun ajaran aktif, semester aktif, kepala sekolah, dll)
  - `[x]` CRUD Rombel / Kelas (`rombels`: tingkat, nama rombel, tahun ajaran)
  - `[x]` CRUD Data Siswa (Create, Edit, Hapus, Index + relasi rombel)
  - `[x]` CRUD Data Guru (biodata `teachers` + akun `users`, mapel/rombel, role)
  - `[x]` CRUD Mata Pelajaran (`mapels` + kategori)

- `[x]` **Tahap 3. Modul TP & KKTP**
  - `[x]` CRUD Tujuan Pembelajaran / TP (`targets`: mapel, kelas, semester, nomor TP, deskripsi)
  - `[x]` Penentuan KKTP (`learning_achievement_criteria` + ambang Min/Max/tengah per rombel & semester, logika eraport)

- `[x]` **Tahap 4. Modul Penilaian** *(inti entry nilai ada, deskripsi otomatis belum di UI)*
  - `[x]` UI Form Input Nilai grid (`/scores`: Sumatif Harian & Sumatif Akhir per siswa × TP)
  - `[x]` Logika perhitungan otomatis (`ScoreCalculator`: 60% harian + 40% akhir, rata rapor mapel)
  - `[x]` Logika *Auto Generate* deskripsi nilai (service KKTP `descriptionPrefix` terhubung ke Rapor)

- `[x]` **Tahap 5. Modul Legger & Rapor**
  - `[x]` Menghitung rekap nilai seluruh kelas (Legger) dan Ranking
  - `[x]` Generate Rapor otomatis berdasarkan data nilai
  - `[x]` Format cetak rapor secara rapi (Print/PDF menggunakan Web Print CSS)

---

## FASE 2: Pengembangan Fitur Sekunder

Fokus pada penambahan elemen pelengkap non-akademik dan statistik dasbor.

- `[~]` **Tahap 6. Modul Ekstrakurikuler & Absensi** *(gabung satu halaman, satu ekskul per siswa)*
  - `[x]` Input absensi per semester (`sakit`, `ijin`, `alpa`) — `/attendances`
  - `[x]` Input ekskul + predikat (satu ekskul per siswa, master `extracurricular_categories`)
  - `[ ]` Form absensi harian/bulanan terpisah (saat ini rekap jumlah hari per semester)

- `[~]` **Tahap 7. Dashboard Analytics**
  - `[x]` Statistik dasar di dashboard (jumlah siswa, guru, mapel, L/P, siswa terbaru)
  - `[ ]` Statistik kehadiran di dashboard
  - `[ ]` Peringatan nilai / data yang belum lengkap

- `[ ]` **Tahap 8. Modul Export Data**
  - `[ ]` Export data nilai ke Excel/CSV
  - `[ ]` Arsip data per semester agar aman

---

## Ringkasan progres MVP (Fase 1)

| Tahap | Status |
|-------|--------|
| 1. Auth & DB | Selesai |
| 2. Master data | Selesai (inti) |
| 3. TP & KKTP | Selesai |
| 4. Penilaian | Selesai (termasuk deskripsi otomatis) |
| 5. Legger & Rapor | Selesai (Cetak Rapor Web Print & Legger Kelas) |

## Route / menu yang sudah hidup

| Menu | Route | Keterangan |
|------|-------|------------|
| Dashboard | `/dashboard` | Statistik dasar |
| Data Siswa | `/students` | CRUD |
| Mata Pelajaran | `/mapels` | CRUD |
| Data Guru | `/teachers` | CRUD + user |
| Data Rombel | `/rombels` | CRUD |
| Entry Nilai | `/scores` | Grid nilai TP |
| Tujuan Pembelajaran | `/targets` | CRUD TP |
| Kriteria Ketercapaian | `/learning-achievement-criteria` | KKTP |
| Absensi & Ekskul | `/attendances` | Ekskul + absensi |
| Pengaturan | `/settings` | Identitas sekolah |
| Rapor Siswa | `/reports` | Cetak A4 otomatis |
| Rekap Nilai | `/recaps` | Legger kelas + ranking |
