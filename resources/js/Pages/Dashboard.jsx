import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({
    auth,
    stats,
    selectedMonth,
    selectedYear,
    currentMonthName,
    monthlyChartData = [],
    yearlyChartData = [],
    reportData = [],
    selectedDateStats = {},
    selectedMonthStats = {},
    selectedYearStats = {},
    topChildren = [],
    learningMaterials = {},
    sundays = []
}) {
    const [statMonth, setStatMonth] = useState(selectedMonth || new Date().toISOString().slice(0, 7));
    const [statYear, setStatYear] = useState(selectedYear || new Date().getFullYear().toString());
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(-1);

    // 1. FORM STATE UNTUK INPUT MATERI
    const initialMaterials = sundays.map(date => ({
        date,
        content: learningMaterials[date]?.content || ''
    }));

    const { data, setData, post, processing, wasSuccessful } = useForm({
        materials: initialMaterials
    });

    useEffect(() => {
        setData('materials', sundays.map(date => ({
            date,
            content: learningMaterials[date]?.content || ''
        })));
    }, [sundays, learningMaterials]);

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

    const handleStatMonthChange = (newMonth) => {
        setStatMonth(newMonth);
        router.get(route('dashboard'), { month: newMonth, year: statYear }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleStatYearChange = (newYear) => {
        setStatYear(newYear);
        router.get(route('dashboard'), { month: statMonth, year: newYear }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const chartData = monthlyChartData.length > 0 ? monthlyChartData : [];
    const yearlyChart = yearlyChartData.length > 0 ? yearlyChartData : [];
    const maxAttendance = Math.max(...chartData.map(d => Math.max(d.Hadir, d.Absen)), 10);
    const maxYearlyAttendance = Math.max(...yearlyChart.map(d => Math.max(d.Hadir, d.Absen)), 10);

    const categoryBreakdown = [
        { label: 'Kelompok A', value: stats?.kelompok_a ?? 0, color: '#FEF3D1' }, // Krem
        { label: 'Kelompok B', value: stats?.kelompok_b ?? 0, color: '#F8C8C8' }, // Pink Lembut
        { label: 'Kelompok C', value: stats?.kelompok_c ?? 0, color: '#720107' }, // Merah Gelap
    ];

    const totalCategoryChildren = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);
    const donutCircumference = 2 * Math.PI * 42;
    let donutOffset = 0;
    const donutSegments = categoryBreakdown.map((item) => {
        const length = totalCategoryChildren > 0 ? (item.value / totalCategoryChildren) * donutCircumference : 0;
        const segment = {
            ...item,
            length,
            offset: donutOffset,
        };
        donutOffset -= length;
        return segment;
    });

    const weeklySummary = chartData.reduce((acc, item) => ({
        hadir: acc.hadir + (item.Hadir || 0),
        absen: acc.absen + (item.Absen || 0),
    }), { hadir: 0, absen: 0 });

    const monthlySummary = {
        hadir: selectedMonthStats?.hadir ?? 0,
        absen: selectedMonthStats?.absen ?? 0,
    };

    useEffect(() => {
        if (chartData.length === 0) {
            setSelectedWeekIndex(-1);
            return;
        }

        setSelectedWeekIndex((prev) => (prev >= chartData.length ? chartData.length - 1 : prev));
    }, [chartData.length, selectedMonth, selectedYear]);

    const selectedWeekData = selectedWeekIndex >= 0 && chartData[selectedWeekIndex]
        ? chartData[selectedWeekIndex]
        : chartData[chartData.length - 1] || { name: 'Minggu Ini', Hadir: 0, Absen: 0 };
    const currentWeekLabel = selectedWeekData?.name || 'Minggu Ini';
    const currentWeekSummary = selectedWeekData || { Hadir: 0, Absen: 0 };
    const currentWeekPercentage = (currentWeekSummary.Hadir + currentWeekSummary.Absen) > 0
        ? Math.round((currentWeekSummary.Hadir / (currentWeekSummary.Hadir + currentWeekSummary.Absen)) * 100)
        : 0;
    const monthlyPercentage = (monthlySummary.hadir + monthlySummary.absen) > 0
        ? Math.round((monthlySummary.hadir / (monthlySummary.hadir + monthlySummary.absen)) * 100)
        : 0;

    // Fungsi mencetak laporan kehadiran
    const handlePrintReport = () => {
        window.print();
    };

    return (
        <AdminLayout auth={auth}>
            <div className="min-h-screen bg-[#FEF3D1] print:bg-white print:p-0">
                <Head title="Admin Dashboard" />

                <div className="bg-[#F7CBCA] pt-12 pb-20 relative text-center print:hidden">
                    <h1 className="text-[#720107] text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-6">
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
                    <div className="mt-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FEFBF5] p-6 rounded-3xl border border-gray-200 print:hidden">
                        <div>
                            <h2 className="text-[#486284] font-black text-xl uppercase tracking-tight">Dashboard Admin</h2>
                            <p className="text-[#486284] font-bold text-xs italic opacity-80 mt-0.5">Sistem Pemantauan Perkembangan Siswa Genta Rohani</p>
                        </div>
                        <div className="flex items-center gap-3 print:hidden">
                            <span className="bg-[#566E91] text-white px-4 py-2 rounded-full text-xs font-black uppercase shadow-sm">
                                Role: Admin
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-4 print:hidden">
                        <div className="flex flex-col md:flex-row md:items-end gap-3">
                            <div className="w-full md:w-1/2">
                                <label className="text-[#486284] font-black text-xs uppercase tracking-wider">Bulan</label>
                                <select
                                    value={statMonth}
                                    onChange={(e) => handleStatMonthChange(e.target.value)}
                                    className="mt-1 w-full bg-[#FEFBF5] text-gray-600 px-4 py-2 rounded-full border border-gray-300 font-bold text-xs focus:ring-2 focus:ring-[#566E91]"
                                >
                                    {Array.from({ length: 12 }, (_, index) => {
                                        const value = `${statYear}-${String(index + 1).padStart(2, '0')}`;
                                        const label = new Date(Number(statYear), index, 1).toLocaleDateString('id-ID', { month: 'long' });
                                        return <option key={value} value={value}>{label}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="w-full md:w-1/2">
                                <label className="text-[#486284] font-black text-xs uppercase tracking-wider">Tahun</label>
                                <select
                                    value={statYear}
                                    onChange={(e) => handleStatYearChange(e.target.value)}
                                    className="mt-1 w-full bg-[#FEFBF5] text-gray-600 px-4 py-2 rounded-full border border-gray-300 font-bold text-xs focus:ring-2 focus:ring-[#566E91]"
                                >
                                    {[2024, 2025, 2026, 2027, 2028].map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 print:hidden">
                        <div className="lg:col-span-2 bg-[#566E91] p-6 rounded-[2rem] text-white shadow-md">
                            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                                <div className="flex-1">
                                    <p className="text-xs font-black uppercase opacity-80">Jumlah Anak</p>
                                    <p className="text-4xl font-black mt-2">{stats?.total_anak ?? 0}</p>
                                    <div className="mt-4 space-y-2">
                                        {categoryBreakdown.map((item) => (
                                            <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span>{item.label}</span>
                                                </div>
                                                <span className="font-black">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90">
                                        <circle cx="70" cy="70" r="42" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="18" fill="none" />
                                        {donutSegments.map((segment) => (
                                            <circle
                                                key={segment.label}
                                                cx="70"
                                                cy="70"
                                                r="42"
                                                stroke={segment.color}
                                                strokeWidth="18"
                                                fill="none"
                                                strokeDasharray={`${segment.length} ${donutCircumference}`}
                                                strokeDashoffset={segment.offset}
                                                strokeLinecap="round"
                                            />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#720107] p-6 rounded-[2rem] text-white shadow-md">
                            <p className="text-xs font-black uppercase opacity-80">Kehadiran Minggu Ini</p>
                            <div className="mt-2">
                                <label className="text-[10px] font-black uppercase tracking-wider opacity-70">Pilih Minggu</label>
                                <select
                                    value={selectedWeekIndex}
                                    onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                                    className="mt-1 w-full bg-white/20 text-white px-3 py-2 rounded-full border border-white/20 text-xs font-bold focus:ring-2 focus:ring-white/40"
                                >
                                    {chartData.length > 0 ? chartData.map((item, index) => (
                                        <option key={item.name} value={index} className="text-gray-700">
                                            {item.name}
                                        </option>
                                    )) : <option value={-1} className="text-gray-700">Belum ada data</option>}
                                </select>
                            </div>
                            <p className="text-sm font-black mt-3 uppercase tracking-wide">{currentWeekLabel}</p>
                            <p className="text-3xl font-black mt-3">{currentWeekSummary.Hadir} Hadir</p>
                            <p className="text-xs opacity-70 mt-1">{currentWeekSummary.Absen} Absen</p>
                            <p className="text-xs opacity-80 mt-2 font-black">Persentase : {currentWeekPercentage}%</p>
                        </div>
                        <div className="bg-[#486284] p-6 rounded-[2rem] text-white shadow-md">
                            <p className="text-xs font-black uppercase opacity-80">Kehadiran Bulan Ini</p>
                            <p className="text-3xl font-black mt-2">{monthlySummary.hadir} Hadir</p>
                            <p className="text-xs opacity-70 mt-1">{monthlySummary.absen} Absen</p>
                            <p className="text-xs opacity-80 mt-2 font-black">Persentase : {monthlyPercentage}%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 print:hidden">
                        <div className="xl:col-span-2 bg-[#FEFBF5] p-6 md:p-8 rounded-[2.5rem] border border-gray-200">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-[#486284] font-black text-base uppercase tracking-tight">Grafik Tren Mingguan Bulan Terpilih</h3>
                                    <p className="text-xs text-gray-400 font-bold italic mt-0.5">Akumulasi presensi per minggu pada bulan yang dipilih</p>
                                </div>
                                <span className="bg-[#FEF3D1] text-[#720107] px-4 py-1 rounded-xl text-xs font-black uppercase tracking-wider border border-[#720107]/20">
                                    {currentMonthName}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 items-end min-h-[12rem] pt-4 border-b-2 border-gray-200 px-2">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center justify-end min-w-0">
                                        <div className="flex items-end space-x-1.5 w-full h-36 justify-center">
                                            <div style={{ height: `${(data.Hadir / maxAttendance) * 100}%` }} className="bg-[#566E91] w-4 rounded-t-md min-h-[4px] transition-all duration-500 relative group">
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#486284] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">{data.Hadir}</span>
                                            </div>
                                            <div style={{ height: `${(data.Absen / maxAttendance) * 100}%` }} className="bg-[#720107] w-4 rounded-t-md min-h-[4px] transition-all duration-500 relative group">
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#720107] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">{data.Absen}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-black text-gray-400 mt-2 text-center truncate w-full">{data.name}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 justify-center mt-4 text-[10px] font-black uppercase tracking-wider">
                                <div className="flex items-center gap-1.5 text-[#486284]"><span className="w-2.5 h-2.5 bg-[#566E91] rounded-full"></span> Hadir</div>
                                <div className="flex items-center gap-1.5 text-[#720107]"><span className="w-2.5 h-2.5 bg-[#720107] rounded-full"></span> Absen</div>
                            </div>
                        </div>

                        <div className="bg-[#FEFBF5] p-6 md:p-8 rounded-[2.5rem] border border-gray-200">
                            <h3 className="text-[#486284] font-black text-base uppercase tracking-tight mb-4">Top 3 Anak Paling Aktif</h3>
                            <div className="space-y-3">
                                {topChildren.length > 0 ? topChildren.map((child, index) => (
                                    <div key={child.id} className="rounded-2xl border border-gray-200 bg-white p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-black text-[#720107]">#{index + 1} {child.name}</p>
                                                <p className="text-xs text-gray-500">Kelompok {child.group}</p>
                                            </div>
                                            <span className="text-sm font-black text-[#486284]">{child.hadir} Hadir</span>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-500">Belum ada data kehadiran.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-[#FEFBF5] p-6 md:p-8 rounded-[2.5rem] border border-gray-200 print:hidden">
                        <div className="mb-6">
                            <h3 className="text-[#486284] font-black text-base uppercase tracking-tight">Grafik Tren Tahunan</h3>
                            <p className="text-xs text-gray-400 font-bold italic mt-0.5">Kehadiran per bulan pada tahun terpilih</p>
                        </div>
                        <div className="flex justify-around items-end h-48 pt-4 border-b-2 border-gray-200 px-2 gap-2">
                            {yearlyChart.map((data, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 max-w-[50px]">
                                    <div className="flex items-end space-x-1 w-full h-36 justify-center">
                                        <div style={{ height: `${(data.Hadir / maxYearlyAttendance) * 100}%` }} className="bg-[#566E91] w-3 rounded-t-md min-h-[4px] transition-all duration-500 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#486284] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">{data.Hadir}</span>
                                        </div>
                                        <div style={{ height: `${(data.Absen / maxYearlyAttendance) * 100}%` }} className="bg-[#720107] w-3 rounded-t-md min-h-[4px] transition-all duration-500 relative group">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#720107] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow">{data.Absen}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] md:text-xs font-black text-gray-400 mt-2 text-center truncate w-full">{data.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto mt-8 print:hidden">
                        <div className="bg-[#FEFBF5] p-6 rounded-[2.5rem] border border-gray-200 mb-8">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-[#720107] font-black text-sm uppercase tracking-tight">Fokus Pembelajaran Bulan Ini</h3>
                                </div>
                                <span className="rounded-full bg-[#F8C8C8] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#720107]">{currentMonthName}</span>
                            </div>

                            <form onSubmit={handleMaterialSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.materials && data.materials.map((mat, idx) => (
                                        <div key={mat.date} className="rounded-2xl border border-gray-200 bg-white p-3">
                                            <label className="block text-[10px] font-black uppercase tracking-wider text-[#720107] mb-1.5">
                                                Minggu {idx + 1} ({new Date(mat.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                                            </label>
                                            <textarea
                                                rows="2"
                                                placeholder="Tulis tema..."
                                                value={mat.content}
                                                onChange={(e) => {
                                                    const newMaterials = [...data.materials];
                                                    newMaterials[idx].content = e.target.value;
                                                    setData('materials', newMaterials);
                                                }}
                                                className="w-full bg-[#FEFBF5] border border-gray-200 rounded-xl shadow-inner p-2.5 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-[#566E91] focus:border-transparent transition-all resize-none"
                                            ></textarea>
                                        </div>
                                    ))}
                                </div>

                                {wasSuccessful && <p className="text-emerald-600 font-bold text-[10px] bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-100 text-center animate-bounce">✓ Materi sukses disimpan!</p>}
                                <button type="submit" disabled={processing} className="w-full py-2.5 bg-[#F8C8C8] text-[#720107] font-black text-[10px] rounded-xl hover:bg-[#f2b3b3] transition-all uppercase tracking-widest shadow-sm disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Materi'}</button>
                            </form>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={handlePrintReport} className="bg-[#486284] text-white py-4 px-10 font-black text-xs rounded-full hover:bg-[#566E91] transition-all uppercase tracking-widest shadow-md flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                </svg>
                                Cetak Laporan Bulanan
                            </button>
                        </div>
                    </div>

                    {/* AREA HALAMAN LAPORAN YANG AKAN DICETAK (Hidden di web, muncul saat print) */}
                    <div className="hidden print:block mt-8 bg-white p-6">
                        <div className="border-b-2 border-black pb-4 mb-6">
                            <h2 className="text-center text-2xl font-black uppercase text-black tracking-tight">Laporan Rekapitulasi Kehadiran Siswa</h2>
                            <h3 className="text-center text-lg font-bold uppercase text-black mt-1">Sekolah Kebajikan Genta Rohani</h3>
                            <p className="text-center text-sm font-semibold text-black mt-1">Periode Bulan: {currentMonthName}</p>
                        </div>
                        
                        <div className="flex justify-between mb-6 text-sm font-bold text-black">
                            <div>
                                <p>Total Aktif: {stats?.total_anak || 0} Anak</p>
                                <p>Rincian: Kel. A ({stats?.kelompok_a || 0}), Kel. B ({stats?.kelompok_b || 0}), Kel. C ({stats?.kelompok_c || 0})</p>
                            </div>
                            <div className="text-right">
                                <p>Total Kehadiran Bulan Ini: {selectedMonthStats?.hadir || 0} Hadir / {selectedMonthStats?.absen || 0} Absen</p>
                                <p>Rata-rata Partisipasi: {((selectedMonthStats?.hadir || 0) / (((selectedMonthStats?.hadir || 0) + (selectedMonthStats?.absen || 0)) || 1) * 100).toFixed(1)}%</p>
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr className="text-black font-bold bg-gray-100">
                                    <th className="border border-black py-2 px-2 text-center w-10">No</th>
                                    <th className="border border-black py-2 px-3 text-left">Nama Siswa</th>
                                    <th className="border border-black py-2 px-2 text-center">Klp</th>
                                    <th className="border border-black py-2 px-2 text-center w-20">Hadir</th>
                                    <th className="border border-black py-2 px-2 text-center w-20">Absen</th>
                                    <th className="border border-black py-2 px-2 text-center w-24">Persentase</th>
                                    <th className="border border-black py-2 px-3 text-left">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row, idx) => {
                                    const totalPertemuan = row.hadir + row.absen;
                                    const persentase = totalPertemuan > 0 ? ((row.hadir / totalPertemuan) * 100).toFixed(0) + '%' : '-';
                                    return (
                                        <tr key={idx} className="text-black">
                                            <td className="border border-black py-1.5 px-2 text-center">{idx + 1}</td>
                                            <td className="border border-black py-1.5 px-3 uppercase text-xs font-semibold">{row.name}</td>
                                            <td className="border border-black py-1.5 px-2 text-center">{row.group || '-'}</td>
                                            <td className="border border-black py-1.5 px-2 text-center">{row.hadir}</td>
                                            <td className="border border-black py-1.5 px-2 text-center">{row.absen}</td>
                                            <td className="border border-black py-1.5 px-2 text-center">{persentase}</td>
                                            <td className="border border-black py-1.5 px-3"></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        <div className="mt-12 flex justify-end">
                            <div className="text-center text-black">
                                <p className="text-sm mb-16">Mengetahui, <br/>Pengajar / Wali Kelas</p>
                                <p className="text-sm font-bold underline">(.......................................)</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}