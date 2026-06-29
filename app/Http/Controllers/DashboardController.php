<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return redirect('/');
        }

        // 1. Ambil filter tanggal dari request (default hari ini)
        $selectedDate = $request->query('date', Carbon::today()->toDateString());
        
        // 2. Mengambil nama bulan sekarang untuk keterangan grafik
        $monthParam = $request->query('month');
        $now = Carbon::now();
        if ($monthParam && preg_match('/^\d{4}-\d{2}$/', $monthParam)) {
            [$y, $m] = explode('-', $monthParam);
            $currentMonthName = Carbon::create((int)$y, (int)$m, 1)->translatedFormat('F Y');
            $start = Carbon::create((int)$y, (int)$m, 1)->startOfMonth();
        } else {
            $currentMonthName = $now->translatedFormat('F Y'); // Contoh: "Mei 2026"
            $start = $now->copy()->startOfMonth();
        }
        $end = $start->copy()->endOfMonth();

        // 3. Logika hari Minggu dinamis untuk grafik
        $sundays = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            if ($cursor->isSunday()) {
                $sundays[] = $cursor->copy();
            }
            $cursor->addDay();
        }

        $monthlyChartData = [];
        foreach ($sundays as $i => $d) {
            $hadirCount = Attendance::whereDate('date', $d->toDateString())->where('is_present', true)->count();
            $absenCount = Attendance::whereDate('date', $d->toDateString())->where('is_present', false)->count();
            
            $monthlyChartData[] = [
                'name'  => 'Minggu ' . ($i + 1) . ' (' . $d->format('d/m') . ')',
                'Hadir' => $hadirCount,
                'Absen' => $absenCount
            ];
        }

        // 4. Ambil Fokus Pembelajaran Admin
        $admin = User::where('role', 'admin')->first();

        // 5. Statistik ringkas (Hadir & Absen disesuaikan dengan $selectedDate)
        $stats = [
            'total_anak'         => Child::count(),
            'kelompok_a'         => Child::where('group', 'A')->count(),
            'kelompok_b'         => Child::where('group', 'B')->count(),
            'kelompok_c'         => Child::where('group', 'C')->count(),
            'hadir_hari_ini'     => Attendance::whereDate('date', $selectedDate)->where('is_present', true)->count(),
            'tidak_hadir'        => Attendance::whereDate('date', $selectedDate)->where('is_present', false)->count(),
            'next_week_material' => $admin->next_week_material ?? 'Belum ada materi pembelajaran yang di-publish.',
        ];

        // 6. Data Rekapitulasi untuk Fitur Cetak Laporan
        $reportData = Child::orderBy('name')->get()->map(function($child) use ($start, $end) {
            return [
                'name' => $child->name,
                'group' => $child->group,
                'hadir' => Attendance::where('child_id', $child->id)->whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', true)->count(),
                'absen' => Attendance::where('child_id', $child->id)->whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', false)->count(),
            ];
        });

        return Inertia::render('Dashboard', [
            'stats'            => $stats,
            'selectedDate'     => $selectedDate,
            'currentMonthName' => $currentMonthName,
            'monthlyChartData' => $monthlyChartData,
            'reportData'       => $reportData,
        ]);
    }

    public function updateMaterial(Request $request)
    {
        $request->validate([
            'next_week_material' => 'required|string|max:1000',
        ]);

        // Selalu cari user dengan role 'admin'
        $admin = User::where('role', 'admin')->first();

        if ($admin) {
            $admin->update([
                'next_week_material' => $request->next_week_material
            ]);
            
            return back()->with('success', 'Materi minggu depan berhasil dipublikasikan!');
        }

        return back()->withErrors(['error' => 'Gagal menemukan akun pengajar.']);
    }
}