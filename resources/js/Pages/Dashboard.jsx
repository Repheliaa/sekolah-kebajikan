import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ auth, stats, selectedDate, currentMonthName, monthlyChartData = [], reportData = [] }) {
    const [statDate, setStatDate] = useState(selectedDate);

    // 1. FORM STATE UNTUK INPUT MATERI
    const { data, setData, post, processing, wasSuccessful } = useForm({
        next_week_material: stats?.next_week_material || ''
    });

    const handleMaterialSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.update-material'), {
            onSuccess: () => {
                // Refresh halaman dashboard setelah materi berhasil tersimpan
                router.visit(route('dashboard'), {
                    preserveScroll: true,
                });
            },
        });
    };

    // Handler filter tanggal untuk mengubah data kotak hadir/absen
    const handleStatDateChange = (newDate) => {
        setStatDate(newDate);
        router.get(route('dashboard'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const chartData = monthlyChartData.length > 0 ? monthlyChartData : [];
    
    // Cari nilai tertinggi untuk batas grafik
    const maxAttendance = Math.max(...chartData.map(d => Math.max(d.Hadir, d.Absen)), 10); 

    // Fungsi mencetak laporan kehadiran
    const handlePrintReport = () => {
        window.print();
    };

    return (
        <AdminLayout auth={auth}>
            <div className="min-h-screen bg-[#FEF3D1] print:bg-white print:p-0">
                <Head title="Admin Dashboard" />

                {/* Hero Banner Minimalis (Disembunyikan saat cetak) */}
                <div className="bg-[#F7CBCA] pt-12 pb-20 relative text-center print:hidden">
                    <h1 className="text-[#720107] text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                        SEKOLAH KEBAJIKAN<br />
                        MAKIN SEMANGAT GENTA ROHANI "SEGAR"
                    </h1>
                    <div className="w-full bg-[#FEF3D1] leading-[0] absolute bottom-0 left-0">
                        <img src="/images/wave-bottom.svg" className="w-full h-auto" alt="wave" />
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10 -mt-10 print:mt-0 print:p-4">
                    
                    {/* Ringkasan Header status */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FEFBF5] p-6 rounded-3xl border border-gray-200 print:border-none">
                        <div>
                            <h2 className="text-[#486284] font-black text-xl uppercase tracking-tight">Dashboard Admin</h2>
                            <p className="text-[#486284] font-bold text-xs italic opacity-80 mt-0.5">Sistem Pemantauan Perkembangan Siswa Genta Rohani</p>
                        </div>
                        <div className="flex items-center gap-3 print:hidden">
                            <button 
                                onClick={handlePrintReport}
                                className="bg-[#486284] text-white px-5 py-2 rounded-full text-xs font-black uppercase shadow-sm hover:bg-[#566E91] transition"
                            >
                                Cetak Laporan Bulanan
                            </button>
                            <span className="bg-[#566E91] text-white px-4 py-2 rounded-full text-xs font-black uppercase shadow-sm">
                                Role: Admin
                            </span>
                        </div>
                    </div>

                    {/* Filter Tanggal Khusus Kotak Hadir & Absen */}
                    <div className="mb-4 flex items-center gap-3 print:hidden">
                        <label className="text-[#486284] font-black text-xs uppercase tracking-wider">Pilih Tanggal Data:</label>
                        <input 
                            type="date"
                            value={statDate}
                            onChange={(e) => handleStatDateChange(e.target.value)}
                            className="bg-[#FEFBF5] text-gray-600 px-4 py-1.5 rounded-full border border-gray-300 font-bold text-xs focus:ring-2 focus:ring-[#566E91] cursor-pointer"
                        />
                    </div>

                    {/* Baris Grid Kotak Statistik Utama */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4">
                        <div className="bg-[#566E91] p-6 rounded-[2rem] text-white shadow-md print:border print:text-black print:bg-transparent">
                            <p className="text-xs font-black uppercase opacity-80">Hadir</p>
                            <p className="text-4xl font-black mt-2">{stats?.hadir_hari_ini ?? 0}</p>
                            <p className="text-[10px] italic opacity-60 mt-1 print:hidden">Tanggal: {statDate}</p>
                        </div>
                        <div className="bg-[#720107] p-6 rounded-[2rem] text-white shadow-md print:border print:text-black print:bg-transparent">
                            <p className="text-xs font-black uppercase opacity-80">Absen</p>
                            <p className="text-4xl font-black mt-2">{stats?.tidak_hadir ?? 0}</p>
                            <p className="text-[10px] italic opacity-60 mt-1 print:hidden">Tanggal: {statDate}</p>
                        </div>
                        <div className="bg-[#FEFBF5] p-6 rounded-[2rem] text-center border border-gray-200 col-span-2 flex flex-col justify-center print:border print:text-black">
                            <p className="text-[#486284] text-xs font-black uppercase tracking-wider mb-1">Total Anak Terdaftar</p>
                            <p className="text-[#720107] text-5xl font-black print:text-black">{stats?.total_anak ?? 0}</p>
                        </div>
                    </div>

                    {/* Layout Dua Kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
                        
                        {/* Kiri: Grafik Batang */}
                        <div className="bg-[#FEFBF5] p-6 md:p-8 rounded-[2.5rem] border border-gray-200 lg:col-span-2 flex flex-col justify-between">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-[#486284] font-black text-base uppercase tracking-tight">Grafik Tren Kehadiran</h3>
                                    <p className="text-xs text-gray-400 font-bold italic mt-0.5">Akumulasi presensi per minggu pada bulan ini</p>
                                </div>
                                {/* MENAMPILKAN KETERANGAN BULAN SEKARANG */}
                                <span className="bg-[#FEF3D1] text-[#720107] px-4 py-1 rounded-xl text-xs font-black uppercase tracking-wider border border-[#720107]/20">
                                    {currentMonthName}
                                </span>
                            </div>

                            <div className="flex justify-around items-end h-48 pt-4 border-b-2 border-gray-200 px-2 gap-4">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1 max-w-[80px]">
                                        <div className="flex items-end space-x-1.5 w-full h-36 justify-center">
                                            <div 
                                                style={{ height: `${(data.Hadir / maxAttendance) * 100}%` }}
                                                className="bg-[#566E91] w-4 rounded-t-md min-h-[4px] transition-all duration-500 relative group"
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#486284] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">
                                                    {data.Hadir}
                                                </span>
                                            </div>
                                            <div 
                                                style={{ height: `${(data.Absen / maxAttendance) * 100}%` }}
                                                className="bg-[#720107] w-4 rounded-t-md min-h-[4px] transition-all duration-500 relative group"
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#720107] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">
                                                    {data.Absen}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-black text-gray-400 mt-2 text-center truncate w-full">
                                            {data.name.split(' ')[0]} {data.name.split(' ')[1]}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 justify-center mt-4 text-[10px] font-black uppercase tracking-wider">
                                <div className="flex items-center gap-1.5 text-[#486284]">
                                    <span className="w-2.5 h-2.5 bg-[#566E91] rounded-full"></span> Hadir
                                </div>
                                <div className="flex items-center gap-1.5 text-[#720107]">
                                    <span className="w-2.5 h-2.5 bg-[#720107] rounded-full"></span> Absen
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Form Kelola Materi Pembelajaran */}
                        <div className="bg-[#FEFBF5] p-6 md:p-8 rounded-[2.5rem] border border-gray-200 flex flex-col justify-between">
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-[#720107] font-black text-base uppercase tracking-tight">Fokus Pembelajaran</h3>
                                    <p className="text-xs text-gray-400 font-bold italic mt-0.5">Input materi pembelajaran genta rohani minggu depan</p>
                                </div>

                                <form onSubmit={handleMaterialSubmit} className="space-y-4">
                                    <textarea
                                        rows="4"
                                        placeholder="Tulis tema atau fokus kebajikan di sini..."
                                        value={data.next_week_material}
                                        onChange={(e) => setData('next_week_material', e.target.value)}
                                        className="w-full bg-[#FEFBF5] border border-gray-200 rounded-2xl shadow-inner p-4 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#566E91] focus:border-transparent transition-all"
                                        required
                                    ></textarea>

                                    {wasSuccessful && (
                                        <p className="text-emerald-600 font-bold text-xs bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-100 text-center animate-bounce">
                                            ✓ Materi sukses di-publish ke halaman utama!
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 bg-[#F8C8C8] text-[#720107] font-black text-xs rounded-2xl hover:bg-[#f2b3b3] transition-all uppercase tracking-widest shadow-sm disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Publish Materi'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* AREA HALAMAN LAPORAN YANG AKAN DICETAK (Hidden di web, muncul saat print) */}
                    <div className="hidden print:block mt-8 bg-white p-4">
                        <h2 className="text-center text-xl font-black uppercase text-black">LAPORAN REKAPITULASI KEHADIRAN SISWA</h2>
                        <p className="text-center text-xs font-bold uppercase text-gray-600 mt-1">Periode Bulan: {currentMonthName}</p>
                        <table className="w-full mt-6 border-collapse border border-black text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-black font-bold">
                                    <th className="border border-black py-2 px-3 text-center">No</th>
                                    <th className="border border-black py-2 px-4">Nama Siswa</th>
                                    <th className="border border-black py-2 px-3 text-center">Kelompok</th>
                                    <th className="border border-black py-2 px-3 text-center">Total Hadir</th>
                                    <th className="border border-black py-2 px-3 text-center">Total Absen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row, idx) => (
                                    <tr key={idx} className="text-black">
                                        <td className="border border-black py-2 px-3 text-center">{idx + 1}</td>
                                        <td className="border border-black py-2 px-4 uppercase">{row.name}</td>
                                        <td className="border border-black py-2 px-3 text-center">{row.group || '-'}</td>
                                        <td className="border border-black py-2 px-3 text-center font-bold text-green-700">{row.hadir} Kali</td>
                                        <td className="border border-black py-2 px-3 text-center font-bold text-red-700">{row.absen} Kali</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}