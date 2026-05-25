import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { 
    School, 
    FlashOn, 
    Assessment, 
    Description, 
    Lock, 
    MailOutline, 
    Lightbulb 
} from '@mui/icons-material';


export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
            <Head title="Masuk Ke-Rapor" />

            {/* LEFT SIDE: Decorative Branding & Academic Info */}
            <div className="relative md:w-1/2 bg-[#1E1B4B] flex flex-col justify-between p-8 md:p-16 text-white overflow-hidden shadow-2xl">
                {/* Background Glow Elements */}
                <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Top: Logo & Title */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-extrabold text-2xl">
                        e
                    </div>
                    <div>
                        <h1 className="font-extrabold text-xl leading-none tracking-tight">e-Rapor</h1>
                        <p className="text-xs text-indigo-300 font-semibold tracking-wider uppercase mt-0.5">Edupena System</p>
                    </div>
                </div>

                {/* Middle: Welcome Text & Features */}
                <div className="relative z-10 my-auto py-12 md:py-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 mb-6 backdrop-blur-md">
                        <School className="w-4 h-4" /> Portal Akademik Resmi
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight max-w-lg">
                        Kemudahan Pengolahan Nilai & Rapor Sekolah
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base mt-4 max-w-md leading-relaxed">
                        Platform administrasi sekolah terintegrasi untuk guru, wali kelas, dan operator dalam merekap hasil belajar siswa secara realtime, akurat, dan aman.
                    </p>

                    {/* Feature Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 max-w-md">
                        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                                <FlashOn className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">Otomatisasi Deskripsi</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Deskripsi KKTP & TP auto-generate</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                                <Assessment className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">Legger & Ranking</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Rekapitulasi nilai kelas instan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                                <Description className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">Cetak PDF Rapor</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Ekspor satu klik siap cetak</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">Keamanan Data</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Enkripsi & audit log lengkap</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: School Identity */}
                <div className="relative z-10 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-2 border-t border-white/10 pt-6">
                    <p>© 2026 Edupena. All Rights Reserved.</p>
                    <p className="font-semibold text-slate-300">SDN Karang Mulya 01</p>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
                <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full translate-x-8 -translate-y-8"></div>
                    
                    {/* Header Form */}
                    <div className="relative z-10 mb-8">
                        <h3 className="text-2xl font-extrabold text-slate-900">Selamat Datang 👋</h3>
                        <p className="text-slate-500 text-sm mt-1">Silakan masuk menggunakan email dan password yang terdaftar.</p>
                    </div>

                    {status && (
                        <div className="mb-5 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold">
                            {status}
                        </div>
                    )}

                    {/* Active Form */}
                    <form onSubmit={submit} className="relative z-10 space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="email">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <MailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all"
                                    placeholder="nama@sekolah.sch.id"
                                    autoComplete="username"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="password">
                                Kata Sandi (Password)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all"
                                    placeholder="Masukkan kata sandi"
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="w-4.5 h-4.5 border-slate-300 text-indigo-600 focus:ring-indigo-500 rounded-md transition-colors cursor-pointer"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                    Ingat saya di perangkat ini
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            {processing ? 'Menghubungkan...' : 'Masuk Aplikasi ➔'}
                        </button>
                    </form>

                    <div className="relative z-10 mt-8 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                        <div className="flex items-start gap-2.5">
                            <Lightbulb className="text-indigo-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold text-indigo-900">Akun Uji Coba (Demo):</p>
                                <div className="mt-1 text-indigo-700 space-y-0.5 font-mono">
                                    <p>Email: <span className="select-all font-semibold">admin@edupena.fun</span></p>
                                    <p>Sandi: <span className="select-all font-semibold">password</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
