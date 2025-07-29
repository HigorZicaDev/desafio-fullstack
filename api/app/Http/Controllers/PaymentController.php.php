<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function generatePix(Payment $payment)
    {
        $pixData = $this->paymentService->simulatePixPayment($payment);

        return response()->json([
            'success' => true,
            'payment_data' => $pixData,
            'payment' => $payment->fresh()
        ]);
    }

    public function confirmPayment(Payment $payment)
    {
        $this->paymentService->confirmPayment($payment);

        // Recarrega o modelo para garantir que está atualizado
        $payment->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Pagamento confirmado com sucesso!',
            'payment' => $payment
        ]);
    }

    public function getPendingPayment()
    {
        $user = auth()->user() ?? User::first();
        
        $payment = Payment::whereHas('contract', function($query) use ($user) {
            $query->where('user_id', $user->id)->where('is_active', true);
        })
        ->where('status', 'pending')
        ->get();

        return response()->json($payment);
    }
}