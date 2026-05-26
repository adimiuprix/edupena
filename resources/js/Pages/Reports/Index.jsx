import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Print } from '@mui/icons-material';

export default function Index({ rombels, semesters, filters, students = [] }) {
    const { global_settings } = usePage().props;

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/reports', filterForm.data, { preserveState: false });
    };

    return (
        <AppLayout title="Rapor Siswa">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <p className="font-bold text-slate-800 mb-1">Filter Rapor</p>
                <p className="text-xs text-slate-500 mb-4">
                    Pilih rombel dan semester untuk menampilkan daftar siswa.
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
                        Tampilkan Daftar Siswa
                    </button>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester untuk menampilkan daftar siswa.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada data siswa di rombel ini.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="font-bold text-lg text-slate-800">Daftar Siswa</h2>
                        <p className="text-sm text-slate-500">
                            Semester {filters.semester} · Tahun Ajaran {global_settings?.tahun_ajaran_aktif || '-'}
                        </p>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-5 py-3 font-bold text-slate-500 w-16 text-center">No</th>
                                <th className="px-5 py-3 font-bold text-slate-500">NISN</th>
                                <th className="px-5 py-3 font-bold text-slate-500">Nama Lengkap</th>
                                <th className="px-5 py-3 font-bold text-slate-500 w-32 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((student, idx) => (
                                <tr key={student.id} className="hover:bg-slate-50/50">
                                    <td className="px-5 py-3 text-center">{idx + 1}</td>
                                    <td className="px-5 py-3">{student.nisn || '-'}</td>
                                    <td className="px-5 py-3 font-medium text-slate-800">{student.nama_lengkap}</td>
                                    <td className="px-5 py-3 text-center">
                                        <a
                                            href={`/reports/${student.id}?semester=${filters.semester}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-semibold transition-colors border border-emerald-200"
                                        >
                                            <Print className="w-4 h-4" />
                                            Cetak
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    );
}
