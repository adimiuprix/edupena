import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Save } from '@mui/icons-material';
import Column from '@/Components/Coumn';

export default function Index({
    rombels,
    semesters,
    filters,
    students = [],
    records = {},
    canEdit = true,
}) {
    const { flash } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            const row = source[s.id] || {};
            g[s.id] = {
                sakit: row.sakit ?? 0,
                ijin: row.ijin ?? 0,
                alpa: row.alpa ?? 0,
            };
        });
        return g;
    };

    const [grid, setGrid] = useState(() => buildGrid(records));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setGrid(buildGrid(records));
    }, [records, students]);

    const updateRow = (studentId, field, value) => {
        setGrid((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value },
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = students.map((s) => ({
            student_id: s.id,
            sakit: Number(grid[s.id]?.sakit ?? 0),
            ijin: Number(grid[s.id]?.ijin ?? 0),
            alpa: Number(grid[s.id]?.alpa ?? 0),
        }));

        setSaving(true);
        router.post('/attendances', {
            rombel_id: filters.rombel_id,
            semester: filters.semester,
            records: payload,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/attendances', filterForm.data, { preserveState: false });
    };

    return (
        <AppLayout title="Data Absensi">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="font-bold text-slate-800">Filter Data Absensi</p>
                        <p className="text-xs text-slate-400 mt-0.5">Pilih rombel dan semester untuk mengisi total absensi</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rombongan Belajar</label>
                        <select
                            value={filterForm.data.rombel_id}
                            onChange={e => filterForm.setData('rombel_id', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                        >
                            <option value="">-- Pilih Rombel --</option>
                            {rombels.map(r => (
                                <option key={r.id} value={r.id}>Kelas {r.tingkat} - {r.nama_rombel}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                        <select
                            value={filterForm.data.semester}
                            onChange={e => filterForm.setData('semester', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                        >
                            <option value="">-- Pilih Semester --</option>
                            {semesters.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl w-full transition-colors"
                        >
                            Tampilkan Data
                        </button>
                    </div>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Silakan pilih rombel dan semester terlebih dulu untuk menampilkan daftar siswa.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">Form Rekap Absensi</p>
                                <p className="text-xs text-slate-400 mt-0.5">Isi total kehadiran siswa dalam satu semester.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saving || !canEdit}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : 'Simpan Absensi'}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">No</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">Sakit</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">Izin</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">Alpa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => {
                                        const row = grid[student.id] || {};
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm font-medium text-slate-700 text-center">{idx + 1}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{student.nama_lengkap}</td>
                                                <Column value={row.sakit} onChange={e => updateRow(student.id, 'sakit', e.target.value)} />
                                                <Column value={row.ijin} onChange={e => updateRow(student.id, 'ijin', e.target.value)} />
                                                <Column value={row.alpa} onChange={e => updateRow(student.id, 'alpa', e.target.value)} />
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            )}
        </AppLayout>
    );
}
