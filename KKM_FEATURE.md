# Fitur KKM Management

## Deskripsi
Fitur ini memungkinkan admin/guru untuk mengelola **KKM (Kriteria Ketuntasan Minimal)** untuk setiap mata pelajaran di setiap kelas (rombel) dan semester yang berbeda.

## Fitur Utama
- **KKM per Mata Pelajaran per Rombel**: Setiap mata pelajaran bisa memiliki KKM yang berbeda di setiap kelas
- **KKM per Semester**: KKM dapat diatur terpisah untuk semester ganjil dan genap
- **Filter Dinamis**: Pilih rombel dan semester untuk menampilkan dan mengelola KKM
- **Bulk Entry**: Input semua KKM mapel dalam satu form sekaligus
- **Auto Save/Update**: Sistem otomatis create atau update data KKM

## Struktur Database

### Tabel: `kkm`
| Field       | Type                        | Keterangan                           |
|-------------|----------------------------|--------------------------------------|
| id          | BIGINT (PK)                | Primary key                          |
| mapel_id    | BIGINT (FK)                | Referensi ke tabel mapels            |
| rombel_id   | BIGINT (FK)                | Referensi ke tabel rombels           |
| nilai_kkm   | INTEGER                    | Nilai KKM (0-100)                    |
| semester    | ENUM ('ganjil', 'genap')   | Semester aktif                       |
| created_at  | TIMESTAMP                  | Waktu dibuat                         |
| updated_at  | TIMESTAMP                  | Waktu diupdate                       |

**Unique Constraint**: `(mapel_id, rombel_id, semester)` - mencegah duplikasi KKM untuk kombinasi yang sama

## Files Created

### Backend
1. **Model**: `app/Models/Kkm.php`
   - Relasi ke Mapel dan Rombel
   - Fillable fields

2. **Migration**: `database/migrations/2026_05_29_080000_create_kkm_table.php`
   - Schema tabel KKM
   - Foreign keys & unique constraint

3. **Controller**: `app/Http\Controllers\KkmController.php`
   - `index()`: Menampilkan halaman KKM dengan filter
   - `store()`: Menyimpan/update KKM secara batch

4. **Seeder**: `database/seeders/KkmSeeder.php` (opsional)
   - Generate data KKM contoh

### Frontend
1. **Page**: `resources/js/Pages/Kkm/Index.jsx`
   - Filter rombel & semester
   - Form input KKM untuk semua mapel
   - Auto-populate data KKM yang sudah ada

### Routes
- `GET /kkm` → Halaman manajemen KKM
- `POST /kkm` → Simpan/update KKM

### Navigation
Menu **"Manajemen KKM"** sudah ditambahkan di sidebar (AppLayout.jsx) dengan icon `Grade`

## Cara Menggunakan

### 1. Jalankan Migration
```bash
php artisan migrate
```

### 2. (Opsional) Seed Data KKM
```bash
php artisan db:seed --class=KkmSeeder
```

### 3. Akses Menu
- Login ke aplikasi
- Klik menu **"Manajemen KKM"** di sidebar
- Pilih **Rombel** dan **Semester**
- Klik **"Tampilkan Data"**
- Input nilai KKM untuk setiap mata pelajaran
- Klik **"Simpan KKM"**

## Validasi
- Nilai KKM: 0-100 (integer)
- Kombinasi mapel + rombel + semester harus unik
- Jika nilai dikosongkan, data KKM akan dihapus

## Relasi Model

### Mapel Model
```php
public function kkm(): HasMany
{
    return $this->hasMany(Kkm::class, 'mapel_id');
}
```

### Rombel Model
```php
public function kkm()
{
    return $this->hasMany(Kkm::class, 'rombel_id');
}
```

## Business Logic
- **Update or Create**: Jika KKM untuk mapel+rombel+semester sudah ada, akan di-update. Jika belum, akan dibuat baru.
- **Delete on Empty**: Jika nilai KKM dikosongkan (null/empty string), record akan dihapus dari database.
- **Bulk Operation**: Semua KKM untuk satu rombel+semester diproses dalam satu transaksi.

## Contoh Use Case

### Skenario 1: Setup KKM Awal Semester
1. Admin memilih Kelas 7A, Semester Ganjil
2. Input KKM untuk semua mata pelajaran (misal: Matematika=75, B.Indonesia=70, dll)
3. Simpan

### Skenario 2: Update KKM Tengah Semester
1. Admin memilih Kelas 7A, Semester Ganjil
2. Form otomatis menampilkan KKM yang sudah tersimpan
3. Edit nilai yang perlu diubah
4. Simpan

### Skenario 3: KKM Berbeda per Kelas
- Kelas 7A - Matematika: KKM 75
- Kelas 7B - Matematika: KKM 70
- Kelas 8A - Matematika: KKM 80

Setiap kelas bisa memiliki standar KKM yang berbeda sesuai kebutuhan.

## Future Enhancement Ideas
- Export/Import KKM via Excel
- Copy KKM dari rombel/semester lain
- History tracking perubahan KKM
- Grafik/statistik ketuntasan siswa berdasarkan KKM
- Notifikasi jika siswa tidak mencapai KKM
