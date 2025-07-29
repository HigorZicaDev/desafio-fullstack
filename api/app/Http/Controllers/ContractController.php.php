<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\User;
use App\Services\ContractService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    protected $contractService;

    public function __construct(ContractService $contractService)
    {
        $this->contractService = $contractService;
    }

    public function getActiveContract()
    {
        // Simulação de usuário logado
        $user = auth()->user() ?? User::first();
        $contract = $this->contractService->getActiveContract($user);

        return response()->json($contract);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);

        $user = auth()->user() ?? User::first();
        $plan = Plan::findOrFail($request->plan_id);

        $contract = $this->contractService->createContract($user, $plan);

        return response()->json([
            'success' => true,
            'contract' => $contract->load(['plan', 'payments']),
            'message' => 'Plano contratado com sucesso!'
        ]);
    }

    public function changePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);

        $user = auth()->user() ?? User::first();
        $newPlan = Plan::findOrFail($request->plan_id);

        $currentContract = $this->contractService->getActiveContract($user);

        // Não permite troca para o mesmo plano
        if ($currentContract && $currentContract->plan_id === $newPlan->id) {
            return response()->json([
                'success' => false,
                'message' => 'Você já está nesse plano.'
            ], 400);
        }

        try {
            $contract = $this->contractService->changeContract($user, $newPlan);

            return response()->json([
                'success' => true,
                'contract' => $contract->load(['plan', 'payments']),
                'message' => 'Plano alterado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }


}
