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

    public function getAllPendingPayment()
    {
        $user = auth()->user() ?? User::first();
        
        $payments = Payment::whereHas('contract', function($query) use ($user) {
            $query->where('user_id', $user->id)->where('is_active', true);
        })
        ->get();

        return response()->json($payments);
    }
}