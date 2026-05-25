import AppLayout from '@/Layouts/AppLayout';
import { confirmDelete } from '@/utils/confirmDelete';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';

export default function Index({ teachers }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();

    const handleDelete = async (id) => {
        const confirmed = await confirmDelete({
            title: 'Hapus data guru?',
            text: 'Akun login terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.',
        });

        if (confirmed) {
            destroy('/teachers/' + id);
        }
    };

    return (
        <AppLayout title="Data Guru">
            {flash?.message && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                    {flash.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-800">Daftar Guru</p>
                        <p className="text-xs text-slate-400 mt-0.5">Biodata guru dan akun sistem</p>
                    </div>
                    <Link
                        href="/teachers/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                    >
                        <PersonAdd className="w-4 h-4" /> Tambah Guru
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">NIP</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Penugasan</th>
                                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {teachers.length > 0 ? teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                        {teacher.user?.name || '-'}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{teacher.nip || '-'}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{teacher.user?.email || '-'}</td>
                                    <td className="px-5 py-4 text-sm">
                                        {teacher.user?.role?.slug === 'walikelas' ? (
                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                                                Wali Kelas
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-lg text-xs font-semibold">
                                                Guru Mapel
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {teacher.user?.role?.slug === 'walikelas' ? (
                                            <span className="font-medium">
                                                {teacher.user?.rombel?.nama_rombel || (
                                                    <span className="text-slate-400 italic">Belum diatur</span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="font-medium">
                                                {teacher.user?.mapel?.mata_pelajaran || (
                                                    <span className="text-slate-400 italic">Belum diatur</span>
                                                )}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-center flex justify-center gap-2">
                                        <Link
                                            href={`/teachers/${teacher.id}/edit`}
                                            className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(teacher.id)}
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
                                        Belum ada data guru.
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
