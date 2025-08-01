import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plan, User } from '../services/api';
import { apiService } from '../services/api';
import axios from 'axios';

export interface Notification {
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface AppContextType {
  user: User | null;
  plans: Plan[] | [];
  currentPlan: Plan | null;
  setCurrentPlan: React.Dispatch<React.SetStateAction<Plan | null>>;
  loading: boolean;
  notification: Notification | null;
  showNotification: (message: string, type?: 'success' | 'warning' | 'error') => void;
  fetchCurrentContract: () => Promise<void>; // ✅ Nova função pública
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [plansRes, userRes, contractRes] = await Promise.all([
          apiService.getPlans(),
          apiService.getUser(),
          apiService.getActiveContract()
        ]);

        setPlans(plansRes.data);
        setUser(userRes.data);
        setCurrentPlan(contractRes.data?.plan || null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          showNotification(`Atenção: ${error.response?.data?.message || 'Erro inesperado'}`, 'error');
        } else {
          showNotification('Erro inesperado ao processar o pagamento.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const showNotification = (
    message: string,
    type: 'success' | 'warning' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCurrentContract = async () => {
    try {
      const contract = await apiService.getActiveContract();
      setCurrentPlan(contract.data?.plan || null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showNotification(`Atenção: Erro ao carregar o plano}`, 'error');
      } else {
        showNotification('Erro desconhecido ao carregar o plano', 'error');
      }
    }
  };

  const value: AppContextType = {
    user,
    plans,
    currentPlan,
    setCurrentPlan,
    loading,
    notification,
    showNotification,
    fetchCurrentContract
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};
