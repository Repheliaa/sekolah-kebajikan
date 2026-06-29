<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Child;
use App\Models\Attendance;

// ==================== 1. HALAMAN UMUM / GUEST ====================
Route::get('/', function (Illuminate\Http\Request $request) {
    // Ambil materi dari admin user
    $admin = \App\Models\User::where('role', 'admin')->first();
    $material = ($admin && $admin->next_week_material) ? $admin->next_week_material : 'Belum ada fokus pembelajaran minggu ini.';

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'nextWeekMaterial' => $material, 
        'auth' => [
            'user' => $request->user(),
        ],
    ]);
});

// ==================== 2. GRUP ROUTE TERAUTENTIKASI (PENGGUNA LOGIN) ====================
Route::middleware(['auth'])->group(function () {
    
    // Rute default setelah login (Admin Dashboard)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/update-material', [DashboardController::class, 'updateMaterial'])->name('dashboard.update-material');

    // ------------------ FITUR PRESENSI MINGGUAN ------------------
    Route::get('/presensi', function (Request $request) {
        $students = Child::all(['id', 'name']);
        
        // Tangkap parameter tanggal dari frontend, default ke hari ini jika kosong
        $dateParam = $request->query('date', date('Y-m-d'));

        // JIKA LOGIN SEBAGAI ADMIN: Ambil riwayat presensi yang cocok dengan tanggal terpilih
        if ($request->user()->role === 'admin') {
            $existingAttendances = Attendance::where('date', $dateParam)->get(['child_id', 'is_present', 'note']);

            return Inertia::render('Presence', [
                'students' => $students,
                'selectedDate' => $dateParam,
                'existingAttendances' => $existingAttendances // <--- KIRIM DATA LAMA KE FRONTEND
            ]);
        }

        // JIKA LOGIN SEBAGAI USER/ORTU
        return Inertia::render('UserPresence', [
            'students' => $students,
            'historyAttendances' => Attendance::all(), 
        ]);
    })->name('presensi');

    // Proses Simpan Absensi (Hanya boleh diakses oleh Admin)
    Route::post('/presensi', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Hanya admin yang dapat menyimpan data presensi.');
        }

        $request->validate([
            'date' => ['required', 'date'],
            'attendances' => ['required', 'array'],
            'attendances.*.child_id' => ['required', 'integer', 'exists:children,id'],
            'attendances.*.is_present' => ['required', 'boolean'],
            'attendances.*.note' => ['nullable', 'string'],
        ]);

        foreach ($request->attendances as $att) {
            Attendance::updateOrCreate(
                [
                    'date' => $request->date,
                    'child_id' => $att['child_id'],
                ],
                [
                    'is_present' => $att['is_present'],
                    'note' => $att['note'],
                ]
            );
        }

        return redirect()->route('presensi')->with('success', 'Data presensi berhasil disimpan.');
    })->name('presensi.store');


    // ------------------ FITUR MANAJEMEN PROFIL ANAK ------------------
    
    // RUTE KHUSUS ADMIN (Kelola, Edit, Tambah, Hapus Profil Anak)
    Route::prefix('admin')->name('admin.')->group(function () {
        // Mengarah ke katalog anak versi admin
        Route::get('/profile', [ProfileController::class, 'adminIndex'])->name('profile.index');
        
        // Mengarah ke form tambah data anak
        Route::get('/profile/create', [ProfileController::class, 'create'])->name('profile.create');
        Route::post('/profile', [ProfileController::class, 'store'])->name('profile.store');
        
        // Mengarah ke form edit & update data anak
        Route::get('/profile/{id}/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile/{id}', [ProfileController::class, 'updateChild'])->name('profile.update');
        
        // Mengarah ke fungsi hapus data anak
        Route::delete('/profile/{id}', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // RUTE KHUSUS USER / ORANG TUA (Melihat List Profil Anak - Read Only)
    // Tampilan katalog semua anak untuk Orang Tua
    Route::get('/profile', [ProfileController::class, 'userIndex'])->name('profile');
    
    // Tampilan detail informasi lengkap per anak bersifat Read-Only untuk Orang Tua
    Route::get('/profile/{id}', [ProfileController::class, 'userShow'])->name('profile.show');

});

require __DIR__.'/auth.php';