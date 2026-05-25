import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Save, Close } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ rombel }) {
    const { data, setData, put, processing, errors } = useForm({
        tingkat: rombel.tingkat || '',
        nama_rombel: rombel.nama_rombel || '',
        tahun_ajaran: rombel.tahun_ajaran || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/rombels/${rombel.id}`);
    };

    return (
        <AppLayout title="Edit Rombel">
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800">Edit Data Rombongan Belajar</p>
                </div>
                
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div>
                        <InputLabel value="Tingkat Kelas (1-12)" required />
                        <TextInput
                            type="number"
                            min="1"
                            max="12"
                            value={data.tingkat}
                            onChange={e => setData('tingkat', e.target.value)}
                            isError={!!errors.tingkat}
                        />
                        <InputError message={errors.tingkat} />
                    </div>

                    <div>
                        <InputLabel value="Nama Rombel" required />
                        <TextInput
                            type="text"
                            value={data.nama_rombel}
                            onChange={e => setData('nama_rombel', e.target.value)}
                            isError={!!errors.nama_rombel}
                        />
                        <InputError message={errors.nama_rombel} />
                    </div>

                    <div>
                        <InputLabel value="Tahun Ajaran" />
                        <TextInput
                            type="text"
                            value={data.tahun_ajaran}
                            onChange={e => setData('tahun_ajaran', e.target.value)}
                            isError={!!errors.tahun_ajaran}
                        />
                        <InputError message={errors.tahun_ajaran} />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Link href="/rombels" className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center">
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
