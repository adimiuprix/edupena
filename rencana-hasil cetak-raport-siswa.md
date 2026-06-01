# Walkthrough: Redesign Tampilan Cetak Rapor

Pekerjaan redesign tampilan cetak rapor telah selesai dan berjalan dengan baik.

## Perubahan Utama

1.  **Struktur Data Rapor Diperkaya**
    *   Mengubah `ReportController.php` untuk memuat lebih banyak identitas siswa seperti NIPD, Agama, Tempat & Tanggal Lahir, dan Nama Orang Tua/Wali.
    *   Memastikan data identitas sekolah dan Kepala Sekolah termuat dengan benar dari `Settings`.
    *   Menarik data NIP Wali Kelas melalui relasi `Rombel -> User -> Teacher`.

2.  **Redesign Tampilan Rapor (`Show.jsx`)**
    *   **Kop Surat Resmi:** Menambahkan kop surat dengan logo (menggunakan `logo_sekolah.png` dan `logo_kabupaten.png` di folder `public/images/`), lengkap dengan nama sekolah, alamat, kontak, dan NPSN. Dilengkapi dengan garis ganda pemisah.
    *   **Identitas Siswa:** Ditampilkan dalam format dua kolom yang rapi (menampilkan NISN, NIPD, Fase, Agama, Tgl Lahir, dll).
    *   **Tabel Nilai Akademik:** Didesain ulang dengan border solid, pewarnaan baris selang-seling (zebra striping), dan lebar kolom yang proporsional agar deskripsi capaian kompetensi mudah dibaca.
    *   **Ekstrakurikuler & Kehadiran:** Ditata berdampingan (side-by-side) untuk menghemat ruang vertikal kertas.
    *   **Area Catatan Wali Kelas:** Menambahkan kotak kosong bergaris bawah untuk catatan manual wali kelas.
    *   **Kolom Tanda Tangan:** Diformat rapi di bagian bawah. Terdiri dari Orang Tua/Wali (kiri), Wali Kelas (kanan), dan Kepala Sekolah (tengah bawah) lengkap dengan NIP.

3.  **Optimasi Print CSS**
    *   Menambahkan aturan khusus `@media print` agar tata letak halaman sesuai dengan kertas A4 (`@page { size: A4 portrait; margin: 0; }`).
    *   Menggunakan font standar dokumen resmi, yaitu `Times New Roman`.
    *   Memastikan header/navigasi aplikasi tersembunyi saat proses cetak.

## Cara Pengujian

1.  Silakan upload gambar logo ke `public/images/logo_sekolah.png`.
2.  Masuk ke menu **Pengaturan** dan pastikan data sekolah serta Kepala Sekolah sudah diisi.
3.  Buka halaman **Rapor Siswa** (`/reports`), pilih salah satu Rombel, lalu klik tombol **Cetak** pada salah satu siswa.
4.  Coba lakukan *Print Preview* (Ctrl+P / Cmd+P) di browser Anda untuk melihat bahwa halaman benar-benar disiapkan khusus untuk ukuran A4.
