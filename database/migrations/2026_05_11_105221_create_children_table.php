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
            $table->unsignedSmallInteger('id')->autoIncrement()->primary();
            
            // --- Data Umum ---
            $table->string('name', 100);
            $table->string('pob', 25)->nullable();        // Tempat Lahir
            $table->date('birth_date');               // Tanggal Lahir
            $table->unsignedTinyInteger('age');       // Umur (Maks 255)
            $table->string('address', 200)->nullable();      // Alamat Anak
            
            // --- Data Orang Tua ---
            $table->string('mother_name', 100)->nullable();
            $table->string('father_name', 100)->nullable();
            $table->string('contact_number', 15)->nullable(); // Nomor Kontak Orang Tua
            
            // --- Data Pendidikan ---
            $table->string('school_name', 50)->nullable();
            $table->string('school_address', 150)->nullable();
            $table->string('class', 5)->nullable();
            $table->string('nipd', 20)->nullable();
            $table->char('group', 1); // Kelompok A, B, atau C (Logika otomatis)
            
            // --- Media & Relasi ---
            $table->string('photo', 100)->nullable();
            $table->unsignedSmallInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
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
