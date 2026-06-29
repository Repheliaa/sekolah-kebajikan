import React, { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// TAMBAHKAN PROPS 'selectedDate' DAN 'existingAttendances' DARI LARAVEL
export default function Presence({ auth, students = [], selectedDate, existingAttendances = [] }) {
    
    // Inisialisasi useForm
    const { data, setData, post, processing } = useForm({
        date: selectedDate || '',
        attendances: []
    });

    // EFFECT SYNC UTAMA: Berfungsi memetakan ulang data tabel setiap kali database mengirim data presensi yang cocok
    useEffect(() => {
        const mappedAttendances = students.map(student => {
            // Cari apakah anak ini sudah punya rekaman absensi di tanggal terpilih
            const existing = existingAttendances.find(att => att.child_id === student.id);
            
            return {
                child_id: student.id,
                // Jika ada gunakan data DB lama, jika tidak ada set default true (Hadir)
                is_present: existing ? Boolean(existing.is_present) : true,
                note: existing ? (existing.note || '') : ''
            };
        });

        setData('attendances', mappedAttendances);
    }, [existingAttendances, students]);

    // Handler ketika admin mengubah tanggal kalender
    const handleDateChange = (newDate) => {
        setData('date', newDate);
        
        // Minta Laravel mengambil data presensi lama yang terdaftar pada tanggal baru ini
        router.get(route('presensi'), { date: newDate }, {
            preserveState: true, // Jaga state komponen agar tidak hilang
            preserveScroll: true
        });
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
        post(route('presensi.store')); 
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Kelola Presensi - Admin" />

            <div className="min-h-screen bg-[#7A0000] py-12 px-4 md:px-8 flex flex-col items-center">
                <h1 className="text-[#FEF3D1] text-3xl md:text-4xl font-black text-center mb-6 tracking-wide uppercase">
                    Presensi Anak
                </h1>

                {/* Input Tanggal */}
                <div className="relative w-full max-w-xs mb-8">
                    <input 
                        type="date"
                        value={data.date}
                        onChange={(e) => handleDateChange(e.target.value)} // Menggunakan handler khusus baru
                        className="w-full bg-[#FEFBF5] text-gray-500 px-6 py-3 rounded-full border-none shadow-inner font-medium text-sm text-center focus:ring-2 focus:ring-[#566E91] cursor-pointer"
                        required
                    />
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
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${
                                                        attendance.is_present ? 'border-[#566E91] bg-[#566E91]' : 'border-gray-400 bg-transparent'
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

                <div className="w-full max-w-4xl flex justify-end mt-8">
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