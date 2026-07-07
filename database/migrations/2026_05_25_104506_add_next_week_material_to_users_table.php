<?php

use Illuminate\Database\Migrations\Migration;

// Migration ini tidak lagi diperlukan karena kolom next_week_material
// sudah dihapus. Digantikan sepenuhnya oleh tabel learning_materials.
return new class extends Migration
{
    public function up(): void {}
    public function down(): void {}
};
