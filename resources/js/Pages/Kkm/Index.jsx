import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import { Save, FilterList } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Index({ rombels, mapels, semesters, filters, kkmData, selectedRombel }) {
    const { flash } = usePage().props;
    const [rombelId, setRombelId] = useState(filters.rombel_id || '');
    const [semester, setSemester] = useState(filters.semester || '');

    const { data, setData, post, processing, errors } = useForm({
        rombel_id: filters.rombel_id || '',
        semester: filters.semester || '',
        kkm_data: kkmData.map(item => ({
            mapel_id: item.mapel_id,
            nilai_kkm: (item.nilai_kkm === null || item.nilai_kkm === undefined) ? '' : item.nilai_kkm,
        })),
    });

    useEffect(() => {
        setData({
            rombel_id: filters.rombel_id || '',
            semester: filters.semester || '',
            kkm_data: kkmData.map(item => ({
                mapel_id: item.mapel_id,
                nilai_kkm: (item.nilai_kkm === null || item.nilai_kkm === undefined) ? '' : item.nilai_kkm,
            })),
        });
    }, [kkmData, filters.rombel_id, filters.semester]);

    const handleFilter = () => {
        router.get('/kkm', {
            rombel_id: rombelId,
            semester: semester,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/kkm');
    };

    const handleKkmChange = (mapelId, value) => {
        const newKkmData = data.kkm_data.map(item => {
            if (item.mapel_id === mapelId) {
                const parsed = parseInt(value);
                const newValue = isNaN(parsed) ? '' : parsed;
                return { ...item, nilai_kkm: newValue };
            }
            return item;
        });
        setData('kkm_data', newKkmData);
    };

    return (
        <AppLayout title="Manajemen KKM">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100">
                    <div>
                        <p className="font-bold text-slate-800">Manajemen KKM (Kriteria Ketuntasan Minimal)</p>
                        <p className="text-xs text-slate-400 mt-0.5">Tetapkan nilai KKM untuk setiap mata pelajaran per kelas dan semester</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rombel / Kelas</label>
                            <select
                                value={rombelId}
                                onChange={(e) => setRombelId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">-- Pilih Rombel --</option>
                                {rombels.map(r => (
                                    <option key={r.id} value={r.id}>
                                        Kelas {r.tingkat} - {r.nama_rombel} ({r.tahun_ajaran || '-'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Semester</label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                {semesters.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleFilter}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <FilterList className="w-4 h-4" /> Tampilkan Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form KKM */}
                {kkmData.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="p-5">
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-sm text-blue-700">
                                    <strong>Kelas:</strong> {selectedRombel?.tingkat} - {selectedRombel?.nama_rombel} | 
                                    <strong className="ml-2">Semester:</strong> {filters.semester === 'ganjil' ? 'Ganjil' : 'Genap'}
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">No</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Nilai KKM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {kkmData.map((item, index) => (
                                            <tr key={item.mapel_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-slate-600">{index + 1}</td>
                                                <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                                    {item.mata_pelajaran}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={data.kkm_data?.find(d => d.mapel_id === item.mapel_id)?.nilai_kkm ?? ''}
                                                        onChange={(e) => handleKkmChange(item.mapel_id, e.target.value)}
                                                        placeholder="Contoh: 75"
                                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {errors.kkm_data && (
                                <p className="mt-2 text-sm text-red-600">{errors.kkm_data}</p>
                            )}
                        </div>

                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-indigo-200"
                            >
                                <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : 'Simpan KKM'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        <p className="text-sm">Silakan pilih Rombel dan Semester untuk mengelola KKM</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
