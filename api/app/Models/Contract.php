<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'monthly_price',
        'start_date',
        'next_payment_date',
        'is_active',
        'remaining_credit'
    ];

    protected $casts = [
        'start_date' => 'date',
        'next_payment_date' => 'date',
        'is_active' => 'boolean',
        'monthly_price' => 'decimal:2',
        'remaining_credit' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function calculateUsedDays()
    {
        $startDate = Carbon::parse($this->start_date);
        $today = Carbon::today();
        return $startDate->diffInDays($today);
    }

    public function calculateRemainingCredit()
    {
        $today = Carbon::today();
        $startDate = Carbon::parse($this->start_date);
        $endOfBillingCycle = $startDate->copy()->addMonthNoOverflow();
        
        // Total de dias do ciclo
        $totalDays = $startDate->diffInDays($endOfBillingCycle);
        
        // Dias restantes até o fim do ciclo (incluindo hoje)
        $remainingDays = $today->lte($endOfBillingCycle)
            ? $today->diffInDays($endOfBillingCycle)
            : 0;

        if ($totalDays === 0 || $remainingDays === 0) {
            return 0;
        }

        $dailyRate = $this->monthly_price / $totalDays;
        $credit = round($dailyRate * $remainingDays, 2);

        return $credit;
    }

}
