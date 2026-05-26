import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import { router, useForm, usePage } from '@inertiajs/react';

export default function Index({ rombels, semesters, filters, mapels = [], students = [] }) {
    const { global_settings } = usePage().props;

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/recaps', filterForm.data, { preserveState: false });
    };

    return (
        <AppLayout title="Legger / Rekap Nilai">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <p className="font-bold text-slate-800 mb-1">Filter Legger</p>
                <p className="text-xs text-slate-500 mb-4">
                    Pilih rombel dan semester untuk melihat rekapitulasi seluruh nilai.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <InputLabel value="Rombongan Belajar" />
                        <select
                            value={filterForm.data.rombel_id}
                            onChange={(e) => filterForm.setData('rombel_id', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                        >
                            <option value="">-- Pilih Rombel --</option>
                            {rombels.map((r) => (
                                <option key={r.id} value={r.id}>
                                    Kelas {r.tingkat} - {r.nama_rombel}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Semester" />
                        <select
                            value={filterForm.data.semester}
                            onChange={(e) => filterForm.setData('semester', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                        >
                            <option value="">-- Pilih Semester --</option>
                            {semesters.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
                    >
                        Tampilkan Legger
                    </button>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester untuk menampilkan Legger.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada data siswa di rombel ini.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="font-bold text-lg text-slate-800">Legger Kelas</h2>
                        <p className="text-sm text-slate-500">
                            Semester {filters.semester} · Tahun Ajaran {global_settings?.tahun_ajaran_aktif || '-'}
                        </p>
                    </div>
                    <table className="w-full text-sm min-w-[1200px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th rowSpan={2} className="px-3 py-3 text-xs font-bold text-slate-500 sticky left-0 bg-slate-50 z-10 border-r border-slate-200 text-center">No</th>
                                <th rowSpan={2} className="px-3 py-3 text-xs font-bold text-slate-500 sticky left-10 bg-slate-50 z-10 border-r border-slate-200 min-w-[180px]">Nama Siswa</th>
                                {mapels.map((m) => (
                                    <th key={m.id} rowSpan={2} className="px-2 py-3 text-[10px] font-bold text-slate-600 border-r border-slate-200 text-center uppercase whitespace-nowrap min-w-[80px]">
                                        <div className="writing-vertical-rl transform -rotate-180 h-32 truncate">{m.mata_pelajaran}</div>
                                    </th>
                                ))}
                                <th rowSpan={2} className="px-3 py-3 text-[11px] font-bold text-indigo-700 border-r border-slate-200 text-center">Jumlah Nilai</th>
                                <th rowSpan={2} className="px-3 py-3 text-[11px] font-bold text-indigo-700 border-r border-slate-200 text-center">Rata-Rata</th>
                                <th rowSpan={2} className="px-3 py-3 text-[11px] font-bold text-indigo-700 border-r border-slate-200 text-center">Peringkat</th>
                                <th colSpan={3} className="px-3 py-2 text-[11px] font-bold text-slate-600 border-r border-slate-200 text-center">Ketidakhadiran</th>
                                <th colSpan={2} className="px-3 py-2 text-[11px] font-bold text-slate-600 text-center">Ekstrakurikuler</th>
                            </tr>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500">
                                <th className="px-2 py-1 border-r border-slate-200 text-center">S</th>
                                <th className="px-2 py-1 border-r border-slate-200 text-center">I</th>
                                <th className="px-2 py-1 border-r border-slate-200 text-center">A</th>
                                <th className="px-2 py-1 border-r border-slate-200">Nama</th>
                                <th className="px-2 py-1">Nilai</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((student, idx) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-3 py-2 text-center sticky left-0 bg-white border-r border-slate-100">{idx + 1}</td>
                                    <td className="px-3 py-2 font-medium sticky left-10 bg-white border-r border-slate-100 truncate max-w-[180px]">{student.nama}</td>
                                    {mapels.map((m) => (
                                        <td key={m.id} className="px-2 py-2 text-center border-r border-slate-100 font-semibold text-slate-700">
                                            {student.mapel_grades[m.id] ?? '-'}
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-center font-bold text-indigo-600 border-r border-slate-100 bg-indigo-50/30">
                                        {student.total_nilai}
                                    </td>
                                    <td className="px-3 py-2 text-center font-bold text-indigo-600 border-r border-slate-100 bg-indigo-50/30">
                                        {student.rata_rata}
                                    </td>
                                    <td className="px-3 py-2 text-center font-bold text-purple-600 border-r border-slate-100 bg-purple-50/30">
                                        {student.ranking}
                                    </td>
                                    <td className="px-2 py-2 text-center border-r border-slate-100">{student.sakit > 0 ? student.sakit : '-'}</td>
                                    <td className="px-2 py-2 text-center border-r border-slate-100">{student.ijin > 0 ? student.ijin : '-'}</td>
                                    <td className="px-2 py-2 text-center border-r border-slate-100">{student.alpa > 0 ? student.alpa : '-'}</td>
                                    <td className="px-2 py-2 border-r border-slate-100 truncate max-w-[100px]">{student.ekskul}</td>
                                    <td className="px-2 py-2 text-center font-semibold text-slate-700">{student.predikat_ekskul}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <style>{`
                .writing-vertical-rl {
                    writing-mode: vertical-rl;
                }
            `}</style>
        </AppLayout>
    );
}
