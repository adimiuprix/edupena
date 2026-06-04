# Fitur Keterangan Kenaikan Kelas (Semester Genap)

## Deskripsi
Fitur otomatis yang menampilkan **keterangan naik kelas atau tidak naik kelas** pada halaman rapor siswa (Reports/Show.jsx) khusus untuk **semester genap**, berdasarkan rumus Kurikulum Merdeka.

## Kriteria Kenaikan Kelas (Kurikulum Merdeka)

### ✅ **NAIK KELAS** jika memenuhi:
1. **Ketuntasan Akademik:**
   - Tuntas minimal **80%** dari total mata pelajaran
   - **ATAU** maksimal **3 mata pelajaran** tidak tuntas
   
2. **Kehadiran:**
   - Persentase kehadiran minimal **90%**

### ❌ **TIDAK NAIK KELAS** jika:
- Ketuntasan < 80% **DAN** lebih dari 3 mapel tidak tuntas
- **ATAU** kehadiran < 90%

## Formula Perhitungan

```javascript
// 1. Hitung Ketuntasan per Mapel
mapelTuntas = 0
mapelTidakTuntas = 0

for each mapel:
    if (nilaiAkhir >= KKM):
        mapelTuntas++
    else:
        mapelTidakTuntas++

// 2. Persentase Ketuntasan
persenTuntas = (mapelTuntas / totalMapel) × 100%

// 3. Persentase Kehadiran
totalAbsen = sakit + ijin + alpa
totalHariEfektif = 200 hari (asumsi)
persenKehadiran = ((totalHariEfektif - totalAbsen) / totalHariEfektif) × 100%

// 4. Cek Syarat
syaratKetuntasan = (persenTuntas >= 80) OR (mapelTidakTuntas <= 3)
syaratKehadiran = (persenKehadiran >= 90)

// 5. Status
NAIK_KELAS = syaratKetuntasan AND syaratKehadiran
```

## Fitur yang Ditambahkan

### Frontend (Show.jsx)
1. **Function `hitungKenaikanKelas()`**
   - Menghitung status kenaikan kelas berdasarkan data nilai dan absensi
   - Return objek dengan informasi lengkap

2. **Komponen UI "E. Keterangan Kenaikan Kelas"**
   - Hanya tampil jika semester **genap**
   - Menampilkan:
     - Jumlah total mata pelajaran
     - Jumlah mapel tuntas + persentase
     - Jumlah mapel tidak tuntas
     - Persentase kehadiran
     - **Status box** (hijau untuk NAIK, merah untuk TIDAK NAIK)
     - Alasan jika tidak naik kelas

### Backend (ReportController.php)
1. **Import Model Kkm**
   ```php
   use App\Models\Kkm;
   ```

2. **Query Data KKM**
   - Ambil KKM per mapel untuk rombel & semester terkait
   - Default KKM = 75 jika belum diset

3. **Pass ke View**
   ```php
   'kkmData' => $kkmData
   ```

## Tampilan Visual

### NAIK KELAS ✅
```
┌─────────────────────────────────────────────┐
│ E. Keterangan Kenaikan Kelas                │
├─────────────────────────────────────────────┤
│ Jumlah Mata Pelajaran    : 10 Mapel         │
│ Mata Pelajaran Tuntas    : 9 Mapel (90.0%)  │
│ Mata Pelajaran Tidak Tuntas : 1 Mapel       │
│ Persentase Kehadiran     : 95.0%            │
│                                              │
│ ┌──────────────────────────────────────┐   │
│ │ Status: NAIK KELAS                    │   │
│ │ (Background: hijau)                   │   │
│ └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### TIDAK NAIK KELAS ❌
```
┌─────────────────────────────────────────────┐
│ E. Keterangan Kenaikan Kelas                │
├─────────────────────────────────────────────┤
│ Jumlah Mata Pelajaran    : 10 Mapel         │
│ Mata Pelajaran Tuntas    : 5 Mapel (50.0%)  │
│ Mata Pelajaran Tidak Tuntas : 5 Mapel       │
│ Persentase Kehadiran     : 85.0%            │
│                                              │
│ ┌──────────────────────────────────────┐   │
│ │ Status: TIDAK NAIK KELAS              │   │
│ │ (Background: merah)                   │   │
│ └──────────────────────────────────────┘   │
│                                              │
│ Alasan:                                      │
│ • Ketuntasan kurang dari 80% atau lebih     │
│   dari 3 mata pelajaran tidak tuntas        │
│ • Kehadiran kurang dari 90%                 │
└─────────────────────────────────────────────┘
```

## Styling CSS

### Status Box
- **NAIK KELAS**: Background hijau (#d4edda), border hijau (#28a745)
- **TIDAK NAIK KELAS**: Background merah (#f8d7da), border merah (#dc3545)
- Font bold, centered, dengan `print-color-adjust: exact` untuk cetak

### Keterangan Tidak Naik
- Background kuning (#fff3cd) dengan border kuning (#ffc107)
- Bullet list untuk alasan detail

## Contoh Use Case

### Skenario 1: Siswa A - NAIK KELAS ✅
```
Total Mapel: 12
Mapel Tuntas: 11 (91.7%)
Mapel Tidak Tuntas: 1
Kehadiran: 95%

