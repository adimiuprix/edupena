import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Save, Close } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ teacher, mapels, rombels }) {
    const { data, setData, put, processing, errors } = useForm({
        name: teacher.name || '',
        nip: teacher.nip || '',
        jenis_guru: teacher.jenis_guru || 'Guru Mapel',
        mapel_id: teacher.mapel_id || '',
        rombel_id: teacher.rombel_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/teachers/${teacher.id}`);
    };

    return (
        <AppLayout title="Edit Guru">
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800">Edit Data Guru</p>
                </div>
                
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div>
                        <InputLabel value="Nama Lengkap (beserta gelar)" required />
                        <TextInput
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            isError={!!errors.name}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel value="NIP (Opsional)" />
                        <TextInput
                            type="text"
                            value={data.nip}
                            onChange={e => setData('nip', e.target.value)}
                            isError={!!errors.nip}
                        />
                        <InputError message={errors.nip} />
                    </div>

                    <div>
                        <InputLabel value="Jenis Guru" required />
                        <div className="flex gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => setData({ ...data, jenis_guru: 'Guru Mapel', rombel_id: '' })}
                                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                    data.jenis_guru === 'Guru Mapel'
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                🎓 Guru Mapel
                            </button>
                            <button
                                type="button"
                                onClick={() => setData({ ...data, jenis_guru: 'Wali Kelas', mapel_id: '' })}
                                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                    data.jenis_guru === 'Wali Kelas'
                                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                🏫 Wali Kelas
                            </button>
                        </div>
                        <InputError message={errors.jenis_guru} />
                    </div>

                    {data.jenis_guru === 'Guru Mapel' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <InputLabel value="Mata Pelajaran Ampuan" required />
                            <select
                                value={data.mapel_id}
                                onChange={e => setData('mapel_id', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.mapel_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                            >
                                <option value="">-- Pilih Mapel --</option>
                                {mapels.map(m => (
                                    <option key={m.id} value={m.id}>{m.mata_pelajaran}</option>
                                ))}
                            </select>
                            <InputError message={errors.mapel_id} />
                        </div>
                    )}

                    {data.jenis_guru === 'Wali Kelas' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <InputLabel value="Kelas / Rombel" required />
                            <select
                                value={data.rombel_id}
                                onChange={e => setData('rombel_id', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.rombel_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                            >
                                <option value="">-- Pilih Rombel --</option>
                                {rombels.map(r => (
                                    <option key={r.id} value={r.id}>Kelas {r.tingkat} - {r.nama_rombel}</option>
                                ))}
                            </select>
                            <InputError message={errors.rombel_id} />
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Link href="/teachers" className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center">
                            <Close className="w-4 h-4 mr-1.5" /> Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-1.5" /> {processing ? 'Menyimpan...' : 'Perbarui Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
