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
            $user->plan_change_count >= 2
        ) {
            throw new \Exception('Limite de 2 trocas de plano por mês atingido.');
        }

        // Atualiza contador table users para controle de trocas de plano de assinatura
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

        // Créditos restantes do plano anterior
        $remainingCredit = $activeContract?->calculateRemainingCredit() ?? 0;

        // Desativa o contrato atual, se existir
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

        // Cria os pagamentos com crédito aplicado
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
                'status' => 'pending'
            ]);
        }
    }

    private function generateFuturePaymentsWithCredit(Contract $contract, float $amount, float $credit, int $months = 12): void
    {
        for ($i = 0; $i < $months; $i++) {
            $paymentAmount = $i === 0
                ? max(0, $amount - $credit) // Primeiro com desconto
                : $amount;

            Payment::create([
                'contract_id' => $contract->id,
                'amount' => $paymentAmount,
                'due_date' => Carbon::today()->addMonths($i),
                'status' => 'pending'
            ]);
        }
    }


}