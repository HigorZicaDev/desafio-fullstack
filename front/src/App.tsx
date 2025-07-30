import { AppProvider, useApp } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import { Router } from './Router';

const Notification = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 animate-pulse`}>
      {notification.message}
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Router />
      </main>
      <Notification />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
