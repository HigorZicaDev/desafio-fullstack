import { useEffect, useState } from 'react';
import { apiService, Payment } from '../../services/api';

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR');
};

const SignaturesPage = () => {
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiService.getAllPendingPayment(); // novo endpoint
        const allPayments = response.data;

        setPendingPayments(allPayments.filter(p => p.status === 'pending'));
        setPaidPayments(allPayments.filter(p => p.status === 'paid'));
      } catch (err: any) {
        setError('Erro ao carregar os pagamentos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const renderPaymentGrid = (title: string, payments: Payment[]) => (
    <>
      <h2 className="text-xl font-semibold mt-8 mb-4">{title}</h2>
      {payments.length === 0 ? (
        <p className="text-gray-500">Nenhum pagamento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p className="text-sm text-gray-500">Vencimento</p>
              <p className="text-lg font-semibold">{formatDate(payment.due_date)}</p>

              <p className="mt-2 text-sm text-gray-500">Valor</p>
              <p className="text-xl font-bold text-green-600">
                R$ {Number(payment.amount).toFixed(2)}
              </p>

              <p className="mt-2 text-sm text-gray-500">Status</p>
              <span
                className={`inline-block px-2 py-1 rounded text-white text-xs ${
                  payment.status === 'pending'
                    ? 'bg-yellow-500'
                    : payment.status === 'paid'
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}
              >
                {payment.status === 'pending'
                  ? 'Pendente'
                  : payment.status === 'paid'
                  ? 'Pago'
                  : 'Cancelado'}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resumo de Pagamentos</h1>

      {loading && <p className="text-gray-500">Carregando pagamentos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <>
          {renderPaymentGrid('Pagamentos Pendentes', pendingPayments)}
          {renderPaymentGrid('Pagamentos Concluídos', paidPayments)}
        </>
      )}
    </div>
  );
};

export default SignaturesPage;
