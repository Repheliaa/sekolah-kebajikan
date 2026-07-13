import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ auth, child, stats }) {
    const [photoPreview, setPhotoPreview] = useState(child?.photo || null);
    const { data, setData, post, put, processing, errors } = useForm({
        name: child?.name || '',
        pob: child?.pob || '',
        birth_date: child?.birth_date || '',
        age: child?.age || '',
        address: child?.address || '',
        mother_name: child?.mother_name || '',
        father_name: child?.father_name || '',
        contact_number: child?.contact_number || '',
        school_name: child?.school_name || '',
        school_address: child?.school_address || '',
        class: child?.class || '',
        nipd: child?.nipd || '',
        group: child?.group || '',
        photo: null,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (data.birth_date) {
            const birth = new Date(data.birth_date);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                calculatedAge--;
            }

            setData(prev => ({ ...prev, age: calculatedAge }));

            if (calculatedAge >= 1 && calculatedAge <= 5) {
                setData('group', 'A');
            } else if (calculatedAge >= 6 && calculatedAge <= 10) {
                setData('group', 'B');
            } else if (calculatedAge >= 11 && calculatedAge <= 15) {
                setData('group', 'C');
            } else {
                setData('group', '-');
            }
        }
    }, [data.birth_date]);

    const submit = (e) => {
        e.preventDefault();
        if (child) {
            post(route('admin.profile.update', child.id), {
                forceFormData: true,
                onSuccess: () => {
                    router.visit(route('admin.profile.index'), {
                        preserveScroll: true,
                    });
                },
            });
        } else {
            post(route('admin.profile.store'), {
                forceFormData: true,
                onSuccess: () => {
                    router.visit(route('admin.profile.index'), {
                        preserveScroll: true,
                    });
                },
            });
        }
    };

    return (
        <AdminLayout auth={auth}>
            <div className="min-h-screen bg-[#720107] py-10 px-4 md:px-0">
                <Head title={child ? "Edit Profile Anak" : "Tambah Profile Anak"} />
                
                <div className="max-w-6xl mx-auto">
                    
                    <div className="bg-[#FEFBF5] rounded-[3.5rem] overflow-hidden p-8 md:p-14 flex flex-col md:flex-row gap-12 border border-gray-100">
                        <div className="w-full md:w-1/3 flex flex-col">
                            <div 
                                className="w-full aspect-[3/4] bg-[#D1D5DB] rounded-[3rem] border-4 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 mb-8 relative overflow-hidden group cursor-pointer hover:bg-gray-400 hover:brightness-90 transition-all"
                                style={photoPreview ? {
                                    backgroundImage: `url(${photoPreview})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderStyle: 'solid'
                                } : {}}
                            >
                                {!photoPreview && (
                                    <>
                                        <span className="italic font-bold text-lg">Masukkan Foto</span>
                                        <p className="text-xs mt-2 opacity-60">Click atau drag foto di sini</p>
                                    </>
                                )}
                                {photoPreview && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-sm">Ubah Foto</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handlePhotoChange}
                                />
                            </div>

                            <button 
                                onClick={submit}
                                disabled={processing}
                                className="w-full py-5 bg-[#F8C8C8] text-[#720107] font-black text-xl rounded-[2rem] shadow-lg hover:bg-[#f2b3b3] transition-all active:scale-95 uppercase tracking-tighter disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : child ? 'Update' : 'Simpan'}
                            </button>
                        </div>

                        {/* Sisi Kanan: Form Fields */}
                        <div className="flex-1 space-y-8">
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Umum</h3>
                                <div className="space-y-3">
                                    <FormField 
                                        label="Nama :" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name}
                                    />
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center gap-4">
                                                <label className="text-[#486284] font-bold text-xs w-28 md:w-40">Tempat, Tanggal Lahir :</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Tempat" 
                                                    className={`flex-1 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-sm focus:ring-2 focus:ring-[#566E91] ${errors.pob ? 'ring-2 ring-red-500' : ''}`} 
                                                    value={data.pob} 
                                                    onChange={e => setData('pob', e.target.value)}
                                                />
                                                <input 
                                                    type="date" 
                                                    className={`flex-1 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-sm focus:ring-2 focus:ring-[#566E91] ${errors.birth_date ? 'ring-2 ring-red-500' : ''}`} 
                                                    value={data.birth_date} 
                                                    onChange={e => setData('birth_date', e.target.value)}
                                                />
                                            </div>
                                            {(errors.pob || errors.birth_date) && <span className="text-red-500 text-xs mt-1 ml-32 md:ml-44">{errors.pob || errors.birth_date}</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-4">
                                            <label className="text-[#486284] font-bold text-xs w-28 md:w-40">Umur :</label>
                                            <input 
                                                type="number" 
                                                className={`w-20 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-center font-bold text-[#486284] focus:ring-2 focus:ring-[#566E91] ${errors.age ? 'ring-2 ring-red-500' : ''}`} 
                                                value={data.age} 
                                                onChange={e => setData('age', e.target.value)}
                                            />
                                            <span className="text-xs font-bold text-[#486284]">Tahun</span>
                                        </div>
                                        {errors.age && <span className="text-red-500 text-xs mt-1 ml-32 md:ml-44">{errors.age}</span>}
                                    </div>
                                    <FormField 
                                        label="Alamat :" 
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)}
                                        error={errors.address}
                                    />
                                </div>
                            </section>

                            {/* Data Orang Tua */}
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Orang Tua</h3>
                                <div className="space-y-3">
                                    <FormField 
                                        label="Nama Ibu :" 
                                        value={data.mother_name} 
                                        onChange={e => setData('mother_name', e.target.value)}
                                        error={errors.mother_name}
                                    />
                                    <FormField 
                                        label="Nama Ayah :" 
                                        value={data.father_name} 
                                        onChange={e => setData('father_name', e.target.value)}
                                        error={errors.father_name}
                                    />
                                    <FormField 
                                        label="Nomor Kontak :" 
                                        value={data.contact_number} 
                                        onChange={e => setData('contact_number', e.target.value)}
                                        error={errors.contact_number}
                                    />
                                </div>
                            </section>

                            {/* Data Pendidikan */}
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Pendidikan</h3>
                                <div className="space-y-3">
                                    <FormField 
                                        label="Nama Sekolah :" 
                                        value={data.school_name} 
                                        onChange={e => setData('school_name', e.target.value)}
                                        error={errors.school_name}
                                    />
                                    <FormField 
                                        label="Alamat Sekolah :" 
                                        value={data.school_address} 
                                        onChange={e => setData('school_address', e.target.value)}
                                        error={errors.school_address}
                                    />
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center gap-4">
                                                <label className="text-[#486284] font-bold text-xs w-28 md:w-40">Kelas :</label>
                                                <input 
                                                    type="text" 
                                                    className={`flex-1 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-sm focus:ring-2 focus:ring-[#566E91] ${errors.class ? 'ring-2 ring-red-500' : ''}`} 
                                                    value={data.class} 
                                                    onChange={e => setData('class', e.target.value)}
                                                />
                                            </div>
                                            {errors.class && <span className="text-red-500 text-xs mt-1 ml-32 md:ml-44">{errors.class}</span>}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center gap-4">
                                                <label className="text-[#486284] font-bold text-xs w-16">NIPD :</label>
                                                <input 
                                                    type="text" 
                                                    className={`flex-1 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-sm focus:ring-2 focus:ring-[#566E91] ${errors.nipd ? 'ring-2 ring-red-500' : ''}`} 
                                                    value={data.nipd} 
                                                    onChange={e => setData('nipd', e.target.value)}
                                                />
                                            </div>
                                            {errors.nipd && <span className="text-red-500 text-xs mt-1 ml-20">{errors.nipd}</span>}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Bottom Section: Kelompok & Kehadiran */}
                    <div className="mt-10">
                        {/* Banner Kelompok - Menggunakan Biru Gelap agar Kontras dengan Krem */}
                        <div className="bg-[#566E91] rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-xl transition-all hover:shadow-2xl">
                            
                            {/* Sisi Kiri: Inisial Kelompok */}
                            <div className="flex items-center gap-10 mb-8 md:mb-0">
                                {/* Lingkaran Tanpa Stroke, Menggunakan Shadow untuk Kedalaman */}
                                <div className="w-32 h-32 bg-[#FEF3D1] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                    <span className="text-[#566E91] text-7xl font-black">{data.group || '-'}</span>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-[#FEF3D1] text-xs font-bold uppercase tracking-widest opacity-90">Kelompok Belajar:</p>
                                    <p className="text-white text-3xl font-black uppercase tracking-tighter">KATEGORI {data.group || '...'}</p>
                                    <div className="h-1 w-20 bg-[#F8C8C8] rounded-full mt-2"></div> {/* Aksen Garis Pink Lembut */}
                                </div>
                            </div>

                            {/* Sisi Kanan: Statistik Kehadiran */}
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 text-center md:text-right min-w-[250px]">
                                <div className="text-white space-y-2">
                                    <div className="flex justify-between items-center md:justify-end md:gap-4">
                                        <span className="text-xs font-bold uppercase opacity-80">Total Kehadiran ({stats?.year || '-'})</span>
                                        <span className="text-2xl font-black text-[#FEF3D1] leading-none">{stats?.total_hadir ?? '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center md:justify-end md:gap-4">
                                        <span className="text-xs font-bold uppercase opacity-80">Persentase Tahunan</span>
                                        <span className="text-2xl font-black text-[#FEF3D1] leading-none">{stats?.persentase !== undefined ? `${stats.persentase}%` : '-%'}</span>
                                    </div>
                                    <p className="text-[10px] italic opacity-60 mt-4 block border-t border-white/20 pt-2">
                                        *Terisi otomatis via presensi mingguan tahun berjalan
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}

// Sub-komponen untuk merapikan input
function FormField({ label, value, onChange, error, color = "text-[#486284]" }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4">
                <label className={`${color} font-bold text-xs w-28 md:w-40`}>{label}</label>
                <input 
                    type="text" 
                    className={`flex-1 bg-[#FDF1D6] border-none rounded-xl shadow-inner py-2 text-sm focus:ring-2 focus:ring-[#566E91] transition-all ${error ? 'ring-2 ring-red-500' : ''}`}
                    value={value} 
                    onChange={onChange} 
                />
            </div>
            {error && <span className="text-red-500 text-xs mt-1 ml-32">{error}</span>}
        </div>
    );
}