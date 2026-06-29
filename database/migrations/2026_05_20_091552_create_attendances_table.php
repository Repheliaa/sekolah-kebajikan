<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->date('date'); // Tanggal hari Minggu pelaksanaan presensi
            
            // Relasi ke tabel anak (sesuaikanconstrained ke 'children' sesuai model Child kamu)
            $table->foreignId('child_id')->constrained('children')->onDelete('cascade'); 
            
            $table->boolean('is_present')->default(true); // True = Hadir, False = Absen
            $table->string('note')->nullable(); // Catatan capaian atau alasan absen (sakit/izin)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
