import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save, Info } from '@mui/icons-material';

function calcThresholds(grid, students, mapels) {
    const averages = {};
    mapels.forEach((m) => {
        const vals = students
            .map((s) => {
                const v = grid[`${s.id}_${m.id}`]?.nilai;
                return v === '' || v === null || v === undefined ? null : Number(v);
            })
            .filter((v) => v !== null);
        averages[m.id] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100 : null;
    });

    const filled = Object.values(averages).filter((v) => v !== null);
    if (!filled.length) {
        return { averages, min: null, max: null, mid: null };
    }

    const min = Math.round(Math.min(...filled) * 100) / 100;
    const max = Math.round((min + 10) * 100) / 100;
    const mid = Math.round(((min + max) / 2) * 100) / 100;

    return { averages, min, max, mid };
}

export default function Index({
    rombels,
    mapels,
    semesters,
    filters,
    students = [],
    criteria = {},
    threshold = null,
    averagesPerMapel: serverAverages = {},
    canEdit = false,
}) {
    const { flash, global_settings } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            mapels.forEach((m) => {
                const key = `${s.id}_${m.id}`;
                g[key] = { nilai: source[key]?.nilai ?? '' };
            });
        });
        return g;
    };

    const [grid, setGrid] = useState(() => buildGrid(criteria));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setGrid(buildGrid(criteria));
    }, [criteria, students, mapels]);

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
    });

    const live = useMemo(
        () => calcThresholds(grid, students, mapels),
        [grid, students, mapels]
    );

    const applyFilters = () => {
        router.get('/learning-achievement-criteria', filterForm.data, { preserveState: false });
    };

    const updateCell = (studentId, mapelId, value) => {
        const key = `${studentId}_${mapelId}`;
        setGrid((prev) => ({ ...prev, [key]: { nilai: value } }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = [];
        students.forEach((s) => {
            mapels.forEach((m) => {
                const cell = grid[`${s.id}_${m.id}`] || {};
                payload.push({
                    student_id: s.id,
                    mapel_id: m.id,
                    nilai: cell.nilai === '' ? null : Number(cell.nilai),
                });
            });
        });

        setSaving(true);
        router.post('/learning-achievement-criteria', {
            rombel_id: filterForm.data.rombel_id,
            semester: filterForm.data.semester,
            criteria: payload,
            min_nilai: live.min,
            max_nilai: live.max,
            save_threshold: true,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const activeThreshold = threshold?.active || {
        min_nilai: live.min,
        max_nilai: live.max,
        mid_nilai: live.mid,
    };

    return (
        <AppLayout title="Kriteria Ketercapaian">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <p className="font-bold text-slate-800 mb-1">Filter KKTP</p>
                <p className="text-xs text-slate-500 mb-4">
                    Semester aktif: {global_settings?.semester_aktif || '-'} · Logika sama sheet KKTP di eraport.xlsm
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
                        Tampilkan
                    </button>
                </div>
            </div>

            {!filters.rombel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel dan semester untuk mengatur KKTP.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                            <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Ambang Min (K3)</p>
                            <p className="text-3xl font-extrabold text-indigo-900">
                                {activeThreshold?.min_nilai ?? '—'}
                            </p>
                            <p className="text-[11px] text-indigo-600 mt-1">MIN(rata-rata nilai KKTP per mapel)</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                            <p className="text-xs font-bold text-purple-600 uppercase mb-2">Ambang Max (L3)</p>
                            <p className="text-3xl font-extrabold text-purple-900">
                                {activeThreshold?.max_nilai ?? '—'}
                            </p>
                            <p className="text-[11px] text-purple-600 mt-1">Min + 10</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                            <p className="text-xs font-bold text-emerald-600 uppercase mb-2">KKTP Tengah (M2)</p>
                            <p className="text-3xl font-extrabold text-emerald-900">
                                {activeThreshold?.mid_nilai ?? '—'}
                            </p>
                            <p className="text-[11px] text-emerald-600 mt-1">(Min + Max) / 2</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex gap-3">
                        <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600 space-y-1">
                            <p><strong>Grid:</strong> nilai KKTP per siswa × mapel (input manual seperti sheet KKTP).</p>
                            <p><strong>Baris rata mapel:</strong> rata-rata tiap kolom mapel → dipakai hitung Min/Max.</p>
                            <p><strong>Deskripsi rapor (PP):</strong> nilai TP max/min dibanding Min/Max → &quot;perlu bimbingan&quot; / &quot;baik&quot; / &quot;sangat baik dalam …&quot;</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-700">Nilai KKTP per Siswa & Mapel</p>
                            <button
                                type="submit"
                                disabled={saving || !canEdit}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl disabled:opacity-60"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : 'Simpan KKTP'}
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto mb-2">
                            <table className="w-full text-sm min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-3 py-2 text-xs font-bold text-slate-500 sticky left-0 bg-slate-50">No</th>
                                        <th className="px-3 py-2 text-xs font-bold text-slate-500 sticky left-10 bg-slate-50 min-w-[140px] text-left">Nama</th>
                                        {mapels.map((m) => (
                                            <th key={m.id} className="px-2 py-2 text-xs font-bold text-indigo-600 text-center min-w-[72px]">
                                                <span className="block truncate max-w-[80px]" title={m.mata_pelajaran}>
                                                    {m.mata_pelajaran.length > 12 ? m.mata_pelajaran.slice(0, 10) + '…' : m.mata_pelajaran}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                    <tr className="bg-indigo-50/50 border-b border-slate-100 text-[10px] text-indigo-700">
                                        <td colSpan={2} className="px-3 py-1.5 font-semibold sticky left-0 bg-indigo-50/50">Rata-rata mapel</td>
                                        {mapels.map((m) => (
                                            <td key={m.id} className="px-2 py-1.5 text-center font-bold">
                                                {live.averages[m.id] ?? serverAverages[m.id] ?? '—'}
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50">
                                            <td className="px-3 py-2 sticky left-0 bg-white">{idx + 1}</td>
                                            <td className="px-3 py-2 font-medium sticky left-10 bg-white">{student.nama_lengkap}</td>
                                            {mapels.map((m) => {
                                                const key = `${student.id}_${m.id}`;
                                                const cell = grid[key] || { nilai: '' };
                                                return (
                                                    <td key={m.id} className="px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={cell.nilai}
                                                            onChange={(e) => updateCell(student.id, m.id, e.target.value)}
                                                            className="w-16 px-1 py-1 text-center rounded-lg border border-slate-200 text-xs mx-auto block"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </>
            )}
        </AppLayout>
    );
}
