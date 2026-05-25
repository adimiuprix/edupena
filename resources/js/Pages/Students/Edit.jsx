import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowBack, Save, Close } from '@mui/icons-material';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const InputText = ({ label, field, type = 'text', placeholder = '', required = false, isTextarea = false, data, setData, errors }) => (
    <div>
        <InputLabel value={label} required={required} />
        <TextInput
            type={type}
            value={data[field] || ''}
            onChange={(e) => setData(field, e.target.value)}
            isError={!!errors[field]}
            isTextarea={isTextarea}
            placeholder={placeholder}
        />
        <InputError message={errors[field]} />
    </div>
);

export default function Edit({ student, rombels }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: student.nama_lengkap || '',
        nama_panggilan: student.nama_panggilan || '',
        nipd: student.nipd || '',
        nisn: student.nisn || '',
        rombel_id: student.rombel_id || '',
        agama: student.agama || '',
        jenis_kelamin: student.jenis_kelamin || 'L',
        tempat_lahir: student.tempat_lahir || '',
        tanggal_lahir: student.tanggal_lahir || '',
        alamat: student.alamat || '',
        rt: student.rt || '',
        rw: student.rw || '',
        desa_kelurahan: student.desa_kelurahan || '',
        kecamatan: student.kecamatan || '',
        kabupaten: student.kabupaten || '',
        provinsi: student.provinsi || '',
        kode_pos: student.kode_pos || '',
        no_telepon: student.no_telepon || '',
        email: student.email || '',
        nama_ayah: student.nama_ayah || '',
        pekerjaan_ayah: student.pekerjaan_ayah || '',
        no_telepon_ayah: student.no_telepon_ayah || '',
        alamat_ayah: student.alamat_ayah || '',
        nama_ibu: student.nama_ibu || '',
        pekerjaan_ibu: student.pekerjaan_ibu || '',
        no_telepon_ibu: student.no_telepon_ibu || '',
        alamat_ibu: student.alamat_ibu || '',
        nama_wali: student.nama_wali || '',
        pekerjaan_wali: student.pekerjaan_wali || '',
        no_telepon_wali: student.no_telepon_wali || '',
        alamat_wali: student.alamat_wali || '',
        nama_wali_murid: student.nama_wali_murid || '',
        pekerjaan_wali_murid: student.pekerjaan_wali_murid || '',
        no_telepon_wali_murid: student.no_telepon_wali_murid || '',
        alamat_wali_murid: student.alamat_wali_murid || ''
    });

    const submit = (e) => {
        e.preventDefault();
        put('/students/' + student.id);
    };

    return (
        <AppLayout title="Edit Siswa">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                    <Link href="/students" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowBack className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Form Edit Siswa</p>
                        <p className="text-xs text-slate-500 mt-0.5">Perbarui data identitas, alamat, dan data orang tua siswa</p>
                    </div>
                </div>

                <form onSubmit={submit} className="p-6">
                    
                    {/* --- DATA DIRI --- */}
                    <div className="mb-8">
                        <h3 className="text-md font-bold text-indigo-700 border-b border-indigo-100 pb-2 mb-4">1. Data Diri Siswa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputText label="NISN" field="nisn" required placeholder="Contoh: 0123456789" data={data} setData={setData} errors={errors} />
                            <InputText label="NIPD" field="nipd" placeholder="Nomor Induk Peserta Didik" data={data} setData={setData} errors={errors} />
                            <InputText label="Nama Lengkap" field="nama_lengkap" required placeholder="Nama sesuai ijazah/akta" data={data} setData={setData} errors={errors} />
                            <InputText label="Nama Panggilan" field="nama_panggilan" placeholder="Nama panggilan sehari-hari" data={data} setData={setData} errors={errors} />

                            <div>
                                <InputLabel value="Kelas / Rombel" />
                                <select
                                    value={data.rombel_id}
                                    onChange={(e) => setData('rombel_id', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.rombel_id ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900' : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800'}`}
                                >
                                    <option value="">-- Pilih Rombel --</option>
                                    {rombels.map(r => (
                                        <option key={r.id} value={r.id}>Kelas {r.tingkat} - {r.nama_rombel}</option>
                                    ))}
                                </select>
                                <InputError message={errors.rombel_id} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jenis Kelamin *</label>
                                <select
                                    value={data.jenis_kelamin}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                >
                                    <option value="L">Laki-laki (L)</option>
                                    <option value="P">Perempuan (P)</option>
                                </select>
                                {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1.5">{errors.jenis_kelamin}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Agama</label>
                                <select
                                    value={data.agama}
                                    onChange={(e) => setData('agama', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                >
                                    <option value="">-- Pilih Agama --</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Khonghucu">Khonghucu</option>
                                </select>
                                {errors.agama && <p className="text-red-500 text-xs mt-1.5">{errors.agama}</p>}
                            </div>

                            <InputText label="Tempat Lahir" field="tempat_lahir" data={data} setData={setData} errors={errors} />
                            <InputText label="Tanggal Lahir" field="tanggal_lahir" type="date" data={data} setData={setData} errors={errors} />
                            <InputText label="No. Telepon / HP" field="no_telepon" data={data} setData={setData} errors={errors} />
                            <InputText label="Email" field="email" type="email" data={data} setData={setData} errors={errors} />
                        </div>
                    </div>

                    {/* --- ALAMAT --- */}
                    <div className="mb-8">
                        <h3 className="text-md font-bold text-indigo-700 border-b border-indigo-100 pb-2 mb-4">2. Alamat Tempat Tinggal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <InputText label="Alamat Lengkap (Jalan/Dusun)" field="alamat" isTextarea data={data} setData={setData} errors={errors} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputText label="RT" field="rt" type="number" data={data} setData={setData} errors={errors} />
                                <InputText label="RW" field="rw" type="number" data={data} setData={setData} errors={errors} />
                            </div>
                            <InputText label="Desa / Kelurahan" field="desa_kelurahan" data={data} setData={setData} errors={errors} />
                            <InputText label="Kecamatan" field="kecamatan" data={data} setData={setData} errors={errors} />
                            <InputText label="Kabupaten / Kota" field="kabupaten" data={data} setData={setData} errors={errors} />
                            <InputText label="Provinsi" field="provinsi" data={data} setData={setData} errors={errors} />
                            <InputText label="Kode Pos" field="kode_pos" data={data} setData={setData} errors={errors} />
                        </div>
                    </div>

                    {/* --- DATA ORANG TUA --- */}
                    <div className="mb-8">
                        <h3 className="text-md font-bold text-indigo-700 border-b border-indigo-100 pb-2 mb-4">3. Data Orang Tua / Wali</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* Ayah */}
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                                <p className="font-semibold text-slate-800">Data Ayah</p>
                                <InputText label="Nama Ayah" field="nama_ayah" data={data} setData={setData} errors={errors} />
                                <InputText label="Pekerjaan Ayah" field="pekerjaan_ayah" data={data} setData={setData} errors={errors} />
                                <InputText label="No. Telepon Ayah" field="no_telepon_ayah" data={data} setData={setData} errors={errors} />
                                <InputText label="Alamat Ayah" field="alamat_ayah" isTextarea data={data} setData={setData} errors={errors} />
                            </div>

                            {/* Ibu */}
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                                <p className="font-semibold text-slate-800">Data Ibu</p>
                                <InputText label="Nama Ibu" field="nama_ibu" data={data} setData={setData} errors={errors} />
                                <InputText label="Pekerjaan Ibu" field="pekerjaan_ibu" data={data} setData={setData} errors={errors} />
                                <InputText label="No. Telepon Ibu" field="no_telepon_ibu" data={data} setData={setData} errors={errors} />
                                <InputText label="Alamat Ibu" field="alamat_ibu" isTextarea data={data} setData={setData} errors={errors} />
                            </div>

                            {/* Wali */}
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4 md:col-span-2">
                                <p className="font-semibold text-slate-800">Data Wali <span className="text-xs font-normal text-slate-500">(Kosongi jika tidak ada)</span></p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputText label="Nama Wali" field="nama_wali" data={data} setData={setData} errors={errors} />
                                    <InputText label="Pekerjaan Wali" field="pekerjaan_wali" data={data} setData={setData} errors={errors} />
                                    <InputText label="No. Telepon Wali" field="no_telepon_wali" data={data} setData={setData} errors={errors} />
                                    <InputText label="Alamat Wali" field="alamat_wali" isTextarea data={data} setData={setData} errors={errors} />
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white/90 backdrop-blur-sm py-4">
                        <Link
                            href="/students"
                            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center"
                        >
                            <Close className="w-4 h-4 mr-1.5" /> Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-xl transition-colors shadow-sm shadow-indigo-200 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-1.5" /> {processing ? 'Menyimpan...' : 'Perbarui Siswa'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
