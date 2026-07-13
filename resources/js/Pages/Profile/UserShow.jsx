import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserShow({ auth, child, stats }) {
    return (
        <AppLayout auth={auth}>
            <div className="min-h-screen bg-[#720107] py-10 px-4 md:px-0">
                <Head title={`Profil ${child.name}`} />
                
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#FEFBF5] rounded-[3.5rem] p-8 md:p-14 flex flex-col md:flex-row gap-12 border border-gray-100">
                        
                        <div className="w-full md:w-1/3 flex flex-col">
                            <div className="w-full aspect-[3/4] bg-gray-200 rounded-[3rem] border-4 border-[#566E91] overflow-hidden shadow-md mb-8">
                                <img 
                                    src={child.photo || "/images/default-child.jpg"} 
                                    className="w-full h-full object-cover" 
                                    alt="Foto Profil" 
                                />
                            </div>
                            <Link 
                                href="/profile"
                                className="w-full py-4 bg-[#566E91] text-white text-center font-black text-sm rounded-[2rem] shadow-lg hover:bg-[#486284] transition-all uppercase tracking-wider"
                            >
                                ← Kembali
                            </Link>
                        </div>

                        <div className="flex-1 space-y-8">
                            {/* Data Umum */}
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Umum</h3>
                                <div className="space-y-4 border-l-2 border-dashed border-gray-200 pl-4">
                                    <p className="text-sm font-bold text-[#486284]">Nama: <span className="text-gray-700 font-semibold ml-2">{child.name}</span></p>
                                    <p className="text-sm font-bold text-[#486484]">Tempat, Tanggal Lahir: <span className="text-gray-700 font-semibold ml-2">{child.pob}, {child.birth_date}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Umur: <span className="text-gray-700 font-semibold ml-2">{child.age} Tahun</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Alamat: <span className="text-gray-700 font-semibold ml-2">{child.address}</span></p>
                                </div>
                            </section>

                            {/* Data Orang Tua */}
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Orang Tua</h3>
                                <div className="space-y-4 border-l-2 border-dashed border-gray-200 pl-4">
                                    <p className="text-sm font-bold text-[#486284]">Nama Ibu: <span className="text-gray-700 font-semibold ml-2">{child.mother_name}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Nama Ayah: <span className="text-gray-700 font-semibold ml-2">{child.father_name}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Nomor Kontak: <span className="text-gray-700 font-semibold ml-2">{child.contact_number}</span></p>
                                </div>
                            </section>

                            {/* Data Pendidikan */}
                            <section>
                                <h3 className="text-[#720107] font-black text-sm uppercase mb-4 tracking-widest">Data Pendidikan</h3>
                                <div className="space-y-4 border-l-2 border-dashed border-gray-200 pl-4">
                                    <p className="text-sm font-bold text-[#486284]">Nama Sekolah: <span className="text-gray-700 font-semibold ml-2">{child.school_name}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Alamat Sekolah: <span className="text-gray-700 font-semibold ml-2">{child.school_address}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">Kelas: <span className="text-gray-700 font-semibold ml-2">{child.class}</span></p>
                                    <p className="text-sm font-bold text-[#486284]">NIPD: <span className="text-gray-700 font-semibold ml-2">{child.nipd}</span></p>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Bottom Section: Banner Kelompok Belajar & Dinamis Real-Time Statistik */}
                    <div className="mt-10">
                        <div className="bg-[#566E91] rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-xl">
                            
                            <div className="flex items-center gap-10 mb-8 md:mb-0">
                                <div className="w-32 h-32 bg-[#FEF3D1] rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-[#566E91] text-7xl font-black">{child.group || '-'}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[#FEF3D1] text-xs font-bold uppercase tracking-widest opacity-90">Kelompok Belajar:</p>
                                    <p className="text-white text-3xl font-black uppercase tracking-tighter">KATEGORI {child.group || '...'}</p>
                                    <div className="h-1 w-20 bg-[#F8C8C8] rounded-full mt-2"></div>
                                </div>
                            </div>

                            {/* DATA STATISTIK TERHUBUNG LANGSUNG DARI DB ATTENDANCES */}
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 text-center md:text-right min-w-[250px]">
                                <div className="text-white space-y-2">
                                    <div className="flex justify-between items-center md:justify-end md:gap-4">
                                        <span className="text-xs font-bold uppercase opacity-80">Total Kehadiran ({stats.year})</span>
                                        <span className="text-2xl font-black text-[#FEF3D1] leading-none">{stats.total_hadir} Kali</span>
                                    </div>
                                    <div className="flex justify-between items-center md:justify-end md:gap-4">
                                        <span className="text-xs font-bold uppercase opacity-80">Persentase Tahunan</span>
                                        <span className="text-2xl font-black text-[#FEF3D1] leading-none">{stats.persentase}</span>
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
        </AppLayout>
    );
}