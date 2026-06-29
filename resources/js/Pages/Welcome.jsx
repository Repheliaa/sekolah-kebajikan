import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import gaya Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

// MENERIMA PROPS 'auth' DARI LARAVEL DAN 'nextWeekMaterial' DARI DASHBOARD CONTROLLER
export default function Welcome({ auth, nextWeekMaterial }) {
    
    // Cek apakah ada user yang sedang terautentikasi (sudah login)
    const isLoggedIn = auth && auth.user;

    return (
        <>
            <Head title="Beranda - SEGAR" />
            
            {/* Navigasi */}
            <Navbar auth={auth} />

            {/* --- SECTION HERO --- */}
            <section className="bg-[#FEF3D1] pt-12 pb-16 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-[#7A0000] leading-tight max-w-4xl mx-auto">
                    SEKOLAH KEBAJIKAN<br />
                    MAKIN SEMANGAT GENTA ROHANI<br />
                    "SEGAR"
                </h1>
                <p className="mt-6 text-[#566E91] font-bold text-lg">
                    Sistem Informasi Pemantauan Perkembangan Anak
                </p>
            </section>

            {isLoggedIn && (
            <section className="bg-[#FEF3D1] w-full pb-12 px-6 animate-fade-in">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-[#FEFBF5] border-2 border-[#566E91] p-6 md:p-8 rounded-[2.5rem] shadow-xl text-center">
                            <span className="bg-[#566E91] text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                                Fokus Belajar Hari Minggu Besok
                            </span>
                            <p className="mt-6 text-[#486284] text-lg md:text-xl font-black italic leading-relaxed px-2">
                                "{nextWeekMaterial || 'Belum ada fokus pembelajaran minggu ini.'}"
                            </p>
                            <div className="mt-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                📌 Dipublikasikan oleh Pengajar Genta Rohani
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION QUOTE --- */}
            <section className="w-full bg-[#FEF3D1]">
                
                {/* 1. Gambar Gelombang Atas */}
                <div className="w-full leading-[0]">
                    <img 
                        src="/images/wave-top.svg" 
                        className="w-full h-auto" 
                        alt="" 
                    />
                </div>

                {/* 2. Area Teks dengan Background Pink Solid */}
                <div className="bg-[#F7CBCA] w-full py-8 md:py-12">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <p className="text-[#486284] text-lg md:text-2xl font-bold italic leading-relaxed">
                            "Nabi bersabda, 'Belajar dan selalu dilatih tidakkah itu menyenangkan?'"
                        </p>
                        <p className="mt-4 text-[#486284] text-base md:text-lg font-bold">
                            Lun Yu (Sabda Suci) I : 1
                        </p>
                    </div>
                </div>

                {/* 3. Gambar Gelombang Bawah */}
                <div className="w-full bg-[#7A0000] leading-[0]">
                    <img 
                        src="/images/wave-bottom.svg" 
                        className="w-full h-auto" 
                        alt="" 
                    />
                </div>

            </section>

            {/* Gallery Section */}
            <section className="bg-[#7A0000] py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-[#FDF1D7] text-3xl font-black text-center mb-10 uppercase tracking-widest">
                        Galeri Kegiatan
                    </h2>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12"
                    >
                        {/* Slide 1 */}
                        <SwiperSlide>
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                                <img src="/images/image1.jpg" className="w-full h-full object-cover rounded-xl" alt="Foto 1" />
                            </div>
                        </SwiperSlide>

                        {/* Slide 2 */}
                        <SwiperSlide>
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                                <img src="/images/image2.jpg" className="w-full h-full object-cover rounded-xl" alt="Foto 2" />
                            </div>
                        </SwiperSlide>

                        {/* Slide 3 */}
                        <SwiperSlide>
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                                <img src="/images/image3.jpg" className="w-full h-full object-cover rounded-xl" alt="Foto 3" />
                            </div>
                        </SwiperSlide>

                        {/* Slide 4 */}
                        <SwiperSlide>
                            <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                                <img src="/images/image4.jpg" className="w-full h-full object-cover rounded-xl" alt="Foto 4" />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>
        </>
    );
}