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

function buildAlamatSekolah(settings) {
    const parts = [
        settings.alamat_sekolah,
        settings.desa_kelurahan,
        settings.kecamatan,
        settings.kabupaten_kota,
        settings.provinsi,
        settings.kode_pos,
    ].filter(Boolean);
    return parts.join(', ');
}

function buildKontakSekolah(settings) {
    const parts = [];
    if (settings.email_sekolah) parts.push(`Email: ${settings.email_sekolah}`);
    if (settings.website_sekolah) parts.push(`Web: ${settings.website_sekolah}`);
    return parts.join('  |  ');
}

function getTanggalCetak(settings) {
    const kota = settings.kabupaten_kota || 'Kota';
    const tanggal = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
    return `${kota}, ${tanggal}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Show({ student, rombel, semester, reportData, kehadiran, absensi, settings, waliKelasNip }) {

    const printPage = () => window.print();

    const fase       = getFase(rombel.tingkat);
    const semesterLabel = semester?.toLowerCase() === 'ganjil' ? '1 (Ganjil)' : '2 (Genap)';
    const waliKelasNama = rombel?.wali_kelas?.name ?? rombel?.waliKelas?.name ?? null;

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
                            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        Cetak / Simpan PDF
                    </button>
                </div>
            </div>

            {/* ── Halaman Rapor A4 ── */}
            <div className="rapor-page print:mt-0 mt-20 mb-10 mx-auto print:mx-0 print:shadow-none bg-white shadow-2xl">

                {/* ════════════════════════════════════════
                    KOP SEKOLAH
                ════════════════════════════════════════ */}
                <div className="kop-wrapper">
                    {/* Logo (kondisional) */}
                    <img
                        src="/images/logo_sekolah.png"
                        alt="Logo Sekolah"
                        className="kop-logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Teks Kop */}
                    <div className="kop-text">
                        <div className="kop-instansi">PEMERINTAH KABUPATEN {(settings.kabupaten_kota || '').toUpperCase()}</div>
                        <div className="kop-nama-sekolah">{(settings.nama_sekolah || 'NAMA SEKOLAH').toUpperCase()}</div>
                        <div className="kop-alamat">{buildAlamatSekolah(settings)}</div>
                        {buildKontakSekolah(settings) && (
                            <div className="kop-kontak">{buildKontakSekolah(settings)}</div>
                        )}
                        {settings.npsn && (
                            <div className="kop-npsn">NPSN: {settings.npsn}</div>
                        )}
                    </div>

                    {/* Logo kanan (opsional duplikat / Garuda / Kab) */}
                    <img
                        src="/images/logo_kabupaten.png"
                        alt="Logo Kabupaten"
                        className="kop-logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>

                {/* Garis Kop: Double Line */}
                <div className="kop-garis-luar"></div>
                <div className="kop-garis-dalam"></div>

                {/* ════════════════════════════════════════
                    JUDUL
                ════════════════════════════════════════ */}
                <div className="judul-wrapper">
                    <div className="judul-utama">LAPORAN HASIL BELAJAR PESERTA DIDIK</div>
                    <div className="judul-sub">
                        Semester {semesterLabel} &nbsp;&bull;&nbsp; Tahun Pelajaran {settings.tahun_ajaran_aktif || rombel.tahun_ajaran || '-'}
                    </div>
                </div>

                {/* ════════════════════════════════════════
                    IDENTITAS SISWA
                ════════════════════════════════════════ */}
                <table className="tabel-identitas">
                    <tbody>
                        <tr>
                            <td className="id-label">Nama Peserta Didik</td>
                            <td className="id-sep">:</td>
                            <td className="id-value"><strong>{student.nama_lengkap || '-'}</strong></td>
                            <td className="id-label">Kelas</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{rombel.tingkat} - {rombel.nama_rombel}</td>
                        </tr>
                        <tr>
                            <td className="id-label">NISN</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{student.nisn || '-'}</td>
                            <td className="id-label">Fase</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{fase}</td>
                        </tr>
                        <tr>
                            <td className="id-label">NIS / NIPD</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{student.nipd || '-'}</td>
                            <td className="id-label">Agama</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{student.agama || '-'}</td>
                        </tr>
                        <tr>
                            <td className="id-label">Tempat, Tgl Lahir</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">
                                {student.tempat_lahir ? `${student.tempat_lahir}, ` : ''}{formatTanggal(student.tanggal_lahir)}
                            </td>
                            <td className="id-label">Wali Kelas</td>
                            <td className="id-sep">:</td>
                            <td className="id-value">{waliKelasNama || '-'}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="section-divider"></div>

                {/* ════════════════════════════════════════
                    A. NILAI AKADEMIK
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
                        {reportData.length > 0 ? (
                            reportData.map((data, index) => (
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
                    B. EKSKUL & C. KEHADIRAN
                ════════════════════════════════════════ */}
                <div className="ekskul-absen-wrapper">

                    {/* B. Ekstrakurikuler */}
                    <div className="ekskul-col">
                        <div className="section-title">B. Ekstrakurikuler</div>
                        <table className="tabel-ekskul">
                            <thead>
                                <tr>
                                    <th className="th-no">No</th>
                                    <th>Kegiatan Ekstrakurikuler</th>
                                    <th className="th-predikat">Predikat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kehadiran?.category ? (
                                    <tr>
                                        <td className="td-no">1</td>
                                        <td>{kehadiran.category.name}</td>
                                        <td className="td-predikat">{kehadiran.predikat || '-'}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="td-empty">Tidak mengikuti ekstrakurikuler.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* C. Ketidakhadiran */}
                    <div className="absen-col">
                        <div className="section-title">C. Ketidakhadiran</div>
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
                    <div className="section-title">D. Catatan Wali Kelas</div>
                    <div className="catatan-box">
                        <div className="catatan-lines">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="catatan-line"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

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

                /* ─ Kop ─ */
                .kop-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 6px;
                }
                .kop-logo {
                    width: 64px;
                    height: 64px;
                    object-fit: contain;
                    flex-shrink: 0;
                }
                .kop-text {
                    flex: 1;
                    text-align: center;
                }
                .kop-instansi {
                    font-size: 9pt;
                    letter-spacing: 0.02em;
                }
                .kop-nama-sekolah {
                    font-size: 16pt;
                    font-weight: 900;
                    letter-spacing: 0.04em;
                    line-height: 1.15;
                }
                .kop-alamat {
                    font-size: 8.5pt;
                    margin-top: 2px;
                }
                .kop-kontak, .kop-npsn {
                    font-size: 8pt;
                    color: #333;
                }
                .kop-garis-luar {
                    border-top: 3px solid #000;
                    margin-bottom: 2px;
                }
                .kop-garis-dalam {
                    border-top: 1px solid #000;
                    margin-bottom: 10px;
                }

                /* ─ Judul ─ */
                .judul-wrapper {
                    text-align: center;
                    margin-bottom: 8px;
                }
                .judul-utama {
                    font-size: 12pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .judul-sub {
                    font-size: 9.5pt;
                    margin-top: 2px;
                }

                /* ─ Identitas Siswa ─ */
                .tabel-identitas {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 6px;
                    font-size: 9.5pt;
                }
                .tabel-identitas td {
                    padding: 1.5px 3px;
                    vertical-align: top;
                }
                .id-label {
                    width: 110px;
                    white-space: nowrap;
                    font-weight: 600;
                }
                .id-sep {
                    width: 10px;
                    text-align: center;
                    padding: 1.5px 2px;
                }
                .id-value {
                    width: 180px;
                    padding-right: 12px;
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
