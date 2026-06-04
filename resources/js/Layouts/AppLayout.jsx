import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dashboard,
    People,
    Book,
    School,
    MeetingRoom,
    Edit,
    Flag,
    AssignmentTurnedIn,
    Assignment,
    Analytics,
    CalendarMonth,
    Settings,
    Menu,
    Search,
    Notifications,
    ArrowDropDown,
    AccountCircle,
    FactCheck,
    Grade
} from '@mui/icons-material';

const navGroups = [
    {
        label: 'Menu Utama',
        items: [
            { icon: Dashboard, label: 'Dashboard', href: '/dashboard', badge: null },
            { icon: People, label: 'Data Siswa', href: '/students', badge: null },
            { icon: Book, label: 'Mata Pelajaran', href: '/mapels', badge: null },
            { icon: School, label: 'Data Guru', href: '/teachers', badge: null },
            { icon: MeetingRoom, label: 'Kelola Rombel', href: '/rombels', badge: null },
            { icon: Grade, label: 'Manajemen KKM', href: '/kkm', badge: null },
            { icon: Edit, label: 'Entry Nilai', href: '/scores', badge: null },
            { icon: Flag, label: 'Tujuan Pembelajaran', href: '/targets', badge: null },
            { icon: AssignmentTurnedIn, label: 'Kriteria Ketercapaian', href: '/learning-achievement-criteria', badge: null },
        ],
    },
    {
        label: 'Laporan',
        items: [
            { icon: Assignment, label: 'Rapor Siswa', href: '/reports', badge: null },
            { icon: Analytics, label: 'Rekap Nilai', href: '/recaps', badge: null },
            { icon: AssignmentTurnedIn, label: 'Rekap Nilai Ulangan', href: '/exams', badge: null },
            { icon: FactCheck, label: 'Data Absensi', href: '/attendances', badge: null },
            { icon: CalendarMonth, label: 'Data Ekstrakurikuler', href: '/extracurriculars', badge: null },
        ],
    },
    {
        label: 'Pengaturan',
        items: [
            { icon: Settings, label: 'Pengaturan', href: '/settings', badge: null },
            { icon: AccountCircle, label: 'Profil Akun', href: '/profile', badge: null },
        ],
    },
];

export default function AppLayout({ children, title = 'Dashboard' }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url, props } = usePage();
    const { global_settings } = props;

    const isActive = (href) => url.startsWith(href);

    return (
        <div className="flex min-h-screen bg-[#F5F7FF] font-sans">

            {/* ===== SIDEBAR ===== */}
            <aside className={`fixed top-0 left-0 z-50 h-full bg-[#1E1B4B] flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                        e
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="text-white font-extrabold text-base leading-tight">e-Rapor</p>
                            <p className="text-indigo-300 text-[11px] font-medium">{global_settings?.nama_sekolah || 'Nama Sekolah'}</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navGroups.map((group) => (
                        <div key={group.label} className="mb-2">
                            {sidebarOpen && (
                                <p className="text-[10px] font-bold tracking-widest text-indigo-400/50 uppercase px-2 pb-1 pt-3">
                                    {group.label}
                                </p>
                            )}
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 group
                                            ${active
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                                        {sidebarOpen && (
                                            <>
                                                <span className="flex-1">{item.label}</span>
                                                {item.badge && (
                                                    <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* User */}
                <div className="px-3 py-4 border-t border-white/10">
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 uppercase">
                            {props.auth?.user?.name?.charAt(0) || 'U'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{props.auth?.user?.name || 'User'}</p>
                                <p className="text-indigo-300 text-xs truncate">{props.auth?.user?.role || 'Administrator'}</p>
                            </div>
                        )}
                    </Link>
                </div>
            </aside>

            {/* ===== MAIN ===== */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>

                {/* Topbar */}
                <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-7 py-3.5 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
                        <p className="text-xs text-slate-500">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Semester Selector */}
                        <button className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-300 text-indigo-700 text-sm font-semibold rounded-xl px-4 py-2 hover:bg-indigo-100 transition-colors cursor-pointer">
                            <CalendarMonth className="w-4 h-4" />
                            Semester {global_settings?.semester_aktif || 'Ganjil'} {global_settings?.tahun_ajaran_aktif || '2025/2026'}
                            <ArrowDropDown className="w-4 h-4 -ml-1" />
                        </button>

                        {/* Search */}
                        <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notif */}
                        <button className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer">
                            <Notifications className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>


                {/* Page Content */}
                <main className="flex-1 p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
