import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserPresence({ auth, students = [], historyAttendances = [] }) {
    // dapatkan string tanggal hari ini 'YYYY-MM-DD' sebagai default awal kalender
    const todayString = new Date().toISOString().split('T')[0];
    
    // 1. STATE UNTUK FILTER TANGGAL (Default langsung ke tanggal hari ini)
    const [filterDate, setFilterDate] = useState(todayString);

    // 2. FILTER DATA PRESENSI BERDASARKAN TANGGAL YANG DIPILIH
    // Menyaring semua riwayat presensi yang memiliki kecocokan tanggal dengan filterDate
    const attendancesByDate = historyAttendances.filter(
        (attendance) => attendance.date === filterDate
    );

    return (
        <AppLayout auth={auth}>
            <Head title="Riwayat Presensi Anak - SEGAR" />

            <div className="min-h-screen bg-[#7A0000] py-12 px-4 md:px-8 flex flex-col items-center">
                
                {/* Judul Utama */}
                <h1 className="text-[#FEF3D1] text-3xl md:text-4xl font-black text-center mb-6 tracking-wide">
                    Riwayat Presensi Anak
                </h1>

                {/* Banner Pemberitahuan Terbaca */}
                <div className="w-full max-w-4xl mb-6 rounded-3xl bg-[#FEF3D1] px-6 py-4 text-xs font-bold text-[#486284] border border-gray-100 shadow-sm">
                    ✨ Halo Orang Tua! Anda berada di mode baca. Data di bawah ini bersumber dari rekapitulasi presensi mingguan yang sah dari pihak pengajar.
                </div>

                {/* Dropdown Filter Tanggal Minggu */}
                <div className="relative w-full max-w-xs mb-8">
                    <input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full bg-[#FEFBF5] text-gray-500 px-6 py-3 rounded-full border-none shadow-inner font-medium text-sm text-center focus:ring-2 focus:ring-[#566E91] cursor-pointer"
                    />
                </div>

                {/* Tabel Informasi Putih Gading */}
                <div className="w-full max-w-4xl bg-[#FEFBF5] overflow-hidden p-1 border border-gray-100 shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#566E91] text-white text-xs md:text-sm font-black uppercase tracking-wider">
                                <th className="py-4 px-6 text-center w-16 border-r border-[#486284]">No</th>
                                <th className="py-4 px-8 border-r border-[#486284]">Nama Anak</th>
                                <th className="py-4 px-6 text-center w-32 border-r border-[#486284]">Status</th>
                                <th className="py-4 px-8">Catatan Capaian Belajar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => {
                                    // PERBAIKAN UTAMA: Mencari data di dalam array yang sudah difilter berdasarkan tanggal
                                    const attendance = attendancesByDate.find(a => a.child_id === student.id);

                                    return (
                                        <tr key={student.id} className="border-b border-gray-200 text-xs md:text-sm text-[#486284] font-bold">
                                            <td className="py-4 px-4 text-center border-r border-gray-200 text-gray-500">{index + 1}</td>
                                            <td className="py-4 px-8 border-r border-gray-200 uppercase tracking-wide">{student.name}</td>
                                            
                                            {/* Status Kehadiran berupa badge datar tanpa input */}
                                            <td className="py-4 px-6 text-center border-r border-gray-200">
                                                {/* Kondisi lencana warna jika rekam data absen pada tanggal tersebut ditemukan */}
                                                {attendance ? (
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                                                        attendance.is_present 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {attendance.is_present ? 'Hadir' : 'Absen'}
                                                    </span>
                                                ) : (
                                                    // Tampilan jika guru belum melakukan absensi di tanggal terpilih
                                                    <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase bg-gray-100 text-gray-400">
                                                        Belum Diabsen
                                                    </span>
                                                )}
                                            </td>
                                            
                                            {/* Catatan Keterangan Read-Only */}
                                            <td className="py-4 px-8 italic text-gray-600 font-medium">
                                                {attendance ? (
                                                    attendance.note || <span className="text-gray-300 font-normal">Tidak ada catatan minggu ini</span>
                                                ) : (
                                                    <span className="text-gray-300 font-normal italic">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-gray-400 italic">Belum ada data siswa terdaftar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AppLayout>
    );
}