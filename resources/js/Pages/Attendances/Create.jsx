import AppLayout from '@/Layouts/AppLayout';

import { router, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Save } from '@mui/icons-material';

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
    const { flash, global_settings } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            const row = source[s.id] || {};
            g[s.id] = {
                extracurricular_category_id: row.extracurricular_category_id ?? '',
                predikat: row.predikat ?? '',
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
            extracurricular_category_id: grid[s.id]?.extracurricular_category_id || null,
            predikat: grid[s.id]?.predikat || null,
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

    const wajibCategories = categories.filter((c) => c.jenis === 'wajib');
    const pilihanCategories = categories.filter((c) => c.jenis === 'pilihan');

    return (
        <AppLayout title="Tambah Absensi & Ekskul">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}



            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester untuk mengisi data ekskul dan absensi.
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
                <>
<form onSubmit={handleSave}>
                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-sm text-slate-600">
                            Isi <strong>satu ekskul</strong>, predikat, dan jumlah hari absensi per siswa.
                        </p>
                        <button
                            type="submit"
                            disabled={saving || !canEdit}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-4 py-3 text-xs font-bold text-slate-500">No</th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-500 text-left">Nama Siswa</th>
                                    <th className="px-4 py-3 text-xs font-bold text-indigo-600">Ekstrakurikuler</th>
                                    <th className="px-4 py-3 text-xs font-bold text-indigo-600">Predikat</th>
                                    <th className="px-4 py-3 text-xs font-bold text-rose-600">Sakit</th>
                                    <th className="px-4 py-3 text-xs font-bold text-amber-600">Ijin</th>
                                    <th className="px-4 py-3 text-xs font-bold text-slate-600">Alpa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, idx) => {
                                    const row = grid[student.id] || {};
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-center">{idx + 1}</td>
                                            <td className="px-4 py-3 font-medium text-slate-900">{student.nama_lengkap}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.extracurricular_category_id}
                                                    onChange={(e) => updateRow(student.id, 'extracurricular_category_id', e.target.value)}
                                                    className="w-full min-w-[160px] px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                                                >
                                                    <option value="">-- Pilih Ekskul --</option>
                                                    {wajibCategories.length > 0 && (
                                                        <optgroup label="Wajib">
                                                            {wajibCategories.map((c) => (
                                                                <option key={c.id} value={c.id}>{c.nama_ekskul}</option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                    {pilihanCategories.length > 0 && (
                                                        <optgroup label="Pilihan">
                                                            {pilihanCategories.map((c) => (
                                                                <option key={c.id} value={c.id}>{c.nama_ekskul}</option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.predikat}
                                                    onChange={(e) => updateRow(student.id, 'predikat', e.target.value)}
                                                    className="w-full min-w-[120px] px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                                                >
                                                    <option value="">--</option>
                                                    {predikatOptions.map((p) => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={row.sakit}
                                                    onChange={(e) => updateRow(student.id, 'sakit', e.target.value)}
                                                    className="w-16 px-2 py-1.5 text-center rounded-lg border border-slate-200 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={row.ijin}
                                                    onChange={(e) => updateRow(student.id, 'ijin', e.target.value)}
                                                    className="w-16 px-2 py-1.5 text-center rounded-lg border border-slate-200 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={row.alpa}
                                                    onChange={(e) => updateRow(student.id, 'alpa', e.target.value)}
                                                    className="w-16 px-2 py-1.5 text-center rounded-lg border border-slate-200 text-xs"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </form>
</>
            )}
        </AppLayout>
    );
}
