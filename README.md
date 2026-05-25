# Edu Pena - Aplikasi E-Raport

Edu Pena adalah aplikasi E-Raport berbasis web yang dirancang untuk memudahkan pihak sekolah dalam mengelola data akademik, penilaian, absensi, dan mencetak laporan hasil belajar (raport) siswa secara digital dan efisien.

## Fitur Utama

- **Manajemen Pengguna:** Akses terpisah dan aman untuk Admin, Guru, dan Siswa/Wali Murid.
- **Data Akademik:** Pengelolaan komprehensif data Tahun Ajaran, Semester, Kelas, dan Mata Pelajaran.
- **Manajemen Nilai:** Input dan perhitungan nilai formatif, sumatif, UTS, UAS, serta nilai ekstrakurikuler.
- **Manajemen Absensi:** Pencatatan kehadiran siswa secara berkala.
- **Cetak Raport:** Generate dan cetak dokumen raport secara otomatis sesuai dengan format kurikulum yang berlaku.

## Teknologi Utama

Aplikasi ini dibangun menggunakan stack teknologi berikut:
- **Backend:** [Laravel](https://laravel.com/) (PHP Framework)
- **Frontend:** [React.js](https://reactjs.org/) dengan [Inertia.js](https://inertiajs.com/)
- **Styling:** CSS / [Tailwind CSS](https://tailwindcss.com/)
- **Database:** MySQL

## Panduan Instalasi (Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal (localhost):

1. **Clone repository ini** (jika dari git)
2. **Duplikasi file environment**
   ```bash
   cp .env.example .env
   ```
3. **Konfigurasi Database**
   Buka file `.env` dan sesuaikan kredensial database (contoh MySQL):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=edupena
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. **Install dependensi PHP (Composer)**
   ```bash
   composer install
   ```
5. **Install dependensi JavaScript (NPM)**
   ```bash
   npm install
   ```
6. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```
7. **Migrasi Database & Seeding (Opsional)**
   ```bash
   php artisan migrate --seed
   ```
8. **Jalankan Aplikasi**
   Buka terminal pertama untuk menjalankan server backend:
   ```bash
   php artisan serve
   ```
   Buka terminal kedua untuk menjalankan build tools frontend:
   ```bash
   npm run dev
   ```

Aplikasi dapat diakses melalui browser di `http://localhost:8000`.
