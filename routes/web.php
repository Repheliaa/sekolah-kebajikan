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
        $students = Child::orderBy('name', 'asc')->get(['id', 'name', 'group']);

        // Ambil tanggal dari query. Jika tidak ada, gunakan hari ini.
        $dateParam = $request->query('date', date('Y-m-d'));

        // Ambil bulan dari query. Jika tidak ada, ambil dari tanggal terpilih.
        $monthParam = $request->query('month', substr($dateParam, 0, 7));

        // JIKA LOGIN SEBAGAI ADMIN
        if ($request->user()->role === 'admin') {
            $existingAttendances = Attendance::whereDate('date', $dateParam)
                ->get(['child_id', 'is_present', 'note']);

            return Inertia::render('Presence', [
                'students' => $students,
                'selectedDate' => $dateParam,
                'selectedMonth' => $monthParam,
                'existingAttendances' => $existingAttendances,
            ]);
        }

        // JIKA LOGIN SEBAGAI USER / ORANG TUA
        return Inertia::render('UserPresence', [
            'students' => $students,
            'historyAttendances' => Attendance::orderBy('date', 'desc')->get(),
        ]);
    })->name('presensi');

    Route::post('/presensi', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Hanya admin yang dapat menyimpan data presensi.');
        }

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'attendances' => ['required', 'array'],
            'attendances.*.child_id' => ['required', 'integer', 'exists:children,id'],
            'attendances.*.is_present' => ['required', 'boolean'],
            'attendances.*.note' => ['nullable', 'string'],
        ]);

        foreach ($validated['attendances'] as $attendance) {
            Attendance::updateOrCreate(
                [
                    'date' => $validated['date'],
                    'child_id' => $attendance['child_id'],
                ],
                [
                    'is_present' => $attendance['is_present'],
                    'note' => $attendance['note'] ?? null,
                ]
            );
        }

        return redirect()->route('presensi', [
            'date' => $validated['date'],
            'month' => substr($validated['date'], 0, 7),
        ])->with('success', 'Data presensi berhasil disimpan.');
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