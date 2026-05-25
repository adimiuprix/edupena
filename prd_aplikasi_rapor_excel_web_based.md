# PRD — Sistem Aplikasi Rapor Sekolah Berbasis Excel & Web

## 1. Ringkasan Produk

### Nama Produk
Sistem Pengolahan Nilai & Rapor Sekolah

### Jenis Produk
Aplikasi administrasi akademik sekolah untuk pengelolaan nilai siswa, penilaian pembelajaran, absensi, kokurikuler, ekstrakurikuler, dan generate rapor.

### Platform
- Excel Macro (.xlsm)
- Future Target: Web App
- Responsive Desktop & Mobile

---

# 2. Latar Belakang

Saat ini banyak sekolah masih menggunakan Excel manual untuk:
- input nilai siswa,
- rekap rapor,
- pengolahan KKTP,
- pengelolaan TP,
- absensi,
- dan eksport data rapor.

Masalah utama:
- Formula rawan rusak
- File mudah corrupt
- Sulit digunakan banyak guru secara bersamaan
- Sulit melakukan backup data
- Tidak realtime
- Sulit melakukan audit perubahan data
- Tidak scalable untuk banyak kelas

Sistem ini dibuat untuk:
- mempercepat pengolahan nilai,
- meminimalkan kesalahan perhitungan,
- mempermudah guru,
- dan mengotomatisasi proses rapor.

---

# 3. Tujuan Produk

## Tujuan Utama
Menyediakan sistem terintegrasi untuk pengolahan nilai siswa dan pembuatan rapor secara otomatis.

## Target Hasil
- Mengurangi waktu pengolahan rapor > 70%
- Mengurangi kesalahan input nilai
- Memudahkan wali kelas dan guru mapel
- Otomatisasi deskripsi nilai
- Export rapor secara cepat

---

# 4. Target Pengguna

| Role | Fungsi |
|---|---|
| Admin Sekolah | Mengatur data sekolah dan pengguna |
| Guru Mapel | Input nilai mata pelajaran |
| Wali Kelas | Rekap absensi dan rapor |
| Kepala Sekolah | Monitoring hasil belajar |
| Operator | Export dan validasi data |

---

# 5. Analisis Struktur Sistem Excel

## Sheet yang Ditemukan

### Master Data
- HOME
- Sekolah ID
- SISWA
- Mapel
- Data

### Pengaturan Akademik
- KKTP
- EDIT TP
- PENCARI

### Penilaian
- Input Nilai
- AGM
- PP
- BIN
- MAT
- IPAS
- PJOK
- BING
- KKA
- BJW
- Mulok2
- Mulok3
- Mulok4
- Mulok5

### Aktivitas Siswa
- ABS&EKSKUL
- Program Kokurikuler

### Rekap & Output
- Legger
- EKSPOR
- TUTORIAL

---

# 6. Analisis Formula & Mekanisme Sistem

## Formula yang Digunakan

### Formula Lookup
Digunakan untuk mengambil data TP dan mapel.

Contoh:
```excel
=VLOOKUP($B$4,TP_BIN,12,FALSE)
```

Fungsi:
- mengambil TP berdasarkan mapel
- sinkronisasi antar sheet
- otomatisasi nilai

---

### Formula IF & IFERROR
Digunakan untuk validasi data kosong.

Contoh:
```excel
=IFERROR(IF(B8="","",1),"")
```

Fungsi:
- validasi input
- mencegah error tampilan
- otomatis numbering

---

### Formula CONCATENATE
Digunakan untuk membentuk identitas dan alamat.

Contoh:
```excel
=CONCATENATE(H8,", ",I8)
```

Fungsi:
- gabung nama
- gabung alamat
- format identitas siswa

---

### Formula MIN dan Rata-rata
Digunakan untuk perhitungan KKTP.

Contoh:
```excel
=(K3+L3)/2
=MIN(C59:N59)
```

Fungsi:
- menentukan nilai minimum
- menentukan rata-rata
- menentukan standar ketuntasan

