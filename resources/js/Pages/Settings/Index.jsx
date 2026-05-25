import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Save, Business, Person, CalendarMonth } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';

const InputText = ({ label, field, type = 'text', placeholder = '', isTextarea = false, data, setData, errors }) => (
    <div>
        <InputLabel value={label} />
        <TextInput
            type={type}
            value={data[field]}
            onChange={(e) => setData(field, e.target.value)}
            isError={!!errors[field]}
            isTextarea={isTextarea}
            placeholder={placeholder}
        />
        <InputError message={errors[field]} />
    </div>
);

export default function Index({ settings }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('sekolah');
    
    const { data, setData, post, processing, errors } = useForm({
        // Profil Sekolah
        nama_sekolah: settings.nama_sekolah || '',
        npsn: settings.npsn || '',
        alamat_sekolah: settings.alamat_sekolah || '',
        desa_kelurahan: settings.desa_kelurahan || '',
        kecamatan: settings.kecamatan || '',
        kabupaten_kota: settings.kabupaten_kota || '',
        provinsi: settings.provinsi || '',
        kode_pos: settings.kode_pos || '',
        email_sekolah: settings.email_sekolah || '',
        website_sekolah: settings.website_sekolah || '',
        
        // Kepala Sekolah
        nama_kepala_sekolah: settings.nama_kepala_sekolah || '',
        nip_kepala_sekolah: settings.nip_kepala_sekolah || '',
        
        // Akademik
        tahun_ajaran_aktif: settings.tahun_ajaran_aktif || '',
        semester_aktif: settings.semester_aktif || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/settings');
    };

    return (
        <AppLayout title="Pengaturan Sistem">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col gap-1">
                        <button 
                            onClick={() => setActiveTab('sekolah')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'sekolah' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Business className="w-5 h-5" /> Profil Sekolah
                        </button>
                        <button 
                            onClick={() => setActiveTab('kepala_sekolah')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'kepala_sekolah' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Person className="w-5 h-5" /> Kepala Sekolah
                        </button>
                        <button 
                            onClick={() => setActiveTab('akademik')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'akademik' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <CalendarMonth className="w-5 h-5" /> Tahun Akademik
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <form onSubmit={submit}>
                            
                            {/* Tab: Profil Sekolah */}
                            {activeTab === 'sekolah' && (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-800 text-lg">Data Profil Sekolah</h3>
                                        <p className="text-sm text-slate-500 mt-1">Atur informasi dasar tentang sekolah yang akan ditampilkan di kop surat dan Rapor.</p>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputText label="Nama Sekolah" field="nama_sekolah" data={data} setData={setData} errors={errors} />
                                        </div>
                                        <InputText label="NPSN" field="npsn" data={data} setData={setData} errors={errors} />
                                        <div className="md:col-span-2">
                                            <InputText label="Alamat Lengkap" field="alamat_sekolah" isTextarea data={data} setData={setData} errors={errors} />
                                        </div>
                                        <InputText label="Desa / Kelurahan" field="desa_kelurahan" data={data} setData={setData} errors={errors} />
                                        <InputText label="Kecamatan" field="kecamatan" data={data} setData={setData} errors={errors} />
                                        <InputText label="Kabupaten / Kota" field="kabupaten_kota" data={data} setData={setData} errors={errors} />
                                        <InputText label="Provinsi" field="provinsi" data={data} setData={setData} errors={errors} />
                                        <InputText label="Kode Pos" field="kode_pos" data={data} setData={setData} errors={errors} />
                                        <InputText label="Email" field="email_sekolah" type="email" data={data} setData={setData} errors={errors} />
                                        <InputText label="Website" field="website_sekolah" data={data} setData={setData} errors={errors} />
                                    </div>
                                </div>
                            )}

                            {/* Tab: Kepala Sekolah */}
                            {activeTab === 'kepala_sekolah' && (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-800 text-lg">Kepala Sekolah</h3>
                                        <p className="text-sm text-slate-500 mt-1">Data kepala sekolah yang akan bertanda tangan di Rapor.</p>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <InputText label="Nama Kepala Sekolah (Beserta Gelar)" field="nama_kepala_sekolah" data={data} setData={setData} errors={errors} />
                                        <InputText label="NIP Kepala Sekolah" field="nip_kepala_sekolah" data={data} setData={setData} errors={errors} />
                                    </div>
                                </div>
                            )}

                            {/* Tab: Akademik */}
                            {activeTab === 'akademik' && (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-800 text-lg">Periode Akademik</h3>
                                        <p className="text-sm text-slate-500 mt-1">Atur tahun ajaran dan semester aktif saat ini.</p>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <InputText label="Tahun Ajaran Aktif" field="tahun_ajaran_aktif" placeholder="Contoh: 2025/2026" data={data} setData={setData} errors={errors} />
                                        
                                        <div>
                                            <InputLabel value="Semester Aktif" />
                                            <select
                                                value={data.semester_aktif}
                                                onChange={(e) => setData('semester_aktif', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all mt-1"
                                            >
                                                <option value="Ganjil">Ganjil</option>
                                                <option value="Genap">Genap</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" /> {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
