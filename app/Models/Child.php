<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $fillable = [
        'name', 'pob', 'birth_date', 'age', 'address',
        'mother_name', 'father_name', 'contact_number',
        'school_name', 'school_address', 'class', 'nipd', 'group',
        'photo', 'user_id'
    ];
}