---

### Formula Referensi Antar Sheet
Digunakan sangat intensif.

Contoh:
```excel
='Program Kokurikuler'!C5
='Sekolah ID'!F4
```

Fungsi:
- sinkronisasi data global
- mengurangi duplikasi data
- auto populate informasi

---

# 7. Alur Sistem Saat Ini

## Alur Penggunaan

### 1. Input Identitas Sekolah
Sheet:
- Sekolah ID

Data:
- nama sekolah
- semester
- tahun ajaran
- kelas
- identitas kepala sekolah

---

### 2. Input Data Siswa
Sheet:
- SISWA

Data:
- nama siswa
- NIS
- NISN
- alamat
- jenis kelamin
- orang tua

---

### 3. Input Mata Pelajaran
Sheet:
- Mapel

Data:
- nama mapel
- kode mapel
- kategori
- bobot

---

### 4. Input TP dan KKTP
Sheet:
- EDIT TP
- KKTP

Data:
- tujuan pembelajaran
- indikator
- target pencapaian
- KKTP minimal

---

### 5. Input Nilai
Sheet:
- AGM
- BIN
- MAT
- IPAS
- dll

Data:
- nilai harian
- nilai tugas
- nilai akhir
- deskripsi

---

### 6. Input Absensi & Ekstrakurikuler
Sheet:
- ABS&EKSKUL
- Program Kokurikuler

Data:
- sakit
- izin
- alfa
- ekskul
- catatan

---

### 7. Rekap Legger
Sheet:
- Legger

Output:
- rekap seluruh nilai
- ranking
- nilai akhir

---

### 8. Export Rapor
Sheet:
- EKSPOR

Output:
- format siap cetak
- export data rapor

---

# 8. Fitur Sistem (Current)

## Fitur Master Data

### Data Sekolah
- Input identitas sekolah
- Semester
- Tahun ajaran
- Kelas
- Kepala sekolah

### Data Siswa
- CRUD siswa
- Nomor induk
- Biodata lengkap
- Data wali

### Data Mata Pelajaran
- CRUD mapel
- Kelompok mapel
- Kategori

---

## Fitur Akademik

### Pengaturan TP
- Input TP per mapel
- Edit TP
- Sinkronisasi TP

### Pengaturan KKTP
- Nilai minimum
- Ketuntasan
- Rata-rata target

---

## Fitur Penilaian

### Input Nilai
- Nilai harian
- Nilai sumatif
- Nilai akhir
- Deskripsi otomatis

### Penilaian Per Mapel
- Sheet terpisah per mapel
- Formula otomatis
- Rekap otomatis

---

## Fitur Kehadiran

### Absensi
- Sakit
- Izin
- Alfa

### Ekstrakurikuler
- Nama ekskul
- Nilai ekskul
- Catatan ekskul

---

## Fitur Output

### Legger
- Rekap nilai
- Rekap kelas
- Ringkasan nilai

### Export
- Export rapor
- Format cetak
- Rekap akhir

---

# 9. Kelemahan Sistem Excel Saat Ini

| Masalah | Dampak |
|---|---|
| Formula kompleks | Mudah error |
| Tidak multi-user | Guru tidak bisa bersamaan |
| Macro rawan blocked | Kompatibilitas rendah |
| Tidak ada login | Keamanan rendah |
| Tidak ada audit log | Sulit tracking perubahan |
| File besar | Lambat |
| Manual backup | Risiko kehilangan data |

---

# 10. PRD Pengembangan Menjadi Web App

# Modul Utama

## 1. Authentication

### Fitur
- Login
- Logout
- Reset password
- Role management

### Role
- Admin
- Operator
- Guru
- Wali kelas
- Kepala sekolah

---

## 2. Dashboard

### Informasi
- jumlah siswa
- jumlah kelas
- nilai belum lengkap
- statistik absensi
- grafik nilai

---

## 3. Master Sekolah

### Fitur
- CRUD sekolah
- Tahun ajaran
- Semester
- Kelas
- Jurusan

