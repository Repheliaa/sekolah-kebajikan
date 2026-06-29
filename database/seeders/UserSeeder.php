<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Pengajar Segar',
            'username' => 'adminsegar',
            'password' => bcrypt('rahasia123'), // Menggunakan Hash::make lebih disarankan di Laravel terbaru
            'role' => 'admin',
        ]);

        // 2. Akun Dummy User (Orang Tua) - Tambahkan di sini
        \App\Models\User::create([
            'name' => 'Budi Santoso',
            'username' => 'budi123',
            'password' => bcrypt('user123'),
            'role' => 'user',
        ]);

        \App\Models\User::create([
            'name' => 'Siti Aminah',
            'username' => 'sitiaminah',
            'password' => bcrypt('user123'),
            'role' => 'user',
        ]);
    }
}
