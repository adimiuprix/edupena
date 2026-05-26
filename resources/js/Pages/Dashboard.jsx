import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { 
    People, 
    School, 
    Book, 
    Edit, 
    PersonAdd,
    WarningAmber,
    EventBusy
} from '@mui/icons-material';


const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className={`relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-5 group hover:shadow-md transition-all duration-300`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </div>
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <div className={`absolute bottom-0 left-0 h-1 w-full ${color} opacity-60`}></div>
    </div>
);

export default function Dashboard({ stats, siswaTerbaru }) {
    return (
        <AppLayout title="Dashboard">

            {/* Welcome Banner */}
            <div className="mb-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-extrabold">Selamat Datang di e-Rapor! 👋</h2>
                    <p className="text-indigo-200 text-sm mt-1 max-w-lg">
                        Kelola nilai, rapor, dan data akademik sekolah Anda dengan mudah dan cepat.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={People}
                    label="Total Siswa"
                    value={stats.totalSiswa}
                    color="bg-blue-100 text-blue-600"
                    subtext={`${stats.totalSiswaL} Laki-laki · ${stats.totalSiswaP} Perempuan`}
                />
                <StatCard
                    icon={School}
                    label="Total Guru"
                    value={stats.totalGuru}
                    color="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                    icon={Book}
                    label="Mata Pelajaran"
                    value={stats.totalMapel}
                    color="bg-amber-100 text-amber-600"
                />
                <StatCard
                    icon={WarningAmber}
                    label="Data Belum Lengkap"
                    value={stats.siswaTanpaNilai + stats.mapelTanpaTP}
                    color="bg-red-100 text-red-600"
                    subtext={`${stats.siswaTanpaNilai} siswa tanpa nilai · ${stats.mapelTanpaTP} mapel tanpa TP`}
                />
            </div>

            {/* Attendance & Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-slate-800">Statistik Ketidakhadiran</p>
                        <EventBusy className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 mb-1">{stats.totalKetidakhadiran}</p>
                    <p className="text-xs text-slate-500 mb-5">Total hari ketidakhadiran semester ini</p>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Sakit</span>
                            <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{stats.totalSakit} Hari</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Izin</span>
                            <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{stats.totalIzin} Hari</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Tanpa Keterangan</span>
                            <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">{stats.totalAlpa} Hari</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-amber-50 rounded-2xl border border-amber-200 p-5 flex flex-col justify-center relative overflow-hidden">
                    <WarningAmber className="w-32 h-32 text-amber-500/10 absolute -right-6 -bottom-6" />
                    <h3 className="font-bold text-amber-800 text-lg mb-2">Peringatan Data!</h3>
                    
                    <ul className="space-y-2 mt-2">
                        {stats.siswaTanpaNilai > 0 ? (
                            <li className="flex items-center gap-2 text-sm text-amber-900">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Terdapat <strong>{stats.siswaTanpaNilai} siswa</strong> yang belum memiliki nilai rapor TP sama sekali.
                            </li>
                        ) : (
                            <li className="flex items-center gap-2 text-sm text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Seluruh siswa sudah mulai dinilai.
                            </li>
                        )}
                        
                        {stats.mapelTanpaTP > 0 ? (
                            <li className="flex items-center gap-2 text-sm text-amber-900">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Ada <strong>{stats.mapelTanpaTP} mata pelajaran</strong> yang belum dikonfigurasi Tujuan Pembelajaran (TP)-nya.
                            </li>
                        ) : (
                            <li className="flex items-center gap-2 text-sm text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Semua mata pelajaran sudah memiliki konfigurasi TP.
                            </li>
                        )}
                    </ul>
                    <div className="mt-4 flex gap-3 relative z-10">
                        {stats.siswaTanpaNilai > 0 && (
                            <Link href="/scores" className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded-lg">Input Nilai</Link>
                        )}
                        {stats.mapelTanpaTP > 0 && (
                            <Link href="/targets/create" className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-1.5 px-4 rounded-lg border border-amber-300">Set Tujuan Pembelajaran</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Siswa Terbaru */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800">Siswa Terbaru</p>
                            <p className="text-xs text-slate-400 mt-0.5">5 siswa terakhir ditambahkan</p>
                        </div>
                        <Link href="/students" className="text-xs text-indigo-600 font-semibold hover:underline">
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">NISN</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">L/P</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {siswaTerbaru && siswaTerbaru.length > 0 ? siswaTerbaru.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-700">{s.nisn || '-'}</td>
                                        <td className="px-5 py-3 text-sm font-semibold text-slate-900">{s.nama_lengkap}</td>
                                        <td className="px-5 py-3 text-sm">
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${s.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                                                {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-8 text-center text-slate-400 text-sm">
                                            Belum ada data siswa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="font-bold text-slate-800 mb-4">Aksi Cepat</p>
                    <div className="space-y-2.5">
                        <Link
                            href="/students/create"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PersonAdd className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Tambah Siswa</p>
                                <p className="text-xs text-slate-400">Input data siswa baru</p>
                            </div>
                        </Link>
                        <Link
                            href="/mapels/create"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Book className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Tambah Mapel</p>
                                <p className="text-xs text-slate-400">Daftarkan mata pelajaran</p>
                            </div>
                        </Link>
                        <Link
                            href="/teachers/create"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <School className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Tambah Guru</p>
                                <p className="text-xs text-slate-400">Daftarkan guru pengajar</p>
                            </div>
                        </Link>
                        <Link
                            href="/scores"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Edit className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Input Nilai</p>
                                <p className="text-xs text-slate-400">Entry nilai siswa</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
