import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Save, Close } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ teacher, mapels, rombels, roles }) {
    const user = teacher.user || {};

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role_id: user.role_id || '',
        nip: teacher.nip || '',
        mapel_id: user.mapel_id || '',
        rombel_id: user.rombel_id || '',
    });

    const guruRole = roles.find((r) => r.slug === 'guru');
    const waliRole = roles.find((r) => r.slug === 'walikelas');
    const selectedRole = roles.find((r) => String(r.id) === String(data.role_id));
    const isWaliKelas = selectedRole?.slug === 'walikelas';

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

                <form onSubmit={submit} className="p-5 space-y-6">
                    <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Biodata</p>
                        <div>
                            <InputLabel value="NIP (Opsional)" />
                            <TextInput
                                type="text"
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
                                isError={!!errors.nip}
                            />
                            <InputError message={errors.nip} />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Akun Sistem</p>
                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Nama Lengkap (beserta gelar)" required />
                                <TextInput
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    isError={!!errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel value="Email Login" required />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    isError={!!errors.email}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <InputLabel value="Password Baru (kosongkan jika tidak diubah)" />
                                <TextInput
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    isError={!!errors.password}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <InputLabel value="Role" required />
                                <div className="flex gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                role_id: guruRole?.id || '',
                                                rombel_id: '',
                                            })
                                        }
                                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                            !isWaliKelas
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        Guru Mapel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                role_id: waliRole?.id || '',
                                                mapel_id: '',
                                            })
                                        }
                                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                            isWaliKelas
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        Wali Kelas
                                    </button>
                                </div>
                                <InputError message={errors.role_id} />
                            </div>

                            {!isWaliKelas && (
                                <div>
                                    <InputLabel value="Mata Pelajaran Ampuan" required />
                                    <select
                                        value={data.mapel_id}
                                        onChange={(e) => setData('mapel_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.mapel_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                                    >
                                        <option value="">-- Pilih Mapel --</option>
                                        {mapels.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.mata_pelajaran}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.mapel_id} />
                                </div>
                            )}

                            {isWaliKelas && (
                                <div>
                                    <InputLabel value="Kelas / Rombel" required />
                                    <select
                                        value={data.rombel_id}
                                        onChange={(e) => setData('rombel_id', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.rombel_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                                    >
                                        <option value="">-- Pilih Rombel --</option>
                                        {rombels.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                Kelas {r.tingkat} - {r.nama_rombel}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.rombel_id} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Link
                            href="/teachers"
                            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center"
                        >
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
