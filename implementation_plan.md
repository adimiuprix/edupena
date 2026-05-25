# Rencana Implementasi Sistem Rapor Web-Based Edupena

Sesuai dengan `prd_aplikasi_rapor_excel_web_based.md`, kita akan membangun sebuah Sistem Pengolahan Nilai & Rapor Sekolah untuk menggantikan sistem Excel manual saat ini. Proyek ini sudah diinisiasi menggunakan stack yang sangat relevan:
- **Backend:** Laravel
- **Frontend:** React.js dengan Inertia.js dan Tailwind CSS
- **Database:** MySQL

## User Review Required

> [!IMPORTANT]
> **Keputusan Desain & Fitur:**
> 1. Apakah Anda ingin kita menggunakan UI library seperti Shadcn UI atau MUI untuk mempercepat proses development frontend?
> 2. Untuk fitur Authentication (Login, Roles), apakah kita akan menggunakan Laravel Breeze (Inertia React) yang sudah menyediakan template authentication lengkap secara bawaan?

## Open Questions

> [!WARNING]
> 1. Apakah database MySQL sudah disiapkan di environment lokal Anda (misalnya melalui Laragon)? Jika sudah, apa nama database yang ingin digunakan?
> 2. Pada Phase 1, ada fitur "Generate rapor". Apakah format PDF atau hanya preview halaman web yang siap diprint (print CSS)? PRD menyebutkan DomPDF/PhpSpreadsheet, namun cetak via Web Print (CSS) seringkali lebih mudah dan rapi untuk React.

## Proposed Changes

Implementasi akan dibagi berdasarkan Phase 1 (MVP) yang tertera di PRD.

### 1. Persiapan Database dan Authentication
Membangun struktur dasar database sesuai Section 12 PRD dan sistem otentikasi.

#### [NEW] Database Migrations & Models
- `users` (dengan `role_id`)
- `students` (Siswa)
- `subjects` (Mata Pelajaran)
- `teachers` (Guru)
- `grades` (Nilai)

#### [NEW] Authentication System
- Instalasi Laravel Breeze untuk React Inertia (jika disetujui).
- Modifikasi tabel users untuk mendukung Roles (Admin, Guru, Wali Kelas).

---

### 2. Modul Master Data (Siswa & Mapel)
Membuat fitur CRUD (Create, Read, Update, Delete) untuk entitas utama.

#### [NEW] Controllers & API
- `StudentController` (Manajemen data siswa)
- `SubjectController` (Manajemen data mata pelajaran)

#### [NEW] Frontend Pages (React/Inertia)
- `resources/js/Pages/Students/Index.jsx`
- `resources/js/Pages/Subjects/Index.jsx`
- Komponen Form dan Tabel.

---

### 3. Modul Penilaian
Fitur esensial di mana guru dapat menginput nilai harian, sumatif, dll.

#### [NEW] Controllers
- `GradeController` (Fungsi untuk menampilkan form input nilai berdasarkan kelas dan mapel, serta menyimpan nilai).

#### [NEW] Frontend Pages
- `resources/js/Pages/Grades/Input.jsx` (Tabel grid mirip Excel untuk mempercepat penginputan data).

---

### 4. Modul Rapor (Generate)
Menghasilkan tampilan rekapitulasi akhir dan fitur cetak.

#### [NEW] Controllers
- `ReportController` (Menghitung akumulasi nilai dan menyajikan data rapor).

#### [NEW] Frontend Pages
- `resources/js/Pages/Reports/Show.jsx` (Tampilan rapor yang siap dicetak).

## Verification Plan

### Automated Tests
- Menjalankan `php artisan test` untuk memastikan relasi model database berjalan dengan baik.

### Manual Verification
- Anda akan diminta untuk melakukan setup database lokal di file `.env`.
- Menjalankan `php artisan serve` dan `npm run dev`.
- Menguji alur Login, input siswa, input mapel, pengisian nilai, hingga melihat halaman rapor.
