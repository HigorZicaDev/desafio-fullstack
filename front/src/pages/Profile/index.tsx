import { CreditCard, Check, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const features = [
    `Clientes ativos`,
    `10GB de armazenamento`,
    'Suporte via e-mail',
    'Acesso a recursos premium'
];

const Profile = () => {
  
  const { user, currentPlan } = useApp();
  const isLoading = !user || currentPlan === undefined;

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados do Usuário</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-900">
                {user?.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="bg-gray-50 rounded-md px-3 py-2 text-gray-900">
                {user?.email}
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano Atual</h3>
            {currentPlan ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">{currentPlan.description}</span>
                </div>
                <p className="text-gray-600">{currentPlan.description}</p>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {currentPlan.price.toFixed(2)}/mês
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Recursos inclusos:</p>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <CreditCard className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600">Nenhum plano contratado</p>
                <p className="text-sm text-gray-500 mt-1">Acesse a aba Planos para escolher um</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;