import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage, Link } from '@inertiajs/react';
import { Save, ArrowBack } from '@mui/icons-material';
import Column from '@/Components/Coumn';

export default function Create({
    rombels,
    categories,
    predikatOptions,
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
                extracurricular_category_id: row.extracurricular_category_id ?? '',
                predikat: row.predikat ?? '',
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
            extracurricular_category_id: grid[s.id]?.extracurricular_category_id || null,
            predikat: grid[s.id]?.predikat || null,
        }));

        setSaving(true);
        router.post('/extracurriculars', {
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
        router.get('/extracurriculars/create', filterForm.data, { preserveState: false });
    };

    const wajibCategories = categories.filter((c) => c.jenis === 'wajib');
    const pilihanCategories = categories.filter((c) => c.jenis === 'pilihan');

    return (
        <AppLayout title="Input Absensi & Ekskul">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="font-bold text-slate-800">Filter Data</p>
                        <p className="text-xs text-slate-400 mt-0.5">Pilih rombel dan semester untuk mengisi data</p>
                    </div>
                    <Link
                        href="/extracurriculars"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <ArrowBack className="w-4 h-4" /> Kembali
                    </Link>
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
                            Tampilkan Form
                        </button>
                    </div>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Silakan pilih rombel dan semester terlebih dulu untuk menampilkan form input.
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
                <form onSubmit={handleSave}>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">Form Input Data</p>
                                <p className="text-xs text-slate-400 mt-0.5">Isi ekskul, predikat, dan rekap absensi per siswa.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saving || !canEdit}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">No</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-56">Ekstrakurikuler</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-36">Predikat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => {
                                        const row = grid[student.id] || {};
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm font-medium text-slate-700 text-center">{idx + 1}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{student.nama_lengkap}</td>
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={row.extracurricular_category_id}
                                                        onChange={e => updateRow(student.id, 'extracurricular_category_id', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                                    >
                                                        <option value="">-- Pilih Ekskul --</option>
                                                        {wajibCategories.length > 0 && (
                                                            <optgroup label="Wajib">
                                                                {wajibCategories.map(c => (
                                                                    <option key={c.id} value={c.id}>{c.nama_ekskul}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        {pilihanCategories.length > 0 && (
                                                            <optgroup label="Pilihan">
                                                                {pilihanCategories.map(c => (
                                                                    <option key={c.id} value={c.id}>{c.nama_ekskul}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <select
                                                        value={row.predikat}
                                                        onChange={e => updateRow(student.id, 'predikat', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-center"
                                                    >
                                                        <option value="">-</option>
                                                        {predikatOptions.map(p => (
                                                            <option key={p} value={p}>{p}</option>
                                                        ))}
                                                    </select>
                                                </td>
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
