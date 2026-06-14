import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage, Link } from '@inertiajs/react';
import { Save, ArrowBack } from '@mui/icons-material';

export default function Create({
    rombels,
    categories,
    predikatOptions,
    semesters,
    filters,
    students = [],
    records = {},   // { student_id: { category_id: predikat|'' } }
    canEdit = true,
}) {
    const { flash } = usePage().props;

    /**
     * grid: { [studentId]: { [categoryId]: predikat|'' } }
     * '' berarti ekskul ini tidak diikuti siswa tersebut
     */
    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            g[s.id] = {};
            categories.forEach((c) => {
                g[s.id][c.id] = source[s.id]?.[c.id] ?? '';
            });
        });
        return g;
    };

    const [grid, setGrid]   = useState(() => buildGrid(records));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setGrid(buildGrid(records));
    }, [records, students, categories]);

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester:  filters.semester  || '',
    });

    const applyFilters = () => {
        router.get('/extracurriculars/create', filterForm.data, { preserveState: false });
    };

    /** Ubah predikat pada (studentId, categoryId). Kosongkan → hapus dari grid */
    const updateCell = (studentId, categoryId, value) => {
        setGrid((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], [categoryId]: value },
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = [];

        students.forEach((s) => {
            categories.forEach((c) => {
                const predikat = grid[s.id]?.[c.id] ?? '';
                if (predikat !== '') {
                    payload.push({
                        student_id:                   s.id,
                        extracurricular_category_id:  c.id,
                        predikat,
                    });
                }
            });
        });

        setSaving(true);
        router.post('/extracurriculars', {
            rombel_id: filters.rombel_id,
            semester:  filters.semester,
            records:   payload,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const wajibCategories   = categories.filter((c) => c.jenis === 'wajib');
    const pilihanCategories = categories.filter((c) => c.jenis === 'pilihan');
    const allCategories     = [...wajibCategories, ...pilihanCategories];

    return (
        <AppLayout title="Input Ekskul">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            {/* Filter */}
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
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        Tampilkan Form
                    </button>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Silakan pilih rombel dan semester terlebih dulu.
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Belum ada kategori ekskul.
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
                                <p className="font-bold text-slate-800">Input Nilai Ekstrakurikuler</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pilih predikat untuk ekskul yang diikuti. Kosongkan (–) jika siswa tidak mengikuti ekskul tersebut.
                                </p>
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
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-8 border-r border-slate-200">No</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase min-w-[180px] border-r border-slate-200">Nama Siswa</th>
                                        {/* Kolom Wajib */}
                                        {wajibCategories.map(c => (
                                            <th key={c.id} className="px-3 py-3 text-center text-xs font-bold text-indigo-600 uppercase min-w-[120px] border-r border-slate-200 bg-indigo-50">
                                                <div>{c.nama_ekskul}</div>
                                                <div className="text-[10px] font-normal text-indigo-400 normal-case">Wajib</div>
                                            </th>
                                        ))}
                                        {/* Kolom Pilihan */}
                                        {pilihanCategories.map(c => (
                                            <th key={c.id} className="px-3 py-3 text-center text-xs font-bold text-emerald-600 uppercase min-w-[120px] border-r border-slate-200 bg-emerald-50">
                                                <div>{c.nama_ekskul}</div>
                                                <div className="text-[10px] font-normal text-emerald-400 normal-case">Pilihan</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-center text-slate-500 border-r border-slate-100">{idx + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-100">{student.nama_lengkap}</td>
                                            {allCategories.map(c => {
                                                const val = grid[student.id]?.[c.id] ?? '';
                                                const isWajib = c.jenis === 'wajib';
                                                return (
                                                    <td key={c.id} className={`px-3 py-2 border-r border-slate-100 ${isWajib ? 'bg-indigo-50/30' : 'bg-emerald-50/20'}`}>
                                                        <select
                                                            value={val}
                                                            onChange={e => updateCell(student.id, c.id, e.target.value)}
                                                            className={`w-full px-2 py-1.5 rounded-lg border text-sm text-center transition-colors
                                                                ${val
                                                                    ? 'border-indigo-300 bg-white font-semibold text-indigo-700'
                                                                    : 'border-slate-200 bg-white text-slate-400'
                                                                }`}
                                                        >
                                                            <option value="">–</option>
                                                            {predikatOptions.map(p => (
                                                                <option key={p} value={p}>{p}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                            Predikat: Sangat Baik = A · Baik = B · Cukup = C · Kurang = D pada rapor
                        </div>
                    </div>
                </form>
            )}
        </AppLayout>
    );
}
