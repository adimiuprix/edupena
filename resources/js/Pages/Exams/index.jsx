import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from '@mui/icons-material';
import Column from '@/Components/Coumn';

const BULANS = [1, 2, 3, 4, 5, 6];

function calcBulanAvg(m1, m2, m3, m4) {
    const vals = [m1, m2, m3, m4].map(v => v === '' || v === null ? null : Number(v)).filter(v => v !== null);
    if (!vals.length) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

export default function Index({
    rombels,
    mapels,
    semesters,
    filters,
    students = [],
    scores = {},
    canEdit = false,
    mapel,
    kelas,
}) {
    const { flash, global_settings } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            BULANS.forEach((b) => {
                const key = `${s.id}_${b}`;
                g[key] = {
                    minggu_1: source[key]?.minggu_1 ?? '',
                    minggu_2: source[key]?.minggu_2 ?? '',
                    minggu_3: source[key]?.minggu_3 ?? '',
                    minggu_4: source[key]?.minggu_4 ?? '',
                };
            });
        });
        return g;
    };

    const [grid, setGrid] = useState(() => buildGrid(scores));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setGrid(buildGrid(scores));
    }, [scores, students]);

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        mapel_id: filters.mapel_id || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/exams', filterForm.data, { preserveState: false });
    };

    const updateCell = (studentId, bulan, field, value) => {
        const key = `${studentId}_${bulan}`;
        setGrid((prev) => ({
            ...prev,
            [key]: { ...prev[key], [field]: value },
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = [];
        students.forEach((s) => {
            BULANS.forEach((b) => {
                const key = `${s.id}_${b}`;
                const cell = grid[key] || {};
                payload.push({
                    student_id: s.id,
                    bulan: b,
                    minggu_1: cell.minggu_1 === '' ? null : Number(cell.minggu_1),
                    minggu_2: cell.minggu_2 === '' ? null : Number(cell.minggu_2),
                    minggu_3: cell.minggu_3 === '' ? null : Number(cell.minggu_3),
                    minggu_4: cell.minggu_4 === '' ? null : Number(cell.minggu_4),
                });
            });
        });

        setSaving(true);
        router.post('/exams', {
            rombel_id: filterForm.data.rombel_id,
            mapel_id: filterForm.data.mapel_id,
            semester: filterForm.data.semester,
            scores: payload,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const averages = useMemo(() => {
        const result = {};
        students.forEach((s) => {
            result[s.id] = { bulans: {}, total: null };
            const bulanAvgs = [];
            BULANS.forEach((b) => {
                const key = `${s.id}_${b}`;
                const cell = grid[key] || { minggu_1: '', minggu_2: '', minggu_3: '', minggu_4: '' };
                const avg = calcBulanAvg(cell.minggu_1, cell.minggu_2, cell.minggu_3, cell.minggu_4);
                result[s.id].bulans[b] = avg;
                if (avg !== null) bulanAvgs.push(avg);
            });
            if (bulanAvgs.length) {
                result[s.id].total = Math.round((bulanAvgs.reduce((a, b) => a + b, 0) / bulanAvgs.length) * 100) / 100;
            }
        });
        return result;
    }, [grid, students]);

    return (
        <AppLayout title="Rekap Nilai Ulangan Mingguan">
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
                    Pilih rombel, mata pelajaran, dan semester untuk menampilkan form rekap nilai ulangan mingguan.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="font-bold text-slate-800">{mapel?.mata_pelajaran} - Kelas {kelas}</p>
                            <p className="text-xs text-slate-500">
                                Rekap 6 bulan. Rata-rata Semester dihitung dari Rata-rata ke-6 bulan tersebut.
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

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto pb-4">
                        <table className="w-max text-sm border-collapse min-w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-center text-xs font-bold">
                                    <th className="px-3 py-2 text-slate-500 border-r border-slate-200 sticky left-0 bg-slate-50 z-20 w-10">No</th>
                                    <th className="px-3 py-2 text-slate-500 border-r border-slate-200 sticky left-10 bg-slate-50 z-20 min-w-[180px] text-left">Nama Siswa</th>
                                    {BULANS.map((b) => (
                                        <th key={`head-b-${b}`} colSpan={5} className="px-2 py-2 text-slate-700 border-l border-slate-300 bg-slate-100">
                                            Bulan {b}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-emerald-700 border-l border-slate-300 bg-emerald-100 min-w-[90px]">
                                        Rata Semester
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, idx) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-3 py-2 text-center text-slate-500 border-r border-slate-100 sticky left-0 bg-white z-10 group-hover:bg-slate-50/90 transition-colors">{idx + 1}</td>
                                        <td className="px-3 py-2 font-semibold text-slate-800 border-r border-slate-100 sticky left-10 bg-white z-10 group-hover:bg-slate-50/90 transition-colors truncate max-w-[180px]">{student.nama_lengkap}</td>
                                        
                                        {BULANS.map((b) => {
                                            const key = `${student.id}_${b}`;
                                            const cell = grid[key] || { minggu_1: '', minggu_2: '', minggu_3: '', minggu_4: '' };
                                            return (
                                                <td key={`cols-${b}`} colSpan={5} className="p-0 border-l border-slate-300 align-top">
                                                    <div className="flex w-full h-full">
                                                        <div className="flex-1 border-r border-slate-100">
                                                            <Column max={100} value={cell.minggu_1} onChange={(e) => updateCell(student.id, b, 'minggu_1', e.target.value)} className="w-[45px] h-full px-1 py-2 text-center" />
                                                        </div>
                                                        <div className="flex-1 border-r border-slate-100">
                                                            <Column max={100} value={cell.minggu_2} onChange={(e) => updateCell(student.id, b, 'minggu_2', e.target.value)} className="w-[45px] h-full px-1 py-2 text-center" />
                                                        </div>
                                                        <div className="flex-1 border-r border-slate-100">
                                                            <Column max={100} value={cell.minggu_3} onChange={(e) => updateCell(student.id, b, 'minggu_3', e.target.value)} className="w-[45px] h-full px-1 py-2 text-center" />
                                                        </div>
                                                        <div className="flex-1 border-r border-slate-100">
                                                            <Column max={100} value={cell.minggu_4} onChange={(e) => updateCell(student.id, b, 'minggu_4', e.target.value)} className="w-[45px] h-full px-1 py-2 text-center" />
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-center font-bold text-indigo-700 bg-indigo-50/40 w-[45px] text-[11px]">
                                                            {averages[student.id]?.bulans[b] ?? '-'}
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        
                                        <td className="px-3 py-2 text-center font-bold text-emerald-800 border-l border-slate-300 bg-emerald-50/50">
                                            {averages[student.id]?.total ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            )}
        </AppLayout>
    );
}
