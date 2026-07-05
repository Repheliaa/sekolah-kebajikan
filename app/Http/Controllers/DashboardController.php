<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\User;
use App\Models\LearningMaterial;
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

        $selectedDate = $request->query('date', Carbon::today()->toDateString());
        $selectedMonth = $request->query('month', Carbon::today()->format('Y-m'));
        $selectedYear = $request->query('year', Carbon::today()->year);

        $now = Carbon::now();
        if (preg_match('/^\d{4}-\d{2}$/', $selectedMonth)) {
            [$y, $m] = explode('-', $selectedMonth);
            $currentMonthName = Carbon::create((int)$y, (int)$m, 1)->translatedFormat('F Y');
            $start = Carbon::create((int)$y, (int)$m, 1)->startOfMonth();
        } else {
            $currentMonthName = $now->translatedFormat('F Y');
            $start = $now->copy()->startOfMonth();
        }
        $end = $start->copy()->endOfMonth();

        $yearStart = Carbon::create((int)$selectedYear, 1, 1)->startOfYear();
        $yearEnd = Carbon::create((int)$selectedYear, 12, 31)->endOfYear();

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

        $admin = User::where('role', 'admin')->first();

        $selectedDateStats = [
            'hadir' => Attendance::whereDate('date', $selectedDate)->where('is_present', true)->count(),
            'absen' => Attendance::whereDate('date', $selectedDate)->where('is_present', false)->count(),
        ];

        $selectedMonthStats = [
            'hadir' => Attendance::whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', true)->count(),
            'absen' => Attendance::whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', false)->count(),
        ];

        $selectedYearStats = [
            'hadir' => Attendance::whereBetween('date', [$yearStart->toDateString(), $yearEnd->toDateString()])->where('is_present', true)->count(),
            'absen' => Attendance::whereBetween('date', [$yearStart->toDateString(), $yearEnd->toDateString()])->where('is_present', false)->count(),
        ];

        $stats = [
            'total_anak'         => Child::count(),
            'kelompok_a'         => Child::where('group', 'A')->count(),
            'kelompok_b'         => Child::where('group', 'B')->count(),
            'kelompok_c'         => Child::where('group', 'C')->count(),
            'hadir_hari_ini'     => $selectedDateStats['hadir'],
            'tidak_hadir'        => $selectedDateStats['absen'],
            'next_week_material' => $admin->next_week_material ?? 'Belum ada materi pembelajaran yang di-publish.',
        ];

        $topChildren = Child::select('id', 'name', 'group')->get()->map(function ($child) use ($yearStart, $yearEnd) {
            $hadir = Attendance::where('child_id', $child->id)
                ->whereBetween('date', [$yearStart->toDateString(), $yearEnd->toDateString()])
                ->where('is_present', true)
                ->count();

            return [
                'id' => $child->id,
                'name' => $child->name,
                'group' => $child->group,
                'hadir' => $hadir,
            ];
        })->sortByDesc('hadir')->take(3)->values();

        $yearlyChartData = [];
        for ($monthIndex = 1; $monthIndex <= 12; $monthIndex++) {
            $monthStart = Carbon::create((int)$selectedYear, $monthIndex, 1)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();
            $hadir = Attendance::whereBetween('date', [$monthStart->toDateString(), $monthEnd->toDateString()])->where('is_present', true)->count();
            $absen = Attendance::whereBetween('date', [$monthStart->toDateString(), $monthEnd->toDateString()])->where('is_present', false)->count();

            $yearlyChartData[] = [
                'name' => $monthStart->translatedFormat('M'),
                'Hadir' => $hadir,
                'Absen' => $absen,
            ];
        }

        $reportData = Child::orderBy('name')->get()->map(function($child) use ($start, $end) {
            return [
                'name' => $child->name,
                'group' => $child->group,
                'hadir' => Attendance::where('child_id', $child->id)->whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', true)->count(),
                'absen' => Attendance::where('child_id', $child->id)->whereBetween('date', [$start->toDateString(), $end->toDateString()])->where('is_present', false)->count(),
            ];
        });
        $sundayDates = array_map(function($d) { return $d->toDateString(); }, $sundays);
        $learningMaterials = LearningMaterial::whereIn('date', $sundayDates)->get()->keyBy('date');

        return Inertia::render('Dashboard', [
            'stats'               => $stats,
            'selectedDate'        => $selectedDate,
            'selectedMonth'       => $selectedMonth,
            'selectedYear'        => $selectedYear,
            'currentMonthName'    => $currentMonthName,
            'monthlyChartData'    => $monthlyChartData,
            'yearlyChartData'     => $yearlyChartData,
            'reportData'          => $reportData,
            'selectedDateStats'   => $selectedDateStats,
            'selectedMonthStats'  => $selectedMonthStats,
            'selectedYearStats'   => $selectedYearStats,
            'topChildren'         => $topChildren,
            'learningMaterials'   => $learningMaterials,
            'sundays'             => $sundayDates,
        ]);
    }

    public function updateMaterial(Request $request)
    {
        $request->validate([
            'materials' => 'required|array',
            'materials.*.date' => 'required|date',
            'materials.*.content' => 'nullable|string|max:1000',
        ]);

        foreach ($request->materials as $mat) {
            LearningMaterial::updateOrCreate(
                ['date' => $mat['date']],
                ['content' => $mat['content']]
            );
        }
            
        return back()->with('success', 'Materi pembelajaran berhasil dipublikasikan!');
    }
}