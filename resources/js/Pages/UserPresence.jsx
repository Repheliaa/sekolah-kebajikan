import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserPresence({ auth, students = [], historyAttendances = [], selectedMonth = '', learningMaterials = [] }) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const [activeMonth, setActiveMonth] = useState(selectedMonth || currentMonth);
    const activeYear = activeMonth.split('-')[0];

    useEffect(() => {
        if (selectedMonth) {
            setActiveMonth(selectedMonth);
        }
    }, [selectedMonth]);

    const yearOptions = useMemo(() => {
        const years = [];
        const currentYearValue = Number(currentYear);

        for (let offset = 0; offset < 5; offset += 1) {
            years.push((currentYearValue - offset).toString());
        }

        return years;
    }, [currentYear]);

    const monthOptions = useMemo(() => {
        const options = [];
        const year = Number(activeYear);

        for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
            const date = new Date(year, monthIndex, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            options.push({
                value,
                label: date.toLocaleDateString('id-ID', { month: 'long' })
            });
        }

        return options;
    }, [activeYear]);

    const weeklyRows = useMemo(() => {
        return historyAttendances
            .filter((attendance) => attendance.date.startsWith(activeMonth))
            .map((attendance) => ({
                ...attendance,
                student: students.find((student) => student.id === attendance.child_id),
            }))
            .filter((row) => row.student)
            .sort((a, b) => {
                // Urutkan berdasarkan nama anak terlebih dahulu (Alfabetis)
                const nameCompare = a.student.name.localeCompare(b.student.name);
                if (nameCompare !== 0) return nameCompare;
                // Jika namanya sama, urutkan berdasarkan minggu terbaru (Descending)
                return b.date.localeCompare(a.date);
            });
    }, [historyAttendances, students, activeMonth]);

    const activeMonthMaterials = useMemo(() => {
        return learningMaterials
            .filter(mat => mat.date.startsWith(activeMonth) && mat.content)
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [learningMaterials, activeMonth]);

    const formatAttendanceDate = (dateString) => {
        const date = new Date(`${dateString}T00:00:00`);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const handleYearChange = (newYear) => {
        const newMonth = `${newYear}-${activeMonth.split('-')[1] || '01'}`;
        setActiveMonth(newMonth);
        router.get(route('presensi'), { month: newMonth }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleMonthChange = (newMonth) => {
        setActiveMonth(newMonth);
        router.get(route('presensi'), { month: newMonth }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AppLayout auth={auth}>
            <Head title="Riwayat Presensi Anak - SEGAR" />

            <div className="min-h-screen bg-[#7A0000] py-12 px-4 md:px-8 flex flex-col items-center">
                
                {/* Judul Utama */}
                <h1 className="text-[#FEF3D1] text-3xl md:text-4xl font-black text-center mb-6 tracking-wide uppercase">
                    Riwayat Presensi Anak
                </h1>

                <div className="w-fit mx-auto mb-6 rounded-3xl bg-[#FEF3D1] px-8 py-4 text-center text-sm font-medium text-[#486284] border border-gray-200 shadow-sm">
                    Berikut adalah data kehadiran anak yang telah dicatat dan diperbarui oleh pengajar.
                </div>

                <div className="w-full max-w-xl mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
                    <div className="w-full md:w-1/2">
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#FEF3D1]">Tahun</label>
                        <select
                            value={activeYear}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="w-full rounded-full border-none bg-[#FEFBF5] px-4 py-3 text-sm font-medium text-gray-600 shadow-inner focus:ring-2 focus:ring-[#566E91]"
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#FEF3D1]">Bulan</label>
                        <select
                            value={activeMonth}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="w-full rounded-full border-none bg-[#FEFBF5] px-4 py-3 text-sm font-medium text-gray-600 shadow-inner focus:ring-2 focus:ring-[#566E91]"
                        >
                            {monthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {activeMonthMaterials.length > 0 && (
                    <div className="w-full max-w-4xl mb-8">
                        <div className="bg-[#FEFBF5] p-6 rounded-[2.5rem] border border-gray-200 shadow-xl">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="bg-[#F8C8C8] p-2.5 rounded-full text-[#720107]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-[#720107] font-black text-sm uppercase tracking-tight">Materi Pembelajaran Bulan Ini</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeMonthMaterials.map((mat, idx) => (
                                    <div key={mat.date} className="rounded-2xl border border-gray-200 bg-white p-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-wider text-[#720107] mb-1.5">
                                            Minggu {idx + 1} - {new Date(`${mat.date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </h4>
                                        <p className="text-sm font-semibold text-gray-700 italic">"{mat.content}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabel Informasi Putih Gading */}
                <div className="w-full max-w-4xl bg-[#FEFBF5] overflow-hidden p-1 border border-gray-100 shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#566E91] text-white text-xs md:text-sm font-black uppercase tracking-wider">
                                <th className="py-4 px-6 text-center w-16 border-r border-[#486284]">No</th>
                                <th className="py-4 px-8 border-r border-[#486284]">Nama Anak</th>
                                <th className="py-4 px-6 text-center w-40 border-r border-[#486284]">Minggu</th>
                                <th className="py-4 px-6 text-center w-32 border-r border-[#486284]">Status</th>
                                <th className="py-4 px-8">Catatan Capaian Belajar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklyRows.length > 0 ? (
                                weeklyRows.map((row, index) => {
                                    const isFirstOfChild = index === 0 || weeklyRows[index - 1].student.name !== row.student.name;
                                    const childNumber = new Set(weeklyRows.slice(0, index + 1).map(r => r.student.name)).size;
                                    
                                    return (
                                        <tr key={`${row.child_id}-${row.date}`} className="border-b border-gray-200 text-xs md:text-sm text-[#486284] font-bold">
                                            <td className="py-4 px-4 text-center border-r border-gray-200 text-gray-800 font-black">
                                                {isFirstOfChild ? childNumber : ''}
                                            </td>
                                            <td className="py-4 px-8 border-r border-gray-200 uppercase tracking-wide text-gray-800 font-black">
                                                {isFirstOfChild ? row.student?.name : ''}
                                            </td>
                                            <td className="py-4 px-6 text-center border-r border-gray-200 text-gray-600">{formatAttendanceDate(row.date)}</td>
                                            <td className="py-4 px-6 text-center border-r border-gray-200">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                                                    row.is_present
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {row.is_present ? 'Hadir' : 'Absen'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 italic text-gray-600 font-medium">
                                                {row.note ? row.note : <span className="text-gray-300 font-normal">Tidak ada catatan minggu ini</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-400 italic">Belum ada data presensi pada bulan ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AppLayout>
    );
}