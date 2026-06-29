import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Navbar() {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;
    const currentRoute = page.url;
    const { post } = useForm();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    const getNavLinkClass = (path, exact = false) => {
        const isActive = exact ? currentRoute === path : currentRoute.startsWith(path);
        return isActive
            ? 'bg-[#566E91] text-white px-4 py-2 rounded-full font-bold shadow-sm transition'
            : 'py-2 hover:text-black font-medium transition duration-200';
    };

    const isAdmin = user?.role === 'admin';
    const isUser = user && !isAdmin;
    const navBgColor = isAdmin ? 'bg-[#F7CBCA]' : 'bg-[#FEF3D1]';

    return (
        <nav className={`flex justify-between items-center p-6 text-xs text-gray-600 ${navBgColor} relative`}>
            {/* KIRI: Logo SEGAR */}
            <div>
                <Link href="/" className="text-2xl font-black text-[#7A0000] tracking-tighter">
                    SEGAR
                </Link>
            </div>

            {/* MENU UTAMA */}
            {isAdmin ? (
                // ADMIN: Rata Kanan Mepet
                <div className="flex items-center gap-2 ml-auto">
                    <Link href="/dashboard" className={getNavLinkClass('/dashboard', true)}>Dashboard</Link>
                    <Link href="/admin/profile" className={getNavLinkClass('/admin/profile')}>Profile</Link>
                    <Link href="/presensi" className={getNavLinkClass('/presensi')}>Presensi</Link>
                </div>
            ) : isUser ? (
                // USER (ORANG TUA): Centered dengan spacing
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-6">
                        <Link href="/" className={getNavLinkClass('/', true)}>Beranda</Link>
                        <Link href="/profile" className={getNavLinkClass('/profile')}>Profile</Link>
                        <Link href="/presensi" className={getNavLinkClass('/presensi')}>Presensi</Link>
                    </div>
                </div>
            ) : (
                // GUEST (BELUM LOGIN): Rata Kanan
                <div className="flex items-center gap-4 ml-auto">
                    <Link href="/login" className={getNavLinkClass('/login', true)}>Masuk</Link>
                    <Link href="/register" className="bg-[#F8C8C8] text-[#720107] px-5 py-2 rounded-full hover:bg-[#f2b3b3] font-bold transition">
                        Daftar
                    </Link>
                </div>
            )}

            {/* KANAN: Profile Button */}
            {user && (
                <div className="relative ml-2">
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-10 h-10 bg-[#566E91] rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-sm hover:scale-105 transition focus:outline-none"
                    >
                        {user.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 text-left">
                            <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Nama Pengguna</p>
                                <p className="text-sm font-black text-[#486284] truncate">{user.name}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}

        </nav>
    );
}