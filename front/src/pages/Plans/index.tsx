import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import PlanCard, { PaymentModal } from '../../components/PlanCard';
import { apiService } from '../../services/api';
import { Plan } from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import axios from 'axios';

const Plans = () => {
  const {
    plans,
    currentPlan,
    showNotification,
    fetchCurrentContract,
    loading
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCurrentContract();
  }, []);

  const handlePlanSelect = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || currentPlan?.id === plan.id) return;
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) return;

    try {
      if (currentPlan) {
        await apiService.changePlan(selectedPlan.id);
        showNotification(`Plano alterado de ${currentPlan.description} para ${selectedPlan.description}!`);
      } else {
        await apiService.subscribe(selectedPlan.id);
        showNotification(`Plano ${selectedPlan.description} assinado com sucesso!`);
      }

      await fetchCurrentContract();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Erro ao atualizar plano após pagamento', error.response?.data?.message);
          showNotification(`Atenção: ${error.response?.data?.message || 'Erro inesperado'}`, 'error');
        } else {
          console.error('Erro desconhecido ao atualizar plano', error);
          showNotification('Erro inesperado ao processar o pagamento.', 'error');
        }
      }

    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const isLoading = loading || (plans.length === 0 && currentPlan === undefined);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {currentPlan ? 'Alterar Plano' : 'Escolha seu Plano'}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {currentPlan 
            ? 'Faça upgrade ou downgrade do seu plano atual conforme suas necessidades'
            : 'Selecione o plano que melhor se adequa às suas necessidades'
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = currentPlan?.id === plan.id;
          const actionType = !currentPlan 
            ? 'subscribe' 
            : isCurrent 
              ? 'current' 
              : 'change';

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={isCurrent}
              actionType={actionType}
              onSelect={() => handlePlanSelect(plan.id)}
            />
          );
        })}
      </div>

      <PaymentModal
        plan={selectedPlan}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default Plans;
