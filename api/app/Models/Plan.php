<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $casts = [
        'price' => 'float',
        'numberOfClients' => 'integer',
        'gigabytesStorage' => 'integer',
        'active' => 'boolean',
    ];
}
