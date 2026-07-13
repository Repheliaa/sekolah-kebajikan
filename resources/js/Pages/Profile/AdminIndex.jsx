import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminIndex({ auth, children = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; 

    const filteredChildren = children.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
    const activePage = currentPage > totalPages ? 1 : currentPage;

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentChildren = filteredChildren.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

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
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mx-auto mb-12 gap-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari profil anak..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full py-4 pl-14 pr-6 rounded-[2rem] border border-gray-100 bg-[#FEFBF5] text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-[#566E91] transition-all focus:outline-none"
                            />
                        </div>
                        <Link 
                            href="/admin/profile/create" 
                            className="flex-shrink-0 flex items-center gap-2 bg-[#FEF3D1] text-[#720107] font-black text-sm uppercase tracking-wider py-4 px-8 rounded-[2rem] shadow-sm hover:shadow-md hover:bg-white transition-all transform hover:-translate-y-0.5 focus:outline-none"
                            title="Tambah Profil Anak Baru"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Tambah Data
                        </Link>
                    </div>

                    {/* Grid Kartu Anak (Maksimal Terpotong 12 Item) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {currentChildren.length > 0 ? (
                            currentChildren.map((child) => (
                                <div key={child.id} className="bg-[#FEF3D1] rounded-[2rem] overflow-hidden shadow-2xl relative group border border-gray-100 flex flex-col justify-between transition duration-200">
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