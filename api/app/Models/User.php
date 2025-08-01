<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $casts = [
        'plan_change_last_date' => 'date',
    ];
}
