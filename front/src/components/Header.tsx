import { User, CreditCard, FileSignature } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { currentPlan } = useApp();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            {currentPlan && (
              <span className={`ml-4 px-3 py-1 rounded-full text-sm text-white`}>
                Plano {currentPlan.description}
              </span>
            )}
          </div>

          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Link>

            <Link
              to="/plans"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/plans' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Planos
            </Link>

            {currentPlan && (
              <Link
                to="/signatures"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/signatures' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileSignature className="w-4 h-4 mr-2" />
                Assinaturas
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
