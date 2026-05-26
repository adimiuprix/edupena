import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Show({ student, rombel, semester, reportData, kehadiran, settings }) {
    
    useEffect(() => {
        // Hapus margin body bawaan browser untuk print
        document.body.classList.add('bg-gray-100');
        return () => document.body.classList.remove('bg-gray-100');
    }, []);

    const printPage = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Rapor - ${student.nama_lengkap}`} />
            
            {/* Top Bar for Action (Hidden on Print) */}
            <div className="print:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-sm">
                <div>
                    <h1 className="font-bold text-gray-800">Preview Rapor</h1>
                    <p className="text-xs text-gray-500">{student.nama_lengkap} - Kelas {rombel.tingkat}</p>
                </div>
                <button 
                    onClick={printPage}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
                >
                    Cetak / Simpan PDF
                </button>
            </div>

            {/* A4 Page Container */}
            <div className="print:m-0 print:shadow-none print:bg-white bg-white w-[210mm] min-h-[297mm] mx-auto mt-24 mb-10 p-[15mm] shadow-xl text-black">
                
                {/* HEADER IDENTITAS */}
                <div className="border-b-4 border-black pb-4 mb-6">
                    <h1 className="text-center text-xl font-bold uppercase tracking-wider mb-2">Laporan Hasil Belajar</h1>
                    <table className="w-full text-sm font-semibold">
                        <tbody>
                            <tr>
                                <td className="w-32 py-1">Nama Peserta Didik</td>
                                <td className="w-4">:</td>
                                <td className="py-1">{student.nama_lengkap}</td>
                                <td className="w-32 py-1">Kelas</td>
                                <td className="w-4">:</td>
                                <td className="py-1">{rombel.tingkat} ({rombel.nama_rombel})</td>
                            </tr>
                            <tr>
                                <td className="py-1">NISN / NIS</td>
                                <td>:</td>
                                <td className="py-1">{student.nisn || '-'} / {student.nis || '-'}</td>
                                <td className="py-1">Fase</td>
                                <td>:</td>
                                <td className="py-1">{rombel.tingkat <= 2 ? 'A' : (rombel.tingkat <= 4 ? 'B' : 'C')}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Nama Sekolah</td>
                                <td>:</td>
                                <td className="py-1">{settings.nama_sekolah || 'Nama Sekolah'}</td>
                                <td className="py-1">Semester</td>
                                <td>:</td>
                                <td className="py-1">{semester === 'ganjil' ? '1 (Ganjil)' : '2 (Genap)'}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Alamat Sekolah</td>
                                <td>:</td>
                                <td className="py-1" colSpan={4}>{settings.alamat_sekolah || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* TABEL NILAI AKADEMIK */}
                <h2 className="font-bold text-md mb-2">A. Nilai Akademik</h2>
                <table className="w-full border-collapse border border-black mb-6 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2 w-10 text-center">No</th>
                            <th className="border border-black p-2 w-48 text-center">Mata Pelajaran</th>
                            <th className="border border-black p-2 w-20 text-center">Nilai Akhir</th>
                            <th className="border border-black p-2 text-center">Capaian Kompetensi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length > 0 ? reportData.map((data, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2 text-center align-top">{index + 1}</td>
                                <td className="border border-black p-2 font-semibold align-top">{data.mapel}</td>
                                <td className="border border-black p-2 text-center font-bold align-top">{data.nilai_akhir ?? '-'}</td>
                                <td className="border border-black p-2 text-justify text-xs align-top">
                                    {data.capaian_kompetensi || '-'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="border border-black p-4 text-center text-gray-500 italic">Belum ada nilai yang diinputkan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* TABEL EKSKUL & ABSENSI */}
                <div className="flex gap-6 mb-8 print:break-inside-avoid">
                    <div className="w-1/2">
                        <h2 className="font-bold text-md mb-2">B. Ekstrakurikuler</h2>
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-black p-2 w-10 text-center">No</th>
                                    <th className="border border-black p-2">Kegiatan Ekstrakurikuler</th>
                                    <th className="border border-black p-2 text-center">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kehadiran?.category ? (
                                    <tr>
                                        <td className="border border-black p-2 text-center">1</td>
                                        <td className="border border-black p-2">{kehadiran.category.name}</td>
                                        <td className="border border-black p-2 text-center font-semibold">{kehadiran.predikat || '-'}</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="border border-black p-2 text-center text-gray-500 italic">Tidak mengikuti ekskul</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/2">
                        <h2 className="font-bold text-md mb-2">C. Ketidakhadiran</h2>
                        <table className="w-full border-collapse border border-black text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-2 w-32">Sakit</td>
                                    <td className="border border-black p-2 text-center">{kehadiran?.sakit || '-'} hari</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2">Izin</td>
                                    <td className="border border-black p-2 text-center">{kehadiran?.ijin || '-'} hari</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-2">Tanpa Keterangan</td>
                                    <td className="border border-black p-2 text-center">{kehadiran?.alpa || '-'} hari</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SIGNATURE AREA */}
                <div className="mt-12 flex justify-between print:break-inside-avoid">
                    <div className="text-center w-64">
                        <p className="mb-20">Mengetahui,<br/>Orang Tua/Wali</p>
                        <div className="border-b border-black w-48 mx-auto"></div>
                    </div>
                    <div className="text-center w-64">
                        <p className="mb-20">
                            {settings.tempat_cetak_rapor || 'Kota'}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                            Wali Kelas
                        </p>
                        <div className="border-b border-black w-56 mx-auto mb-1">
                            {rombel?.wali_kelas?.name || '_________________________'}
                        </div>
                        <p className="text-xs">NIP. {rombel?.wali_kelas?.teacher?.nip || '-'}</p>
                    </div>
                </div>

                <div className="mt-10 text-center print:break-inside-avoid">
                    <p className="mb-20">Mengetahui,<br/>Kepala Sekolah</p>
                    <div className="border-b border-black w-64 mx-auto mb-1 font-bold">
                        {settings.kepala_sekolah || '_________________________'}
                    </div>
                    <p className="text-xs">NIP. {settings.nip_kepala_sekolah || '-'}</p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
                }
            `}</style>
        </>
    );
}
