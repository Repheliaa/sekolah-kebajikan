import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserPresence({ auth, students = [], historyAttendances = [], selectedMonth = '' }) {
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
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [historyAttendances, students, activeMonth]);

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

                {/* Banner Pemberitahuan Terbaca */}
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
                                weeklyRows.map((row, index) => (
                                    <tr key={`${row.child_id}-${row.date}`} className="border-b border-gray-200 text-xs md:text-sm text-[#486284] font-bold">
                                        <td className="py-4 px-4 text-center border-r border-gray-200 text-gray-500">{index + 1}</td>
                                        <td className="py-4 px-8 border-r border-gray-200 uppercase tracking-wide">{row.student?.name}</td>
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
                                ))
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