✓ Ketuntasan > 80%
✓ Tidak tuntas ≤ 3 mapel
✓ Kehadiran ≥ 90%

HASIL: NAIK KELAS
```

### Skenario 2: Siswa B - TIDAK NAIK KELAS ❌
```
Total Mapel: 12
Mapel Tuntas: 8 (66.7%)
Mapel Tidak Tuntas: 4
Kehadiran: 88%

✗ Ketuntasan < 80%
✗ Tidak tuntas > 3 mapel
✗ Kehadiran < 90%

HASIL: TIDAK NAIK KELAS
Alasan:
- Ketuntasan kurang dari 80% atau lebih dari 3 mata pelajaran tidak tuntas
- Kehadiran kurang dari 90%
```

### Skenario 3: Siswa C - NAIK KELAS (Ketuntasan 75% tapi hanya 3 mapel tidak tuntas) ✅
```
Total Mapel: 12
Mapel Tuntas: 9 (75%)
Mapel Tidak Tuntas: 3
Kehadiran: 92%

✗ Ketuntasan < 80%
✓ Tidak tuntas ≤ 3 mapel (SYARAT ALTERNATIF!)
✓ Kehadiran ≥ 90%

HASIL: NAIK KELAS
```

## Parameter yang Bisa Disesuaikan

Jika ingin mengubah kriteria, edit di `Show.jsx`:

```javascript
// Ubah persentase minimal ketuntasan (default: 80%)
const syaratKetuntasan = persenTuntas >= 80 || mapelTidakTuntas <= 3;

// Ubah maksimal mapel tidak tuntas (default: 3)
const syaratKetuntasan = persenTuntas >= 80 || mapelTidakTuntas <= 3;

// Ubah persentase minimal kehadiran (default: 90%)
const syaratKehadiran = persenKehadiran >= 90;

// Ubah total hari efektif (default: 200 hari)
const totalHariEfektif = 200;
```

## Catatan Penting

1. **Hanya Tampil di Semester Genap**
   - Kenaikan kelas dihitung di akhir tahun ajaran (semester genap)
   - Semester ganjil tidak menampilkan keterangan ini

2. **KKM Otomatis**
   - Sistem mengambil KKM dari tabel `kkm` yang sudah diset
   - Jika belum diset, default KKM = 75

3. **Print-Friendly**
   - Warna tetap muncul saat cetak/PDF dengan `print-color-adjust: exact`
   - Layout otomatis menyesuaikan halaman A4

4. **Objektif & Transparan**
   - Perhitungan otomatis berdasarkan data sistem
   - Menampilkan detail lengkap untuk transparansi

## Files Modified

1. ✅ `resources/js/Pages/Reports/Show.jsx`
   - Tambah function `hitungKenaikanKelas()`
   - Tambah komponen UI kenaikan kelas
   - Tambah CSS styling

2. ✅ `app/Http/Controllers/ReportController.php`
   - Import model `Kkm`
   - Query data KKM
   - Pass `kkmData` ke view

## Testing

### Manual Test
1. Buat data siswa dengan nilai di semester genap
2. Set KKM untuk mapel-mapel di kelas tersebut
3. Input nilai siswa (beberapa di atas KKM, beberapa di bawah)
4. Input data absensi
5. Akses halaman rapor siswa
6. Verifikasi perhitungan dan tampilan keterangan kenaikan kelas

### Test Cases
- [x] Siswa dengan ketuntasan > 80% → NAIK
- [x] Siswa dengan 3 mapel tidak tuntas, ketuntasan 75% → NAIK
- [x] Siswa dengan 4 mapel tidak tuntas, ketuntasan < 80% → TIDAK NAIK
- [x] Siswa dengan kehadiran < 90% → TIDAK NAIK
- [x] Semester ganjil → tidak tampil keterangan

## Future Enhancement
- Export laporan kenaikan kelas per rombel
- Dashboard rekap kenaikan kelas
- Notifikasi untuk siswa yang berisiko tidak naik
- Filter/sort siswa berdasarkan status kenaikan
