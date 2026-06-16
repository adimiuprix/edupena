import { Head } from '@inertiajs/react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getFase(tingkat) {
    if (tingkat <= 2) return 'A';
    if (tingkat <= 4) return 'B';
    return 'C';
}

function getTanggalCetak(settings) {
    const kota = settings.kabupaten_kota || 'Kota';
    const tanggal = new Date('2026-06-20').toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
    return `${kota}, ${tanggal}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Show({ student, rombel, semester, reportData, kehadiran, absensi, settings, waliKelasNip }) {

    const printPage = () => window.print();

    const fase = getFase(rombel.tingkat);
    const semesterLabel = semester?.toLowerCase() === 'ganjil' ? '1 (Ganjil)' : '2 (Genap)';
    const waliKelasNama = rombel?.wali_kelas?.name ?? rombel?.waliKelas?.name ?? null;
    const isGenap = semester?.toLowerCase() === 'genap';

    // ─── Hitung Status Kenaikan Kelas (Semester Genap) ───────────────────────
    const hitungKenaikanKelas = () => {
        if (!isGenap || reportData.length === 0) {
            return null;
        }

        // Hanya mapel akademik (bukan ekskul) yang dihitung untuk kenaikan kelas
        const akademikData = reportData.filter(d => d.tipe !== 'ekskul');
        const totalMapel = akademikData.length;
        if (totalMapel === 0) return null;

        let mapelTuntas = 0;
        let mapelTidakTuntas = 0;

        akademikData.forEach((data) => {
            const nilaiAkhir = data.nilai_akhir;
            // Ambil KKM langsung dari data mapel, default 75
            const kkm = data.nilai_kkm ?? 75;

            if (nilaiAkhir !== null && nilaiAkhir !== undefined && nilaiAkhir >= kkm) {
                mapelTuntas++;
            } else if (nilaiAkhir !== null && nilaiAkhir !== undefined) {
                mapelTidakTuntas++;
            }
        });

        const persenTuntas = totalMapel > 0 ? (mapelTuntas / totalMapel) * 100 : 0;
        
        // Hitung total ketidakhadiran
        const totalAbsen = (absensi?.sakit || 0) + (absensi?.ijin || 0) + (absensi?.alpa || 0);
        // Ambil dari settings jika ada, default 200 hari per tahun
        const totalHariEfektif = parseInt(settings?.total_hari_efektif) || 200;
        const persenKehadiran = totalHariEfektif > 0 ? ((totalHariEfektif - totalAbsen) / totalHariEfektif) * 100 : 100;

        // Kriteria Kenaikan Kelas Kurikulum Merdeka:
        // 1. Tuntas minimal 80% dari total mapel ATAU maksimal 3 mapel tidak tuntas
        // 2. Kehadiran minimal 90%
        const syaratKetuntasan = persenTuntas >= 80 || mapelTidakTuntas <= 3;
        const syaratKehadiran = persenKehadiran >= 90;

        const naikKelas = syaratKetuntasan && syaratKehadiran;

        return {
            naikKelas,
            totalMapel,
            mapelTuntas,
            mapelTidakTuntas,
            persenTuntas: persenTuntas.toFixed(1),
            persenKehadiran: persenKehadiran.toFixed(1),
            syaratKetuntasan,
            syaratKehadiran,
        };
    };

    const statusKenaikan = hitungKenaikanKelas();

    return (
        <>
            <Head title={`Rapor - ${student.nama_lengkap}`} />

            {/* ── Action Bar (tersembunyi saat cetak) ── */}
            <div className="print:hidden fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">Preview Rapor</p>
                        <p className="text-xs text-slate-500">
                            {student.nama_lengkap} &middot; Kelas {rombel.tingkat} ({rombel.nama_rombel}) &middot; Semester {semesterLabel}
                        </p>
                    </div>
                    <button
                        onClick={printPage}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                        </svg>
                        Cetak / Simpan PDF
                    </button>
                </div>
            </div>

            {/* ── Halaman Rapor A4 ── */}
            <div className="rapor-page print:mt-0 mt-20 mb-10 mx-auto print:mx-0 print:shadow-none bg-white shadow-2xl">

                {/* ════════════════════════════════════════
                    KOP / KEPALA RAPOR
                ════════════════════════════════════════ */}
                <div className="judul-wrapper">
                    <div className="judul-utama">LAPORAN HASIL BELAJAR</div>
                </div>

                <table className="tabel-kop">
                    <tbody>
                        <tr>
                            <td className="kop-label">Nama Peserta Didik</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value"><strong>{student.nama_lengkap || '-'}</strong></td>
                            <td className="kop-label-right">Kelas</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value-right">{rombel.tingkat} ({rombel.nama_rombel})</td>
                        </tr>
                        <tr>
                            <td className="kop-label">NISN</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value">{student.nisn || '-'}</td>
                            <td className="kop-label-right">Fase</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value-right">{fase}</td>
                        </tr>
                        <tr>
                            <td className="kop-label">Sekolah</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value">{settings.nama_sekolah || '-'}</td>
                            <td className="kop-label-right">Semester</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value-right">{semesterLabel}</td>
                        </tr>
                        <tr>
                            <td className="kop-label">Alamat</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value">
                                {settings.alamat_sekolah || '-'}
                                {settings.kabupaten_kota && `, ${settings.kabupaten_kota}`}
                                {settings.provinsi && `, ${settings.provinsi}`}
                            </td>
                            <td className="kop-label-right">Tahun Pelajaran</td>
                            <td className="kop-sep">:</td>
                            <td className="kop-value-right">{settings.tahun_ajaran_aktif || rombel.tahun_ajaran || '-'}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="section-divider"></div>

                {/* ════════════════════════════════════════
                    A. NILAI AKADEMIK (PENDIDIKAN UMUM)
                ════════════════════════════════════════ */}
                <div className="section-title">A. Nilai Akademik</div>
                <table className="tabel-nilai">
                    <thead>
                        <tr>
                            <th className="th-no">No</th>
                            <th className="th-mapel">Mata Pelajaran</th>
                            <th className="th-nilai">Nilai</th>
                            <th className="th-deskripsi">Capaian Kompetensi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.filter(d => d.tipe === 'akademik').length > 0 ? (
                            reportData.filter(d => d.tipe === 'akademik').map((data, index) => (
                                <tr key={index} className={index % 2 === 1 ? 'row-alt' : ''}>
                                    <td className="td-no">{index + 1}</td>
                                    <td className="td-mapel">{data.mapel}</td>
                                    <td className="td-nilai">{data.nilai_akhir ?? '-'}</td>
                                    <td className="td-deskripsi">{data.capaian_kompetensi || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="td-empty">Belum ada nilai yang diinputkan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="section-divider"></div>

                {/* ════════════════════════════════════════
                    B. MUATAN LOKAL
                ════════════════════════════════════════ */}
                {reportData.filter(d => d.tipe === 'mulok').length > 0 && (
                    <>
                        <div className="section-title">B. Muatan Lokal</div>
                        <table className="tabel-nilai">
                            <thead>
                                <tr>
                                    <th className="th-no">No</th>
                                    <th className="th-mapel">Mata Pelajaran</th>
                                    <th className="th-nilai">Nilai</th>
                                    <th className="th-deskripsi">Capaian Kompetensi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.filter(d => d.tipe === 'mulok').map((data, index) => (
                                    <tr key={index} className={index % 2 === 1 ? 'row-alt' : ''}>
                                        <td className="td-no">{index + 1}</td>
                                        <td className="td-mapel">{data.mapel}</td>
                                        <td className="td-nilai">{data.nilai_akhir ?? '-'}</td>
                                        <td className="td-deskripsi">{data.capaian_kompetensi || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="section-divider"></div>
                    </>
                )}

                {/* ════════════════════════════════════════
                    C. EKSKUL & D. KEHADIRAN
                ════════════════════════════════════════ */}
                <div className="ekskul-absen-wrapper">

                    {/* C. Ekstrakurikuler */}
                    <div className="ekskul-col">
                        <div className="section-title">C. Ekstrakurikuler</div>
                        <table className="tabel-ekskul">
                            <thead>
                                <tr>
                                    <th className="th-no">No</th>
                                    <th>Kegiatan Ekstrakurikuler</th>
                                    <th className="th-predikat">Predikat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kehadiran?.length > 0 ? (
                                    kehadiran.map((k, i) => (
                                        <tr key={i}>
                                            <td className="td-no">{i + 1}</td>
                                            <td>{k.category?.nama_ekskul || k.category?.name || '-'}</td>
                                            <td className="td-predikat">{k.predikat || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="td-empty">Tidak mengikuti ekstrakurikuler.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* D. Ketidakhadiran */}
                    <div className="absen-col">
                        <div className="section-title">D. Ketidakhadiran</div>
                        <table className="tabel-absen">
                            <tbody>
                                <tr>
                                    <td className="absen-label">Sakit</td>
                                    <td className="absen-sep">:</td>
                                    <td className="absen-value">{absensi?.sakit ?? 0} hari</td>
                                </tr>
                                <tr>
                                    <td className="absen-label">Izin</td>
                                    <td className="absen-sep">:</td>
                                    <td className="absen-value">{absensi?.ijin ?? 0} hari</td>
                                </tr>
                                <tr>
                                    <td className="absen-label">Tanpa Keterangan</td>
                                    <td className="absen-sep">:</td>
                                    <td className="absen-value">{absensi?.alpa ?? 0} hari</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* ════════════════════════════════════════
                    CATATAN WALI KELAS
                ════════════════════════════════════════ */}
                <div className="catatan-wrapper">
                    <div className="section-title">E. Catatan Wali Kelas</div>
                    <div className="catatan-box">
                        <div className="catatan-lines">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="catatan-line"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* ════════════════════════════════════════
                    KETERANGAN KENAIKAN KELAS (SEMESTER GENAP)
                ════════════════════════════════════════ */}
                {statusKenaikan && (
                    <>
                        <div className="kenaikan-wrapper">
                            <div className="kenaikan-box">
                                <p className="kenaikan-intro">
                                    Berdasarkan pencapaian tujuan pembelajaran pada semester ganjil dan genap, 
                                    dengan mempertimbangkan ketuntasan {statusKenaikan.mapelTuntas} dari {statusKenaikan.totalMapel} mata pelajaran 
                                    ({statusKenaikan.persenTuntas}% ketuntasan) dan kehadiran {statusKenaikan.persenKehadiran}%, 
                                    maka peserta didik ditetapkan:
                                </p>
                                
                                <table className="tabel-keputusan">
                                    <tbody>
                                        {statusKenaikan.naikKelas ? (
                                            <>
                                                <tr>
                                                    <td className="keputusan-label">Naik kelas</td>
                                                    <td className="keputusan-sep">:</td>
                                                    <td className="keputusan-value">
                                                        <strong>{rombel.tingkat < 6 ? rombel.tingkat + 1 : 'Lulus'}</strong> 
                                                        {rombel.tingkat < 6 && (
                                                            <span className="kelas-terbilang">
                                                                ({['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam'][rombel.tingkat + 1]})
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="keputusan-label">Tinggal kelas</td>
                                                    <td className="keputusan-sep">:</td>
                                                    <td className="keputusan-value">-</td>
                                                </tr>
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td className="keputusan-label">Naik kelas</td>
                                                    <td className="keputusan-sep">:</td>
                                                    <td className="keputusan-value">-</td>
                                                </tr>
                                                <tr>
                                                    <td className="keputusan-label">Tinggal kelas</td>
                                                    <td className="keputusan-sep">:</td>
                                                    <td className="keputusan-value">
                                                        <strong>{rombel.tingkat}</strong>
                                                        <span className="kelas-terbilang">
                                                            ({['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam'][rombel.tingkat]})
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                                
                                {!statusKenaikan.naikKelas && (
                                    <div className="catatan-kenaikan">
                                        <p className="catatan-penjelasan">
                                            <em>Catatan: Peserta didik belum memenuhi kriteria kenaikan kelas karena 
                                            {!statusKenaikan.syaratKetuntasan && ` memiliki ${statusKenaikan.mapelTidakTuntas} mata pelajaran yang tidak tuntas (ketuntasan ${statusKenaikan.persenTuntas}%)`}
                                            {!statusKenaikan.syaratKetuntasan && !statusKenaikan.syaratKehadiran && ' dan'}
                                            {!statusKenaikan.syaratKehadiran && ` kehadiran ${statusKenaikan.persenKehadiran}% (kurang dari 90%)`}.
                                            Peserta didik diharapkan mengikuti program remedial dan meningkatkan kehadiran.</em>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="section-divider"></div>
                    </>
                )}

                {/* ════════════════════════════════════════
                    TANDA TANGAN
                ════════════════════════════════════════ */}
                <div className="ttd-wrapper">

                    {/* Orang Tua / Wali */}
                    <div className="ttd-box">
                        <p className="ttd-label">Mengetahui,<br />Orang Tua / Wali Murid</p>
                        <div className="ttd-space"></div>
                        <div className="ttd-garis">
                            <span className="ttd-nama">{student.nama_wali ? `(${student.nama_wali})` : '(______________________)'}</span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="ttd-spacer"></div>

                    {/* Wali Kelas */}
                    <div className="ttd-box">
                        <p className="ttd-label">
                            {getTanggalCetak(settings)}<br />Wali Kelas,
                        </p>
                        <div className="ttd-space"></div>
                        <div className="ttd-garis">
                            <span className="ttd-nama">{waliKelasNama || '______________________'}</span>
                        </div>
                        <p className="ttd-nip">NIP. {waliKelasNip || '-'}</p>
                    </div>
                </div>

                {/* Kepala Sekolah (center) */}
                <div className="ttd-kepsek-wrapper">
                    <div className="ttd-box">
                        <p className="ttd-label">Mengetahui,<br />Kepala Sekolah,</p>
                        <div className="ttd-space"></div>
                        <div className="ttd-garis">
                            <span className="ttd-nama">{settings.nama_kepala_sekolah || '______________________'}</span>
                        </div>
                        <p className="ttd-nip">NIP. {settings.nip_kepala_sekolah || '-'}</p>
                    </div>
                </div>

            </div>

            {/* ── Style ── */}
            <style>{`
                /* ─ Reset & Base ─ */
                .rapor-page {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 14mm 18mm 16mm;
                    box-sizing: border-box;
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 10.5pt;
                    color: #000;
                    background: #fff;
                    line-height: 1.4;
                }

                /* ─ Judul ─ */
                .judul-wrapper {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .judul-utama {
                    font-size: 13pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    line-height: 1.2;
                }
                .judul-sub {
                    font-size: 11pt;
                    margin-top: 1px;
                    font-weight: 600;
                }

                /* ─ Tabel Kop (2 Kolom) ─ */
                .tabel-kop {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                    font-size: 9.5pt;
                }
                .tabel-kop td {
                    padding: 2px 3px;
                    vertical-align: top;
                }
                .kop-label {
                    width: 130px;
                    font-weight: 600;
                }
                .kop-sep {
                    width: 10px;
                    text-align: center;
                }
                .kop-value {
                    width: 240px;
                    padding-right: 16px;
                }
                .kop-label-right {
                    width: 110px;
                    font-weight: 600;
                }
                .kop-value-right {
                    width: auto;
                }

                /* ─ Divider ─ */
                .section-divider {
                    border-top: 1px solid #999;
                    margin: 6px 0;
                }

                /* ─ Section Title ─ */
                .section-title {
                    font-weight: 700;
                    font-size: 9.5pt;
                    margin-bottom: 4px;
                    text-decoration: underline;
                }

                /* ─ Tabel Nilai ─ */
                .tabel-nilai {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9pt;
                    margin-bottom: 2px;
                }
                .tabel-nilai th,
                .tabel-nilai td {
                    border: 1px solid #000;
                    padding: 3px 5px;
                    vertical-align: top;
                }
                .tabel-nilai thead tr {
                    background-color: #d0d0d0;
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                    font-weight: 700;
                    text-align: center;
                }
                .th-no, .td-no { width: 24px; text-align: center; }
                .th-mapel, .td-mapel { width: 150px; }
                .td-mapel { font-weight: 600; }
                .th-nilai, .td-nilai { width: 38px; text-align: center; font-weight: 700; }
                .td-nilai-huruf { font-style: italic; }
                .th-deskripsi, .td-deskripsi { text-align: justify; font-size: 8.5pt; line-height: 1.45; }
                .row-alt { background-color: #f5f5f5; }
                .row-alt td { background-color: #f5f5f5; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                .td-empty { text-align: center; color: #666; font-style: italic; padding: 8px; }

                /* ─ Ekskul & Absensi ─ */
                .ekskul-absen-wrapper {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    margin-bottom: 2px;
                }
                .ekskul-col { flex: 0 0 58%; }
                .absen-col  { flex: 1; }

                .tabel-ekskul {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9pt;
                }
                .tabel-ekskul th,
                .tabel-ekskul td {
                    border: 1px solid #000;
                    padding: 3px 5px;
                }
                .tabel-ekskul thead tr {
                    background-color: #d0d0d0;
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                    font-weight: 700;
                    text-align: center;
                }
                .th-predikat, .td-predikat { width: 60px; text-align: center; font-weight: 700; }

                .tabel-absen {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9pt;
                }
                .tabel-absen td { padding: 3px 4px; }
                .absen-label { font-weight: 600; width: 110px; }
                .absen-sep   { width: 10px; text-align: center; }
                .absen-value { }

                /* ─ Catatan ─ */
                .catatan-wrapper { margin-bottom: 2px; }
                .catatan-box { padding: 2px 0; }
                .catatan-lines { }
                .catatan-line {
                    border-bottom: 1px solid #aaa;
                    margin-bottom: 11px;
                    height: 11px;
                }

                /* ─ Kenaikan Kelas (Format Naratif) ─ */
                .kenaikan-wrapper { 
                    margin-bottom: 2px; 
                }
                .kenaikan-box { 
                    padding: 4px 0; 
                }
                .kenaikan-intro {
                    font-size: 9.5pt;
                    text-align: justify;
                    line-height: 1.5;
                    margin-bottom: 8px;
                }
                
                .tabel-keputusan {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9.5pt;
                    margin-bottom: 4px;
                }
                .tabel-keputusan td { 
                    padding: 3px 4px; 
                }
                .keputusan-label { 
                    font-weight: 600; 
                    width: 100px; 
                }
                .keputusan-sep { 
                    width: 10px; 
                    text-align: center; 
                }
                .keputusan-value { 
                    font-weight: 500; 
                }
                .kelas-terbilang {
                    margin-left: 6px;
                    font-weight: 400;
                    font-style: italic;
                }
                
                .catatan-kenaikan {
                    margin-top: 8px;
                }
                .catatan-penjelasan {
                    font-size: 8.5pt;
                    text-align: justify;
                    line-height: 1.4;
                    margin: 0;
                }

                /* ─ Tanda Tangan ─ */
                .ttd-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 8px;
                    page-break-inside: avoid;
                }
                .ttd-kepsek-wrapper {
                    display: flex;
                    justify-content: center;
                    page-break-inside: avoid;
                }
                .ttd-box {
                    text-align: center;
                    min-width: 140px;
                }
                .ttd-label {
                    font-size: 9.5pt;
                    margin: 0 0 4px;
                    line-height: 1.5;
                }
                .ttd-space {
                    height: 40px;
                }
                .ttd-garis {
                    border-bottom: 1px solid #000;
                    width: 160px;
                    margin: 0 auto;
                    padding-bottom: 2px;
                    min-height: 18px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                .ttd-nama {
                    font-size: 9pt;
                    font-weight: 700;
                }
                .ttd-nip {
                    font-size: 8.5pt;
                    margin-top: 2px;
                }
                .ttd-spacer { flex: 1; }

                /* ─ Print ─ */
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                        background: white !important;
                    }

                    .rapor-page {
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 210mm;
                        min-height: 297mm;
                        padding: 14mm 18mm 16mm;
                    }
                }
            `}</style>
        </>
    );
}
