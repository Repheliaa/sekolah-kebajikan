<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Child;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_attendance_and_it_is_counted_for_child_profile(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $child = Child::create([
            'name' => 'Ayu Lestari',
            'pob' => 'Bandung',
            'birth_date' => '2018-05-10',
            'age' => 8,
            'address' => 'Jl. Contoh',
            'mother_name' => 'Ibu Ayu',
            'father_name' => 'Bapak Ayu',
            'contact_number' => '08123456789',
            'school_name' => 'Sekolah Segar',
            'school_address' => 'Jl. Sekolah',
            'class' => 'B',
            'nipd' => '001',
            'group' => 'A',
        ]);

        $response = $this->actingAs($admin)->post(route('presensi.store'), [
            'date' => '2026-07-05',
            'attendances' => [
                [
                    'child_id' => $child->id,
                    'is_present' => true,
                    'note' => 'Aktif belajar',
                ],
            ],
        ]);

        $response->assertRedirect(route('presensi', absolute: false));
        $this->assertDatabaseHas('attendances', [
            'child_id' => $child->id,
            'date' => '2026-07-05',
            'is_present' => true,
            'note' => 'Aktif belajar',
        ]);

        $this->assertSame(1, Attendance::where('child_id', $child->id)->where('is_present', true)->count());
    }
}
