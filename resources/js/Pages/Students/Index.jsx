import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';

export default function Index({ students }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data siswa ini?')) {
            destroy('/students/' + id);
        }
    };

    return (
        <AppLayout title="Data Siswa">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-800">Daftar Siswa</p>
                        <p className="text-xs text-slate-400 mt-0.5">Semua data siswa terdaftar</p>
                    </div>
                    <Link
                        href="/students/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <PersonAdd className="w-4 h-4" /> Tambah Siswa
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">NISN</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">L/P</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Agama</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.length > 0 ? students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{student.nisn}</td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{student.nama_lengkap}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {student.rombel ? (
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                                                {student.rombel.nama_rombel}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">Belum diatur</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{student.jenis_kelamin}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{student.agama || '-'}</td>
                                    <td className="px-5 py-4 text-sm text-center flex justify-center gap-2">
                                        <Link
                                            href={`/students/${student.id}/edit`}
                                            className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Delete className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Belum ada data siswa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
