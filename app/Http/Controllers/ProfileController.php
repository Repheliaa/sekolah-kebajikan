<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // Tampilan Katalog Anak untuk Admin
    public function adminIndex()
    {
        return Inertia::render('Profile/AdminIndex', [
            'children' => Child::orderBy('name')->get(['id', 'name', 'age', 'photo'])
        ]);
    }

    // Tampilan Katalog Anak untuk User Biasa (Orang Tua)
    public function userIndex()
    {
        return Inertia::render('Profile/Index', [
            'students' => Child::orderBy('name')->get(['id', 'name', 'age', 'photo'])
        ]);
    }

    // Membuka Form Tambah Anak Baru
    public function create()
    {
        return Inertia::render('Profile/Form', ['child' => null]);
    }

    // Memproses Penyimpanan Data Form ke Database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pob' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|integer',
            'address' => 'required|string',
            'mother_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'school_name' => 'required|string|max:255',
            'school_address' => 'required|string',
            'class' => 'required|string|max:50',
            'nipd' => 'required|string|max:50',
            'group' => 'required|string|max:5',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('public/photos');
            $validated['photo'] = Storage::url($path);
        }

        Child::create($validated);

        return redirect()->route('admin.profile.index')->with('success', 'Profil anak berhasil disimpan!');
    }

    // Membuka Form Edit Data Lama (Admin)
    public function edit($id)
    {
        $child = Child::findOrFail($id);
        return Inertia::render('Profile/Form', ['child' => $child]);
    }

    // Memproses Update Data Anak (Admin)
    public function updateChild(Request $request, $id)
    {
        $child = Child::findOrFail($id);
        
        // Catatan: Gunakan metode POST dengan header _method=PUT jika mengirim berkas biner/file foto
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pob' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|integer',
            'address' => 'required|string',
            'mother_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'school_name' => 'required|string|max:255',
            'school_address' => 'required|string',
            'class' => 'required|string|max:50',
            'nipd' => 'required|string|max:50',
            'group' => 'required|string|max:5',
        ]);

        if ($request->hasFile('photo')) {
            if ($child->photo) {
                Storage::delete(str_replace('/storage/', 'public/', $child->photo));
            }
            $path = $request->file('photo')->store('public/photos');
            $validated['photo'] = Storage::url($path);
        }

        $child->update($validated);

        return redirect()->route('admin.profile.index')->with('success', 'Profil anak berhasil diperbarui!');
    }

    public function userShow($id)
    {
        $child = Child::findOrFail($id);

        // Kalkulasi otomatis statistik kehadiran anak untuk ditampilkan di banner bawah
        $totalHadir = Attendance::where('child_id', $id)->where('is_present', true)->count();
        $totalPertemuan = Attendance::where('child_id', $id)->count();
        $persentase = $totalPertemuan > 0 ? round(($totalHadir / $totalPertemuan) * 100) . '%' : '0%';

        return Inertia::render('Profile/UserShow', [
            'child' => $child,
            'stats' => [
                'total_hadir' => $totalHadir,
                'persentase' => $persentase
            ]
        ]);
    }

    public function destroy($id)
    {
        $child = Child::findOrFail($id);

        // Hapus file foto dari storage jika ada
        if ($child->photo) {
            Storage::delete(str_replace('/storage/', 'public/', $child->photo));
        }

        // Hapus data presensi terkait
        Attendance::where('child_id', $id)->delete();

        // Hapus data anak
        $child->delete();

        return redirect()->route('admin.profile.index')->with('success', 'Profil anak berhasil dihapus!');
    }
}