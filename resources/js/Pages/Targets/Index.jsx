import AppLayout from '@/Layouts/AppLayout';
import { confirmDelete } from '@/utils/confirmDelete';
import InputLabel from '@/Components/InputLabel';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Delete, Flag, PersonAdd } from '@mui/icons-material';

export default function Index({ targets, mapels, filters, kelasOptions, semesters }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();

    const filterForm = useForm({
        mapel_id: filters.mapel_id || '',
        kelas: filters.kelas || '',
        semester: filters.semester || '',
    });

    const applyFilters = () => {
        router.get('/targets', filterForm.data, { preserveState: true });
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmDelete({
            title: 'Hapus TP?',
            text: 'Nilai siswa terkait TP ini juga akan terhapus.',
        });
        if (confirmed) destroy(`/targets/${id}`);
    };

    return (
        <AppLayout title="Tujuan Pembelajaran">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">{flash.message}</div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <InputLabel value="Mata Pelajaran" />
                        <select value={filterForm.data.mapel_id} onChange={(e) => filterForm.setData('mapel_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                            <option value="">Semua</option>
                            {mapels.map((m) => <option key={m.id} value={m.id}>{m.mata_pelajaran}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Kelas" />
                        <select value={filterForm.data.kelas} onChange={(e) => filterForm.setData('kelas', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                            <option value="">Semua</option>
                            {kelasOptions.map((k) => <option key={k} value={k}>Kelas {k}</option>)}
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Semester" />
                        <select value={filterForm.data.semester} onChange={(e) => filterForm.setData('semester', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm">
                            <option value="">Semua</option>
                            {semesters.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <button type="button" onClick={applyFilters} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Filter</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                    <p className="font-bold text-slate-800">Daftar TP</p>
                    <Link href="/targets/create" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl flex items-center gap-2">
                        <PersonAdd className="w-4 h-4" /> Tambah TP
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-5 py-3 text-xs font-bold text-slate-500">Mapel</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500">Kelas</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500">Semester</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500">No. TP</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500">Deskripsi</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {targets.length ? targets.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50">
                                    <td className="px-5 py-3">{t.mapel?.mata_pelajaran}</td>
                                    <td className="px-5 py-3">{t.kelas}</td>
                                    <td className="px-5 py-3 capitalize">{t.semester}</td>
                                    <td className="px-5 py-3 font-semibold">TP{t.nomor_tp}</td>
                                    <td className="px-5 py-3 text-slate-600 max-w-md truncate" title={t.deskripsi_target_pencapaian}>{t.deskripsi_target_pencapaian}</td>
                                    <td className="px-5 py-3 flex justify-center gap-2">
                                        <Link href={`/targets/${t.id}/edit`} className="p-1.5 bg-sky-50 text-sky-600 rounded-lg"><Edit className="w-4 h-4" /></Link>
                                        <button type="button" onClick={() => handleDelete(t.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Delete className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Belum ada TP.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
