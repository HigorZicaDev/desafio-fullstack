<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

        protected $fillable = [
        'contract_id',
        'amount',
        'due_date',
        'status',
        'payment_method',
        'paid_at',
        'payment_data'
    ];

    protected $casts = [
        'due_date' => 'datetime:Y-m-d\TH:i:sP',
        'paid_at' => 'datetime:Y-m-d\TH:i:sP',
        'payment_data' => 'array',
        'amount' => 'float',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
