import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Save } from '@mui/icons-material';

function calcTpRapor(harian, akhir) {
    if (harian === '' && akhir === '') return null;
    const h = harian === '' ? 0 : Number(harian);
    const a = akhir === '' ? 0 : Number(akhir);
    return Math.round((h * 0.6 + a * 0.4) * 100) / 100;
}

function calcMapelRapor(targets, studentId, grid) {
    const values = targets
        .map((t) => calcTpRapor(
            grid[`${studentId}_${t.id}`]?.sumatif_harian ?? '',
            grid[`${studentId}_${t.id}`]?.sumatif_akhir ?? ''
        ))
        .filter((v) => v !== null);
    if (!values.length) return null;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

export default function Index({
    rombels,
    mapels,
    semesters,
    filters,
    targets = [],
    students = [],
    scores = {},
    mapelRapor: serverMapelRapor = {},
    canEdit = false,
    mapel,
    kelas,
}) {
    const { flash, global_settings } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            targets.forEach((t) => {
                const key = `${s.id}_${t.id}`;
                g[key] = {
                    sumatif_harian: source[key]?.sumatif_harian ?? '',
                    sumatif_akhir: source[key]?.sumatif_akhir ?? '',
                };
            });
        });
        return g;
    };

    const [grid, setGrid] = useState(() => buildGrid(scores));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setGrid(buildGrid(scores));
    }, [scores, students, targets]);

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        mapel_id: filters.mapel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/scores', filterForm.data, { preserveState: false });
    };

    const updateCell = (studentId, targetId, field, value) => {
        const key = `${studentId}_${targetId}`;
        setGrid((prev) => ({
            ...prev,
            [key]: { ...prev[key], [field]: value },
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = [];
        students.forEach((s) => {
            targets.forEach((t) => {
                const key = `${s.id}_${t.id}`;
                const cell = grid[key] || {};
                payload.push({
                    student_id: s.id,
                    target_id: t.id,
                    sumatif_harian: cell.sumatif_harian === '' ? null : Number(cell.sumatif_harian),
                    sumatif_akhir: cell.sumatif_akhir === '' ? null : Number(cell.sumatif_akhir),
                });
            });
        });

        setSaving(true);
        router.post('/scores', {
            rombel_id: filterForm.data.rombel_id,
            mapel_id: filterForm.data.mapel_id,
            semester: filterForm.data.semester,
            scores: payload,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const liveMapelRapor = useMemo(() => {
        const result = {};
        students.forEach((s) => {
            result[s.id] = calcMapelRapor(targets, s.id, grid);
        });
        return result;
    }, [grid, students, targets]);

    return (
        <AppLayout title="Entry Nilai">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <p className="font-bold text-slate-800 mb-1">Filter Penilaian</p>
                <p className="text-xs text-slate-500 mb-4">
                    Semester aktif: {global_settings?.semester_aktif || '-'} · Tahun {global_settings?.tahun_ajaran_aktif || '-'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                        <InputLabel value="Mata Pelajaran" />
                        <select
                            value={filterForm.data.mapel_id}
                            onChange={(e) => filterForm.setData('mapel_id', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                        >
                            <option value="">-- Pilih Mapel --</option>
                            {mapels.map((m) => (
                                <option key={m.id} value={m.id}>{m.mata_pelajaran}</option>
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

            {!filters.rombel_id || !filters.mapel_id || !filters.semester ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Pilih rombel, mata pelajaran, dan semester untuk menampilkan form entry nilai.
                </div>
            ) : targets.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Belum ada TP untuk mapel ini (Kelas {kelas}, semester {filters.semester}).{' '}
                    <Link href="/targets/create" className="font-semibold underline">Tambah TP</Link> terlebih dahulu.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="font-bold text-slate-800">{mapel?.mata_pelajaran}</p>
                            <p className="text-xs text-slate-500">
                                Rumus TP: 60% Sumatif Harian + 40% Sumatif Akhir · Nilai Rapor Mapel = rata-rata TP
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Menyimpan...' : 'Simpan Nilai'}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th rowSpan={2} className="px-3 py-2 text-xs font-bold text-slate-500 sticky left-0 bg-slate-50 z-10">No</th>
                                    <th rowSpan={2} className="px-3 py-2 text-xs font-bold text-slate-500 sticky left-10 bg-slate-50 z-10 min-w-[140px]">Nama</th>
                                    {targets.map((t) => (
                                        <th key={t.id} colSpan={3} className="px-2 py-2 text-xs font-bold text-indigo-600 border-l border-slate-100 text-center">
                                            TP{t.nomor_tp}
                                        </th>
                                    ))}
                                    <th rowSpan={2} className="px-3 py-2 text-xs font-bold text-emerald-700 border-l border-slate-200">Rapor</th>
                                </tr>
                                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-500">
                                    {targets.map((t) => (
                                        <Fragment key={t.id}>
                                            <th className="px-1 py-1 border-l border-slate-100">SH</th>
                                            <th className="px-1 py-1">SA</th>
                                            <th className="px-1 py-1 text-indigo-600">TP</th>
                                        </Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, idx) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50">
                                        <td className="px-3 py-2 sticky left-0 bg-white">{idx + 1}</td>
                                        <td className="px-3 py-2 font-medium sticky left-10 bg-white">{student.nama_lengkap}</td>
                                        {targets.map((t) => {
                                            const key = `${student.id}_${t.id}`;
                                            const cell = grid[key] || { sumatif_harian: '', sumatif_akhir: '' };
                                            const raporTp = calcTpRapor(cell.sumatif_harian, cell.sumatif_akhir);
                                            return (
                                                <Fragment key={t.id}>
                                                    <td className="px-1 py-1 border-l border-slate-50">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={cell.sumatif_harian}
                                                            onChange={(e) => updateCell(student.id, t.id, 'sumatif_harian', e.target.value)}
                                                            className="w-14 px-1 py-1 text-center rounded-lg border border-slate-200 text-xs"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={cell.sumatif_akhir}
                                                            onChange={(e) => updateCell(student.id, t.id, 'sumatif_akhir', e.target.value)}
                                                            className="w-14 px-1 py-1 text-center rounded-lg border border-slate-200 text-xs"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1 text-center text-xs font-semibold text-indigo-700">
                                                        {raporTp ?? '-'}
                                                    </td>
                                                </Fragment>
                                            );
                                        })}
                                        <td className="px-3 py-2 text-center font-bold text-emerald-700 border-l border-slate-100">
                                            {liveMapelRapor[student.id] ?? serverMapelRapor[student.id] ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">SH = Sumatif Harian · SA = Sumatif Akhir Semester · TP = Nilai Rapor per TP</p>
                </form>
            )}
        </AppLayout>
    );
}
