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
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            
            // --- Data Umum ---
            $table->string('name');
            $table->string('pob')->nullable();        // Tempat Lahir
            $table->date('birth_date');               // Tanggal Lahir
            $table->integer('age');                   // Umur
            $table->text('address')->nullable();      // Alamat Anak
            
            // --- Data Orang Tua ---
            $table->string('mother_name')->nullable();
            $table->string('father_name')->nullable();
            $table->string('contact_number')->nullable(); // Nomor Kontak Orang Tua
            
            // --- Data Pendidikan ---
            $table->string('school_name')->nullable();
            $table->text('school_address')->nullable();
            $table->string('class')->nullable();
            $table->string('nipd')->nullable();
            $table->string('group'); // Kelompok A, B, atau C (Logika otomatis)
            
            // --- Media & Relasi ---
            $table->string('photo')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            
            $table->timestamps();
        });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
