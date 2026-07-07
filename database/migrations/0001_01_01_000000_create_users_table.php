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
    Schema::create('users', function (Blueprint $table) {
        $table->unsignedSmallInteger('id')->autoIncrement()->primary();
        $table->string('name', 100); // Nama Lengkap
        $table->string('username', 25)->unique(); // Untuk Login sesuai desain
        $table->string('password', 60);
        $table->enum('role', ['admin', 'user'])->default('user'); // Menggunakan Enum lebih aman dan cepat
        $table->rememberToken();
        $table->timestamps(); // Mencatat created_at & updated_at secara otomatis
    });


    // Opsional: Aktifkan jika kamu mengatur SESSION_DRIVER=database di .env
    Schema::create('sessions', function (Blueprint $table) {
        $table->string('id')->primary();
        $table->unsignedSmallInteger('user_id')->nullable()->index();
        $table->string('ip_address', 45)->nullable();
        $table->text('user_agent')->nullable();
        $table->longText('payload');
        $table->integer('last_activity')->index();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('sessions');
    }
};
