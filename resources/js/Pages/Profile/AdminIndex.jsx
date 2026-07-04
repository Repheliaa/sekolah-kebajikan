import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminIndex({ auth, children = [] }) {
    // 1. STATE UNTUK PENCARIAN & PAGINATION
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Batasan 12 profil anak per halaman

    // 2. LOGIKA LIVE SEARCH
    const filteredChildren = children.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. LOGIKA MATHEMATIKA PAGINATION
    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
    const activePage = currentPage > totalPages ? 1 : currentPage;

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Potong data anak hasil filter untuk halaman aktif saat ini
    const currentChildren = filteredChildren.slice(indexOfFirstItem, indexOfLastItem);

    // Membuat nomor halaman dinamis secara otomatis [1, 2, 3, ...]
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Reset ke halaman 1 saat admin mengetik di search bar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    // Fungsi tambahan aksi hapus profil anak jika sewaktu-waktu dibutuhkan admin
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data profil dari ${name}?`)) {
            router.delete(route('admin.profile.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Kelola Profil Anak - Admin" />

            <div className="min-h-screen bg-[#7A0000]">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    
                    {/* Search Bar & Add Button */}
                    <div className="flex items-center justify-center space-x-4 mb-10">
                        <div className="relative w-full max-w-xl">
                            <input 
                                type="text" 
                                placeholder="Cari nama anak..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full py-3 px-6 rounded-full border-none italic shadow-inner text-gray-600 bg-[#FEFBF5] focus:ring-2 focus:ring-[#566E91]"
                            />
                            <span className="absolute right-5 top-3 text-gray-400 text-lg">🔍</span>
                        </div>
                        <Link 
                            href="/admin/profile/create" 
                            className="w-12 h-12 bg-[#720107] border-2 border-[#FEF3D1] rounded-full flex items-center justify-center text-[#FEF3D1] text-2xl font-bold shadow-lg hover:scale-110 transition duration-200 focus:outline-none"
                            title="Tambah Profil Anak Baru"
                        >
                            +
                        </Link>
                    </div>

                    {/* Grid Kartu Anak (Maksimal Terpotong 12 Item) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {currentChildren.length > 0 ? (
                            currentChildren.map((child) => (
                                <div key={child.id} className="bg-[#FEF3D1] rounded-[2rem] overflow-hidden shadow-2xl relative group border border-gray-100 flex flex-col justify-between transition duration-200">
                                    
                                    {/* Tombol Edit Aksi Cepat (Muncul saat hover kartu) */}
                                    <Link 
                                        href={`/admin/profile/${child.id}/edit`} 
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#486284] text-lg shadow-md opacity-0 group-hover:opacity-100 transition duration-200 z-10 hover:bg-white hover:scale-105"
                                        title="Edit profil"
                                    >
                                        ✎
                                    </Link>

                                    <button 
                                        onClick={() => handleDelete(child.id, child.name)}
                                        className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#720107] text-lg shadow-md opacity-0 group-hover:opacity-100 transition duration-200 z-10 hover:bg-red-100 hover:scale-105"
                                        title="Hapus profil"
                                    >
                                        ✕
                                    </button>
                                
                                    <div className="h-44 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {child.photo ? (
                                            <img 
                                                src={`${child.photo}`}
                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-300" 
                                                alt={child.name}
                                                onError={(e) => {
                                                    e.target.src = '/images/default-child.jpg';
                                                    e.target.className = 'h-full w-full object-cover group-hover:scale-105 transition duration-300 brightness-75';
                                                }}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                <span className="text-4xl">📷</span>
                                                <span className="text-xs font-bold">Tidak ada foto</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4 text-center flex-1 flex flex-col justify-center">
                                        <h3 className="font-black text-[#486284] text-sm uppercase truncate px-1">
                                            {child.name}
                                        </h3>
                                        <p className="text-[#486284] text-xs font-bold mt-0.5 opacity-80">
                                            {child.age} tahun
                                        </p>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 md:col-span-4 text-center py-16">
                                <p className="text-[#FEF3D1] italic text-sm font-bold tracking-wide">
                                    {searchTerm ? 'Nama anak tidak ditemukan dalam daftar.' : 'Belum ada data anak terdaftar.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-12">
                            
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={activePage === 1}
                                className="bg-[#FEF3D1] text-[#720107] px-8 py-2 rounded-full font-black text-sm uppercase shadow-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEF3D1]"
                            >
                                Kembali
                            </button>
                            
                            <div className="bg-[#FEF3D1] flex items-center space-x-2 px-4 py-1.5 rounded-full shadow-md font-bold text-[#566E91] text-sm">
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                                            activePage === number 
                                                ? 'bg-[#566E91] text-white shadow-sm font-black scale-105' 
                                                : 'text-[#566E91] hover:bg-black/5 hover:text-black'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={activePage === totalPages}
                                className="bg-[#FEF3D1] text-[#720107] px-8 py-2 rounded-full font-black text-sm uppercase shadow-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEF3D1]"
                            >
                                Selanjutnya
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
}