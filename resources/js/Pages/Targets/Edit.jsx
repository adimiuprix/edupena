import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';
import { Save, Close } from '@mui/icons-material';

export default function Edit({ target, mapels, kelasOptions, semesters }) {
    const { data, setData, put, processing, errors } = useForm({
        mapel_id: target.mapel_id || '',
        kelas: target.kelas || '1',
        semester: target.semester || 'ganjil',
        nomor_tp: target.nomor_tp || 1,
        deskripsi_target_pencapaian: target.deskripsi_target_pencapaian || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/targets/${target.id}`);
    };

    return (
        <AppLayout title="Edit TP">
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50 font-bold text-slate-800">Edit Tujuan Pembelajaran</div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div>
                        <InputLabel value="Mata Pelajaran" required />
                        <select value={data.mapel_id} onChange={(e) => setData('mapel_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
                            {mapels.map((m) => <option key={m.id} value={m.id}>{m.mata_pelajaran}</option>)}
                        </select>
                        <InputError message={errors.mapel_id} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <InputLabel value="Kelas" required />
                            <select value={data.kelas} onChange={(e) => setData('kelas', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
                                {kelasOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                            </select>
                            <InputError message={errors.kelas} />
                        </div>
                        <div>
                            <InputLabel value="Semester" required />
                            <select value={data.semester} onChange={(e) => setData('semester', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
                                {semesters.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            <InputError message={errors.semester} />
                        </div>
                        <div>
                            <InputLabel value="No. TP" required />
                            <TextInput type="number" min="1" max="20" value={data.nomor_tp} onChange={(e) => setData('nomor_tp', e.target.value)} isError={!!errors.nomor_tp} />
                            <InputError message={errors.nomor_tp} />
                        </div>
                    </div>
                    <div>
                        <InputLabel value="Deskripsi TP" required />
                        <textarea
                            value={data.deskripsi_target_pencapaian}
                            onChange={(e) => setData('deskripsi_target_pencapaian', e.target.value)}
                            rows={5}
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm ${errors.deskripsi_target_pencapaian ? 'border-red-300' : 'border-slate-200'} bg-slate-50`}
                        />
                        <p className="text-xs text-slate-400 mt-1">Jumlah karakter: {data.deskripsi_target_pencapaian.length}</p>
                        <InputError message={errors.deskripsi_target_pencapaian} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link href="/targets" className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl flex items-center"><Close className="w-4 h-4 mr-1" /> Batal</Link>
                        <button type="submit" disabled={processing} className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl flex items-center disabled:opacity-60">
                            <Save className="w-4 h-4 mr-1" /> Perbarui
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
