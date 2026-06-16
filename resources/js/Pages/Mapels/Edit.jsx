import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Save, Close } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ mapel, categories, ekskul }) {
    const { data, setData, put, processing, errors } = useForm({
        category_mapels_id: mapel.category_mapels_id || '',
        mata_pelajaran: mapel.mata_pelajaran || '',
        jenis_ekskul: ekskul?.jenis || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/mapels/${mapel.id}`);
    };

    // Cek apakah kategori yang dipilih adalah ekstrakurikuler (id = 3)
    const isEkstrakurikuler = data.category_mapels_id == 3;

    return (
        <AppLayout title="Edit Mata Pelajaran">
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <p className="font-bold text-slate-800">Edit Mata Pelajaran</p>
                </div>
                
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div>
                        <InputLabel value="Kategori Mapel" required />
                        <select
                            value={data.category_mapels_id}
                            onChange={e => setData('category_mapels_id', e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.category_mapels_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.kategori}</option>
                            ))}
                        </select>
                        <InputError message={errors.category_mapels_id} />
                    </div>

                    <div>
                        <InputLabel value="Nama Mata Pelajaran" required />
                        <TextInput
                            type="text"
                            value={data.mata_pelajaran}
                            onChange={e => setData('mata_pelajaran', e.target.value)}
                            isError={!!errors.mata_pelajaran}
                        />
                        <InputError message={errors.mata_pelajaran} />
                    </div>

                    {isEkstrakurikuler && (
                        <div>
                            <InputLabel value="Jenis Ekstrakurikuler" required />
                            <select
                                value={data.jenis_ekskul}
                                onChange={e => setData('jenis_ekskul', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.jenis_ekskul ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                            >
                                <option value="">-- Pilih Jenis --</option>
                                <option value="wajib">Wajib</option>
                                <option value="pilihan">Pilihan</option>
                            </select>
                            <InputError message={errors.jenis_ekskul} />
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Link href="/mapels" className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center">
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
