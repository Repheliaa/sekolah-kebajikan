import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ProfileIndex({ auth, students = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const activePage = currentPage > totalPages ? 1 : currentPage;

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <AppLayout auth={auth}>
            <Head title="Profile Anak - SEGAR" />
            <div className="min-h-screen bg-[#7A0000]">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="relative w-full max-w-2xl mx-auto mb-12">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari profil anak..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full py-4 pl-14 pr-6 rounded-[2rem] border border-gray-100 bg-[#FEFBF5] text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-[#566E91] transition-all focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student) => (
                                <Link
                                    key={student.id}
                                    href={`/profile/${student.id}`}
                                    className="bg-[#FEF3D1] rounded-[2rem] overflow-hidden shadow-xl transition transform hover:scale-105 group border border-gray-100 flex flex-col justify-between"
                                >
                                    <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {student.photo ? (
                                            <img
                                                src={`${student.photo}?t=${Date.now()}`}
                                                alt={student.name}
                                                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition duration-300"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-child.jpg';
                                                    e.target.className = 'w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition duration-300 brightness-75';
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
                                        <h3 className="font-black text-[#486284] text-sm md:text-base leading-tight uppercase tracking-tight truncate px-1">
                                            {student.name}
                                        </h3>
                                        <p className="text-[#486284] text-xs font-bold mt-1 opacity-80">
                                            {student.age} Tahun
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-2 md:col-span-4 text-center py-16">
                                <p className="text-[#FEF3D1] italic text-sm font-bold tracking-wide">
                                    {searchTerm ? 'Nama anak tidak ditemukan.' : 'Belum ada data anak terdaftar.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-between items-center">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={activePage === 1}
                                className="bg-[#FEF3D1] text-[#720107] px-8 py-3 rounded-full font-black text-sm uppercase shadow-md hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEF3D1]"
                            >
                                Kembali
                            </button>

                            <div className="bg-[#FEF3D1] flex items-center space-x-2 px-4 py-1.5 rounded-full shadow-md font-bold text-[#566E91] text-sm">
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${activePage === number
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
                                className="bg-[#FEF3D1] text-[#720107] px-8 py-3 rounded-full font-black text-sm uppercase shadow-md hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEF3D1]"
                            >
                                Selanjutnya
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}