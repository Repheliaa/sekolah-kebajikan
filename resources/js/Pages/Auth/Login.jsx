import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#FEFBF5] flex flex-col justify-center items-center p-6">
            <Head title="Masuk - SEGAR" />

            <div className="w-full max-w-md bg-[#FDF1D7] rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#486284] tracking-tighter">Masuk</h1>
                    <p className="text-gray-500 text-[#486284] mt-2 font-medium">Silakan masuk ke akun milik Anda</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Nama Pengguna</label>
                        <input
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-[#FEFBF5]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="masukkan username"
                            required
                        />
                        {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#566E91] uppercase mb-1 ml-1">Kata Sandi</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-[#FEFBF5]-50 border-transparent focus:border-[#566E91] focus:bg-white focus:ring-0 text-sm transition"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-2 bg-[#F8C8C8] hover:bg-[#f2b3b3] text-[#720107] font-black rounded-full shadow-md transition duration-200 transform active:scale-95 uppercase tracking-widest text-xs mx-auto block">
                        Masuk
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-[#566E91]-600">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-[#486284] font-bold hover:underline">
                        Daftar Sekarang
                    </Link>
                </div>
            </div>
            
            <Link href="/" className="mt-6 text-[#FDF1D7] text-sm hover:underline opacity-80">
                ← Kembali ke Beranda
            </Link>
        </div>
    );
}