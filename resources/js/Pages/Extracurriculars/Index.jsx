import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage, Link } from '@inertiajs/react';
import { EditNote } from '@mui/icons-material';

export default function Index({
    rombels,
    categories,
    predikatOptions,
    semesters,
    filters,
    students = [],
    records = {},
    canEdit = false,
}) {
    const { flash, global_settings } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            const row = source[s.id] || {};
            g[s.id] = {
                extracurricular_category_id: row.extracurricular_category_id ?? '',
                predikat: row.predikat ?? '',
            };
        });
        return g;
    };

    const [grid, setGrid] = useState(() => buildGrid(records));

    useEffect(() => {
        setGrid(buildGrid(records));
    }, [records, students]);

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/extracurriculars', filterForm.data, { preserveState: false });
    };

    const getEkskulName = (id) => {
        if (!id) return '-';
        const cat = categories.find(c => c.id == id);
        return cat ? cat.nama_ekskul : '-';
    };

    return (
        <AppLayout title="Data Absensi & Ekskul">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-slate-800">Filter Data</p>
                    <Link
                        href={`/extracurriculars/create?rombel_id=${filterForm.data.rombel_id}&semester=${filterForm.data.semester}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <EditNote className="w-4 h-4" /> Tambah Data
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rombongan Belajar</label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
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
                    <div>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl w-full"
                        >
                            Tampilkan Data
                        </button>
                    </div>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester terlebih dulu.
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Belum ada kategori ekskul. Jalankan seeder: <code className="font-mono">php artisan db:seed --class=ExtracurricularCategorySeeder</code>
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800">Daftar Absensi & Ekstrakurikuler</p>
                            <p className="text-xs text-slate-400 mt-0.5">Satu ekskul per siswa per semester</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">No</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ekstrakurikuler</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Predikat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, idx) => {
                                    const row = grid[student.id] || {};
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-medium text-slate-700 text-center">{idx + 1}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">{student.nama_lengkap}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {row.extracurricular_category_id ? (
                                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                                                        {getEkskulName(row.extracurricular_category_id)}
                                                    </span>
                                                ) : <span className="text-slate-400 italic text-xs">Belum diisi</span>}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-center">
                                                {row.predikat ? (
                                                    <span className="font-semibold text-slate-700">{row.predikat}</span>
                                                ) : <span className="text-slate-400 italic text-xs">-</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
