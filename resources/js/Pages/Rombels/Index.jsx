import AppLayout from '@/Layouts/AppLayout';
import { confirmDelete as confirmDeleteDialog } from '@/utils/confirmDelete';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Add, Edit, Delete } from '@mui/icons-material';

export default function Index({ rombels, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const { get, delete: destroy } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        get(`/rombels?search=${search}`, { preserveState: true });
    };

    const handleDelete = async (rombel) => {
        const confirmed = await confirmDeleteDialog({
            title: 'Hapus Rombel?',
            text: `Apakah Anda yakin ingin menghapus kelas ${rombel.nama_rombel}? Data yang dihapus tidak dapat dikembalikan.`,
            confirmButtonText: 'Ya, Hapus Kelas',
        });

        if (confirmed) {
            destroy(`/rombels/${rombel.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Data Rombel">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Data Rombongan Belajar</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola data kelas dan wali kelas</p>
                </div>
                <Link
                    href="/rombels/create"
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 border border-transparent rounded-xl font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm shadow-indigo-200"
                >
                    <Add className="w-4 h-4 mr-1" /> Tambah Rombel
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kelas atau tahun ajaran..."
                            className="w-full pl-10 pr-4 py-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tingkat</th>
                                <th className="px-6 py-4 font-semibold">Nama Rombel</th>
                                <th className="px-6 py-4 font-semibold">Tahun Ajaran</th>
                                <th className="px-6 py-4 font-semibold">Wali Kelas</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rombels.data.map((rombel) => (
                                <tr key={rombel.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">Kelas {rombel.tingkat}</td>
                                    <td className="px-6 py-4 text-slate-600 font-semibold">{rombel.nama_rombel}</td>
                                    <td className="px-6 py-4 text-slate-600">{rombel.tahun_ajaran || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {rombel.wali_kelas ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {rombel.wali_kelas.name.charAt(0)}
                                                </div>
                                                <span>{rombel.wali_kelas.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">Belum diatur</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/rombels/${rombel.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(rombel)}
                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Delete className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rombels.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        Data rombel tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {rombels.links && rombels.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-1">
                        {rombels.links.map((link, k) => (
                            <Link
                                key={k}
                                href={link.url || '#'}
                                className={`px-3 py-1 text-sm rounded-lg border ${
                                    link.active
                                        ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
