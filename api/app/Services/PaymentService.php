<?php

namespace App\Services;

use App\Models\Payment;
use Carbon\Carbon;

class PaymentService
{
    public function simulatePixPayment(Payment $payment): array
    {
        $pixCode = $this->generatePixCode();
        
        $paymentData = [
            'pix_code' => $pixCode,
            'qr_code_url' => "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($pixCode),
            'expires_at' => Carbon::now()->addMinutes(30)->toISOString()
        ];

        $payment->update([
            'payment_method' => 'pix',
            'payment_data' => $paymentData
        ]);

        return $paymentData;
    }

    public function confirmPayment(Payment $payment): bool
    {
        $payment->update([
            'status' => 'paid',
            'paid_at' => Carbon::now()
        ]);

        return true;
    }

    private function generatePixCode(): string
    {
        return 'PIX' . strtoupper(uniqid()) . rand(1000, 9999);
    }
}