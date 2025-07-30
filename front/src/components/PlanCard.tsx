import React, { useState } from 'react';
import { Check, ArrowRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Plan {
  id: number;
  description: string;
  numberOfClients: number;
  gigabytesStorage: number;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  actionType: 'subscribe' | 'change' | 'current';
  onSelect: () => void;
}

interface PaymentModalProps {
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const PaymentModal = ({ plan, isOpen, onClose, onConfirm }: PaymentModalProps) => {
  const [paymentStep, setPaymentStep] = useState(1);

  if (!isOpen || !plan) return null;

  const handleConfirm = async () => {
    setPaymentStep(2);
    await onConfirm();
    setPaymentStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {paymentStep === 1 ? 'Confirmar Assinatura' : 'Processando Pagamento'}
        </h3>

        {paymentStep === 1 ? (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900">Plano</h4>
              <p className="text-gray-600 text-sm">{plan.description}</p>
              <div className="text-xl font-bold text-blue-600 mt-2">
                R$ {plan.price.toFixed(2)}/mês
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-900 mb-2">Pagamento via PIX</h5>
              <p className="text-blue-700 text-sm">
                Após confirmar, você receberá o código PIX para pagamento.
                O plano será ativado automaticamente após a confirmação do pagamento.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processando pagamento via PIX...</p>
            <p className="text-sm text-gray-500 mt-2">Aguarde alguns instantes</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanCard = ({ plan, isActive, actionType, onSelect }: PlanCardProps) => {
  const { loading } = useApp();

  const icon = User;
  const color = 'bg-blue-500';

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isActive ? 'ring-2 ring-green-500' : ''
    }`}>
      {isActive && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
          <Check className="w-3 h-3 inline mr-1" />
          Ativo
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            {icon && React.createElement(icon, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 ml-3">Plano</h3>
        </div>

        <p className="text-gray-600 mb-6">{plan.description}</p>

        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900">
            R$ {plan.price.toFixed(2)}
            <span className="text-lg font-normal text-gray-500">/mês</span>
          </div>
        </div>

        <button
          onClick={onSelect}
          disabled={actionType === 'current' || loading}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
            actionType === 'current'
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              {actionType !== 'current' && <ArrowRight className="w-4 h-4 mr-2" />}
              {actionType === 'subscribe' && 'Assinar Plano'}
              {actionType === 'change' && 'Trocar para esse Plano'}
              {actionType === 'current' && 'Plano Atual'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};


export default PlanCard;
