import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plan, User } from '../services/api';
import { apiService } from '../services/api';


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
        const [plansRes, userRes] = await Promise.all([
          apiService.getPlans(),
          apiService.getUser(),
        ]);
        setPlans(plansRes.data);
        setUser(userRes.data);
      } catch (error) {
        showNotification('Erro ao carregar dados iniciais.', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const value: AppContextType = {
    user,
    plans,
    currentPlan,
    setCurrentPlan,
    loading,
    notification,
    showNotification
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