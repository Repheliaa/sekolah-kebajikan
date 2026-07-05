import React, { useEffect, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const getSundaysInMonth = (monthValue) => {
    const [year, month] = monthValue.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(Date.UTC(year, month - 1, day));
        if (date.getUTCDay() === 0) {
            dates.push(date.toISOString().split('T')[0]);
        }
    }

    return dates;
};

export default function Presence({ auth, students = [], selectedDate, selectedMonth, existingAttendances = [], learningMaterial }) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const activeMonth = selectedMonth || currentMonth;
    const activeYear = activeMonth.split('-')[0];

    const { data, setData, post, processing } = useForm({
        date: selectedDate || '',
        attendances: []
    });

    useEffect(() => {
        setData('date', selectedDate || '');
    }, [selectedDate]);

    useEffect(() => {
        const mappedAttendances = students.map((student) => {
            const existing = existingAttendances.find((att) => att.child_id === student.id);

            return {
                child_id: student.id,
                is_present: existing ? Boolean(existing.is_present) : true,
                note: existing ? (existing.note ?? '') : ''
            };
        });

        setData('attendances', mappedAttendances);
    }, [existingAttendances, students]);

    const availableDates = useMemo(() => getSundaysInMonth(activeMonth), [activeMonth]);

    const yearOptions = useMemo(() => {
        const years = [];
        const currentYearValue = Number(currentYear);

        for (let offset = 0; offset < 5; offset += 1) {
            const year = currentYearValue - offset;
            years.push(year.toString());
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

    const navigateToAttendance = (newMonth, newDate) => {
        router.visit(route('presensi'), {
            data: {
                month: newMonth,
                date: newDate,
            },
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleYearChange = (newYear) => {
        const newMonth = `${newYear}-${activeMonth.split('-')[1] || '01'}`;
        const fallbackDate = getSundaysInMonth(newMonth)[0] || '';
        setData('date', fallbackDate);
        navigateToAttendance(newMonth, fallbackDate);
    };

    const handleMonthChange = (newMonth) => {
        const fallbackDate = getSundaysInMonth(newMonth)[0] || '';
        setData('date', fallbackDate);
        navigateToAttendance(newMonth, fallbackDate);
    };

    const handleDateChange = (newDate) => {
        setData('date', newDate);
        navigateToAttendance(activeMonth, newDate);
    };

    const handleAttendanceChange = (index, value) => {
        const updated = [...data.attendances];
        updated[index].is_present = value;
        setData('attendances', updated);
    };

    const handleNoteChange = (index, value) => {
        const updated = [...data.attendances];
        updated[index].note = value;
        setData('attendances', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('presensi.store'), {
            preserveScroll: true,
            onSuccess: () => {
                router.get(route('presensi'), {
                    month: activeMonth,
                    date: data.date,
                }, {
                    preserveState: false,
                    preserveScroll: true,
                    replace: true,
                });
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus seluruh data presensi pada tanggal ini secara permanen?')) {
            router.delete(route('presensi.destroy', data.date), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Kelola Presensi - Admin" />

            <div className="min-h-screen bg-[#7A0000] py-12 px-4 md:px-8 flex flex-col items-center">
                <h1 className="text-[#FEF3D1] text-3xl md:text-4xl font-black text-center mb-6 tracking-wide uppercase">
                    Presensi Anak
                </h1>

                <div className="w-full max-w-3xl mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
                    <div className="w-full md:w-1/3">
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

                    <div className="w-full md:w-1/3">
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

                    <div className="w-full md:w-1/3">
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#FEF3D1]">Tanggal Minggu</label>
                        <select
                            value={data.date || ''}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full rounded-full border-none bg-[#FEFBF5] px-4 py-3 text-sm font-medium text-gray-600 shadow-inner focus:ring-2 focus:ring-[#566E91]"
                            required
                        >
                            {availableDates.length > 0 ? (
                                availableDates.map((date) => (
                                    <option key={date} value={date}>
                                        {new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                    </option>
                                ))
                            ) : (
                                <option value="">Belum ada tanggal minggu</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Info Materi Pembelajaran */}
                <div className="w-full max-w-4xl mb-6">
                    <div className="bg-[#FEFBF5] p-5 rounded-2xl border border-gray-100 shadow-md flex gap-4 items-start">
                        <div className="bg-[#F8C8C8] p-3 rounded-full text-[#720107]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#720107] mb-1">Materi Pembelajaran ({new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })})</h3>
                            <p className="text-sm font-medium text-gray-700 italic">
                                {learningMaterial ? `"${learningMaterial}"` : 'Belum ada materi pembelajaran yang diinput pada tanggal ini.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabel Render */}
                <div className="w-full max-w-4xl bg-[#FEFBF5] overflow-hidden p-1 border border-gray-100 shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#566E91] text-white text-xs md:text-sm font-black uppercase tracking-wider">
                                <th className="py-4 px-6 text-center w-16 border-r border-[#486284]">No</th>
                                <th className="py-4 px-8 border-r border-[#486284]">Nama</th>
                                <th className="py-4 px-6 text-center w-32 border-r border-[#486284]">Hadir</th>
                                <th className="py-4 px-8">Catatan Capaian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.attendances.map((attendance, index) => {
                                const studentInfo = students.find(s => s.id === attendance.child_id);
                                return (
                                    <tr key={attendance.child_id} className="border-b border-gray-200 text-xs md:text-sm text-[#486284] font-bold">
                                        <td className="py-4 px-4 text-center border-r border-gray-200 text-gray-500">{index + 1}</td>
                                        <td className="py-4 px-8 border-r border-gray-200 uppercase tracking-wide">{studentInfo?.name}</td>
                                        <td className="py-4 px-6 text-center border-r border-gray-200">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAttendanceChange(index, !attendance.is_present)}
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${attendance.is_present ? 'border-[#566E91] bg-[#566E91]' : 'border-gray-400 bg-transparent'
                                                        }`}
                                                >
                                                    {attendance.is_present && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2 px-6">
                                            <input
                                                type="text"
                                                placeholder={attendance.is_present ? "Tulis capaian perkembangan..." : "Sakit / Izin"}
                                                value={attendance.note}
                                                onChange={(e) => handleNoteChange(index, e.target.value)}
                                                className="w-full bg-transparent border-none py-1 px-2 italic text-gray-600 placeholder-gray-300 focus:ring-0 text-sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="w-full max-w-4xl flex justify-end gap-4 mt-8">
                    {existingAttendances && existingAttendances.length > 0 && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={processing}
                            className="py-3 px-6 border-2 border-[#FEF3D1] text-[#FEF3D1] font-black text-sm rounded-full hover:bg-[#FEF3D1] hover:text-[#7A0000] transition-all uppercase tracking-wider disabled:opacity-50"
                        >
                            Hapus Presensi
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="py-3 px-10 bg-[#F8C8C8] text-[#720107] font-black text-sm rounded-full shadow-md hover:bg-[#f2b3b3] transition-all active:scale-95 uppercase tracking-wider shadow-sm disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Input Presensi'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}