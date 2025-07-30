import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Plan {
  id: number;
  description: string;
  price: number; // Corrigido para string
  gigabytesStorage: number;
  numberOfClients: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}


export interface Contract {
  id: number;
  user_id: number;
  plan_id: number;
  monthly_price: number;
  start_date: string;
  next_payment_date: string;
  is_active: boolean;
  remaining_credit: number;
  plan: Plan;
  payments: Payment[];
}

export interface Payment {
  id: number;
  contract_id: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  payment_method?: string;
  paid_at?: string;
  payment_data?: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const apiService = {
  // Planos
  getPlans: () => api.get<Plan[]>('/plans'),
  
  // Usuário
  getUser: () => api.get<User>('/user'),
  
  // Contratos
  getActiveContract: () => api.get<Contract>('/contracts/active'),
  subscribe: (planId: number) => api.post('/contracts/subscribe', { plan_id: planId }),
  changePlan: (planId: number) => api.post('/contracts/change-plan', { plan_id: planId }),
  
  // Pagamentos
  getAllPendingPayment: () => api.get<Payment[]>('/payments/pendings'),
  generatePix: (paymentId: number) => api.post(`/payments/${paymentId}/generate-pix`),
  confirmPayment: (paymentId: number) => api.post(`/payments/${paymentId}/confirm`),
};

export default api;