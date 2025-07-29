<?php

namespace App\Services;

use App\Models\Payment;
use Carbon\Carbon;

class PaymentService
{
    public function confirmPayment(Payment $payment): bool
    {
        $payment->update([
            'status' => 'paid',
            'paid_at' => Carbon::now()
        ]);

        return true;
    }

}