---

## 4. Master Siswa

### Fitur
- CRUD siswa
- Import Excel
- Export Excel
- Status aktif
- Mutasi siswa

---

## 5. Master Guru

### Fitur
- CRUD guru
- Mapel pengampu
- Wali kelas

---

## 6. Master Mata Pelajaran

### Fitur
- CRUD mapel
- Kategori mapel
- KKTP
- TP

---

## 7. Modul TP & KKTP

### Fitur
- Input TP
- Edit TP
- Import TP
- Penentuan KKTP
- Mapping TP per kelas

---

## 8. Modul Penilaian

### Fitur
- Input nilai
- Bulk input
- Auto calculate
- Auto deskripsi
- Validasi nilai
- Draft & publish nilai

### Jenis Nilai
- Harian
- Tugas
- Sumatif
- Praktik
- UTS/UAS

---

## 9. Modul Absensi

### Fitur
- Input absensi
- Rekap absensi
- Statistik kehadiran

---

## 10. Modul Ekstrakurikuler

### Fitur
- Daftar ekskul
- Nilai ekskul
- Catatan pembina

---

## 11. Modul Rapor

### Fitur
- Generate rapor otomatis
- Cetak PDF
- Template rapor
- Tanda tangan digital
- Preview rapor

---

## 12. Modul Legger

### Fitur
- Rekap nilai kelas
- Ranking
- Statistik kelas
- Export Excel

---

## 13. Modul Export

### Fitur
- Export PDF
- Export Excel
- Export CSV
- Arsip semester

---

# 11. Non Functional Requirement

## Performance
- Support minimal 1000 siswa
- Loading < 3 detik
- Bulk input cepat

## Security
- Password hashing
- Session management
- Role access
- Audit log

## Compatibility
- Mobile responsive
- Chrome support
- Firefox support
- Edge support

## Backup
- Auto backup database
- Restore data

---

# 12. Database Entity (Rekomendasi)

## Tabel Utama

### users
- id
- name
- email
- password
- role_id

### students
- id
- nis
- nisn
- name
- gender
- address
- class_id

### teachers
- id
- name
- nip
- subject_id

### subjects
- id
- code
- name
- category

### grades
- id
- student_id
- subject_id
- score
- semester

### attendance
- id
- student_id
- sick
- permit
- absent

### extracurriculars
- id
- student_id
- name
- score

---

# 13. Teknologi yang Direkomendasikan

## Backend
- Laravel 11
atau
- CodeIgniter 4

## Frontend
- Vue.js
atau
- React

## Database
- MySQL

## Export
- DomPDF
- PhpSpreadsheet

---

# 14. User Flow Web App

## Guru Input Nilai
1. Login
2. Pilih kelas
3. Pilih mapel
4. Input nilai
5. Simpan
6. Publish nilai

---

## Wali Kelas Cetak Rapor
1. Login
2. Pilih kelas
3. Generate rapor
4. Preview
5. Export PDF
6. Cetak

---

# 15. MVP Prioritas

## Phase 1
- Login
- Data siswa
- Data mapel
- Input nilai
- Generate rapor

## Phase 2
- Absensi
- Ekstrakurikuler
- Ranking
- Dashboard analytics

## Phase 3
- Mobile app
- WA notification
- Parent portal
- e-Rapor online

---

# 16. Kesimpulan

Workbook Excel ini sebenarnya sudah berbentuk mini academic information system yang cukup kompleks.

Struktur formula menunjukkan bahwa:
- sistem memiliki arsitektur modular,
- data saling terhubung antar sheet,
- terdapat otomatisasi rekap nilai,
- dan sudah memiliki konsep relational data sederhana.

Namun keterbatasan Excel membuat sistem sulit dikembangkan dalam skala besar.

Transformasi ke web app akan memberikan:
- stabilitas lebih baik,
- multi-user realtime,
- keamanan,
- audit data,
- backup otomatis,
- dan pengalaman penggunaan yang jauh lebih modern.

