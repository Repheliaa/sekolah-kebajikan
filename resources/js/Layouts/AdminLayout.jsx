import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function AdminLayout({ auth, children }) {
    const [showMenu, setShowMenu] = useState(false);
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    const currentRoute = window.location.pathname;

    const getNavLinkClass = (path) => {
        const isActive = currentRoute === path || currentRoute.startsWith(path);
        return isActive
            ? 'bg-[#566E91] text-white px-4 py-2 rounded-full font-bold'
            : 'py-2 hover:text-black';
    };

    return (
        <>
            {/* Navbar Admin */}
            <nav className="flex justify-between items-center space-x-8 p-6 bg-[#F7CBCA] text-xs font-medium text-gray-600 sticky top-0 z-50 print:hidden">
                {/* Logo */}
                <Link href="/">
                    <img src="/images/asm.png" alt="Logo ASM" className="h-12 object-contain scale-110 origin-left" />
                </Link>

                {/* Menu Links */}
                <div className="flex space-x-8">
                    <Link href="/dashboard" className={getNavLinkClass('/dashboard')}>
                        Dashboard
                    </Link>
                    <Link href="/admin/profile" className={getNavLinkClass('/admin/profile')}>
                        Profile
                    </Link>
                    <Link href="/presensi" className={getNavLinkClass('/presensi')}>
                        Presensi
                    </Link>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-10 h-10 bg-[#566E91] rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-sm hover:scale-105 transition focus:outline-none"
                    >
                        {auth.user.username ? auth.user.username.substring(0, 2).toUpperCase() : 'AD'}
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 text-left">
                            <div className="px-4 py-2 border-b border-gray-50">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Nama Pengguna</p>
                                <p className="text-sm font-black text-[#486284]">{auth.user.name}</p>
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
            </nav>

            {/* Children Content */}
            {children}
        </>
    );
}
