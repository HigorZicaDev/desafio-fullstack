<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            [
                'description' => 'Individual',
                'numberOfClients' => 1,
                'price' => 100.00,
                'gigabytesStorage' => 1,
            ],
            [
                'description' => 'Até 10 vistorias / clientes ativos',
                'numberOfClients' => 10,
                'price' => 200.00,
                'gigabytesStorage' => 10,
            ],
            [
                'description' => 'Até 25 vistorias / clientes ativos',
                'numberOfClients' => 25,
                'price' => 300.00,
                'gigabytesStorage' => 25,
            ]
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
