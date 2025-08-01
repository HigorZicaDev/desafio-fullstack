<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;

class ContractService
{
    public function createContract(User $user, Plan $plan): Contract
    {
        // Desativa contrato anterior se existir
        $this->deactivateActiveContract($user);

        $contract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'monthly_price' => $plan->price,
            'start_date' => Carbon::today(),
            'next_payment_date' => Carbon::today()->addMonth(),
            'is_active' => true,
            'remaining_credit' => 0
        ]);

        // Cria primeiro pagamento + 11 proximos meses
        $this->generateFuturePayments($contract, $plan->price);


        return $contract;
    }

    public function changeContract(User $user, Plan $newPlan): Contract
    {
        $activeContract = $this->getActiveContract($user);

        // Se já está no plano, impede repetição
        if ($activeContract && $activeContract->plan_id === $newPlan->id) {
            throw new \Exception('Você já está nesse plano.');
        }

        // Verifica se já trocou mais de 2 vezes este mês
        $today = Carbon::today();
        $currentMonth = $today->format('Y-m');

        if (
            $user->plan_change_last_date &&
            $user->plan_change_last_date->format('Y-m') === $currentMonth &&
            $user->plan_change_count >= 1
        ) {
            throw new \Exception('Limite de 2 trocas de plano por mês atingido.');
        }

        // Atualiza contador
        if (
            $user->plan_change_last_date &&
            $user->plan_change_last_date->format('Y-m') === $currentMonth
        ) {
            $user->plan_change_count += 1;
        } else {
            $user->plan_change_count = 1;
        }

        $user->plan_change_last_date = $today;
        $user->save();

        $remainingCredit = $activeContract?->calculateRemainingCredit() ?? 0;

        if ($activeContract) {
            $activeContract->update(['is_active' => false]);
        }

        $newContract = Contract::create([
            'user_id' => $user->id,
            'plan_id' => $newPlan->id,
            'monthly_price' => $newPlan->price,
            'start_date' => $today,
            'next_payment_date' => $today->copy()->addMonth(),
            'is_active' => true,
            'remaining_credit' => $remainingCredit,
        ]);

        // Cria as parcelas futuras com crédito aplicado
        $this->generateFuturePaymentsWithCredit($newContract, $newPlan->price, $remainingCredit);

        return $newContract;
    }


    public function getActiveContract(User $user): ?Contract
    {
        return Contract::where('user_id', $user->id)
            ->where('is_active', true)
            ->with(['plan', 'payments'])
            ->first();
    }


    private function deactivateActiveContract(User $user): void
    {
        Contract::where('user_id', $user->id)
            ->where('is_active', true)
            ->update(['is_active' => false]);
    }

    private function generateFuturePayments(Contract $contract, float $amount, int $months = 12): void
    {
        for ($i = 0; $i < $months; $i++) {
            Payment::create([
                'contract_id' => $contract->id,
                'amount' => $amount,
                'due_date' => Carbon::today()->addMonths($i),
                'status' => $i === 0 ? 'paid' : 'pending',
                'paid_at' => $i === 0 ? Carbon::now() : null
            ]);
        }
    }

    private function generateFuturePaymentsWithCredit(Contract $contract, float $amount, float $credit, int $months = 12): void
    {
        for ($i = 0; $i < $months; $i++) {
            if ($i === 0) {
                // Primeira parcela é sempre status 'paid' no momento da assinatura
                $paymentAmount = $amount;
                $status = 'paid';
                $paidAt = Carbon::now();
            } elseif ($i === 1) {
                // Aplicar o crédito na segunda parcela caso precisar
                $paymentAmount = max(0, $amount - $credit);
                if ($credit >= $amount) {
                    // Se o crédito cobre o valor inteiro → alterar o status como 'paid'
                    $status = 'paid';
                    $paidAt = Carbon::now();
                } else {
                    $status = 'pending';
                    $paidAt = null;
                }
            } else {
                $paymentAmount = $amount;
                $status = 'pending';
                $paidAt = null;
            }

            Payment::create([
                'contract_id' => $contract->id,
                'amount' => $paymentAmount,
                'due_date' => Carbon::today()->addMonths($i),
                'status' => $status,
                'paid_at' => $paidAt,
            ]);
        }
    }

}