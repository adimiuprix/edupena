import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Save } from '@mui/icons-material';
import TextInput from '@/Components/TextInput';

export default function Index({
    rombels,
    filters,
    students = [],
    records = {},
    canEdit = true,
    statusOptions = [],
}) {
    const { flash } = usePage().props;

    const buildGrid = (source) => {
        const g = {};
        students.forEach((s) => {
            g[s.id] = {
                status: source[s.id]?.status ?? 'Hadir',
                keterangan: source[s.id]?.keterangan ?? '',
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
            status: grid[s.id]?.status || 'Hadir',
            keterangan: grid[s.id]?.keterangan || null,
        }));

        setSaving(true);
        router.post('/daily-attendances', {
            rombel_id: filters.rombel_id,
            tanggal: filters.tanggal,
            records: payload,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const filterForm = useForm({
        rombel_id: filters.rombel_id || '',
        tanggal: filters.tanggal || '',
    });

    const applyFilters = () => {
        router.get('/daily-attendances', filterForm.data, { preserveState: false });
    };

    const setAllStatus = (status) => {
        const newGrid = { ...grid };
        students.forEach((s) => {
            newGrid[s.id] = { ...newGrid[s.id], status };
        });
        setGrid(newGrid);
    };

    return (
        <AppLayout title="Absensi Harian">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="font-bold text-slate-800">Filter Kehadiran Harian</p>
                        <p className="text-xs text-slate-400 mt-0.5">Pilih rombel dan tanggal untuk mengisi absensi</p>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                        <TextInput
                            type="date"
                            value={filterForm.data.tanggal}
                            onChange={e => filterForm.setData('tanggal', e.target.value)}
                        />
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

            {!filters.rombel_id || !filters.tanggal ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Silakan pilih rombel dan tanggal terlebih dulu untuk menampilkan form input.
                </div>
            ) : students.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
                    Tidak ada siswa di rombel ini.
                </div>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                            <div>
                                <p className="font-bold text-slate-800">Daftar Hadir: {filters.tanggal}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" onClick={() => setAllStatus('Hadir')} className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium">Semua Hadir</button>
                                    <button type="button" onClick={() => setAllStatus('Sakit')} className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 font-medium">Semua Sakit</button>
                                    <button type="button" onClick={() => setAllStatus('Izin')} className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">Semua Izin</button>
                                    <button type="button" onClick={() => setAllStatus('Alpa')} className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium">Semua Alpa</button>
                                </div>
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
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-48 text-center">Status Kehadiran</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => {
                                        const row = grid[student.id] || { status: 'Hadir', keterangan: '' };
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm font-medium text-slate-700 text-center">{idx + 1}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{student.nama_lengkap}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <select
                                                        value={row.status}
                                                        onChange={e => updateRow(student.id, 'status', e.target.value)}
                                                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 transition-colors text-sm font-medium text-center ${
                                                            row.status === 'Hadir' ? 'bg-green-50 border-green-200 text-green-700 focus:ring-green-500/20 focus:border-green-500' :
                                                            row.status === 'Sakit' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 focus:ring-yellow-500/20 focus:border-yellow-500' :
                                                            row.status === 'Izin' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500/20 focus:border-blue-500' :
                                                            'bg-red-50 border-red-200 text-red-700 focus:ring-red-500/20 focus:border-red-500'
                                                        }`}
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <TextInput
                                                        type="text"
                                                        value={row.keterangan || ''}
                                                        onChange={e => updateRow(student.id, 'keterangan', e.target.value)}
                                                        placeholder="Opsional"
                                                    />
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
