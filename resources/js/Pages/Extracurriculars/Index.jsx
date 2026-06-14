import React, { useState } from 'react';
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
    records = {},   // { student_id: [ {id, extracurricular_category_id, predikat, nama_ekskul}, ... ] }
    canEdit = false,
}) {
    const { flash } = usePage().props;

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester:  filters.semester  || '',
    });

    const applyFilters = () => {
        router.get('/extracurriculars', filterForm.data, { preserveState: false });
    };

    const predikatBadge = (predikat) => {
        const map = {
            'Sangat Baik': 'bg-emerald-100 text-emerald-700',
            'Baik':        'bg-blue-100 text-blue-700',
            'Cukup':       'bg-amber-100 text-amber-700',
            'Kurang':      'bg-red-100 text-red-700',
        };
        return map[predikat] || 'bg-slate-100 text-slate-600';
    };

    return (
        <AppLayout title="Data Ekstrakurikuler">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-slate-800">Filter Data</p>
                    <Link
                        href={`/extracurriculars/create?rombel_id=${filterForm.data.rombel_id}&semester=${filterForm.data.semester}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <EditNote className="w-4 h-4" /> Input / Edit Data
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
                                <option key={r.id} value={r.id}>Kelas {r.tingkat} - {r.nama_rombel}</option>
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
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
                    >
                        Tampilkan Data
                    </button>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester terlebih dulu.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <p className="font-bold text-slate-800">Rekap Ekstrakurikuler</p>
                        <p className="text-xs text-slate-400 mt-0.5">Setiap siswa dapat mengikuti lebih dari satu ekskul.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">No</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ekstrakurikuler yang Diikuti</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, idx) => {
                                    const ekskulList = records[student.id] || [];
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 text-sm text-slate-500 text-center">{idx + 1}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900 align-top">{student.nama_lengkap}</td>
                                            <td className="px-5 py-4">
                                                {ekskulList.length === 0 ? (
                                                    <span className="text-slate-400 italic text-xs">Belum ada data</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {ekskulList.map((ekskul) => (
                                                            <span
                                                                key={ekskul.id}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-white"
                                                            >
                                                                <span className="text-slate-700">{ekskul.nama_ekskul}</span>
                                                                {ekskul.predikat && (
                                                                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${predikatBadge(ekskul.predikat)}`}>
                                                                        {ekskul.predikat}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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
