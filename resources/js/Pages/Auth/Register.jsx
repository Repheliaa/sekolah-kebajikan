import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen bg-[#FEFBF5] flex flex-col justify-center items-center p-6">
            <Head title="Daftar - SEGAR" />

            <div className="w-full max-w-md bg-[#FDF1D7] rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#486284] tracking-tighter">Daftar Akun</h1>
                    <p className="text-[#486284] text-sm mt-2 font-medium">Daftarkan diri untuk dapat mengakses</p>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Nama Lengkap</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-[#486284]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Budi Setiawan"
                            autoComplete="name"
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-[#486284]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Buat username unik"
                            autoComplete="username"
                            required
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Kata Sandi</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl bg-[#486284]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                autoComplete="new-password"
                                required
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Konfirmasi</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl bg-[#486284]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi password"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-2 bg-[#F8C8C8] hover:bg-[#f2b3b3] text-[#720107] font-black rounded-full shadow-md transition duration-200 transform active:scale-95 uppercase tracking-widest text-xs mx-auto block"
                    >
                        Daftar Akun
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-[#7A0000] font-bold hover:underline">
                        Masuk di sini
                    </Link>
                </div>
            </div>
        </div>
    );
}