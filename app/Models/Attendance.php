<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'child_id',
        'is_present',
        'note'
    ];

    // Hubungan relasi balik ke data anak
    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}